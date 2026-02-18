"""
Modular configuration system for NCMDS (No Code Markdown Sites)
Created by: edujbarrios

This module handles configuration and theme loading in a parametrized way
"""

import os
import yaml
from pathlib import Path
from typing import Dict, Any, Optional


class ThemeLoader:
    """Modular theme loader"""
    
    def __init__(self, themes_dir: str = "config/themes"):
        self.themes_dir = Path(themes_dir)
        self.available_themes = self._discover_themes()
    
    def _discover_themes(self) -> Dict[str, str]:
        """Discover all available themes in the themes folder"""
        themes = {}
        
        if not self.themes_dir.exists():
            return themes
        
        for theme_file in self.themes_dir.glob("*.yaml"):
            theme_name = theme_file.stem
            themes[theme_name] = str(theme_file)
        
        return themes
    
    def load_theme(self, theme_name: str) -> Dict[str, Any]:
        """Load a specific theme by name"""
        if theme_name not in self.available_themes:
            # If theme doesn't exist, load default theme
            theme_name = "ncmds_default"
        
        theme_path = self.available_themes.get(theme_name)
        if not theme_path:
            return self._get_default_colors()
        
        try:
            with open(theme_path, 'r', encoding='utf-8') as f:
                theme_data = yaml.safe_load(f)
                return theme_data.get('colors', self._get_default_colors())
        except Exception as e:
            print(f"⚠️  Error loading theme '{theme_name}': {e}")
            return self._get_default_colors()
    
    def get_theme_info(self, theme_name: str) -> Dict[str, str]:
        """Get theme information without loading colors"""
        if theme_name not in self.available_themes:
            return {}
        
        theme_path = self.available_themes.get(theme_name)
        try:
            with open(theme_path, 'r', encoding='utf-8') as f:
                theme_data = yaml.safe_load(f)
                return {
                    'name': theme_data.get('name', theme_name),
                    'description': theme_data.get('description', ''),
                    'author': theme_data.get('author', '')
                }
        except Exception as e:
            print(f"⚠️  Error getting theme info '{theme_name}': {e}")
            return {}
    
    def list_themes(self) -> Dict[str, Dict[str, str]]:
        """List all available themes with their information"""
        themes_info = {}
        for theme_name in self.available_themes.keys():
            themes_info[theme_name] = self.get_theme_info(theme_name)
        return themes_info
    
    @staticmethod
    def _get_default_colors() -> Dict[str, str]:
        """Return default colors if a theme cannot be loaded"""
        return {
            'primary_color': '#3b82f6',
            'secondary_color': '#8b5cf6',
            'background_color': '#0f1e35',
            'surface_color': '#1a2942',
            'text_color': '#e8edf5',
            'text_secondary': '#a8b5d1',
            'accent_color': '#06b6d4',
            'border_color': '#2a4365',
            'code_background': '#132336',
            'link_color': '#60a5fa',
            'link_hover': '#93c5fd'
        }


class ConfigManager:
    """Main configuration manager"""
    
    def __init__(self, config_file: str = "config/config.yaml"):
        self.config_file = Path(config_file)
        self.theme_loader = ThemeLoader()
        self.config = self._load_config()
        self._resolve_theme()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load main configuration"""
        default_config = {
            'site_name': 'NCMDS Documentation',
            'author': 'edujbarrios',
            'description': 'No Code Markdown Sites - Easy documentation builder',
            'theme_name': 'ncmds_default',
            'server': {
                'host': '0.0.0.0',
                'port': 5000,
                'debug': True
            },
            'directories': {
                'docs': 'docs',
                'static': 'static',
                'templates': 'templates'
            },
            'features': {
                'table_of_contents': True,
                'syntax_highlighting': True,
                'auto_reload': True,
                'search': False
            }
        }
        
        # If configuration file exists, load it
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    user_config = yaml.safe_load(f) or {}
                    # Deep merge configurations
                    default_config = self._deep_merge(default_config, user_config)
            except Exception as e:
                print(f"⚠️  Error loading configuration: {e}")
                print(f"    Using default configuration")
        
        return default_config
    
    def _deep_merge(self, base: Dict, update: Dict) -> Dict:
        """Deep merge of dictionaries"""
        result = base.copy()
        for key, value in update.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                result[key] = self._deep_merge(result[key], value)
            else:
                result[key] = value
        return result
    
    def _resolve_theme(self):
        """Resolve current theme and add it to configuration"""
        # Check if theme is defined inline in config (new format with dark/light)
        if 'theme' in self.config and isinstance(self.config['theme'], dict):
            # New format with inline theme definition including dark and light variants
            if 'dark' in self.config['theme'] and 'light' in self.config['theme']:
                # Themes are already defined in config, no need to load from files
                return
        
        # Legacy format: load theme from file
        theme_name = self.config.get('theme_name', 'ncmds_default')
        
        # Load theme from file
        theme_colors = self.theme_loader.load_theme(theme_name)
        
        # Add theme to configuration
        self.config['theme'] = theme_colors
        self.config['active_theme_name'] = theme_name
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get a configuration value"""
        keys = key.split('.')
        value = self.config
        
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
                if value is None:
                    return default
            else:
                return default
        
        return value
    
    def get_all(self) -> Dict[str, Any]:
        """Return all configuration"""
        return self.config
    
    def reload(self):
        """Reload configuration"""
        self.config = self._load_config()
        self._resolve_theme()
    
    def get_available_themes(self) -> Dict[str, Dict[str, str]]:
        """Get list of available themes"""
        return self.theme_loader.list_themes()
    
    def switch_theme(self, theme_name: str) -> bool:
        """Switch active theme"""
        if theme_name != 'custom' and theme_name not in self.theme_loader.available_themes:
            return False
        
        self.config['theme_name'] = theme_name
        self._resolve_theme()
        return True


# Helper function to create global instance
_config_instance: Optional[ConfigManager] = None


def get_config() -> ConfigManager:
    """Get global configuration instance"""
    global _config_instance
    if _config_instance is None:
        _config_instance = ConfigManager()
    return _config_instance


def reload_config():
    """Reload global configuration"""
    global _config_instance
    if _config_instance:
        _config_instance.reload()
    else:
        _config_instance = ConfigManager()
