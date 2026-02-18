# 视频号金句图生成器 (WeChat-Video-Quote-Generator)

将文本转化为适配微信视频号（9:16）的高级感金句长图，具备 AI 语义优化、智能分页和流光毛玻璃视觉效果。

## 功能特点

- **AI 文本优化**：使用 AI 模型提升文本的金句感和共鸣感，修正错别字，保持原意但排版精简
- **智能分页**：基于动态高度测量的自动分页算法，确保每张图内容不被视频号 UI 遮挡
- **高级视觉效果**：流光毛玻璃效果，支持自定义模糊度和透明度
- **实时预览**：25% 缩放的实时卡片预览，支持开关 '视频号界面模拟遮罩'
- **批量导出**：支持批量下载 PNG 序列
- **响应式设计**：适配不同屏幕尺寸

## 技术栈

- **框架**：Next.js 15+ (App Router)
- **UI**：shadcn/ui + Tailwind CSS + Lucide React (Icons)
- **状态管理**：React Context / Hooks
- **AI SDK**：coze-coding-dev-sdk
- **Canvas 引擎**：html2canvas
- **语言**：TypeScript 5

## 核心逻辑

### 分页算法
- **策略**：动态高度测量
- **画布尺寸**：1080 × 1920（9:16）
- **内容安全区域**：
  - 顶部：250px
  - 底部：500px
  - 侧边：80px
  - 最大内容高度：1170px
- **逻辑**：在隐藏 DOM 中预渲染文本，当高度超过 1170px 时，寻找最近的断句点进行自动分页

### AI 优化器
- **端点**：/api/optimize
- **模型**：doubao-seed-1-8-251228
- **提示词**：社交媒体爆款文案专家，优化文本的金句感和共鸣感

## 安装步骤

1. 克隆项目
```bash
git clone https://github.com/yourusername/WeChat-Video-Quote-Generator.git
cd WeChat-Video-Quote-Generator
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env.local` 文件，添加 Coze API 密钥：
```env
COZE_API_KEY=your-api-key-here
```

4. 启动开发服务器
```bash
npm run dev
```

5. 构建生产版本
```bash
npm run build
npm start
```

## 使用方法

1. **输入文本**：在左侧文本编辑器中输入或粘贴您的金句文本
2. **AI 优化**：点击「AI 优化文本」按钮，让 AI 提升文本质量
3. **调节样式**：使用滑块调整模糊度、透明度和字号
4. **预览效果**：在中间区域查看实时预览，可点击「显示视频号遮罩」查看实际效果
5. **生成图片**：点击「批量生成图片」按钮，下载所有分页图片

## 项目结构

```
WeChat-Video-Quote-Generator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── optimize/     # AI 文本优化 API 路由
│   │   ├── components/        # 组件
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── styles/            # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 主页面
│   └── ...
├── package.json               # 项目配置
├── tsconfig.json              # TypeScript 配置
├── next.config.js             # Next.js 配置
├── tailwind.config.js         # Tailwind CSS 配置
└── README.md                  # 项目说明
```

## 注意事项

- **API 密钥**：使用前需要配置 Coze API 密钥
- **渲染兼容性**：html2canvas 对 backdrop-filter 的渲染存在兼容性问题，已在代码中处理
- **性能优化**：对于长文本，自动分页可能会有轻微延迟
- **图片质量**：生成的图片为 PNG 格式，分辨率为 1080 × 1920

## 版本历史

- **v2.1**：
  - 优化 AI 文本优化逻辑
  - 改进智能分页算法
  - 提升视觉效果和用户体验

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

**提示**：在使用 AI 文本优化功能时，确保您的 Coze API 密钥已正确配置，并且有足够的 API 调用额度。