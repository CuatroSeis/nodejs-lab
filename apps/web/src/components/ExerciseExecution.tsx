import React from "react";
import ExerciseRunner from "./ExerciseRunner";

interface ExerciseExecutionProps {
  exerciseId: string;
  starterCode: string;
  testCases: Array<{
    id: string;
    input: unknown;
    expected: unknown;
    description: string;
  }>;
  onComplete?: (results: { passed: number; total: number }) => void;
  lessonId?: string;
}

export default function ExerciseExecution({
  exerciseId,
  starterCode,
  testCases,
  onComplete,
  lessonId,
}: ExerciseExecutionProps) {
  const [code, setCode] = React.useState(starterCode);

  return (
    <ExerciseRunner
      code={code}
      onCodeChange={setCode}
      testCases={testCases}
      onComplete={onComplete}
      lessonId={lessonId}
    />
  );
}
