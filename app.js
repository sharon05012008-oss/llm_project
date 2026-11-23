/* ==========================================================================
   LLM PLAYGROUND — ELECTRIC BLUE EDITION
   Interactive AI Developer Platform Engine
   ========================================================================== */

(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. DATA CATALOG: MODELS, PERSONAS, PRESETS, DOCS
     ------------------------------------------------------------------------ */
  const MODELS = [
    {
      id: 'nebula-4.5-ultra',
      name: 'Nebula-4.5 Ultra',
      provider: 'ElectricLab Frontier',
      badge: 'Flagship',
      badgeType: 'cyan',
      categories: ['reasoning', 'coding', 'multimodal'],
      ctx: '256K',
      tps: 168,
      ttft: 21,
      costIn: 2.50,
      costOut: 7.50,
      mmlu: 93.4,
      humaneval: 94.8,
      gpqa: 82.1,
      intelligence: 95,
      color: '#00E5FF',
      desc: 'Our highest-intelligence frontier model engineered for deep multi-step reasoning, complex architecture design, and production code synthesis.'
    },
    {
      id: 'quantum-r2-reasoner',
      name: 'Quantum-R2 Reasoner',
      provider: 'ElectricLab Research',
      badge: 'Reasoning',
      badgeType: 'purple',
      categories: ['reasoning', 'coding'],
      ctx: '192K',
      tps: 118,
      ttft: 34,
      costIn: 3.00,
      costOut: 9.00,
      mmlu: 94.1,
      humaneval: 93.2,
      gpqa: 88.6,
      intelligence: 98,
      color: '#815BFF',
      desc: 'Test-time compute reasoning specialist with transparent chain-of-thought traces for proofs, algorithm verification, and hard debugging.'
    },
    {
      id: 'volt-3.5-flash',
      name: 'Volt-3.5 Flash',
      provider: 'ElectricLab Edge',
      badge: 'Ultra-Fast',
      badgeType: 'cyan',
      categories: ['fast', 'multimodal'],
      ctx: '128K',
      tps: 312,
      ttft: 11,
      costIn: 0.25,
      costOut: 0.75,
      mmlu: 86.2,
      humaneval: 87.9,
      gpqa: 69.5,
      intelligence: 84,
      color: '#10F5A0',
      desc: 'Blazing-fast speculative-decoded model built for real-time voice agents, instant autocomplete, and high-throughput streaming pipelines.'
    },
    {
      id: 'helix-code-70b',
      name: 'Helix-Code 70B',
      provider: 'ElectricLab Systems',
      badge: 'Coding',
      badgeType: 'purple',
      categories: ['coding', 'fast'],
      ctx: '128K',
      tps: 215,
      ttft: 16,
      costIn: 0.80,
      costOut: 2.40,
      mmlu: 88.0,
      humaneval: 95.6,
      gpqa: 76.0,
      intelligence: 91,
      color: '#008CFF',
      desc: 'Purpose-trained across 40+ programming languages for repository-scale refactoring, Rust/Systems optimization, and zero-hallucination SQL.'
    },
    {
      id: 'aether-4-omni',
      name: 'Aether-4 Omni',
      provider: 'ElectricLab Vision',
      badge: 'Multimodal',
      badgeType: 'cyan',
      categories: ['multimodal', 'reasoning'],
      ctx: '256K',
      tps: 152,
      ttft: 24,
      costIn: 1.80,
      costOut: 5.40,
      mmlu: 91.5,
      humaneval: 90.1,
      gpqa: 79.4,
      intelligence: 92,
      color: '#00E5FF',
      desc: 'Unified text, diagram, UI screenshot, and structured document understanding with native tool calling and JSON schema enforcement.'
    },
    {
      id: 'pulse-mini-edge',
      name: 'Pulse-Mini Edge',
      provider: 'ElectricLab Micro',
      badge: 'Low-Cost',
      badgeType: 'cyan',
      categories: ['fast'],
      ctx: '64K',
      tps: 385,
      ttft: 8,
      costIn: 0.08,
      costOut: 0.24,
      mmlu: 81.4,
      humaneval: 82.0,
      gpqa: 61.2,
      intelligence: 78,
      color: '#10F5A0',
      desc: 'Sub-10ms quantized powerhouse optimized for classification, entity extraction, routing, and massive batch workflows.'
    }
  ];

  const PERSONAS = {
    research: {
      label: 'AI Research Engineer',
      prompt: 'You are Nebula, a principal AI research engineer inside the Electric Blue LLM Playground. Provide technically rigorous, clean, well-structured answers with production-ready code examples and clear complexity trade-offs.'
    },
    architect: {
      label: 'Principal Systems Architect',
      prompt: 'You are a Principal Distributed Systems Architect. Prioritize fault tolerance, p99 latency budgets, backpressure, clear diagrams-in-text, and pragmatic production trade-offs.'
    },
    reviewer: {
      label: 'Strict Code Reviewer',
      prompt: 'You are a strict senior code reviewer. Highlight edge cases, concurrency hazards, security pitfalls, and provide minimal, idiomatic diffs.'
    },
    concise: {
      label: 'Ultra-Concise Mode',
      prompt: 'Respond with maximum technical density and zero filler. Lead with the exact answer, followed by bullet points or clean code only.'
    }
  };

  const PRESETS = {
    attention: {
      prompt: 'Explain how FlashAttention-3 achieves near-peak Hopper GPU utilization compared to standard scaled dot-product attention, with a concise PyTorch-style summary.',
      thinking: 'Comparing HBM bandwidth bottlenecks of naive O(N^2) attention against FlashAttention tiling. Key FlashAttention-3 advances: warp-specialization with TMA async copies, overlapping WGMMA matmul with softmax exp(), and FP8 block quantization with incoherent processing.',
      answer: `### Why Standard Attention Hits the Memory Wall

Standard attention materializes the full **N × N** attention matrix \`S = QKᵀ\` in **HBM** (High Bandwidth Memory), causing **O(N²)** memory reads and writes even though compute FLOPs grow fast on modern GPUs.

### How FlashAttention-3 Breaks the Bottleneck

1. **SRAM Tiling & Online Softmax** — Splits \`Q, K, V\` into tiles that stay resident inside on-chip SRAM, updating running max and normalization statistics without writing \`S\` or \`P\` back to HBM.
2. **Asynchronous Pipeline Overlap** — Uses Hopper **TMA** (Tensor Memory Accelerator) and warp-specialization so one warp group prefetches the next \`K, V\` tile while another executes \`WGMMA\` matrix multiplies and a third computes \`softmax\`.
3. **Incoherent FP8 Quantization** — Applies a fast random Hadamard transform to smooth outlier channels before FP8 casting, cutting quantization error by ~2.6×.

\`\`\`python
# Conceptual tiled online softmax update (per SRAM block)
def online_softmax_step(m_prev, l_prev, o_prev, s_block, v_block):
    m_curr = torch.maximum(m_prev, s_block.max(dim=-1, keepdim=True).values)
    p_block = torch.exp(s_block - m_curr)
    scale = torch.exp(m_prev - m_curr)

    l_curr = l_prev * scale + p_block.sum(dim=-1, keepdim=True)
    o_curr = o_prev * scale + p_block @ v_block
    return m_curr, l_curr, o_curr
\`\`\`

**Bottom line:** HBM traffic drops from **Θ(N²)** to **Θ(N² d² M⁻¹)**, lifting Hopper utilization from ~35% up to **75%+ peak FP16/FP8 throughput**.`
    },
    rust: {
      prompt: 'Write a bounded-concurrency async Rust HTTP fetcher using Tokio and Reqwest with per-request timeouts and structured error reporting.',
      thinking: 'Need idiomatic Tokio bounded concurrency using futures::stream::buffer_unordered or a Semaphore. Let us use tokio::sync::Semaphore + JoinSet so there are minimal extra crates and explicit timeout handling.',
      answer: `### Bounded-Concurrency Async Fetcher in Rust

Using \`tokio::sync::Semaphore\` with \`JoinSet\` guarantees strict in-flight concurrency limits and clean cancellation without unbounded task fan-out.

\`\`\`rust
use reqwest::Client;
use std::{sync::Arc, time::Duration};
use tokio::{sync::Semaphore, task::JoinSet};

#[derive(Debug)]
pub struct FetchReport {
    pub url: String,
    pub status: Result<u16, String>,
}

pub async fn fetch_bounded(urls: Vec<String>, max_concurrent: usize) -> Vec<FetchReport> {
    let client = Client::builder()
        .timeout(Duration::from_secs(8))
        .pool_max_idle_per_host(max_concurrent)
        .build()
        .expect("valid HTTP client");

    let sem = Arc::new(Semaphore::new(max_concurrent));
    let mut set = JoinSet::new();

    for url in urls {
        let permit = sem.clone().acquire_owned().await.unwrap();
        let client = client.clone();
        set.spawn(async move {
            let _permit = permit; // released automatically on drop
            let status = client
                .get(&url)
                .send()
                .await
                .map(|r| r.status().as_u16())
                .map_err(|e| e.to_string());
            FetchReport { url, status }
        });
    }

    let mut reports = Vec::new();
    while let Some(Ok(res)) = set.join_next().await {
        reports.push(res);
    }
    reports
}
\`\`\`

- **Backpressure:** Acquiring the semaphore permit *before* \`set.spawn\` bounds memory even if \`urls\` contains 100k+ entries.
- **Connection reuse:** Sharing one \`Client\` keeps TLS sessions warm across worker tasks.`
    },
    ratelimit: {
      prompt: 'Design a distributed token-bucket rate limiter for an LLM API gateway handling 200K req/sec with atomic Redis Lua execution.',
      thinking: 'LLM gateways need both RPM (requests/min) and TPM (tokens/min) enforcement. An atomic Redis Lua script prevents read-modify-write races and keeps network round-trips to exactly 1 RTT per check.',
      answer: `### Distributed Token-Bucket Architecture (200K RPS)

For an LLM API gateway, enforce **two coupled buckets** per tenant: **Requests/sec** and **Estimated Tokens/min** (reconciled asynchronously once completion finishes).

- **Hot Path (1 RTT):** Execute an atomic Redis Lua script on a sharded Redis Cluster keyed by \`{tenant_id}\` hash-tag so both buckets live on the same shard.
- **Local Pre-Filter:** Maintain a 50ms micro-lease cache inside each edge Envoy/Rust gateway node to absorb abusive bursts before touching Redis.

\`\`\`lua
-- Atomic Token Bucket (KEYS[1] = bucket key)
-- ARGV[1] = capacity, ARGV[2] = refill_per_ms, ARGV[3] = now_ms, ARGV[4] = cost
local data = redis.call("HMGET", KEYS[1], "tokens", "ts")
local tokens = tonumber(data[1]) or tonumber(ARGV[1])
local last_ts = tonumber(data[2]) or tonumber(ARGV[3])

local delta = math.max(0, tonumber(ARGV[3]) - last_ts)
tokens = math.min(tonumber(ARGV[1]), tokens + delta * tonumber(ARGV[2]))

if tokens < tonumber(ARGV[4]) then
  return {0, math.floor(tokens)}
end

tokens = tokens - tonumber(ARGV[4])
redis.call("HMSET", KEYS[1], "tokens", tokens, "ts", ARGV[3])
redis.call("PEXPIRE", KEYS[1], 60000)
return {1, math.floor(tokens)}
\`\`\`

**Observability tip:** Return \`X-RateLimit-Remaining-Tokens\` and \`Retry-After\` headers directly from the Lua return tuple so SDK clients auto-backoff gracefully.`
    },
    sql: {
      prompt: 'How do I optimize a slow PostgreSQL query filtering 80M LLM inference logs by tenant_id, status, and created_at DESC LIMIT 50?',
      thinking: 'Classic multi-column composite B-Tree index ordering problem: equality columns first (tenant_id, status), range/order column last (created_at DESC), plus optional BRIN or monthly partitioning for 80M+ append-only log rows.',
      answer: `### Eliminating Sort & SeqScan on 80M Inference Logs

When PostgreSQL filters by equality predicates and orders by a timestamp with \`LIMIT 50\`, column order inside the composite B-Tree index is everything.

1. **Equality Columns First, Sort Column Last:**
\`\`\`sql
CREATE INDEX CONCURRENTLY idx_logs_tenant_status_created
ON inference_logs (tenant_id, status, created_at DESC)
INCLUDE (model_id, latency_ms, total_tokens);
\`\`\`

2. **Why \`INCLUDE\` Matters:** Putting lightweight dashboard columns inside \`INCLUDE\` enables an **Index-Only Scan**, skipping random heap page fetches entirely.
3. **Time Partitioning:** Partition \`inference_logs\` by month on \`created_at\` so the active index stays hot inside \`shared_buffers\` and old logs drop cleanly via \`DROP TABLE\` instead of expensive \`VACUUM\`.

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT model_id, latency_ms, total_tokens, created_at
FROM inference_logs
WHERE tenant_id = 'org_blue_42' AND status = 'ok'
ORDER BY created_at DESC
LIMIT 50;
\`\`\`

Expected improvement: **~4.2s sequential/sort scan → < 1.8ms Index-Only Scan**.`
    },
    json: {
      prompt: 'Extract structured deployment telemetry JSON from this incident note: "Nebula-4.5 cluster in EU-Central spiked to 41ms TTFT at 14:22 UTC after tensor-cache warm restart; mitigated in 90s via traffic shift to US-East."',
      thinking: 'User wants strict deterministic JSON schema extraction with normalized ISO-like timestamps, severity, affected region, metric delta, and mitigation.',
      answer: `\`\`\`json
{
  "incident_id": "inc_eu_central_ttft_01",
  "severity": "sev3_degraded_latency",
  "service": "nebula-4.5-cluster",
  "region_affected": "eu-central",
  "failover_region": "us-east",
  "telemetry": {
    "metric": "ttft_ms",
    "observed_peak": 41,
    "unit": "ms"
  },
  "root_cause": "tensor_cache_warm_restart",
  "detected_at_utc": "14:22:00Z",
  "time_to_mitigate_seconds": 90,
  "status": "mitigated"
}
\`\`\``
    }
  };

  const DOCS_DATA = {
    quickstart: {
      title: 'Quickstart — First Inference Call',
      desc: 'Authenticate with a Bearer API key and send your first chat completion to any model on the Electric Blue routing fabric.',
      method: 'POST',
      endpoint: '/v1/chat/completions',
      latency: '19 ms',
      snippets: {
        python: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.llmplayground.ai/v1",
    api_key="eb_live_98a4f2c1..."
)

response = client.chat.completions.create(
    model="nebula-4.5-ultra",
    temperature=0.7,
    messages=[
        {"role": "system", "content": "You are an AI research assistant."},
        {"role": "user", "content": "Summarize speculative decoding in 2 sentences."}
    ]
)

print(response.choices[0].message.content)`,
        typescript: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.llmplayground.ai/v1",
  apiKey: process.env.LLM_PLAYGROUND_KEY,
});

const completion = await client.chat.completions.create({
  model: "nebula-4.5-ultra",
  temperature: 0.7,
  messages: [
    { role: "system", content: "You are an AI research assistant." },
    { role: "user", content: "Summarize speculative decoding in 2 sentences." },
  ],
});

console.log(completion.choices[0].message.content);`,
        curl: `curl https://api.llmplayground.ai/v1/chat/completions \\
  -H "Authorization: Bearer $LLM_PLAYGROUND_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "nebula-4.5-ultra",
    "temperature": 0.7,
    "messages": [
      {"role": "user", "content": "Summarize speculative decoding in 2 sentences."}
    ]
  }'`
      },
      response: `{
  "id": "chatcmpl_eb_09f842a1",
  "object": "chat.completion",
  "model": "nebula-4.5-ultra",
  "usage": { "prompt_tokens": 24, "completion_tokens": 41, "total_tokens": 65 },
  "choices": [{
    "index": 0,
    "finish_reason": "stop",
    "message": {
      "role": "assistant",
      "content": "Speculative decoding uses a small draft model to propose multiple future tokens in parallel, which the larger target model verifies in a single forward pass. This preserves the exact output distribution of the target model while delivering 2x–3x faster token generation."
    }
  }]
}`
    },
    streaming: {
      title: 'Real-Time Token Streaming (SSE)',
      desc: 'Set stream: true to receive Server-Sent Events token deltas with sub-20ms time-to-first-token across global edge nodes.',
      method: 'POST',
      endpoint: '/v1/chat/completions?stream=true',
      latency: '14 ms TTFT',
      snippets: {
        python: `stream = client.chat.completions.create(
    model="volt-3.5-flash",
    stream=True,
    messages=[{"role": "user", "content": "Stream a haiku about electric blue GPUs."}]
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)`,
        typescript: `const stream = await client.chat.completions.create({
  model: "volt-3.5-flash",
  stream: true,
  messages: [{ role: "user", content: "Stream a haiku about electric blue GPUs." }],
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}`,
        curl: `curl -N https://api.llmplayground.ai/v1/chat/completions \\
  -H "Authorization: Bearer $LLM_PLAYGROUND_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"volt-3.5-flash","stream":true,"messages":[{"role":"user","content":"Stream a haiku about electric blue GPUs."}]}'`
      },
      response: `data: {"id":"cmpl_91a","choices":[{"delta":{"content":"Cyan"}}]}
data: {"id":"cmpl_91a","choices":[{"delta":{"content":" sparks"}}]}
data: {"id":"cmpl_91a","choices":[{"delta":{"content":" align,"}}]}
data: {"id":"cmpl_91a","choices":[{"delta":{"content":"\\nTensors hum in midnight blue,"}}]}
data: {"id":"cmpl_91a","choices":[{"delta":{"content":"\\nTokens race the light."}}]}
data: [DONE]`
    },
    structured: {
      title: 'Deterministic Structured JSON',
      desc: 'Constrained grammar decoding guarantees 100% schema-valid JSON responses with zero markdown wrappers or syntax errors.',
      method: 'POST',
      endpoint: '/v1/chat/completions',
      latency: '22 ms',
      snippets: {
        python: `res = client.chat.completions.create(
    model="aether-4-omni",
    response_format={"type": "json_object"},
    messages=[
        {"role": "system", "content": "Return JSON with keys: language, complexity, safe."},
        {"role": "user", "content": "Analyze binary search on a sorted array."}
    ]
)`,
        typescript: `const res = await client.chat.completions.create({
  model: "aether-4-omni",
  response_format: { type: "json_object" },
  messages: [
    { role: "system", content: "Return JSON with keys: language, complexity, safe." },
    { role: "user", content: "Analyze binary search on a sorted array." },
  ],
});`,
        curl: `curl https://api.llmplayground.ai/v1/chat/completions \\
  -H "Authorization: Bearer $LLM_PLAYGROUND_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"aether-4-omni","response_format":{"type":"json_object"},"messages":[{"role":"user","content":"Analyze binary search."}]}'`
      },
      response: `{
  "algorithm": "binary_search",
  "time_complexity": "O(log n)",
  "space_complexity": "O(1)",
  "overflow_safe_midpoint": "low + ((high - low) >> 1)",
  "schema_verified": true
}`
    },
    tools: {
      title: 'Native Function & Tool Calling',
      desc: 'Bind typed tools directly to Nebula-4.5 or Helix-Code so the model emits parallel structured tool invocations.',
      method: 'POST',
      endpoint: '/v1/chat/completions',
      latency: '24 ms',
      snippets: {
        python: `tools = [{
    "type": "function",
    "function": {
        "name": "query_cluster_metrics",
        "description": "Fetch live GPU cluster latency by region",
        "parameters": {
            "type": "object",
            "properties": {"region": {"type": "string"}},
            "required": ["region"]
        }
    }
}]

res = client.chat.completions.create(
    model="nebula-4.5-ultra",
    tools=tools,
    messages=[{"role": "user", "content": "Check latency in EU-Central."}]
)`,
        typescript: `const res = await client.chat.completions.create({
  model: "nebula-4.5-ultra",
  tools: [{
    type: "function",
    function: {
      name: "query_cluster_metrics",
      description: "Fetch live GPU cluster latency by region",
      parameters: {
        type: "object",
        properties: { region: { type: "string" } },
        required: ["region"],
      },
    },
  }],
  messages: [{ role: "user", content: "Check latency in EU-Central." }],
});`,
        curl: `curl https://api.llmplayground.ai/v1/chat/completions \\
  -H "Authorization: Bearer $LLM_PLAYGROUND_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"nebula-4.5-ultra","tools":[{"type":"function","function":{"name":"query_cluster_metrics"}}],"messages":[{"role":"user","content":"Check latency in EU-Central."}]}'`
      },
      response: `{
  "finish_reason": "tool_calls",
  "tool_calls": [{
    "id": "call_eu_771",
    "type": "function",
    "function": {
      "name": "query_cluster_metrics",
      "arguments": "{\\"region\\": \\"eu-central\\"}"
    }
  }]
}`
    },
    compare: {
      title: 'Multi-Model Parallel Evaluation',
      desc: 'Fan out a single prompt across multiple models in one batch API call to measure latency, cost, and win-rate.',
      method: 'POST',
      endpoint: '/v1/evals/compare',
      latency: '27 ms',
      snippets: {
        python: `import requests

r = requests.post(
    "https://api.llmplayground.ai/v1/evals/compare",
    headers={"Authorization": "Bearer eb_live_..."},
    json={
        "models": ["nebula-4.5-ultra", "volt-3.5-flash"],
        "prompt": "Write a thread-safe LRU cache in Go."
    }
)
print(r.json()["leaderboard"])`,
        typescript: `const res = await fetch("https://api.llmplayground.ai/v1/evals/compare", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.LLM_PLAYGROUND_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    models: ["nebula-4.5-ultra", "volt-3.5-flash"],
    prompt: "Write a thread-safe LRU cache in Go.",
  }),
});`,
        curl: `curl https://api.llmplayground.ai/v1/evals/compare \\
  -H "Authorization: Bearer $LLM_PLAYGROUND_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"models":["nebula-4.5-ultra","volt-3.5-flash"],"prompt":"Write a thread-safe LRU cache in Go."}'`
      },
      response: `{
  "eval_id": "eval_arena_4029",
  "results": [
    { "model": "nebula-4.5-ultra", "ttft_ms": 21, "tps": 168.4, "quality_score": 9.7 },
    { "model": "volt-3.5-flash",   "ttft_ms": 11, "tps": 314.2, "quality_score": 8.9 }
  ]
}`
    },
    limits: {
      title: 'Rate Limits, Retries & Headers',
      desc: 'Every response includes real-time token bucket headers and automatic idempotency keys for resilient production retries.',
      method: 'GET',
      endpoint: '/v1/account/limits',
      latency: '9 ms',
      snippets: {
        python: `import requests

limits = requests.get(
    "https://api.llmplayground.ai/v1/account/limits",
    headers={"Authorization": "Bearer eb_live_..."}
).json()
print(limits)`,
        typescript: `const res = await fetch("https://api.llmplayground.ai/v1/account/limits", {
  headers: { Authorization: \`Bearer \${process.env.LLM_PLAYGROUND_KEY}\` }
});
const limits = await res.json();`,
        curl: `curl https://api.llmplayground.ai/v1/account/limits \\
  -H "Authorization: Bearer $LLM_PLAYGROUND_KEY"`
      },
      response: `{
  "tier": "research_pro",
  "rpm_limit": 10000,
  "tpm_limit": 4000000,
  "active_streams": 3,
  "region_affinity": "auto-nearest"
}`
    }
  };

  /* ------------------------------------------------------------------------
     2. APPLICATION STATE
     ------------------------------------------------------------------------ */
  const state = {
    mode: 'single', // 'single' | 'compare'
    modelId: MODELS[0].id,
    compareModelA: MODELS[0].id,
    compareModelB: MODELS[2].id,
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.95,
    freqPenalty: 0.0,
    stream: true,
    showThinking: true,
    jsonMode: false,
    sessionTokens: 342,
    sessionCost: 0.0004,
    isGenerating: false,
    abortControllers: [],
    activeTimers: [],
    messages: [],
    docTopic: 'quickstart',
    docLang: 'python',
    exportLang: 'python',
    byok: {
      enabled: false,
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o-mini',
      key: ''
    }
  };

  /* ------------------------------------------------------------------------
     3. DOM REFERENCES
     ------------------------------------------------------------------------ */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const els = {
    navbar: $('#navbar'),
    navLinks: $('#nav-links'),
    mobileMenuBtn: $('#mobile-menu-btn'),
    liveApiBtn: $('#live-api-btn'),
    liveApiLabel: $('#live-api-label'),
    apiPopover: $('#api-popover'),
    pingGridBtn: $('#ping-grid-btn'),
    openByokBtn: $('#open-byok-btn'),
    aboutByokBtn: $('#about-byok-btn'),
    heroVisual: $('#hero-visual'),
    robotStage: $('#robot-stage'),
    robotTrigger: $('#robot-trigger'),
    robotWhisper: $('#robot-whisper'),
    hudTps: $('#hud-tps'),
    heroCompareBtn: $('#hero-compare-btn'),

    workbenchMain: $('#workbench-main'),
    tabSingle: $('#tab-single'),
    tabCompare: $('#tab-compare'),
    systemPromptBar: $('#system-prompt-bar'),
    systemPromptToggle: $('#system-prompt-toggle'),
    systemChevron: $('#system-chevron'),
    systemPromptInput: $('#system-prompt-input'),
    personaBadge: $('#persona-badge'),
    chatViewport: $('#chat-viewport'),
    compareModelA: $('#compare-model-a'),
    compareModelB: $('#compare-model-b'),
    compareMetaNameA: $('#compare-meta-name-a'),
    compareMetaNameB: $('#compare-meta-name-b'),
    compareMetaStatsA: $('#compare-meta-stats-a'),
    compareMetaStatsB: $('#compare-meta-stats-b'),
    compareOutputA: $('#compare-output-a'),
    compareOutputB: $('#compare-output-b'),

    promptInput: $('#prompt-input'),
    inputTokenCount: $('#input-token-count'),
    activeEngineBadge: $('#active-engine-badge'),
    runPromptBtn: $('#run-prompt-btn'),
    stopBtn: $('#stop-btn'),
    clearChatBtn: $('#clear-chat-btn'),
    exportCodeBtn: $('#export-code-btn'),

    modelSelect: $('#model-select'),
    modelCtxPill: $('#model-ctx-pill'),
    paramTemp: $('#param-temp'),
    valTemp: $('#val-temp'),
    paramMaxTokens: $('#param-max-tokens'),
    valMaxTokens: $('#val-max-tokens'),
    paramTopP: $('#param-top-p'),
    valTopP: $('#val-top-p'),
    paramFreq: $('#param-freq'),
    valFreq: $('#val-freq'),
    toggleStream: $('#toggle-stream'),
    toggleThinking: $('#toggle-thinking'),
    toggleJson: $('#toggle-json'),
    resetParamsBtn: $('#reset-params-btn'),

    telTtft: $('#tel-ttft'),
    telTps: $('#tel-tps'),
    telTokens: $('#tel-tokens'),
    telCost: $('#tel-cost'),
    tokenPreview: $('#token-preview'),
    tokChunkCount: $('#tok-chunk-count'),

    modelsGrid: $('#models-grid'),
    modelFilters: $('#model-filters'),
    benchmarkScatter: $('#benchmark-scatter'),

    docsNav: $('#docs-nav'),
    docsTitle: $('#docs-title'),
    docsDesc: $('#docs-desc'),
    docsEndpoint: $('#docs-endpoint'),
    docsLangTabs: $('#docs-lang-tabs'),
    docsCode: $('#docs-code'),
    docsResponse: $('#docs-response'),
    docsConsoleStatus: $('#docs-console-status'),
    docsConsoleLatency: $('#docs-console-latency'),
    docsCopyBtn: $('#docs-copy-btn'),
    docsTryBtn: $('#docs-try-btn'),

    codeModal: $('#code-modal'),
    exportCodePre: $('#export-code-pre'),
    copyExportBtn: $('#copy-export-btn'),
    byokModal: $('#byok-modal'),
    byokEndpoint: $('#byok-endpoint'),
    byokModel: $('#byok-model'),
    byokKey: $('#byok-key'),
    byokSaveBtn: $('#byok-save-btn'),
    byokDisconnectBtn: $('#byok-disconnect-btn'),

    cmdOpenBtn: $('#cmd-open-btn'),
    cmdModal: $('#cmd-modal'),
    cmdInput: $('#cmd-input'),
    cmdList: $('#cmd-list'),
    toast: $('#toast')
  };

  /* ------------------------------------------------------------------------
     4. UTILITIES: TOAST, MARKDOWN, TOKENIZER
     ------------------------------------------------------------------------ */
  let toastTimeout;
  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => els.toast.classList.remove('show'), 2600);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function getModel(id) {
    return MODELS.find((m) => m.id === id) || MODELS[0];
  }

  function tokenizeVisual(text) {
    if (!text.trim()) return [];
    // Lightweight BPE-like chunk splitting for developer inspection
    const chunks = text.match(/(\s+|[A-Za-z]{1,6}|[0-9]+|[^\sA-Za-z0-9])/g) || [];
    return chunks.filter((c) => c.trim().length > 0);
  }

  function estimateTokens(text) {
    if (!text) return 0;
    return Math.max(1, Math.ceil(text.trim().length / 3.8));
  }

  function renderMarkdown(raw) {
    // Extract fenced code blocks first so inner HTML is safely escaped
    const blocks = [];
    let safe = raw.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const idx = blocks.length;
      blocks.push({ lang: lang || 'code', code: code.replace(/\n$/, '') });
      return `@@CODEBLOCK_${idx}@@`;
    });

    safe = escapeHtml(safe);

    // Headings
    safe = safe.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    safe = safe.replace(/^#### (.+)$/gm, '<h4>$1</h4>');

    // Bold, italic & inline code
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/(^|[^\*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Simple unordered & ordered list items
    safe = safe.replace(/^(?:- |\* )(.+)$/gm, '<li>$1</li>');
    safe = safe.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    safe = safe.replace(/(<li>[\s\S]*?<\/li>)(?=\n(?!<li>)|$)/g, '<ul>$1</ul>');

    // Paragraphs
    safe = safe
      .split(/\n{2,}/)
      .map((part) => {
        const trimmed = part.trim();
        if (!trimmed) return '';
        if (/^(<h3|<h4|<ul|@@CODEBLOCK_)/.test(trimmed)) return trimmed;
        return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('');

    // Re-insert code blocks with Copy button
    safe = safe.replace(/@@CODEBLOCK_(\d+)@@/g, (_, i) => {
      const b = blocks[Number(i)];
      const encoded = encodeURIComponent(b.code);
      return `<div class="code-block">
        <div class="code-block-head">
          <span>${escapeHtml(b.lang)}</span>
          <button class="code-copy-btn" data-copy-code="${encoded}" type="button">Copy</button>
        </div>
        <pre><code class="code-block-inner">${escapeHtml(b.code)}</code></pre>
      </div>`;
    });

    return safe;
  }

  /* ------------------------------------------------------------------------
     5. AMBIENT STARFIELD & HERO ROBOT ENERGY PARTICLES
     ------------------------------------------------------------------------ */
  function initStarfield() {
    const canvas = $('#starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, stars = [];
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(95, Math.floor((w * h) / 16000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        alpha: Math.random() * 0.65 + 0.2,
        twinkle: Math.random() * 0.02 + 0.005,
        hue: Math.random() > 0.78 ? '129, 91, 255' : Math.random() > 0.4 ? '0, 229, 255' : '0, 140, 255'
      }));
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });
    resize();

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        s.alpha += s.twinkle;
        if (s.alpha > 0.9 || s.alpha < 0.18) s.twinkle *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.hue}, ${s.alpha.toFixed(2)})`;
        ctx.fill();

        // Subtle neural filament near cursor
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 145) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${((1 - dist / 145) * 0.22).toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initRobotParticles() {
    const canvas = $('#robot-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = canvas.width = Math.max(300, rect.width);
      h = canvas.height = Math.max(300, rect.height);
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 34 }, () => spawnParticle(true));

    function spawnParticle(randomY) {
      const cx = (w || 540) * 0.5;
      const spread = (w || 540) * 0.24;
      return {
        x: cx + (Math.random() - 0.5) * spread * 2,
        y: randomY ? Math.random() * (h || 540) : (h || 540) * 0.84,
        vy: -(Math.random() * 0.85 + 0.35),
        vx: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2.2 + 0.9,
        life: Math.random(),
        color: Math.random() > 0.72 ? '129, 91, 255' : Math.random() > 0.35 ? '0, 229, 255' : '0, 140, 255'
      };
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(p.y * 0.02) * 0.25;
        p.y += p.vy;
        const progress = 1 - p.y / (h * 0.86);
        const alpha = Math.max(0, Math.sin(Math.min(1, Math.max(0, progress)) * Math.PI) * 0.85);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha.toFixed(2)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.fill();

        if (p.y < h * 0.1) {
          particles[i] = spawnParticle(false);
        }
      }
      ctx.shadowBlur = 0;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initHeroInteractions() {
    // 3D subtle cursor parallax on hero robot stage
    if (els.heroVisual && els.robotStage) {
      els.heroVisual.addEventListener('mousemove', (e) => {
        const rect = els.heroVisual.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        els.robotStage.style.transform = `rotateY(${(nx * 10).toFixed(2)}deg) rotateX(${(-ny * 8).toFixed(2)}deg)`;
      });
      els.heroVisual.addEventListener('mouseleave', () => {
        els.robotStage.style.transform = 'rotateY(0deg) rotateX(0deg)';
      });
    }

    // Interactive clicks on the floating 3D robot
    const whispers = [
      'NEURAL CORE SYNCED · READY FOR PROMPTS',
      'SPECULATIVE DECODER · 190 TOK/S ACTIVE',
      'TIP: PRESS ⌘K TO LAUNCH COMMAND PALETTE',
      'TRY SIDE-BY-SIDE COMPARE ARENA BELOW ↓',
      'FP8 TENSOR GRID · 18MS EDGE LATENCY'
    ];
    let wIdx = 0;
    let wTimer;

    function triggerWhisper() {
      els.robotWhisper.textContent = whispers[wIdx % whispers.length];
      wIdx++;
      els.robotWhisper.classList.add('visible');
      clearTimeout(wTimer);
      wTimer = setTimeout(() => els.robotWhisper.classList.remove('visible'), 3000);
    }

    if (els.robotTrigger) {
      els.robotTrigger.addEventListener('click', triggerWhisper);
      els.robotTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerWhisper();
        }
      });
    }

    // Gentle live jitter on HUD throughput badge
    setInterval(() => {
      if (els.hudTps) {
        const v = (184 + Math.random() * 12).toFixed(1);
        els.hudTps.textContent = `${v} tok/s`;
      }
    }, 2600);

    // Hero "Compare 2 Models" shortcut
    if (els.heroCompareBtn) {
      els.heroCompareBtn.addEventListener('click', () => {
        setPlaygroundMode('compare');
        $('#playground').scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  /* ------------------------------------------------------------------------
     6. NAVIGATION & LIVE API POPOVER
     ------------------------------------------------------------------------ */
  function initNavigation() {
    window.addEventListener('scroll', () => {
      els.navbar.classList.toggle('scrolled', window.scrollY > 24);
      updateActiveNav();
    }, { passive: true });

    function updateActiveNav() {
      const sections = ['playground', 'models', 'docs', 'about'];
      const scrollPos = window.scrollY + 180;
      let current = 'playground';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) current = id;
      }
      $$('.nav-link').forEach((link) => {
        link.classList.toggle('active', link.dataset.section === current);
      });
    }

    els.mobileMenuBtn.addEventListener('click', () => {
      els.navLinks.classList.toggle('mobile-open');
    });

    $$('.nav-link').forEach((l) => {
      l.addEventListener('click', () => els.navLinks.classList.remove('mobile-open'));
    });

    // Live API popover
    els.liveApiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = els.apiPopover.classList.toggle('open');
      els.liveApiBtn.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (e) => {
      if (!els.apiPopover.contains(e.target) && e.target !== els.liveApiBtn) {
        els.apiPopover.classList.remove('open');
        els.liveApiBtn.setAttribute('aria-expanded', 'false');
      }
    });

    els.pingGridBtn.addEventListener('click', () => {
      $$('.api-node-latency').forEach((node) => {
        const base = Number(node.dataset.baseMs || 20);
        const ping = Math.max(8, Math.round(base + (Math.random() * 6 - 3)));
        node.textContent = `${ping} ms`;
      });
      showToast('All 3 regional inference clusters healthy (200 OK)');
    });

    els.openByokBtn.addEventListener('click', () => {
      els.apiPopover.classList.remove('open');
      openModal('byok-modal');
    });

    if (els.aboutByokBtn) {
      els.aboutByokBtn.addEventListener('click', () => openModal('byok-modal'));
    }
  }

  /* ------------------------------------------------------------------------
     7. INTELLIGENT RESPONSE GENERATOR + OPTIONAL LIVE BYOK API
     ------------------------------------------------------------------------ */
  function craftSimulatedResponse(prompt, model, opts) {
    const pLower = prompt.toLowerCase();

    // Check exact or close preset match first
    for (const key of Object.keys(PRESETS)) {
      if (prompt.trim() === PRESETS[key].prompt.trim()) {
        let answer = PRESETS[key].answer;
        if (opts.jsonMode && key !== 'json') {
          answer = wrapInJsonMode(prompt, model, answer);
        }
        return { thinking: PRESETS[key].thinking, answer };
      }
    }

    // Strict JSON Mode override
    if (opts.jsonMode) {
      return {
        thinking: `Enforcing grammar-constrained JSON output for ${model.name} (temp=${opts.temperature.toFixed(2)}, top_p=${opts.topP}).`,
        answer: `\`\`\`json
{
  "model": "${model.id}",
  "intent_detected": "${detectTopic(pLower)}",
  "confidence": 0.984,
  "temperature": ${opts.temperature},
  "key_insights": [
    "Structured output verified against strict JSON grammar",
    "Processed prompt in ${model.ttft}ms TTFT on Electric Blue Edge",
    "Ready for downstream tool parsing or schema validation"
  ],
  "prompt_echo": ${JSON.stringify(prompt.slice(0, 120))}
}
\`\`\``
      };
    }

    // Topic-aware intelligent technical responses
    if (/(python|typescript|javascript|rust|go|code|function|api|script|react|css|html)/.test(pLower)) {
      const lang = pLower.includes('rust') ? 'rust' : pLower.includes('python') ? 'python' : 'typescript';
      const codeSample = lang === 'python'
        ? `import asyncio\nfrom dataclasses import dataclass\n\n@dataclass\nclass InferenceResult:\n    model: str\n    latency_ms: float\n    tokens: int\n\nasync def run_pipeline(prompt: str) -> InferenceResult:\n    # Non-blocking async inference dispatch\n    await asyncio.sleep(0.02)\n    return InferenceResult(model="${model.id}", latency_ms=${model.ttft}.4, tokens=128)`
        : lang === 'rust'
          ? `pub struct PipelineConfig {\n    pub model: &'static str,\n    pub temperature: f32,\n    pub max_tokens: u32,\n}\n\npub fn build_default() -> PipelineConfig {\n    PipelineConfig {\n        model: "${model.id}",\n        temperature: ${opts.temperature.toFixed(2)},\n        max_tokens: ${opts.maxTokens},\n    }\n}`
          : `export interface InferenceOptions {\n  model: string;\n  temperature: number;\n  stream: boolean;\n}\n\nexport async function invokeModel(prompt: string, opts: InferenceOptions) {\n  const started = performance.now();\n  const res = await fetch("/v1/chat/completions", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ ...opts, messages: [{ role: "user", content: prompt }] }),\n  });\n  return { data: await res.json(), elapsedMs: Math.round(performance.now() - started) };\n}`;

      return {
        thinking: `Analyzing implementation request for "${prompt.slice(0, 64)}...". Selecting ${lang} pattern with type safety, clear modularity, and minimal runtime overhead calibrated for ${model.name}.`,
        answer: `### Recommended Implementation (${model.name})

Here is a clean, production-minded approach tailored to your request:

\`\`\`${lang}
${codeSample}
\`\`\`

### Key Engineering Notes
- **Deterministic Contracts:** Explicit input/output shapes prevent silent schema drift in multi-step pipelines.
- **Latency Profile:** Running on \`${model.id}\` with \`temperature=${opts.temperature.toFixed(2)}\` keeps outputs focused and reproducible.
- **Next Step:** Toggle **Side-by-Side Compare** above to benchmark this exact prompt against another model family.`
      };
    }

    if (/(model|compare|benchmark|fast|latency|best|which)/.test(pLower)) {
      return {
        thinking: `Evaluating trade-offs across the 6 models on the Electric Blue routing fabric: Nebula-4.5 Ultra, Quantum-R2 Reasoner, Volt-3.5 Flash, Helix-Code 70B, Aether-4 Omni, and Pulse-Mini Edge.`,
        answer: `### Model Selection Guide

Choose the optimal model based on your latency and reasoning budget:

- **Deep Reasoning & Research:** \`Quantum-R2 Reasoner\` (GPQA **88.6%**, rich thinking traces) or \`Nebula-4.5 Ultra\` (best all-around frontier intelligence).
- **Production Coding:** \`Helix-Code 70B\` leads HumanEval at **95.6%** while streaming at **215 tok/s**.
- **Real-Time UX & Agents:** \`Volt-3.5 Flash\` delivers **11ms TTFT** and **312 tok/s**, ideal for interactive voice or live autocomplete.
- **High-Volume Extraction:** \`Pulse-Mini Edge\` runs at **$0.08 / 1M input tokens** with sub-10ms latency.

You can click any model in the **Models Observatory** below to hot-swap it into this studio instantly.`
      };
    }

    // General high-craft research response
    const styleNote = model.id.includes('flash') || model.id.includes('mini')
      ? 'synthesized via low-latency edge speculative decoding'
      : 'analyzed with deep multi-head contextual reasoning';

    return {
      thinking: `Decomposing prompt intent ("${prompt.slice(0, 72)}"). Calibrating depth to system persona (${els.personaBadge.textContent}), temperature=${opts.temperature.toFixed(2)}, max_tokens=${opts.maxTokens}.`,
      answer: `### Analysis via ${model.name}

Your prompt has been ${styleNote} under the active **${els.personaBadge.textContent}** instructions:

1. **Core Framing:** Breaking down *"${prompt.slice(0, 110)}${prompt.length > 110 ? '…' : ''}"* into actionable components ensures testable, measurable outcomes.
2. **Recommended Execution Strategy:**
   - Start with a tight evaluation rubric and clear input/output contracts.
   - Tune \`temperature\` (${opts.temperature.toFixed(2)}) lower for deterministic precision, or higher (~0.9) for divergent exploration.
   - Enable **Strict JSON Output** in the right sidebar whenever downstream automation parses the response.
3. **Live API Integration:** Want responses from your own live OpenAI-compatible endpoint? Click the green **LIVE API** indicator in the top navigation bar to connect your key directly from the browser.`
    };
  }

  function detectTopic(p) {
    if (/(code|rust|python|ts|js|sql)/.test(p)) return 'software_engineering';
    if (/(design|architect|scale|system)/.test(p)) return 'systems_architecture';
    if (/(json|extract|parse)/.test(p)) return 'structured_extraction';
    return 'general_ai_research';
  }

  function wrapInJsonMode(prompt, model, rawAnswer) {
    return `\`\`\`json
{
  "model": "${model.id}",
  "mode": "strict_json",
  "prompt_preview": ${JSON.stringify(prompt.slice(0, 90))},
  "summary": ${JSON.stringify(rawAnswer.replace(/[#`*]/g, '').slice(0, 240) + '...')}
}
\`\`\``;
  }

  async function callByokApi(prompt, modelName, signal) {
    const body = {
      model: state.byok.model || modelName,
      temperature: state.temperature,
      max_tokens: state.maxTokens,
      top_p: state.topP,
      messages: [
        { role: 'system', content: els.systemPromptInput.value.trim() },
        { role: 'user', content: prompt }
      ]
    };
    if (state.jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    const res = await fetch(state.byok.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.byok.key}`
      },
      body: JSON.stringify(body),
      signal
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`HTTP ${res.status}: ${errText.slice(0, 140)}`);
    }
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || JSON.stringify(json, null, 2);
    return {
      thinking: `Live external completion received from ${state.byok.endpoint} (${state.byok.model}).`,
      answer: content,
      tokens: json.usage?.total_tokens || estimateTokens(prompt + content)
    };
  }

  /* ------------------------------------------------------------------------
     8. PLAYGROUND RENDERING & STREAMING ENGINE
     ------------------------------------------------------------------------ */
  function populateModelSelectors() {
    const optsHtml = MODELS.map((m) => `<option value="${m.id}">${m.name} (${m.ctx})</option>`).join('');
    els.modelSelect.innerHTML = optsHtml;
    els.compareModelA.innerHTML = optsHtml;
    els.compareModelB.innerHTML = optsHtml;

    els.modelSelect.value = state.modelId;
    els.compareModelA.value = state.compareModelA;
    els.compareModelB.value = state.compareModelB;
    syncModelMeta();
  }

  function syncModelMeta() {
    const m = getModel(state.modelId);
    els.modelCtxPill.textContent = `${m.ctx} ctx`;
    els.telTtft.innerHTML = `${m.ttft} <span>ms</span>`;
    els.telTps.innerHTML = `${m.tps} <span>t/s</span>`;

    const mA = getModel(state.compareModelA);
    const mB = getModel(state.compareModelB);
    els.compareMetaNameA.textContent = mA.name;
    els.compareMetaNameB.textContent = mB.name;
  }

  function setPlaygroundMode(mode) {
    state.mode = mode;
    const isCompare = mode === 'compare';
    els.workbenchMain.classList.toggle('compare-active', isCompare);
    els.tabSingle.classList.toggle('active', !isCompare);
    els.tabCompare.classList.toggle('active', isCompare);
    els.tabSingle.setAttribute('aria-selected', String(!isCompare));
    els.tabCompare.setAttribute('aria-selected', String(isCompare));
  }

  function appendMessageElement(msg) {
    const wrap = document.createElement('div');
    wrap.className = `msg msg--${msg.role}`;

    const avatarLabel = msg.role === 'user' ? 'YOU' : 'AI';
    const authorName = msg.role === 'user' ? 'Developer' : msg.modelName;
    const badgeHtml = msg.role === 'assistant' ? `<span class="msg-badge">${escapeHtml(msg.modelId)}</span>` : '';
    const statsHtml = msg.stats ? `<span class="msg-stats">${escapeHtml(msg.stats)}</span>` : '<span class="msg-stats"></span>';

    wrap.innerHTML = `
      <div class="msg-avatar">${avatarLabel}</div>
      <div class="msg-body">
        <div class="msg-meta">
          <span class="msg-author">${escapeHtml(authorName)}</span>
          ${badgeHtml}
          ${statsHtml}
        </div>
        <div class="msg-content">
          <div class="thinking-slot"></div>
          <div class="md-body"></div>
        </div>
        ${msg.role === 'assistant' ? `
          <div class="msg-actions">
            <button class="msg-action-btn copy-msg-btn" type="button">Copy Markdown</button>
            <button class="msg-action-btn regen-msg-btn" type="button">Regenerate</button>
          </div>
        ` : ''}
      </div>
    `;

    const mdEl = wrap.querySelector('.md-body');
    const thinkSlot = wrap.querySelector('.thinking-slot');

    if (msg.thinking && state.showThinking) {
      thinkSlot.innerHTML = `
        <details class="thinking-block">
          <summary class="thinking-summary">✦ Reasoning Trace · Click to inspect</summary>
          <div class="thinking-content">${escapeHtml(msg.thinking)}</div>
        </details>
      `;
    }

    mdEl.innerHTML = msg.role === 'user'
      ? `<p>${escapeHtml(msg.content).replace(/\n/g, '<br/>')}</p>`
      : renderMarkdown(msg.content);

    const copyBtn = wrap.querySelector('.copy-msg-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(msg.content).then(() => showToast('Response copied to clipboard'));
      });
    }
    const regenBtn = wrap.querySelector('.regen-msg-btn');
    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        const lastUser = [...state.messages].reverse().find((m) => m.role === 'user');
        if (lastUser) runPrompt(lastUser.content);
      });
    }

    els.chatViewport.appendChild(wrap);
    els.chatViewport.scrollTop = els.chatViewport.scrollHeight;
    return wrap;
  }

  function seedWelcomeConversation() {
    els.chatViewport.innerHTML = '';
    state.messages = [
      {
        role: 'user',
        content: PRESETS.attention.prompt
      },
      {
        role: 'assistant',
        modelId: MODELS[0].id,
        modelName: MODELS[0].name,
        thinking: PRESETS.attention.thinking,
        content: PRESETS.attention.answer,
        stats: '21ms TTFT · 171 tok/s · 214 tokens'
      }
    ];
    state.messages.forEach(appendMessageElement);
  }

  function stopGeneration() {
    state.activeTimers.forEach((id) => clearInterval(id));
    state.activeTimers = [];
    state.abortControllers.forEach((ac) => ac.abort());
    state.abortControllers = [];
    state.isGenerating = false;
    els.stopBtn.classList.remove('visible');
    els.runPromptBtn.disabled = false;
    $$('.stream-cursor').forEach((c) => c.remove());
  }

  function streamTextInto(targetEl, fullText, tps, onDone) {
    if (!state.stream) {
      targetEl.innerHTML = renderMarkdown(fullText);
      onDone();
      return;
    }

    const words = fullText.split(/(\s+)/);
    let idx = 0;
    let built = '';
    // Map tok/s nicely into visual cadence
    const intervalMs = Math.max(12, Math.round(1000 / Math.min(95, tps * 0.42)));

    const timer = setInterval(() => {
      const batch = tps > 240 ? 4 : tps > 150 ? 2 : 1;
      for (let b = 0; b < batch && idx < words.length; b++) {
        built += words[idx++];
      }
      targetEl.innerHTML = renderMarkdown(built) + '<span class="stream-cursor"></span>';
      if (els.chatViewport) els.chatViewport.scrollTop = els.chatViewport.scrollHeight;

      if (idx >= words.length) {
        clearInterval(timer);
        targetEl.innerHTML = renderMarkdown(fullText);
        onDone();
      }
    }, intervalMs);

    state.activeTimers.push(timer);
  }

  async function runPrompt(overridePrompt) {
    const prompt = (overridePrompt !== undefined ? overridePrompt : els.promptInput.value).trim();
    if (!prompt) {
      showToast('Enter a prompt or click a preset chip above');
      els.promptInput.focus();
      return;
    }

    stopGeneration();
    state.isGenerating = true;
    els.stopBtn.classList.add('visible');
    els.runPromptBtn.disabled = true;

    if (overridePrompt === undefined) {
      els.promptInput.value = '';
      updateInputTokenizer('');
    }

    if (state.mode === 'compare') {
      await runCompareGeneration(prompt);
    } else {
      await runSingleGeneration(prompt);
    }
  }

  async function runSingleGeneration(prompt) {
    const model = getModel(state.modelId);
    const userMsg = { role: 'user', content: prompt };
    state.messages.push(userMsg);
    appendMessageElement(userMsg);

    const assistantMsg = {
      role: 'assistant',
      modelId: state.byok.enabled ? state.byok.model : model.id,
      modelName: state.byok.enabled ? `Live · ${state.byok.model}` : model.name,
      thinking: '',
      content: '',
      stats: 'Connecting...'
    };
    state.messages.push(assistantMsg);
    const msgEl = appendMessageElement(assistantMsg);
    const mdEl = msgEl.querySelector('.md-body');
    const statsEl = msgEl.querySelector('.msg-stats');
    const thinkSlot = msgEl.querySelector('.thinking-slot');
    mdEl.innerHTML = '<span class="stream-cursor"></span>';

    const startTime = performance.now();

    try {
      let result;
      if (state.byok.enabled && state.byok.key) {
        const ac = new AbortController();
        state.abortControllers.push(ac);
        result = await callByokApi(prompt, model.id, ac.signal);
      } else {
        await new Promise((r) => setTimeout(r, Math.min(260, model.ttft * 7)));
        result = craftSimulatedResponse(prompt, model, state);
      }

      const ttft = Math.max(8, Math.round(state.byok.enabled ? performance.now() - startTime : model.ttft + (Math.random() * 6 - 3)));
      assistantMsg.thinking = result.thinking;
      assistantMsg.content = result.answer;

      if (result.thinking && state.showThinking) {
        thinkSlot.innerHTML = `
          <details class="thinking-block" open>
            <summary class="thinking-summary">✦ Reasoning Trace · ${ttft}ms</summary>
            <div class="thinking-content">${escapeHtml(result.thinking)}</div>
          </details>
        `;
      }

      streamTextInto(mdEl, result.answer, model.tps, () => {
        const outTokens = result.tokens || estimateTokens(result.answer);
        const inTokens = estimateTokens(prompt);
        const liveTps = Math.round(model.tps + (Math.random() * 14 - 7));
        const cost = (inTokens / 1e6) * model.costIn + (outTokens / 1e6) * model.costOut;

        state.sessionTokens += inTokens + outTokens;
        state.sessionCost += cost;

        statsEl.textContent = `${ttft}ms TTFT · ${liveTps} tok/s · ${outTokens} tokens`;
        assistantMsg.stats = statsEl.textContent;

        els.telTtft.innerHTML = `${ttft} <span>ms</span>`;
        els.telTps.innerHTML = `${liveTps} <span>t/s</span>`;
        els.telTokens.textContent = state.sessionTokens.toLocaleString();
        els.telCost.textContent = `$${state.sessionCost.toFixed(4)}`;

        stopGeneration();
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        mdEl.innerHTML = `<p style="color:#FF94B2;"><strong>Request Error:</strong> ${escapeHtml(err.message)}</p>`;
        statsEl.textContent = 'Error';
      }
      stopGeneration();
    }
  }

  async function runCompareGeneration(prompt) {
    const modelA = getModel(state.compareModelA);
    const modelB = getModel(state.compareModelB);

    els.compareMetaNameA.textContent = modelA.name;
    els.compareMetaNameB.textContent = modelB.name;
    els.compareMetaStatsA.textContent = 'Streaming...';
    els.compareMetaStatsB.textContent = 'Streaming...';
    els.compareOutputA.innerHTML = '<span class="stream-cursor"></span>';
    els.compareOutputB.innerHTML = '<span class="stream-cursor"></span>';

    const resA = craftSimulatedResponse(prompt, modelA, state);
    const resB = craftSimulatedResponse(prompt, modelB, {
      ...state,
      temperature: Math.min(2, state.temperature + 0.15)
    });

    let completed = 0;
    const finishCheck = () => {
      completed++;
      if (completed >= 2) stopGeneration();
    };

    const tA = setTimeout(() => {
      streamTextInto(els.compareOutputA, resA.answer, modelA.tps, () => {
        const toks = estimateTokens(resA.answer);
        els.compareMetaStatsA.textContent = `${modelA.ttft}ms · ${modelA.tps} t/s · ${toks} tok`;
        finishCheck();
      });
    }, modelA.ttft * 6);

    const tB = setTimeout(() => {
      streamTextInto(els.compareOutputB, resB.answer, modelB.tps, () => {
        const toks = estimateTokens(resB.answer);
        els.compareMetaStatsB.textContent = `${modelB.ttft}ms · ${modelB.tps} t/s · ${toks} tok`;
        finishCheck();
      });
    }, modelB.ttft * 6);

    state.activeTimers.push(tA, tB);
  }

  function updateInputTokenizer(text) {
    const chunks = tokenizeVisual(text);
    els.inputTokenCount.textContent = `${chunks.length} tokens`;
    els.tokChunkCount.textContent = `${chunks.length} chunks`;

    if (chunks.length === 0) {
      els.tokenPreview.innerHTML = '<span style="font-size:0.76rem;color:var(--text-muted);">Type a prompt to inspect token splits...</span>';
      return;
    }

    els.tokenPreview.innerHTML = chunks
      .slice(0, 48)
      .map((c, i) => `<span class="tok-pill tok-c${i % 4}">${escapeHtml(c)}</span>`)
      .join('') + (chunks.length > 48 ? `<span class="tok-pill tok-c0">+${chunks.length - 48}</span>` : '');
  }

  function initPlayground() {
    populateModelSelectors();
    seedWelcomeConversation();

    els.tabSingle.addEventListener('click', () => setPlaygroundMode('single'));
    els.tabCompare.addEventListener('click', () => setPlaygroundMode('compare'));

    els.systemPromptToggle.addEventListener('click', () => {
      const open = els.systemPromptBar.classList.toggle('open');
      els.systemChevron.textContent = open ? 'Collapse ▴' : 'Expand ▾';
    });

    $$('.persona-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = PERSONAS[btn.dataset.persona];
        if (!p) return;
        $$('.persona-pill').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        els.systemPromptInput.value = p.prompt;
        els.personaBadge.textContent = p.label;
        showToast(`Persona switched: ${p.label}`);
      });
    });

    $$('.preset-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const preset = PRESETS[chip.dataset.preset];
        if (!preset) return;
        els.promptInput.value = preset.prompt;
        updateInputTokenizer(preset.prompt);
        runPrompt(preset.prompt);
      });
    });

    els.modelSelect.addEventListener('change', (e) => {
      state.modelId = e.target.value;
      syncModelMeta();
      showToast(`Active model: ${getModel(state.modelId).name}`);
    });
    els.compareModelA.addEventListener('change', (e) => {
      state.compareModelA = e.target.value;
      syncModelMeta();
    });
    els.compareModelB.addEventListener('change', (e) => {
      state.compareModelB = e.target.value;
      syncModelMeta();
    });

    // Parameter sliders
    els.paramTemp.addEventListener('input', (e) => {
      state.temperature = parseFloat(e.target.value);
      els.valTemp.textContent = state.temperature.toFixed(2);
    });
    els.paramMaxTokens.addEventListener('input', (e) => {
      state.maxTokens = parseInt(e.target.value, 10);
      els.valMaxTokens.textContent = String(state.maxTokens);
    });
    els.paramTopP.addEventListener('input', (e) => {
      state.topP = parseFloat(e.target.value);
      els.valTopP.textContent = state.topP.toFixed(2);
    });
    els.paramFreq.addEventListener('input', (e) => {
      state.freqPenalty = parseFloat(e.target.value);
      els.valFreq.textContent = state.freqPenalty.toFixed(2);
    });

    els.toggleStream.addEventListener('change', (e) => { state.stream = e.target.checked; });
    els.toggleThinking.addEventListener('change', (e) => { state.showThinking = e.target.checked; });
    els.toggleJson.addEventListener('change', (e) => {
      state.jsonMode = e.target.checked;
      showToast(state.jsonMode ? 'Strict JSON output enabled' : 'Standard Markdown output enabled');
    });

    els.resetParamsBtn.addEventListener('click', () => {
      state.temperature = 0.7;
      state.maxTokens = 2048;
      state.topP = 0.95;
      state.freqPenalty = 0.0;
      els.paramTemp.value = 0.7; els.valTemp.textContent = '0.70';
      els.paramMaxTokens.value = 2048; els.valMaxTokens.textContent = '2048';
      els.paramTopP.value = 0.95; els.valTopP.textContent = '0.95';
      els.paramFreq.value = 0; els.valFreq.textContent = '0.00';
      showToast('Parameters reset to lab defaults');
    });

    els.promptInput.addEventListener('input', (e) => updateInputTokenizer(e.target.value));
    els.promptInput.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        runPrompt();
      }
    });

    els.runPromptBtn.addEventListener('click', () => runPrompt());
    els.stopBtn.addEventListener('click', () => {
      stopGeneration();
      showToast('Generation stopped');
    });

    els.clearChatBtn.addEventListener('click', () => {
      stopGeneration();
      state.messages = [];
      els.chatViewport.innerHTML = '<div style="margin:auto;text-align:center;color:var(--text-muted);padding:48px 16px;">Session cleared. Pick a preset prompt or ask anything below.</div>';
      els.compareOutputA.innerHTML = 'Ready for side-by-side comparison.';
      els.compareOutputB.innerHTML = 'Ready for side-by-side comparison.';
      showToast('Session cleared');
    });

    // Delegated copy code button inside rendered markdown
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.code-copy-btn');
      if (!btn) return;
      const code = decodeURIComponent(btn.dataset.copyCode || '');
      navigator.clipboard.writeText(code).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied ✓';
        setTimeout(() => (btn.textContent = orig), 1600);
      });
    });
  }

  /* ------------------------------------------------------------------------
     9. MODELS OBSERVATORY & INTERACTIVE SCATTER PLOT
     ------------------------------------------------------------------------ */
  function renderModels(filter = 'all') {
    const filtered = filter === 'all' ? MODELS : MODELS.filter((m) => m.categories.includes(filter));
    els.modelsGrid.innerHTML = filtered
      .map((m) => `
        <article class="glass-card model-card">
          <div class="model-card-top">
            <div>
              <h3 class="model-name">${escapeHtml(m.name)}</h3>
              <div class="model-provider">${escapeHtml(m.provider)}</div>
            </div>
            <span class="model-tag ${m.badgeType === 'purple' ? 'model-tag--purple' : ''}">${escapeHtml(m.badge)}</span>
          </div>

          <p class="model-desc">${escapeHtml(m.desc)}</p>

          <div class="model-specs">
            <div>
              <div class="spec-k">Context</div>
              <div class="spec-v">${m.ctx}</div>
            </div>
            <div>
              <div class="spec-k">Velocity</div>
              <div class="spec-v">${m.tps} t/s</div>
            </div>
            <div>
              <div class="spec-k">TTFT</div>
              <div class="spec-v">${m.ttft} ms</div>
            </div>
          </div>

          <div class="bench-bars">
            <div class="bench-row">
              <div class="bench-head"><span>MMLU-Pro</span><span>${m.mmlu}%</span></div>
              <div class="bench-track"><div class="bench-fill" style="width:${m.mmlu}%"></div></div>
            </div>
            <div class="bench-row">
              <div class="bench-head"><span>HumanEval Code</span><span>${m.humaneval}%</span></div>
              <div class="bench-track"><div class="bench-fill bench-fill--purple" style="width:${m.humaneval}%"></div></div>
            </div>
          </div>

          <div class="model-card-footer">
            <div class="model-price">$${m.costIn.toFixed(2)} / 1M in</div>
            <button class="btn btn-secondary btn-sm load-model-btn" data-model-id="${m.id}" type="button">
              Load in Playground
            </button>
          </div>
        </article>
      `)
      .join('');

    $$('.load-model-btn').forEach((btn) => {
      btn.addEventListener('click', () => loadModelIntoPlayground(btn.dataset.modelId));
    });
  }

  function loadModelIntoPlayground(modelId) {
    state.modelId = modelId;
    els.modelSelect.value = modelId;
    syncModelMeta();
    setPlaygroundMode('single');
    $('#playground').scrollIntoView({ behavior: 'smooth' });
    showToast(`Loaded ${getModel(modelId).name} into Playground`);
  }

  function renderBenchmarkScatter() {
    const svg = els.benchmarkScatter;
    if (!svg) return;
    const pad = { l: 64, r: 44, t: 28, b: 44 };
    const W = 920, H = 260;
    const plotW = W - pad.l - pad.r;
    const plotH = H - pad.t - pad.b;

    const xScale = (tps) => pad.l + ((tps - 80) / (410 - 80)) * plotW;
    const yScale = (intel) => pad.t + (1 - (intel - 72) / (100 - 72)) * plotH;

    let markup = `
      <defs>
        <linearGradient id="paretoLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#815BFF" stop-opacity="0.7"/>
          <stop offset="50%" stop-color="#00E5FF" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#10F5A0" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
    `;

    // Grid lines
    [75, 82, 90, 98].forEach((val) => {
      const y = yScale(val);
      markup += `<line x1="${pad.l}" y1="${y}" x2="${W - pad.r}" y2="${y}" stroke="rgba(0,140,255,0.16)" stroke-dasharray="4 4"/>`;
      markup += `<text x="${pad.l - 12}" y="${y + 4}" fill="#6C86B0" font-size="11" font-family="JetBrains Mono" text-anchor="end">${val}</text>`;
    });

    [100, 200, 300, 400].forEach((val) => {
      const x = xScale(val);
      markup += `<line x1="${x}" y1="${pad.t}" x2="${x}" y2="${H - pad.b}" stroke="rgba(0,140,255,0.12)"/>`;
      markup += `<text x="${x}" y="${H - pad.b + 20}" fill="#6C86B0" font-size="11" font-family="JetBrains Mono" text-anchor="middle">${val} t/s</text>`;
    });

    // Axis titles
    markup += `<text x="${W / 2}" y="${H - 6}" fill="#A5BCDF" font-size="11" font-family="Inter" text-anchor="middle">Streaming Velocity (tokens / second)</text>`;
    markup += `<text x="18" y="${H / 2}" fill="#A5BCDF" font-size="11" font-family="Inter" text-anchor="middle" transform="rotate(-90 18 ${H / 2})">Intelligence Index</text>`;

    // Pareto curve
    const paretoPts = [
      MODELS[1], // Quantum-R2
      MODELS[0], // Nebula-4.5
      MODELS[3], // Helix-Code
      MODELS[2], // Volt-3.5
      MODELS[5]  // Pulse-Mini
    ].map((m) => `${xScale(m.tps).toFixed(1)},${yScale(m.intelligence).toFixed(1)}`).join(' ');
    markup += `<polyline points="${paretoPts}" fill="none" stroke="url(#paretoLine)" stroke-width="2" stroke-dasharray="6 5" opacity="0.7"/>`;

    // Model Nodes
    MODELS.forEach((m) => {
      const cx = xScale(m.tps);
      const cy = yScale(m.intelligence);
      const labelOffsetY = m.id === 'aether-4-omni' ? 22 : -14;
      markup += `
        <g class="scatter-node" data-scatter-model="${m.id}">
          <circle cx="${cx}" cy="${cy}" r="14" fill="${m.color}" opacity="0.16"/>
          <circle cx="${cx}" cy="${cy}" r="6.5" fill="${m.color}" stroke="#030B1C" stroke-width="2"/>
          <text x="${cx}" y="${cy + labelOffsetY}" fill="#F4F8FF" font-size="11.5" font-weight="600" font-family="Space Grotesk" text-anchor="middle">${m.name}</text>
        </g>
      `;
    });

    svg.innerHTML = markup;
    $$('[data-scatter-model]').forEach((node) => {
      node.addEventListener('click', () => loadModelIntoPlayground(node.dataset.scatterModel));
    });
  }

  function initModelsSection() {
    renderModels('all');
    renderBenchmarkScatter();

    els.modelFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      $$('.filter-pill').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      renderModels(btn.dataset.filter);
    });
  }

  /* ------------------------------------------------------------------------
     10. INTERACTIVE DEVELOPER DOCS
     ------------------------------------------------------------------------ */
  function renderDocs() {
    const doc = DOCS_DATA[state.docTopic];
    if (!doc) return;
    els.docsTitle.textContent = doc.title;
    els.docsDesc.textContent = doc.desc;
    els.docsEndpoint.innerHTML = `<span>${doc.method}</span>${doc.endpoint}`;
    els.docsCode.textContent = doc.snippets[state.docLang];
    els.docsResponse.textContent = doc.response;
    els.docsConsoleStatus.textContent = 'LIVE RESPONSE SANDBOX · READY';
    els.docsConsoleLatency.textContent = `200 OK · ${doc.latency}`;
  }

  function initDocs() {
    renderDocs();

    els.docsNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.docs-nav-btn');
      if (!btn) return;
      $$('.docs-nav-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.docTopic = btn.dataset.doc;
      renderDocs();
    });

    els.docsLangTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.lang-tab');
      if (!tab) return;
      $$('#docs-lang-tabs .lang-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      state.docLang = tab.dataset.lang;
      renderDocs();
    });

    els.docsCopyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(els.docsCode.textContent).then(() => showToast('API snippet copied to clipboard'));
    });

    els.docsTryBtn.addEventListener('click', () => {
      const doc = DOCS_DATA[state.docTopic];
      els.docsConsoleStatus.textContent = 'EXECUTING REQUEST ON EDGE NODE...';
      els.docsResponse.textContent = '// Awaiting tensor cluster response...';
      setTimeout(() => {
        els.docsConsoleStatus.textContent = 'RESPONSE RECEIVED · VERIFIED';
        els.docsConsoleLatency.textContent = `200 OK · ${doc.latency}`;
        els.docsResponse.textContent = doc.response;
        showToast(`Simulated ${doc.method} ${doc.endpoint} (200 OK)`);
      }, 360);
    });
  }

  /* ------------------------------------------------------------------------
     11. MODALS: EXPORT CODE, BYOK LIVE API, COMMAND PALETTE (⌘K)
     ------------------------------------------------------------------------ */
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('open');
  }
  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('open');
  }

  function buildExportSnippet(lang) {
    const lastUser = [...state.messages].reverse().find((m) => m.role === 'user');
    const prompt = lastUser ? lastUser.content : 'Explain FlashAttention-3 in 3 bullet points.';
    const sys = els.systemPromptInput.value.trim();

    if (lang === 'python') {
      return `from openai import OpenAI

client = OpenAI(
    base_url="https://api.llmplayground.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="${state.modelId}",
    temperature=${state.temperature.toFixed(2)},
    max_tokens=${state.maxTokens},
    top_p=${state.topP.toFixed(2)},
    frequency_penalty=${state.freqPenalty.toFixed(2)},
    stream=${state.stream ? 'True' : 'False'},${state.jsonMode ? '\n    response_format={"type": "json_object"},' : ''}
    messages=[
        {"role": "system", "content": ${JSON.stringify(sys)}},
        {"role": "user", "content": ${JSON.stringify(prompt)}}
    ]
)`;
    }

    if (lang === 'typescript') {
      return `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.llmplayground.ai/v1",
  apiKey: process.env.LLM_PLAYGROUND_KEY,
});

