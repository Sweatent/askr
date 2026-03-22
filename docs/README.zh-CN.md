<div align="center">

# askr

**MCP Q&A Assistant / MCP 问答助手**

Async Q&A capabilities for AI clients via MCP protocol, powered by any OpenAI-compatible API.

通过 MCP 协议为 AI 客户端提供异步问答能力，后端对接任意 OpenAI 兼容 API。

[English](./README.md) | [中文文档](./docs/README.zh-CN.md)

🤖 100% Vibe Coding — 纯氛围编程，全程 AI 辅助开发。

⭐ 如果喜欢这个项目，请给一个小小的 Star！

</div>

---

# askr

MCP 问答助手 — 通过 MCP 协议为 AI 客户端提供异步问答能力，后端对接任意 OpenAI 兼容 API。

## 快速开始

```bash
# 首次使用，启动管理面板配置供应方
npx @sweatent/askr -m

# 启动 MCP stdio server
npx @sweatent/askr
```

## 功能

- **question** — 提出单个问题，支持流式响应
- **agentq** — 并行提问多个独立问题（可配置最大并发数）
- **list** — 查看最近的会话状态
- **check** — 查询会话结果，支持阻塞等待、完整内容及思维链展示

## 接入 MCP 客户端

### Claude Desktop

在 `claude_desktop_config.json` 中添加：

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

在项目目录或全局配置中添加：

```bash
claude mcp add askr -- npx @sweatent/askr
```

或手动编辑 `.claude/settings.json`：

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

### Cursor / 其他 MCP 客户端

按对应客户端文档配置 stdio 类型的 MCP server，命令为 `npx @sweatent/askr`。

## 管理面板

```bash
npx @sweatent/askr -m
# 或
npx @sweatent/askr --manage
```

功能菜单：

1. **管理供应方** — 配置 Base URL、API Key、模型（自动拉取模型列表或手动输入）
2. **管理问题** — 查看/关闭活跃会话
3. **查看可视化日志** — 浏览历史会话的问题、思维链、回答（运行中的会话支持实时刷新）
4. **更多设置** — 最大并发数、超时时间、折叠字符数、系统提示词、语言切换

支持中文和英文界面。

## 配置

配置文件存储在系统数据目录：

| 平台 | 路径 |
|------|------|
| Windows | `%AppData%/askr/config.json` |
| macOS | `~/Library/Application Support/askr/config.json` |
| Linux | `~/.config/askr/config.json` |

```json
{
  "language": "zh-CN",
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

### Base URL 说明

- 常规格式：`https://api.example.com` → 自动拼接 `/v1/chat/completions`
- 自定义端点：`https://api.example.com/custom/path#` → 以 `#` 结尾表示原样使用（去掉 `#`）

## 工具详情

### question

```json
{ "content": "What is REST and its core principles?" }
```

提出单个问题。回答超过 `foldChars` 字符时自动截断，可用 `check` 获取完整内容。超时返回 session ID。

### agentq

```json
{ "questions": ["What is Docker?", "What is Kubernetes?"] }
```

并行提问，数量不超过 `maxConcurrent`。每个问题独立上下文，返回各自的结果或 session ID。

### list

```json
{ "count": 5 }
```

返回最近 N 条会话摘要（ID、时间、状态、问题预览）。

### check

```json
{ "id": "a3f8k2", "showFull": true, "showThinking": true }
```

查询会话结果。若会话仍在运行则阻塞等待。参数：

- `showFull` — 返回完整回答（不截断）
- `showThinking` — 包含思维链内容

## 特性

- **流式响应** — 支持 SSE 流式接收，实时写入 session 文件
- **自动降级** — 流式请求失败时自动回退为非流式
- **思维链分离** — 自动识别 `<think>` 标签、`reasoning_content`、`thinking` 字段
- **热加载** — 管理面板修改配置后 MCP server 自动生效，无需重启
- **会话持久化** — 所有问答记录保存在本地，支持历史查看

## 环境要求

- Node.js >= 18

## 推荐提示词

将以下内容添加到项目的 `CLAUDE.md` 或其他 AI 客户端的系统提示中，以获得最佳使用效果：

```markdown
## askr 使用规范

你可以通过 askr MCP 工具向外部 AI 搜索提问来辅助完成任务。

### 适用场景

- **施工前调研**: 使用不熟悉或不确定的公开 API / 库函数前，先查询其签名、参数、用法和注意事项，避免凭记忆编写错误代码
- **陌生概念理解**: 遇到不了解的术语、协议、设计模式时查询含义和最佳实践
- **最新信息获取**: 查询近期发布的版本、变更、新闻、公告等你训练数据可能未覆盖的内容
- **疑难问题排查**: 遇到难以解决的报错或异常行为时，搜索解决方案，包括 GitHub Issues、Stack Overflow 等社区讨论
- **方案对比选型**: 在多种技术方案间犹豫时，查询各方案的优劣和社区推荐
- **配置与兼容性**: 查询特定环境、平台、版本下的配置方法或已知兼容性问题

### 使用原则

1. 优先使用 askr 搜索工具，仅在完全确信自身知识准确且未过时时才依赖自身能力
2. 问题描述要具体明确，包含必要上下文（语言、框架、版本等），避免模糊提问
3. 相关子问题合并为一个 question，无关问题使用 agentq 并行
4. 超时后用 check 获取结果，两次 check 仍超时则重新提问
5. 收到截断回答且需要完整内容时，使用 check(id, showFull: true)
```

### English

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

## 致谢

感谢 [LinuxDo 社区](https://linux.do) 的支持！

## License

MIT
