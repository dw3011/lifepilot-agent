# LifePilot

LifePilot — AI-powered local life assistant.

LifePilot helps users plan short local life activities by understanding a natural language request, calling mock tools, and generating an executable plan.

## MVP Features

- Natural language input
- Requirement parsing
- Mock activity and restaurant search
- Availability check
- Travel time estimation
- Itinerary generation
- Simulated booking / ordering action
- Shareable plan message

## Planned Tech Stack

- Web UI: Next.js
- Agent runtime: Node.js / TypeScript
- AI integration: LLM with Tool Calling
- Data layer: Mock API and local JSON data for MVP
- Deployment: Vercel or similar static-friendly hosting

## Project Structure

```text
lifepilot-agent/
├── README.md
├── docs/
│   ├── MVP.md
│   ├── DESIGN.md
│   └── DEMO_SCRIPT.md
├── app/
├── lib/
└── package.json
```

## How to Run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

The current MVP uses mock data only. It does not connect to real Meituan APIs, payment APIs, map APIs, SMS APIs, login, or a database.
