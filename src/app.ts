import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import nunjucks from 'nunjucks';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import matter from 'gray-matter';

type Config = Record<string, any>;

type NavItem = {
  title: string;
  path: string;
  file: string;
  order: number;
  tags: string[];
  difficulty: string;
  owner: string;
  writer: string;
};

type DocumentData = {
  html: string;
  plain_text: string;
  metadata: Record<string, any>;
  toc: string;
  path: string;
  tags: string[];
  difficulty: string;
  owner: string;
  writer: string;
  last_updated_display: string;
  last_updated_iso: string;
};

const ROOT_DIR = process.cwd();

const defaultConfig: Config = {
  site_name: 'NCMDS Documentation',
  author: 'edujbarrios',
  description: 'No Code Markdown Sites - Easy documentation builder',
  directories: {
    docs: 'docs',
    static: 'static',
    templates: 'templates'
  }
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const md = new MarkdownIt({ html: true, linkify: true }).use(markdownItAnchor, { slugify });

function parseFrontMatter(raw: string): { data: Record<string, any>; content: string } {
  try {
    const parsed = matter(raw);
    return { data: (parsed.data as Record<string, any>) ?? {}, content: parsed.content };
  } catch {
    return { data: {}, content: raw };
  }
}

function deepMerge(base: any, update: any): any {
  if (!update || typeof update !== 'object') return base;
  const result = { ...base };
  for (const [key, value] of Object.entries(update)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function resolveEnvVars(value: any): any {
  if (typeof value === 'string') {
    return value.replace(/\$\{([A-Z0-9_]+)\}/gi, (_, name) => process.env[name] ?? '');
  }
  if (Array.isArray(value)) return value.map(resolveEnvVars);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveEnvVars(v)]));
  }
  return value;
}

function loadConfig(): Config {
  const configPath = path.join(ROOT_DIR, 'config', 'config.yaml');
  if (!fs.existsSync(configPath)) return defaultConfig;
  const raw = fs.readFileSync(configPath, 'utf8');
  const parsed = (yaml.load(raw) as Config) ?? {};
  return resolveEnvVars(deepMerge(defaultConfig, parsed));
}

const config = loadConfig();
const docsDir = path.join(ROOT_DIR, config.directories?.docs ?? 'docs');
const templatesDir = path.join(ROOT_DIR, config.directories?.templates ?? 'templates');
const staticDir = path.join(ROOT_DIR, config.directories?.static ?? 'static');

const env = nunjucks.configure(templatesDir, {
  autoescape: true,
  express: undefined,
  noCache: true
});
env.addGlobal('now_year', String(new Date().getFullYear()));

function firstHeading(markdownText: string, fallback: string): string {
  for (const line of markdownText.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      return trimmed.replace(/^#+\s*/, '').trim() || fallback;
    }
  }
  return fallback;
}

function normalizeText(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function normalizeTags(rawTags: any): string[] {
  const candidates = Array.isArray(rawTags)
    ? rawTags.map((value) => String(value).trim())
    : typeof rawTags === 'string'
      ? rawTags.split(',').map((value) => value.trim())
      : [];
  const tags: string[] = [];
  const seen = new Set<string>();
  for (const tag of candidates) {
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
  }
  return tags;
}

function buildDocMetadata(frontMatter: Record<string, any>) {
  const defaultAuthor = normalizeText(config.author);
  const tags = normalizeTags(frontMatter.tags);
  return {
    tags: tags.length ? tags : ['documentation'],
    difficulty: normalizeText(frontMatter.difficulty) || 'general',
    owner: normalizeText(frontMatter.owner) || defaultAuthor,
    writer:
      normalizeText(frontMatter.writer ?? frontMatter.writter ?? frontMatter.author) || defaultAuthor
  };
}

function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const result: string[] = [];
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        result.push(fullPath);
      }
    }
  };
  walk(dir);
  return result;
}