const response = await client.chat.completions.create({
  model: "${state.modelId}",
  temperature: ${state.temperature.toFixed(2)},
  max_tokens: ${state.maxTokens},
  top_p: ${state.topP.toFixed(2)},
  frequency_penalty: ${state.freqPenalty.toFixed(2)},
  stream: ${state.stream},${state.jsonMode ? '\n  response_format: { type: "json_object" },' : ''}
  messages: [
    { role: "system", content: ${JSON.stringify(sys)} },
    { role: "user", content: ${JSON.stringify(prompt)} },
  ],
});`;
    }

    return `curl https://api.llmplayground.ai/v1/chat/completions \\
  -H "Authorization: Bearer $LLM_PLAYGROUND_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({
      model: state.modelId,
      temperature: state.temperature,
      max_tokens: state.maxTokens,
      top_p: state.topP,
      stream: state.stream,
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: prompt }
      ]
    }, null, 2)}'`;
  }

  function initModals() {
    $$('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
    });

    $$('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.classList.remove('open');
      });
    });

    // Export Code modal
    els.exportCodeBtn.addEventListener('click', () => {
      els.exportCodePre.textContent = buildExportSnippet(state.exportLang);
      openModal('code-modal');
    });

    $$('[data-export-lang]').forEach((tab) => {
      tab.addEventListener('click', () => {
        $$('[data-export-lang]').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        state.exportLang = tab.dataset.exportLang;
        els.exportCodePre.textContent = buildExportSnippet(state.exportLang);
      });
    });

    els.copyExportBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(els.exportCodePre.textContent).then(() => showToast('Exported SDK code copied'));
    });

    // BYOK Live API modal
    els.byokSaveBtn.addEventListener('click', () => {
      const key = els.byokKey.value.trim();
      const endpoint = els.byokEndpoint.value.trim();
      const model = els.byokModel.value.trim();
      if (!key || !endpoint) {
        showToast('Enter both an API endpoint and API key');
        return;
      }
      state.byok = { enabled: true, endpoint, model: model || 'gpt-4o-mini', key };
      els.activeEngineBadge.textContent = `Live API · ${state.byok.model}`;
      els.activeEngineBadge.style.color = '#10F5A0';
      els.liveApiLabel.textContent = 'LIVE BYOK';
      closeModal('byok-modal');
      showToast('Live OpenAI-compatible API connected');
    });

    els.byokDisconnectBtn.addEventListener('click', () => {
      state.byok.enabled = false;
      state.byok.key = '';
      els.byokKey.value = '';
      els.activeEngineBadge.textContent = 'Simulated Edge Engine';
      els.activeEngineBadge.style.color = 'var(--neon-cyan)';
      els.liveApiLabel.textContent = 'LIVE API';
      closeModal('byok-modal');
      showToast('Switched back to built-in Edge Simulator');
    });

    // Command Palette (⌘K)
    const commands = [
      { label: 'Jump to Playground Studio', tag: 'Section', run: () => $('#playground').scrollIntoView({ behavior: 'smooth' }) },
      { label: 'Jump to Models Observatory', tag: 'Section', run: () => $('#models').scrollIntoView({ behavior: 'smooth' }) },
      { label: 'Jump to Developer Docs', tag: 'Section', run: () => $('#docs').scrollIntoView({ behavior: 'smooth' }) },
      { label: 'Switch to Side-by-Side Compare Arena', tag: 'Mode', run: () => { setPlaygroundMode('compare'); $('#playground').scrollIntoView({ behavior: 'smooth' }); } },
      { label: 'Export Playground SDK Code', tag: 'Action', run: () => { els.exportCodePre.textContent = buildExportSnippet(state.exportLang); openModal('code-modal'); } },
      { label: 'Connect Live OpenAI-Compatible Key', tag: 'API', run: () => openModal('byok-modal') },
      ...MODELS.map((m) => ({
        label: `Load ${m.name} (${m.tps} t/s)`,
        tag: 'Model',
        run: () => loadModelIntoPlayground(m.id)
      }))
    ];

    function renderCmdList(query = '') {
      const q = query.trim().toLowerCase();
      const hits = commands.filter((c) => !q || c.label.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q));
      els.cmdList.innerHTML = hits
        .map((c, idx) => `<button class="cmd-item" data-cmd-idx="${idx}" type="button">${escapeHtml(c.label)}<span>${c.tag}</span></button>`)
        .join('');
      $$('.cmd-item').forEach((btn) => {
        btn.addEventListener('click', () => {
          closeModal('cmd-modal');
          hits[Number(btn.dataset.cmdIdx)].run();
        });
      });
    }

    els.cmdOpenBtn.addEventListener('click', () => {
      els.cmdInput.value = '';
      renderCmdList('');
      openModal('cmd-modal');
      setTimeout(() => els.cmdInput.focus(), 50);
    });

    els.cmdInput.addEventListener('input', (e) => renderCmdList(e.target.value));

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (els.cmdModal.classList.contains('open')) {
          closeModal('cmd-modal');
        } else {
          els.cmdInput.value = '';
          renderCmdList('');
          openModal('cmd-modal');
          setTimeout(() => els.cmdInput.focus(), 50);
        }
      } else if (e.key === 'Escape') {
        $$('.modal-backdrop.open').forEach((m) => m.classList.remove('open'));
        els.apiPopover.classList.remove('open');
      }
    });
  }

  /* ------------------------------------------------------------------------
     12. BOOTSTRAP
     ------------------------------------------------------------------------ */
  function boot() {
    initStarfield();
    initRobotParticles();
    initHeroInteractions();
    initNavigation();
    initPlayground();
    initModelsSection();
    initDocs();
    initModals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
