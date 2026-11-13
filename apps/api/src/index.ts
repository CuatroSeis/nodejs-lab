// Servidor Express con persistencia en MySQL.
// Endpoints: /health, /levels, /levels/:levelId/modules, /levels/:levelId/modules/:moduleId/lessons
// Progreso: POST /progress/:lessonId/status

import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env") });

import express from "express";
import { levelRepository } from "./repositories/levelRepository";
import { moduleRepository } from "./repositories/moduleRepository";
import { lessonRepository } from "./repositories/lessonRepository";
import { progressRepository } from "./repositories/progressRepository";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check
app.get("/health", async (_req, res) => {
  try {
    // Verificar conexión a MySQL
    await levelRepository.findAll();
    res.json({ status: "ok", service: "nodejs-lab-api", database: "mysql", timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: "error", service: "nodejs-lab-api", database: "mysql", error: String(err) });
  }
});

// Listado de niveles (desde MySQL)
app.get("/levels", async (_req, res) => {
  try {
    const levels = await levelRepository.findAll();
    res.json({ success: true, data: levels });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error obteniendo niveles", data: null });
  }
});

// Módulos de un nivel
app.get("/levels/:levelId/modules", async (req, res) => {
  try {
    const { levelId } = req.params;
    const modules = await moduleRepository.findByLevelId(levelId);
    res.json({ success: true, data: modules });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error obteniendo módulos", data: null });
  }
});

// Lecciones de un módulo
app.get("/levels/:levelId/modules/:moduleId/lessons", async (req, res) => {
  try {
    const { moduleId } = req.params;
    const lessons = await lessonRepository.findByModuleId(moduleId);
    res.json({ success: true, data: lessons });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error obteniendo lecciones", data: null });
  }
});

// Obtener una lección por su ID
app.get("/lessons/:lessonId", async (req, res) => {
  try {
    const lesson = await lessonRepository.findById(req.params.lessonId);
    if (lesson === null) {
      res.status(404).json({ success: false, error: "Lección no encontrada", data: null });
      return;
    }
    res.json({ success: true, data: lesson });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error obteniendo lección", data: null });
  }
});

// Actualizar progreso de una lección
app.post("/progress/:lessonId/status", async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { status, userId = "anonymous" } = req.body;

    if (!status || !["unstarted", "read", "attempted", "approved"].includes(status)) {
      res.status(400).json({ success: false, error: "Estado inválido", data: null });
      return;
    }

    const progress = await progressRepository.upsert(lessonId, status, userId);
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error actualizando progreso", data: null });
  }
});

// Middleware de errores centralizado
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, error: "Error interno del servidor", data: null });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});

export default app;