function buildNavigation(): NavItem[] {
  const nav: NavItem[] = [];
  for (const file of listMarkdownFiles(docsDir)) {
    const relative = path.relative(docsDir, file);
    const urlPath = relative.replace(/\\/g, '/').replace(/\.md$/, '');
    const { data, content } = parseFrontMatter(fs.readFileSync(file, 'utf8'));
    const fileStem = path.basename(file, '.md');
    let title = normalizeText((data as any).title) || firstHeading(content, fileStem);
    let order = Number.parseInt(String((data as any).order ?? '999'), 10);
    if (Number.isNaN(order)) order = 999;

    const prefixMatch = fileStem.match(/^(\d+)-/);
    if (prefixMatch) {
      order = Number.parseInt(prefixMatch[1], 10);
      if (title.startsWith(prefixMatch[1])) {
        title = title.slice(prefixMatch[1].length).replace(/^[-\s]+/, '') || title;
      }
    }

    const metadata = buildDocMetadata((data as Record<string, any>) ?? {});
    nav.push({
      title,
      path: urlPath,
      file: relative,
      order,
      tags: metadata.tags,
      difficulty: metadata.difficulty,
      owner: metadata.owner,
      writer: metadata.writer
    });
  }
  nav.sort((a, b) => (a.order - b.order) || a.title.localeCompare(b.title));
  return nav;
}

let navigation = buildNavigation();

function buildToc(markdownText: string): string {
  const tokens = md.parse(markdownText, {});
  const slugCount = new Map<string, number>();
  const items: Array<{ level: number; title: string; slug: string }> = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type !== 'heading_open') continue;
    const level = Number.parseInt(token.tag.replace('h', ''), 10);
    if (![1, 2, 3].includes(level)) continue; // TOC includes h1, h2, and h3
    const next = tokens[i + 1];
    const title = next?.content?.trim() ?? '';
    if (!title) continue;
    const base = slugify(title);
    const seen = slugCount.get(base) ?? 0;
    slugCount.set(base, seen + 1);
    const slug = seen > 0 ? `${base}-${seen}` : base;
    items.push({ level, title, slug });
  }

  if (!items.length) return '';

  const rows = items
    .map(
      (item) =>
        `<li class="toc-level-${item.level}"><a href="#${item.slug}">${item.title}</a></li>`
    )
    .join('');

  return `<ul>${rows}</ul>`;
}

function formatDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function resolveDocumentPath(docPath: string): string | null {
  if (!docPath || docPath === 'index') {
    const preferred = path.join(docsDir, '01-index.md');
    if (fs.existsSync(preferred)) return preferred;
    const fallback = path.join(docsDir, 'index.md');
    return fs.existsSync(fallback) ? fallback : null;
  }

  const markdownFiles = listMarkdownFiles(docsDir);
  for (const file of markdownFiles) {
    const stem = path.basename(file, '.md');
    if (stem === docPath) return file;
    const match = stem.match(/^(\d+)-(.+)$/);
    if (match && match[2] === docPath) return file;
  }

  const direct = path.join(docsDir, `${docPath}.md`);
  if (!fs.existsSync(direct)) return null;

  const resolvedDirect = path.resolve(direct);
  const resolvedDocs = path.resolve(docsDir);
  if (!resolvedDirect.startsWith(resolvedDocs)) return null;
  return direct;
}

function getDocument(docPath: string): DocumentData | null {
  const filePath = resolveDocumentPath(docPath);
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = parseFrontMatter(raw);
  const html = md.render(content);
  const metadata = buildDocMetadata((data as Record<string, any>) ?? {});
  const stat = fs.statSync(filePath);

  const title = normalizeText((data as any).title);
  const mdMetadata: Record<string, any> = {};
  if (title) mdMetadata.title = [title];

  return {
    html,
    plain_text: content,
    metadata: mdMetadata,
    toc: buildToc(content),
    path: docPath,
    tags: metadata.tags,
    difficulty: metadata.difficulty,
    owner: metadata.owner,
    writer: metadata.writer,
    last_updated_display: formatDate(stat.mtime),
    last_updated_iso: stat.mtime.toISOString().slice(0, 19)
  };
}

