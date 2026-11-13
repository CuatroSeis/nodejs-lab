import React from "react";

// Gestión de progreso en localStorage (MVP, se migra a MySQL en fases siguientes).
// Clave versionada para permitir migraciones futuras sin romper datos existentes.
// Los datos se mantienen en memoria (React state) y se sincronizan con localStorage
// solo al escribir, evitando lecturas repetidas de localStorage.

const STORAGE_KEY = "nodejs-lab-progress:v1";

export type LessonStatus = "unstarted" | "read" | "attempted" | "approved";

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  openedAt?: string;
  attemptedAt?: string;
  approvedAt?: string;
  attemptsCount: number;
  lastError?: string;
  timeSpentSeconds: number;
  lastActivityAt?: string;
}

export interface AttemptRecord {
  lessonId: string;
  timestamp: string;
  result: "approved" | "failed" | "attempted";
  score?: number;
}

interface ProgressData {
  lessons: LessonProgress[];
  attempts: AttemptRecord[];
  activeDays: string[]; // fechas YYYY-MM-DD
}

const EMPTY_DATA: ProgressData = { lessons: [], attempts: [], activeDays: [] };

function nowISO(): string {
  return new Date().toISOString();
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function loadFromStorage(): ProgressData {
  if (typeof window === "undefined") return EMPTY_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DATA;
    const parsed = JSON.parse(raw);
    return {
      lessons: parsed.lessons ?? [],
      attempts: parsed.attempts ?? [],
      activeDays: parsed.activeDays ?? [],
    };
  } catch {
    return EMPTY_DATA;
  }
}

function saveToStorage(data: ProgressData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignorar errores de cuota de almacenamiento
  }
}

export function useProgress() {
  // Cargar datos una sola vez al inicializar el hook
  const [data, setData] = React.useState<ProgressData>(loadFromStorage);

  const saveAll = (updatedData: ProgressData) => {
    setData(updatedData);
    saveToStorage(updatedData);
  };

  const getLesson = (lessonId: string): LessonProgress | undefined =>
    data.lessons.find((p) => p.lessonId === lessonId);

  const setStatus = (lessonId: string, status: LessonStatus) => {
    const now = nowISO();
    const today = todayKey();

    setData((prev) => {
      const existing = prev.lessons.find((p) => p.lessonId === lessonId);
      let updated: LessonProgress;

      if (existing) {
        updated = {
          ...existing,
          status,
          ...(status === "read" && !existing.openedAt ? { openedAt: now } : {}),
          ...(status === "attempted" ? { attemptedAt: now } : {}),
          ...(status === "approved"
            ? { approvedAt: now, attemptsCount: (existing.attemptsCount ?? 0) + 1 }
            : {}),
          lastActivityAt: now,
        };
      } else {
        updated = {
          lessonId,
          status,
          ...(status === "read" ? { openedAt: now } : {}),
          ...(status === "attempted" ? { attemptedAt: now } : {}),
          ...(status === "approved" ? { approvedAt: now, attemptsCount: 1 } : {}),
          attemptsCount: 0,
          timeSpentSeconds: 0,
          lastActivityAt: now,
        };
      }

      const updatedLessons = existing
        ? prev.lessons.map((p) => (p.lessonId === lessonId ? updated : p))
        : [...prev.lessons, updated];

      const newAttempts: AttemptRecord = {
        lessonId,
        timestamp: now,
        result: status === "approved" ? "approved" : status === "attempted" ? "attempted" : "failed",
      };

      const updatedActiveDays = prev.activeDays.includes(today)
        ? prev.activeDays
        : [...prev.activeDays, today];

      return {
        lessons: updatedLessons,
        attempts: [...prev.attempts, newAttempts],
        activeDays: updatedActiveDays,
      };
    });
  };

  const incrementAttempts = (lessonId: string) => {
    setData((prev) => {
      const existing = prev.lessons.find((p) => p.lessonId === lessonId);
      if (!existing) return prev;

      return {
        ...prev,
        lessons: prev.lessons.map((p) =>
          p.lessonId === lessonId
            ? { ...p, attemptsCount: (p.attemptsCount ?? 0) + 1, lastActivityAt: nowISO() }
            : p
        ),
      };
    });
  };

  const setError = (lessonId: string, error: string) => {
    setData((prev) => {
      const existing = prev.lessons.find((p) => p.lessonId === lessonId);
      if (!existing) return prev;

      return {
        ...prev,
        lessons: prev.lessons.map((p) =>
          p.lessonId === lessonId
            ? { ...p, lastError: error, lastActivityAt: nowISO() }
            : p
        ),
      };
    });
  };

  const addTimeSpent = (lessonId: string, seconds: number) => {
    setData((prev) => {
      const existing = prev.lessons.find((p) => p.lessonId === lessonId);
      if (!existing) {
        return {
          ...prev,
          lessons: [
            ...prev.lessons,
            {
              lessonId,
              status: "read",
              openedAt: nowISO(),
              attemptsCount: 0,
              timeSpentSeconds: seconds,
              lastActivityAt: nowISO(),
            },
          ],
        };
      }

      return {
        ...prev,
        lessons: prev.lessons.map((p) =>
          p.lessonId === lessonId
            ? {
                ...p,
                timeSpentSeconds: (p.timeSpentSeconds ?? 0) + seconds,
                lastActivityAt: nowISO(),
              }
            : p
        ),
      };
    });
  };

  const getAttempts = (lessonId?: string): AttemptRecord[] => {
    if (lessonId) return data.attempts.filter((a) => a.lessonId === lessonId);
    return data.attempts;
  };

  const getActiveDays = (): string[] => data.activeDays;

  const stats = () => {
    const all = data.lessons;
    const total = all.length;
    const approved = all.filter((p) => p.status === "approved").length;
    const attempted = all.filter((p) => p.status === "attempted").length;
    const read = all.filter((p) => p.status === "read").length;
    const unstarted = total - approved - attempted - read;
    const percentage = total === 0 ? 0 : Math.round((approved / total) * 100);
    const totalTimeSeconds = all.reduce((sum, p) => sum + (p.timeSpentSeconds ?? 0), 0);

    // Racha de días activos (días consecutivos hasta hoy)
    const activeDays = [...data.activeDays].sort();
    const today = todayKey();
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    const dayMs = 24 * 60 * 60 * 1000;

    for (let i = 0; i < activeDays.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(activeDays[i - 1]).getTime();
        const curr = new Date(activeDays[i]).getTime();
        const diffDays = Math.round((curr - prev) / dayMs);
        if (diffDays === 1) {
          tempStreak += 1;
        } else {
          tempStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, tempStreak);
    }

    // Racha actual: verificar si hoy o ayer hay actividad
    const yesterday = new Date(Date.now() - dayMs).toISOString().slice(0, 10);
    if (activeDays.includes(today) || activeDays.includes(yesterday)) {
      currentStreak = tempStreak;
    }

    return {
      total,
      approved,
      attempted,
      read,
      unstarted,
      percentage,
      totalTimeSeconds,
      currentStreak,
      maxStreak,
      activeDaysCount: activeDays.length,
    };
  };

  const progressByLesson = () => data.lessons;

  return {
    loadAll: () => data,
    getLesson,
    setStatus,
    incrementAttempts,
    setError,
    addTimeSpent,
    getAttempts,
    getActiveDays,
    stats,
    progressByLesson,
  };
}
