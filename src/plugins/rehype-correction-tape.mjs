// 修正带 rehype 插件
// 用法：markdown 里写 ~~~被盖住的字~~~ ，渲染成一条「修正带」盖在文字上，
// 视觉模糊，悬停才撕开看原文。用于模糊不想摆在公开页面的信息（平台名、人名等）。
// 规则：~~~ 之间不含 ~ 或换行；code/pre/kbd 里的 ~~~ 不处理（避免破坏代码块）。
// 用三个波浪号而不是 ==（== 在不少渲染器是「高亮」语义，会撞车）。
import { visit } from 'unist-util-visit';

const TAPE_RE = /~~~([^~\n]+)~~~/g;

// 命中 ~~~…~~~ 的标签（跳过代码块/行内代码，避免误伤）
const SKIP_TAGS = new Set(['code', 'pre', 'kbd', 'script', 'style']);

export default function rehypeCorrectionTape() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (SKIP_TAGS.has(parent.tagName)) return;

      TAPE_RE.lastIndex = 0;
      if (!TAPE_RE.test(node.value)) return;
      TAPE_RE.lastIndex = 0;

      // split 带捕获组：[纯文本, 命中1, 纯文本, 命中2, ...]
      const parts = node.value.split(TAPE_RE);
      if (parts.length < 3) return;

      const children = [];
      parts.forEach((part, i) => {
        if (i % 2 === 1) {
          // 奇数下标 = ~~~...~~~ 捕获内容 → 拆成单字符修正带方块，包进一组
          children.push({
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['correction-tape-group'],
              title: '修正带 · 悬停擦除看原文',
            },
            children: Array.from(part).map((ch) => ({
              type: 'element',
              tagName: 'span',
              properties: { className: ['correction-tape'] },
              children: [{ type: 'text', value: ch }],
            })),
          });
        } else if (part) {
          children.push({ type: 'text', value: part });
        }
      });

      parent.children.splice(index, 1, ...children);
      return 'skip'; // 该节点已替换，不再深入
    });
  };
}
