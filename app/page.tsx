"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { buildLifePilotPlan, SAMPLE_REQUEST } from "@/lib/lifepilot";

const requirementItems = [
  ["时间", "timeWindow"],
  ["成员", "people"],
  ["场景", "scenario"],
  ["儿童", "childAge"],
  ["距离", "distancePreference"],
  ["饮食", "dietPreference"],
  ["活动", "activityPreference"],
  ["预算", "budget"]
] as const;

const navItems = ["智能助手", "我的行程", "历史记录", "设置"];

export default function Home() {
  const [input, setInput] = useState(SAMPLE_REQUEST);
  const [submittedInput, setSubmittedInput] = useState(SAMPLE_REQUEST);
  const [restaurantFullMode, setRestaurantFullMode] = useState(false);
  const plan = useMemo(
    () => buildLifePilotPlan(submittedInput, { restaurantFull: restaurantFullMode }),
    [submittedInput, restaurantFullMode]
  );

  return (
    <div className="app-shell">
      <aside className="side-nav" aria-label="LifePilot navigation">
        <div className="brand-block">
          <div className="brand-mark">LP</div>
          <div>
            <h1>LifePilot</h1>
            <p>本地生活 AI 助手</p>
          </div>
        </div>
        <nav className="nav-list">
          {navItems.map((item, index) => (
            <button type="button" className={index === 0 ? "nav-item active" : "nav-item"} key={item}>
              <span>{index + 1}</span>
              {item}
            </button>
          ))}
        </nav>
        <div className="demo-user">
          <div className="user-avatar">DU</div>
          <div>
            <strong>Demo User</strong>
            <span>MVP Demo</span>
          </div>
        </div>
      </aside>

      <main className="main-canvas">
        <header className="top-bar">
          <div>
            <span className="mobile-brand">LifePilot</span>
            <p>当前城市：上海 · Mock API only</p>
          </div>
          <div className="top-actions" aria-label="MVP scope">
            <span>No payment</span>
            <span>No database</span>
          </div>
        </header>

        <div className="content-wrap">
          <section className="hero-panel" aria-labelledby="hero-title">
            <p className="label-caps">Meituan Hackathon MVP Demo</p>
            <h2 id="hero-title">LifePilot</h2>
            <p className="hero-subtitle">AI-powered local life assistant</p>
            <p className="hero-copy">一句话安排本地出行，LifePilot 帮你规划活动、用餐、路线和可分享行程。</p>

            <div className="prompt-card">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                aria-label="用户需求输入"
                placeholder="例如：今天下午想和老婆、5 岁孩子出去玩几个小时，别离家太远……"
                rows={5}
              />
              <div className="prompt-actions">
                <label className={restaurantFullMode ? "simulation-toggle active" : "simulation-toggle"}>
                  <input
                    type="checkbox"
                    checked={restaurantFullMode}
                    onChange={(event) => setRestaurantFullMode(event.target.checked)}
                  />
                  <span>触发异常场景：餐厅满座</span>
                </label>
                <button type="button" className="ghost-button" onClick={() => setInput(SAMPLE_REQUEST)}>
                  使用家庭出游示例
                </button>
                <button type="button" className="solid-button" onClick={() => setSubmittedInput(input)}>
                  生成行程
                </button>
              </div>
            </div>
          </section>

          <section className="bento-grid" aria-label="Agent planning overview">
            <Card title="需求摘要" kicker="Parsed Constraints">
              <ul className="constraint-list">
                {requirementItems.map(([label, key]) => (
                  <li key={key}>
                    <span>{label}</span>
                    <strong>{plan.parsed[key]}</strong>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="如何为你安排行程" kicker="Planning Strategy">
              <ol className="planning-list">
                {plan.agentSteps.map((step, index) => (
                  <li key={step}>
                    <span>{index + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </Card>

            <section className="execution-card">
              <div className="card-heading">
                <p className="label-caps">Execution Record</p>
                <h3>执行记录</h3>
              </div>
              <div className="terminal-log">
                {plan.toolTrace.map((trace, index) => (
                  <article key={`${trace.tool}-${index}`}>
                    <div>
                      <span className="status-dot">OK</span>
                      <strong>{trace.tool}</strong>
                    </div>
                    <p>{trace.output}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <section className="itinerary-shell" aria-labelledby="itinerary-title">
            <div className="itinerary-header">
              <div>
                <p className="label-caps">Final Itinerary</p>
                <h3 id="itinerary-title">{plan.itineraryTitle}</h3>
              </div>
              <button
                type="button"
                className={restaurantFullMode ? "switch-pill active" : "switch-pill"}
                onClick={() => setRestaurantFullMode((current) => !current)}
                aria-pressed={restaurantFullMode}
              >
                <span>餐厅满座模拟</span>
                <strong>{restaurantFullMode ? "ON" : "OFF"}</strong>
              </button>
            </div>

            {plan.exceptionNote ? (
              <div className="alert-card" role="status">
                <strong>原餐厅满座</strong>
                <p>{plan.exceptionNote}</p>
              </div>
            ) : null}

            <div className="timeline">
              {plan.timeline.map((item) => (
                <article className="timeline-item" key={`${item.time}-${item.title}`}>
                  <time>{item.time}</time>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="summary-grid" aria-label="Plan summary">
            <MetricCard label="预计预算" value={plan.estimatedBudget} />
            <MetricCard label="预计路程" value={`去程 ${plan.travelTimes.homeToActivity}`} />
            <MetricCard label="预约状态" value={plan.booking.status} tone="success" />
            <div className="share-card">
              <div>
                <p className="label-caps">Share Message</p>
                <h3>分享给家人</h3>
              </div>
              <p>{plan.shareMessage}</p>
            </div>
          </section>

          <section className="tool-trace-panel" aria-labelledby="trace-title">
            <div className="card-heading">
              <p className="label-caps">Tool Calling Trace</p>
              <h3 id="trace-title">Mock API 调用详情</h3>
            </div>
            <div className="trace-list">
              {plan.toolTrace.map((trace, index) => (
                <article className="trace-row" key={`trace-${trace.tool}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{trace.tool}</h4>
                    <p>
                      <strong>Input</strong>
                      {trace.input}
                    </p>
                    <p>
                      <strong>Output</strong>
                      {trace.output}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <footer className="footer-note">
            <p>Built for Meituan Hackathon</p>
            <span>LifePilot · Hackathon MVP Demo</span>
          </footer>
        </div>
      </main>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        <button type="button" className="active">助理</button>
        <button type="button">行程</button>
        <button type="button">我的</button>
      </nav>
    </div>
  );
}

function Card({ title, kicker, children }: { title: string; kicker: string; children: ReactNode }) {
  return (
    <section className="soft-card">
      <div className="card-heading">
        <p className="label-caps">{kicker}</p>
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className={tone === "success" ? "metric-card success" : "metric-card"}>
      <p className="label-caps">{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
