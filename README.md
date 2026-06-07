# AI 晨间简报 Zeabur 版

这是一个适合部署到 Zeabur 的 Node.js 常驻服务。

## 它会做什么

- 每个工作日北京时间 10:30 自动运行。
- 用阿里云百炼 OpenAI 兼容 Chat Completions 接口生成真实晨间简报。
- 同时推送到两个飞书机器人。
- 提供 `POST /run` 手动触发入口。

## Zeabur 环境变量

必填：

```text
DASHSCOPE_API_KEY=你的百炼 API Key
```

推荐：

```text
RUN_SECRET=一个你自己设置的随机密码
MODEL=glm-5
```

可选：

```text
BAILIAN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
SEARCH_STRATEGY=agent_max
```

可选，覆盖默认两个飞书机器人：

```text
FEISHU_WEBHOOKS=https://...,https://...
```

## 手动测试

部署后访问：

```bash
curl -X POST "https://你的-zeabur域名/run" -H "x-run-secret: 你的RUN_SECRET"
```
