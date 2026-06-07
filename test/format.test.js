import assert from "node:assert/strict";
import test from "node:test";
import { formatForFeishuText } from "../src/format.js";

test("formatForFeishuText removes markdown syntax that Feishu text does not render well", () => {
  const input = [
    "## 晨间简报｜标题",
    "**1. AI 产品人今日名词**",
    "- [文章标题](https://example.com/a)",
    "* 重点：不要用 markdown",
    "```json",
    "{\"a\":1}",
    "```"
  ].join("\n");

  const output = formatForFeishuText(input);

  assert.equal(output.includes("##"), false);
  assert.equal(output.includes("**"), false);
  assert.equal(output.includes("```"), false);
  assert.equal(output.includes("[文章标题]("), false);
  assert.equal(output.includes("文章标题\nhttps://example.com/a"), true);
  assert.equal(output.includes("1. AI 产品人今日名词"), true);
});
