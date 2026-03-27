<div align="center">
  <img src="images/screenshot.png" alt="Screenshot">
</div>

[中文](https://zdoc.app/zh/jae-jae/codex-opener) | 
[Deutsch](https://zdoc.app/de/jae-jae/codex-opener) | 
[English](https://zdoc.app/en/jae-jae/codex-opener) | 
[Español](https://zdoc.app/es/jae-jae/codex-opener) | 
[français](https://zdoc.app/fr/jae-jae/codex-opener) | 
[日本語](https://zdoc.app/ja/jae-jae/codex-opener) | 
[한국어](https://zdoc.app/ko/jae-jae/codex-opener) | 
[Português](https://zdoc.app/pt/jae-jae/codex-opener) | 
[Русский](https://zdoc.app/ru/jae-jae/codex-opener) | 


# Codex Opener

A VS Code extension that adds a button to open your current project in [Codex](https://github.com/openai/codex) desktop app with one click.

> 🌟 **Recommended**: [OllaMan](https://ollaman.com/) - Powerful Ollama AI Model Manager.

## Features

- One-click button in editor title bar
- Automatically activates Codex window (even when the app is not running)
- Works on macOS, Windows, and Linux
- No configuration needed

## Installation

### From Marketplace

Search **"Codex Opener"** in VS Code Extensions marketplace, or click:

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Jaeger.codex-opener)
- [Open VSX Registry](https://open-vsx.org/extension/Jaeger/codex-opener)

### From Releases

Download the latest `.vsix` file from [Releases](https://github.com/jae-jae/codex-opener/releases) and install:

```bash
code --install-extension codex-opener-*.vsix
```

## Requirements

- [Codex CLI](https://github.com/openai/codex) installed
- [Codex Desktop](https://github.com/openai/codex) installed

## Usage

1. Open a folder/workspace in VS Code
2. Click the Codex icon in the editor title bar (top right)
3. Your project opens in Codex Desktop

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `codexOpener.codexPath` | `codex` | Path to codex CLI executable |

## License

MIT
