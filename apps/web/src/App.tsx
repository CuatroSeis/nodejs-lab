import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LearningPath from "./pages/LearningPath";
import Module from "./pages/Module";
import Lesson from "./pages/Lesson";
import Exercise from "./pages/Exercise";
import Evaluation from "./pages/Evaluation";
import Conceptos from "./pages/Conceptos";
import Stats from "./pages/Stats";
import IntegratorProjects from "./pages/IntegratorProjects";

function LayoutWrapper() {
  return <Layout><Outlet /></Layout>;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ruta" element={<LearningPath />} />
          <Route path="/modulo/:moduleId" element={<Module />} />
          <Route path="/leccion/:lessonId" element={<Lesson />} />
          <Route path="/leccion/:lessonId/ejercicio" element={<Exercise />} />
          <Route path="/leccion/:lessonId/evaluacion" element={<Evaluation />} />
          <Route path="/conceptos" element={<Conceptos />} />
          <Route path="/estadisticas" element={<Stats />} />
          <Route path="/proyectos" element={<IntegratorProjects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