function renderTemplate(template: string, context: Record<string, any>): string {
  return env.render(template, context);
}

function pickPreviousNext(docPath: string): { prevDoc: NavItem | null; nextDoc: NavItem | null } {
  for (let i = 0; i < navigation.length; i += 1) {
    const navPath = navigation[i].path;
    const prefixedMatch =
      Boolean(docPath) &&
      navPath.endsWith(`-${docPath}`) &&
      /^\d+$/.test(navPath.slice(0, -(docPath.length + 1)).replace(/-/g, ''));
    if (navPath === docPath || prefixedMatch) {
      return {
        prevDoc: i > 0 ? navigation[i - 1] : null,
        nextDoc: i < navigation.length - 1 ? navigation[i + 1] : null
      };
    }
  }
  return { prevDoc: null, nextDoc: null };
}

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use('/static', express.static(staticDir));

const exportRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again shortly.' }
});

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send(renderTemplate('home.html', { title: config.site_name, config }));
});

app.get('/docs', (_req: Request, res: Response) => {
  const first = navigation[0];
  if (first) {
    res.redirect(`/docs/${first.path}`);
  } else {
    res.redirect('/');
  }
});

app.get(/^\/docs\/(.+)$/, (req: Request, res: Response) => {
  const docPath = String(req.params[0] ?? '');
  const doc = getDocument(docPath);
  if (!doc) {
    res.status(404).send(
      renderTemplate('404.html', { title: `404 - ${config.site_name}`, config, navigation })
    );
    return;
  }

  const metadataTitle = Array.isArray(doc.metadata.title) ? doc.metadata.title[0] : '';
  const title = metadataTitle ? `${metadataTitle} - ${config.site_name}` : config.site_name;
  const { prevDoc, nextDoc } = pickPreviousNext(docPath);

  res.status(200).send(
    renderTemplate('layout.html', {
      content: doc.html,
      title,
      toc: doc.toc,
      navigation,
      prev_doc: prevDoc,
      next_doc: nextDoc,
      doc_last_updated: doc.last_updated_display,
      doc_last_updated_iso: doc.last_updated_iso,
      doc_tags: doc.tags,
      doc_difficulty: doc.difficulty,
      doc_owner: doc.owner,
      doc_writer: doc.writer,
      config
    })
  );
});

