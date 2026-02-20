export type StepDef = {
  action: string;
  target?: string;
  selector?: { type: 'css' | 'xpath'; value: string };
};

export type ScriptSpec = {
  name?: string;
  steps: StepDef[];
};

export type StepResult = {
  index: number;
  action: string;
  status: string;
  duration: number;
  error?: string;
  screenshot?: string;
};

export type RunReport = {
  id: string;
  name?: string;
  steps: StepResult[];
};

export type RunExecution = {
  results: StepResult[];
  mode: 'driver' | 'simulation';
};