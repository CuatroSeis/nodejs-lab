import express from "express";
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./index";

describe("API base", () => {
  it("health check devuelve 200 y status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("listado de niveles devuelve array con al menos 3 niveles", async () => {
    const res = await request(app).get("/levels");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
  });
});