app.get('/api/search', (req: Request, res: Response) => {

  const query = String(req.query.q ?? '').trim();
  const tagFilter = String(req.query.tag ?? '').trim().toLowerCase();
  const difficultyFilter = String(req.query.difficulty ?? '').trim().toLowerCase();
  const ownerFilter = String(req.query.owner ?? '').trim().toLowerCase();
  const writerFilter = String(req.query.writer ?? '').trim().toLowerCase();
  const limitRaw = Number.parseInt(String(req.query.limit ?? '10'), 10);

  if (Number.isNaN(limitRaw)) {
    res.status(400).json({ error: 'Invalid limit parameter. It must be an integer.' });
    return;
  }

  const limit = Math.max(1, Math.min(limitRaw, 100));
  if (!query && !tagFilter && !difficultyFilter && !ownerFilter && !writerFilter) {
    res.json({ results: [], query });
    return;
  }

  interface ResultWithScore {
    title: string;
    path: string;
    url: string;
    title_match: boolean;
    tags: string[];
    difficulty: string;
    owner: string;
    writer: string;
    context: string;
    relevance_score: number;
  }

  const results: ResultWithScore[] = [];
  const queryLower = query.toLowerCase();

  for (const navItem of navigation) {
    const doc = getDocument(navItem.path);
    if (!doc) continue;

    const tagsLower = doc.tags.map((tag) => tag.toLowerCase());
    if (tagFilter && !tagsLower.includes(tagFilter)) continue;
    if (difficultyFilter && doc.difficulty.toLowerCase() !== difficultyFilter) continue;
    if (ownerFilter && doc.owner.toLowerCase() !== ownerFilter) continue;
    if (writerFilter && doc.writer.toLowerCase() !== writerFilter) continue;

    const plainText = doc.plain_text;
    const plainLower = plainText.toLowerCase();

    const titleMatch = query ? navItem.title.toLowerCase().includes(queryLower) : false;
    const contentMatch = query ? plainLower.includes(queryLower) : false;
    const tagMatch = query ? doc.tags.some((tag) => tag.toLowerCase().includes(queryLower)) : false;
    const metadataMatch = query
      ? doc.difficulty.toLowerCase().includes(queryLower) ||
        doc.owner.toLowerCase().includes(queryLower) ||
        doc.writer.toLowerCase().includes(queryLower)
      : false;

    if (query && !(titleMatch || contentMatch || tagMatch || metadataMatch)) continue;

    let context = '';
    if (contentMatch) {
      const pos = plainLower.indexOf(queryLower);
      const start = Math.max(0, pos - 80);
      const end = Math.min(plainText.length, pos + query.length + 80);
      context = `${start > 0 ? '...' : ''}${plainText.slice(start, end).trim()}${end < plainText.length ? '...' : ''}`;
    } else if (tagMatch) {
      context = `Matched in tags: ${doc.tags.join(', ')}`;
    } else if (metadataMatch) {
      context = `Matched in metadata (difficulty: ${doc.difficulty}, owner: ${doc.owner}, writer: ${doc.writer})`;
    }

    // Calculate relevance score: title matches are prioritized over content matches
    let relevance_score = 0;
    if (titleMatch) relevance_score += 100;
    if (tagMatch) relevance_score += 50;
    if (metadataMatch) relevance_score += 25;
    if (contentMatch) relevance_score += 10;

    results.push({
      title: navItem.title,
      path: navItem.path,
      url: `/docs/${navItem.path}`,
      title_match: titleMatch,
      tags: doc.tags,
      difficulty: doc.difficulty,
      owner: doc.owner,
      writer: doc.writer,
      context,
      relevance_score
    });
  }

  // Sort by relevance score (descending), then by title (ascending)
  results.sort((a, b) => b.relevance_score - a.relevance_score || a.title.localeCompare(b.title));

  // Remove relevance_score before sending response
  const finalResults = results.slice(0, limit).map(({ relevance_score: _, ...rest }) => rest);

  res.json({ results: finalResults, query });
});

app.get('/api/ai-chat/status', (_req: Request, res: Response) => {
  const enabled = Boolean(config.ai_chat?.enabled);
  const apiKeyConfigured = Boolean(config.ai_chat?.api_key);
  const defaultModel = config.ai_chat?.model ?? 'gpt-4o-mini';

  res.json({ enabled, configured: apiKeyConfigured, default_model: defaultModel });
});

