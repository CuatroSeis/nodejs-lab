// Tipos del editor de código
export interface CodeEditorProps {
  value: string;
  language?: "javascript" | "typescript";
  readOnly?: boolean;
  onChange?: (code: string) => void;
  height?: string;
  placeholder?: string;
}

export interface ExerciseExecutionProps {
  exerciseId: string;
  starterCode: string;
  testCases: Array<{
    id: string;
    input: unknown;
    expected: unknown;
    description: string;
  }>;
  onComplete?: (results: { passed: number; total: number }) => void;
}

export interface TestResultItem {
  testCaseId: string;
  passed: boolean;
  output: string | undefined;
  error: string | undefined;
  executionTimeMs: number;
  timedOut: boolean;
}
