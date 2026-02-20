import React, { useState } from 'react';

type Step = {
  action: string;
  target?: string;
  selector?: { type: 'css' | 'xpath'; value: string };
};

type ScriptSpec = {
  name?: string;
  steps: Step[];
};

type StepResult = {
  index: number;
  action: string;
  status: string;
  duration: number;
  error?: string;
  screenshot?: string;
};

type RunResponse = {
  runId: string;
  steps: StepResult[];
  name?: string;
  json?: any;
  htmlUrl?: string;
  mode?: string;
};

const defaultScript: ScriptSpec = {
  name: "Demo Run",
  steps: [
    { action: "navigate", target: "http://localhost:3000/" }
  ]
};

export default function Home() {
  const [scriptText, setScriptText] = useState<string>(JSON.stringify(defaultScript, null, 2));
  const [running, setRunning] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [steps, setSteps] = useState<StepResult[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [liveName, setLiveName] = useState<string>(defaultScript.name ?? "Demo Run");
  const [mode, setMode] = useState<string | null>(null);

  const runScript = async () => {
    setErr(null);
    setRunning(true);
    setRunId(null);
    setSteps([]);
    setMode(null);
    try {
      const parsed = JSON.parse(scriptText) as ScriptSpec;
      const resp = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: parsed })
      });
      if (!resp.ok) {
        throw new Error(`Server error: ${resp.status}`);
      }
      const data: RunResponse = await resp.json();
      setRunId(data.runId);
      // Display steps
      setSteps(data.steps);
      // Update optional name
      if (data.name) setLiveName(data.name);
      if (data.mode) setMode(data.mode);
    } catch (e: any) {
      setErr(e?.message ?? 'Unknown error');
    } finally {
      setRunning(false);
    }
  };

  const getDataUrl = (b64?: string) => {
    if (!b64) return '';
    if (b64.startsWith('data:')) return b64;
    return `data:image/png;base64,${b64}`;
  };

  const downloadJson = () => {
    if (!runId) return;
    window.open(`/api/reports/${runId}?format=json`, '_blank');
  };
  const downloadHtml = () => {
    if (!runId) return;
    window.open(`/api/reports/${runId}?format=html`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">StepShot Runner (Preview)</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Script (JSON)</label>
          <textarea
            className="w-full h-48 p-3 border rounded"
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={runScript}
            disabled={running}
          >
            {running ? 'Running...' : 'Run Script'}
          </button>
          <span className="text-sm text-gray-600">Target: local app at http://localhost:3000/</span>
          {mode && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
              Mode: {mode.toUpperCase()}
            </span>
          )}
        </div>

        {err && <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded">{err}</div>}

        {runId && (
          <div className="mb-4">
            <div className="text-sm text-gray-700 mb-2">Run ID: {runId}</div>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={downloadJson}>
                Download JSON Report
              </button>
              <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={downloadHtml}>
                Download HTML Report
              </button>
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="text-sm font-semibold mb-2">Progress</div>
          {steps.length === 0 && <div className="text-sm text-gray-600">No steps executed yet.</div>}
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.index} className="border rounded p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">
                    Step {s.index + 1}: {s.action}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    s.status === 'passed' ? 'bg-green-100 text-green-800' :
                    s.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {s.status}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-700">
                      Duration: {s.duration != null ? s.duration.toFixed(0) + ' ms' : '–'}
                    </div>
                    {s.error && (
                      <div className="mt-1 text-sm text-red-700">{s.error}</div>
                    )}
                  </div>
                  {s.screenshot && (
                    <img
                      src={getDataUrl(s.screenshot)}
                      alt={`Step ${s.index + 1} screenshot`}
                      style={{ width: 320, height: 'auto', border: '1px solid #e5e7eb' }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-6 text-xs text-gray-500">
        This is a minimal MVP. For production, replace the simulation with robust real-driver flows and streaming progress.
      </div>
    </div>
  );
}