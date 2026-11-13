// Servicio de API para el frontend.
// Todos los endpoints van a /api (proxy Vite -> http://localhost:3001).
// Usa los tipos de @nodejs-lab/shared para tipar las respuestas.

import type { Level, Module } from "@nodejs-lab/shared";
import type { Lesson } from "@nodejs-lab/content";

const API_BASE = "/api";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status} for ${path}`);
  }
  const json = await res.json();
  // La API devuelve un envelope { success, data } salvo /health;
  // desempaquetamos si existe la propiedad data, si no devolvemos el JSON crudo.
  if (json !== null && typeof json === "object" && "data" in json) {
    return json.data as T;
  }
  return json as T;
}

export type { Level, Module, Lesson };

export async function fetchLevels(): Promise<Level[]> {
  return fetchJson<Level[]>("/levels");
}

export async function fetchModules(levelId: string): Promise<Module[]> {
  return fetchJson<Module[]>(`/levels/${levelId}/modules`);
}

export async function fetchLessons(levelId: string, moduleId: string): Promise<Lesson[]> {
  return fetchJson<Lesson[]>(`/levels/${levelId}/modules/${moduleId}/lessons`);
}

export async function fetchLessonById(lessonId: string): Promise<Lesson> {
  return fetchJson<Lesson>(`/lessons/${lessonId}`);
}

export async function healthCheck(): Promise<{ status: string }> {
  return fetchJson<{ status: string }>("/health");
}
