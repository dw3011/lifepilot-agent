# LifePilot — AI-powered local life assistant

LifePilot 是一个 AI-powered local life assistant，用 Agent + Tool Calling 把一句自然语言请求转成可执行的本地生活计划。

## Problem Statement

周末下午临时有空时，用户常常想和家人或朋友出门 4-6 小时，但需要手动搜索活动、餐厅、余位、路线、预算和预订选项。这个过程信息分散、决策成本高，尤其在亲子、减脂饮食、距离限制等条件同时存在时更麻烦。

LifePilot 的目标是让用户只说一句话，Agent 自动理解需求、调用 Mock API、处理异常情况，并输出一份可以直接执行和分享的本地生活 itinerary。

## MVP Features

- Chat-style natural language input
- Sample request button for Demo
- Parsed requirement summary
- Agent planning steps
- Mock Tool Calling trace
- Mock activity search
- Mock restaurant search
- Availability check
- Travel time estimation
- Final itinerary timeline
- Simulated booking status
- Shareable plan message
- Exception Handling demo：餐厅满座后自动选择替代餐厅

## Demo Flow

1. 打开 Web UI。
2. 使用默认 sample request：

   ```text
   今天下午是空的，想和老婆、5 岁孩子出去玩几个小时，别离家太远，老婆最近在减肥，帮我安排一下。
   ```

3. 点击 `Run Agent Demo`。
4. 查看 Parsed Constraints、Agent Planning、Tool Calling Trace 和 Final Itinerary。
5. 打开 `触发异常场景：餐厅满座`。
6. 再观察 Tool Calling Trace：首选餐厅满座后，Agent 选择替代餐厅并完成模拟预约。

## Tech Stack

- Framework: Next.js
- Language: TypeScript
- UI: React + CSS
- Agent logic: local TypeScript functions
- Data: Mock API / local mock data only
- Package manager: npm

## How to Run Locally

```bash
cd "/Users/wudi2023/Documents/New project/lifepilot-agent"
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

Useful checks:

```bash
npm run build
npm run lint
```

## Project Structure

```text
lifepilot-agent/
├── README.md
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── docs/
│   ├── MVP.md
│   ├── DESIGN.md
│   └── DEMO_SCRIPT.md
├── lib/
│   └── lifepilot.ts
├── package.json
└── tsconfig.json
```

## Known Limitations

- 使用 Mock API 和本地 mock data，不接入真实 Meituan API。
- 不包含真实支付、真实地图导航、真实短信、用户登录或数据库。
- 当前只覆盖一个主 Demo 输入和一个异常场景。
- Travel time、budget、availability 和 booking status 都是模拟结果。
- Agent reasoning 是可展示的 planning summary，不是生产级自治 Agent runtime。

## GitHub Submission Note

This repository is prepared for Hackathon judging. The MVP focuses on showing the product concept, Agent Planning Strategy, Tool Calling Chain, and Exception Handling flow with a simple runnable Web UI.
