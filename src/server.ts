import app from './app';

const port = Number(process.env.PORT ?? 5000);
const host = process.env.HOST ?? '0.0.0.0';

app.listen(port, host, () => {
  console.log(`🚀 NCMDS running on http://${host}:${port}`);
});
