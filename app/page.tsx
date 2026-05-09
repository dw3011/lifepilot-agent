"use client";

import { useMemo, useState } from "react";
import { buildLifePilotPlan, SAMPLE_REQUEST } from "@/lib/lifepilot";

const requirementLabels = {
  timeWindow: "Time window",
  people: "People",
  scenario: "Scenario",
  childAge: "Child age",
  distancePreference: "Distance",
  dietPreference: "Diet",
  activityPreference: "Activity",
  budget: "Budget",
  finalGoal: "Final goal"
};

export default function Home() {
  const [input, setInput] = useState(SAMPLE_REQUEST);
  const [submittedInput, setSubmittedInput] = useState(SAMPLE_REQUEST);
  const plan = useMemo(() => buildLifePilotPlan(submittedInput), [submittedInput]);

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Meituan Hackathon MVP Web Demo</p>
          <h1>LifePilot</h1>
          <p className="subtitle">AI-powered local life assistant，帮用户把一句自然语言需求变成可执行的本地生活计划。</p>
        </div>
        <div className="hero-badges" aria-label="MVP scope">
          <span>Mock API only</span>
          <span>No payment</span>
          <span>No database</span>
        </div>
      </section>

      <section className="chat-panel" aria-labelledby="chat-title">
        <div className="section-heading">
          <p className="eyebrow">Chat Input</p>
          <h2 id="chat-title">告诉 LifePilot 你的下午怎么过</h2>
        </div>
        <div className="chat-box">
          <div className="avatar">LP</div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-label="用户需求输入"
            rows={4}
          />
        </div>
        <div className="actions">
          <button type="button" className="secondary-button" onClick={() => setInput(SAMPLE_REQUEST)}>
            Sample request
          </button>
          <button type="button" className="primary-button" onClick={() => setSubmittedInput(input)}>
            Run Agent Demo
          </button>
        </div>
      </section>

      <section className="grid-two">
        <Panel eyebrow="Parsed Constraints" title="需求解析">
          <dl className="requirements">
            {Object.entries(plan.parsed).map(([key, value]) => (
              <div key={key}>
                <dt>{requirementLabels[key as keyof typeof requirementLabels]}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel eyebrow="Agent Planning" title="规划步骤">
          <ol className="steps">
            {plan.agentSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Panel>
      </section>

      <section className="tool-section" aria-labelledby="trace-title">
        <div className="section-heading">
          <p className="eyebrow">Tool Calling Trace</p>
          <h2 id="trace-title">Mock tool 调用记录</h2>
        </div>
        <div className="trace-grid">
          {plan.toolTrace.map((trace) => (
            <article className="trace-card" key={trace.tool}>
              <h3>{trace.tool}</h3>
              <p>
                <strong>Input</strong>
                {trace.input}
              </p>
              <p>
                <strong>Output</strong>
                {trace.output}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid-main">
        <Panel eyebrow="Final Itinerary" title="推荐行程 Timeline">
          <div className="timeline">
            {plan.timeline.map((item) => (
              <article className="timeline-item" key={`${item.time}-${item.title}`}>
                <time>{item.time}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <aside className="summary-panel">
          <div>
            <p className="eyebrow">Selected Activity</p>
            <h2>{plan.activity.name}</h2>
            <p>{plan.activity.reason}</p>
          </div>
          <div>
            <p className="eyebrow">Selected Restaurant</p>
            <h2>{plan.restaurant.name}</h2>
            <p>{plan.restaurant.reason}</p>
          </div>
          <div className="metrics">
            <div>
              <span>Estimated budget</span>
              <strong>{plan.estimatedBudget}</strong>
            </div>
            <div>
              <span>Travel time</span>
              <strong>{plan.travelTimes.homeToActivity}</strong>
            </div>
          </div>
          <div className="booking">
            <span>Booking status</span>
            <strong>{plan.booking.status}</strong>
            <small>{plan.booking.bookingId} · {plan.booking.note}</small>
          </div>
        </aside>
      </section>

      <section className="share-section" aria-labelledby="share-title">
        <div className="section-heading">
          <p className="eyebrow">Share Message</p>
          <h2 id="share-title">可分享计划文案</h2>
        </div>
        <p>{plan.shareMessage}</p>
      </section>
    </main>
  );
}

function Panel({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel">
      <div className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
