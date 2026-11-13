import React from "react";
import ExerciseRunner from "./ExerciseRunner";
import { FileCode, CheckSquare } from "lucide-react";
import type { IntegratorProject } from "../data/integratorProjects";

interface IntegratorProjectProps {
  project: IntegratorProject;
  onComplete?: (results: { passed: number; total: number }) => void;
}

export default function IntegratorProject({ project, onComplete }: IntegratorProjectProps) {
  const [code, setCode] = React.useState(project.starterCode);
  const [showSolution, setShowSolution] = React.useState(false);

  return (
    <div className="integrator-project">
      <div className="integrator-header">
        <div className="integrator-badge">
          <FileCode size={16} strokeWidth={2} />
          <span>Proyecto integrador — {project.levelTitle}</span>
        </div>
        <div className="integrator-actions">
          <span className="sandbox-badge">Web Worker aislado</span>
          <ExerciseRunner
            code={code}
            onCodeChange={setCode}
            testCases={project.testCases}
            onComplete={(results) => onComplete?.(results)}
            editorHeight="300px"
            showSolution
            solutionCode={project.solution ?? ""}
            acceptanceCriteria={project.acceptanceCriteria}
            solutionVisible={showSolution}
            onToggleSolution={() => setShowSolution((prev) => !prev)}
          />
        </div>
      </div>

      <div className="integrator-description">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-meta">
          <span className="meta-item">{project.estimatedMinutes} min estimados</span>
          <span className="meta-item">{project.concepts.join(", ")}</span>
        </div>
      </div>
    </div>
  );
}