app.get('/api/ai-chat/models', async (_req: Request, res: Response) => {
  if (!config.ai_chat?.enabled) {
    res.status(403).json({ error: 'AI chat is not enabled' });
    return;
  }

  const apiUrl = String(config.ai_chat?.api_url ?? '');
  const apiKey = String(config.ai_chat?.api_key ?? '');

  if (!apiKey) {
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  if (!apiUrl) {
    res.status(500).json({ error: 'API URL not configured' });
    return;
  }

  const modelsUrl = apiUrl.replace(/\/chat\/completions\/?$/, '/models');

  try {
    const response = await fetch(modelsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    const payload = await response.json() as any;
    const models = Array.isArray(payload.data)
      ? payload.data.map((model: any) => ({ id: model.id, name: model.id }))
      : [];

    res.json({ models, success: true });
  } catch {
    res.json({
      models: [
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
        { id: 'gpt-4o', name: 'GPT-4o' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
      ],
      success: true,
      fallback: true
    });
  }
});

app.post('/api/ai-chat', async (req: Request, res: Response) => {
  if (!config.ai_chat?.enabled) {
    res.status(403).json({ error: 'AI chat is not enabled' });
    return;
  }

  const apiUrl = String(config.ai_chat?.api_url ?? '');
  const apiKey = String(config.ai_chat?.api_key ?? '');
  const defaultModel = String(config.ai_chat?.model ?? 'gpt-4o-mini');

  if (!apiKey) {
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  if (!apiUrl) {
    res.status(500).json({ error: 'API URL not configured' });
    return;
  }

  const { question, page_content: pageContentRaw, model } = req.body ?? {};

  if (typeof question !== 'string' || !question.trim()) {
    res.status(400).json({ error: 'Field "question" must be a non-empty string' });
    return;
  }

  if (typeof pageContentRaw !== 'string') {
    res.status(400).json({ error: 'Field "page_content" must be a string' });
    return;
  }

  const maxLength = Number(config.ai_chat?.behavior?.context_max_length ?? 8000);
  const pageContent = pageContentRaw.length > maxLength ? `${pageContentRaw.slice(0, maxLength)}...` : pageContentRaw;

  const systemPrompt = String(config.ai_chat?.behavior?.system_prompt ?? 'You are a helpful documentation assistant.');
  const temperature = Number(config.ai_chat?.behavior?.temperature ?? 0.7);
  const maxTokens = Number(config.ai_chat?.behavior?.max_tokens ?? 1000);

  // Validate and select model: security measure to restrict which models can be used
  // If config.ai_chat.allowed_models is defined, only those models are permitted.
  // Otherwise, only the default model specified in config.ai_chat.model is allowed.
  // This prevents clients from requesting arbitrary or unauthorized models.
  let selectedModel = defaultModel;
  if (typeof model === 'string') {
    const rawAllowedModels = config.ai_chat?.allowed_models;
    let allowedModels: string[] = [defaultModel];
    
    // Validate allowed_models if present and is an array
    if (Array.isArray(rawAllowedModels) && rawAllowedModels.every((m: any) => typeof m === 'string')) {
      allowedModels = rawAllowedModels;
    }
    
    // Only use the model if it's in the allowed list
    const trimmedModel = model.trim();
    if (allowedModels.includes(trimmedModel)) {
      selectedModel = trimmedModel;
    }
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Page content:\n${pageContent}\n\nQuestion:\n${question.trim()}`
          }
        ],
        temperature,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(errorBody || 'AI request failed');
    }

    const payload = await response.json() as any;
    const answer = payload?.choices?.[0]?.message?.content;

    if (!answer || typeof answer !== 'string') {
      throw new Error('Invalid AI response format');
    }

    res.json({ answer, success: true });
  } catch (error: any) {
    res.status(500).json({ error: String(error?.message ?? error), success: false });
  }
});

app.get('/export/config', (_req: Request, res: Response) => {
  res.json({
    qmd_enabled: Boolean(config.export?.qmd?.enabled ?? true),
    qmd_button_text: String(config.export?.qmd?.button_text ?? 'Export Documentation'),
    show_on_all_pages: Boolean(config.export?.show_on_all_pages ?? true)
  });
});

app.get('/export/qmd/all', exportRateLimiter, (_req: Request, res: Response) => {
  navigation = buildNavigation();

  const chunks: string[] = ['---', `title: "${String(config.site_name ?? 'Documentation')}"`, 'format: gfm', '---', ''];

  for (const item of navigation) {
    const filePath = path.join(docsDir, item.file);
    if (!fs.existsSync(filePath)) continue;
    chunks.push(`# ${item.title}`);
    chunks.push(fs.readFileSync(filePath, 'utf8'));
    chunks.push('');
  }

  const qmd = chunks.join('\n');
  const fileName = `${String(config.site_name ?? 'Documentation').replace(/\s+/g, '_')}_documentation.qmd`;

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.status(200).send(qmd);
});

export default app;
