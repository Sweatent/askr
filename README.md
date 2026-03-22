<div align="center">

# askr

**MCP Q&A Assistant / MCP 问答助手**

Async Q&A capabilities for AI clients via MCP protocol, powered by any OpenAI-compatible API.

通过 MCP 协议为 AI 客户端提供异步问答能力，后端对接任意 OpenAI 兼容 API。

[English](./README.md) | [中文文档](./docs/README.zh-CN.md)

🤖 100% Vibe Coding — Built entirely through AI-assisted development.

⭐ If you like this project, please give it a star!

</div>

---

## Quick Start

```bash
# First time: launch the management panel to configure your provider
npx @sweatent/askr -m

# Start the MCP stdio server
npx @sweatent/askr
```

## Features

- **question** — Ask a single question with streaming support
- **agentq** — Ask multiple independent questions in parallel (configurable concurrency)
- **list** — View recent session statuses
- **check** — Retrieve session results with blocking wait, full content, and chain-of-thought support

## MCP Client Integration

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "askr": {
      "command": "npx",
      "args": ["@sweatent/askr"]
    }
  }
}
```

### Claude Code

Add via CLI or global config:

```bash
claude mcp add askr -- npx @sweatent/askr
```

Or manually edit `.claude/settings.json`:

```json
{
  "mcpServers": {
    "askr": {
      "command": "npx",
      "args": ["@sweatent/askr"]
    }
  }
}
```

### Cursor / Other MCP Clients

Configure a stdio-type MCP server with command `npx @sweatent/askr` per your client's documentation.

## Management Panel

```bash
npx @sweatent/askr -m
# or
npx @sweatent/askr --manage
```

Menu options:

1. **Manage Provider** — Configure Base URL, API Key, model (auto-fetch model list or manual input)
2. **Manage Questions** — View/close active sessions
3. **View Logs** — Browse session history with question, chain-of-thought, and answer (live refresh for running sessions)
4. **More Settings** — Max concurrency, timeout, fold characters, system prompt, language

Supports Chinese and English interfaces.

## Configuration

Config file is stored in the system data directory:

| Platform | Path |
|----------|------|
| Windows | `%AppData%/askr/config.json` |
| macOS | `~/Library/Application Support/askr/config.json` |
| Linux | `~/.config/askr/config.json` |

```json
{
  "language": "en",
  "provider": {
    "baseUrl": "https://api.example.com",
    "apiKey": "sk-xxx",
    "model": "gpt-4",
    "stream": true
  },
  "settings": {
    "maxConcurrent": 5,
    "timeout": 150,
    "foldChars": 1000,
    "systemPrompt": "You are a search assistant..."
  }
}
```

### Base URL

- Standard: `https://api.example.com` — automatically appends `/v1/chat/completions`
- Custom endpoint: `https://api.example.com/custom/path#` — trailing `#` means use as-is (strip the `#`)

## Tool Reference

### question

```json
{ "content": "What is REST and its core principles?" }
```

Ask a single question. Answers exceeding `foldChars` are truncated; use `check` for full content. Returns session ID on timeout.

### agentq

```json
{ "questions": ["What is Docker?", "What is Kubernetes?"] }
```

Parallel questions, up to `maxConcurrent`. Each question runs in isolated context, returning its own result or session ID.

### list

```json
{ "count": 5 }
```

Returns the most recent N session summaries (ID, timestamp, status, question preview).

### check

```json
{ "id": "a3f8k2", "showFull": true, "showThinking": true }
```

Retrieve session result. Blocks if the session is still running. Parameters:

- `showFull` — Return full answer without truncation
- `showThinking` — Include chain-of-thought content

## Highlights

- **Streaming** — SSE streaming with real-time session file updates
- **Auto fallback** — Automatically falls back to non-streaming if streaming fails
- **Chain-of-thought separation** — Detects `<think>` tags, `reasoning_content`, and `thinking` fields
- **Hot reload** — Config changes from the management panel take effect immediately, no restart needed
- **Session persistence** — All Q&A records saved locally with full history browsing

## Requirements

- Node.js >= 18

## Recommended Prompt

Add the following to your project's `CLAUDE.md` or other AI client system prompt for best results:

```markdown
## askr Usage Guidelines

You can use askr MCP tools to search and ask an external AI to assist with your tasks.

### When to Use

- **Pre-implementation research**: Before using unfamiliar or uncertain public APIs / library functions, query their signatures, parameters, usage, and caveats to avoid writing incorrect code from memory
- **Unfamiliar concepts**: Look up terms, protocols, or design patterns you don't fully understand
- **Latest information**: Query recently released versions, changelogs, news, or announcements that may not be covered in your training data
- **Troubleshooting**: When facing hard-to-solve errors or unexpected behavior, search for solutions including GitHub Issues, Stack Overflow discussions, etc.
- **Solution comparison**: When deciding between multiple technical approaches, query their trade-offs and community recommendations
- **Configuration & compatibility**: Look up platform-specific configurations or known compatibility issues for particular environments or versions

### Principles

1. Prefer using askr to search first; only rely on your own knowledge when you are fully confident it is accurate and up-to-date
2. Be specific in your questions, include necessary context (language, framework, version, etc.), avoid vague queries
3. Combine related sub-questions into one question; use agentq for unrelated parallel questions
4. Use check to retrieve timed-out results; re-ask if check times out twice
5. Use check(id, showFull: true) when you need the full untruncated answer
```

## Acknowledgements

Thanks to the [LinuxDo community](https://linux.do) for the support!

## License

MIT
