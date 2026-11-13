import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MOCK_LESSON } from "../data/mock";
import { fetchLessons } from "../lib/api";
import LessonCard from "../components/LessonCard";
import { useProgress } from "../hooks/useProgress";

export default function Module() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [lessons, setLessons] = useState<Array<{ id: string; title: string; status: string; order: number; estimatedMinutes: number }>>([]);
  const [levelId, setLevelId] = useState<string>("");
  const { setStatus } = useProgress();

  useEffect(() => {
    if (!moduleId) return;
    // Extraer levelId del moduleId (formato: mod-N-M -> level-N)
    const levelNum = moduleId.split("-")[1];
    const inferredLevelId = `level-${levelNum}`;
    setLevelId(inferredLevelId);

    fetchLessons(inferredLevelId, moduleId).then((fetched) => {
      setLessons(
        fetched.map((l, i) => ({
          id: l.id,
          title: l.title,
          status: "unstarted",
          order: i + 1,
          estimatedMinutes: 30,
        }))
      );
    });
  }, [moduleId]);

  const handleStartLesson = (lessonId: string) => {
    setStatus(lessonId, "read");
    // Navegar a la lección
    window.location.href = `/leccion/${lessonId}/ejercicio`;
  };

  // Buscar título del nivel para el breadcrumb
  const levelTitle = levelId === "level-1" ? "Fundamentos de Node.js" : levelId === "level-2" ? "Asincronía y APIs nativas" : "Nivel";

  if (!moduleId) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>Módulo no encontrado</h1>
        </header>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <a href="/ruta" className="breadcrumb">← Volver a la ruta</a>
        <h1>Módulo: {moduleId}</h1>
        <p className="page-subtitle">{levelTitle}</p>
      </header>

      <div className="module-lessons">
        <h2 className="section-title">Lecciones</h2>
        <div className="lessons-grid">
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onStart={() => handleStartLesson(lesson.id)}
              />
            ))
          ) : (
            <div className="empty-modules">Cargando lecciones...</div>
          )}
        </div>
      </div>
    </div>
  );
}
