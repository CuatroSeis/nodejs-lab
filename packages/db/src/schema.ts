// Esquema completo de la base de datos para Node.js Lab.
// Ejecutar en MySQL: mysql -u root -p nodejs_lab < schema.sql
// O a través de la API: POST /migrate (si se expone).

export const SCHEMA_SQL = `
-- Tabla de niveles
CREATE TABLE IF NOT EXISTS levels (
  id VARCHAR(36) PRIMARY KEY,
  order_index INT UNSIGNED NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  prerequisites JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_levels_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de módulos
CREATE TABLE IF NOT EXISTS modules (
  id VARCHAR(36) PRIMARY KEY,
  level_id VARCHAR(36) NOT NULL,
  order_index INT UNSIGNED NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
  INDEX idx_modules_level (level_id),
  INDEX idx_modules_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de lecciones
CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR(36) PRIMARY KEY,
  level_id VARCHAR(36) NOT NULL,
  module_id VARCHAR(36) NOT NULL,
  order_index INT UNSIGNED NOT NULL,
  title VARCHAR(140) NOT NULL,
  objective TEXT NOT NULL,
  sections JSON NOT NULL,
  estimated_minutes INT UNSIGNED DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  INDEX idx_lessons_level (level_id),
  INDEX idx_lessons_module (module_id),
  INDEX idx_lessons_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de ejercicios
CREATE TABLE IF NOT EXISTS exercises (
  id VARCHAR(36) PRIMARY KEY,
  lesson_id VARCHAR(36) NOT NULL,
  title VARCHAR(120) NOT NULL,
  statement TEXT NOT NULL,
  objectives JSON NOT NULL,
  difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
  prerequisites JSON DEFAULT NULL,
  starter_code TEXT NULL,
  acceptance_criteria JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  INDEX idx_exercises_lesson (lesson_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de casos de prueba de ejercicios
CREATE TABLE IF NOT EXISTS exercise_test_cases (
  id VARCHAR(36) PRIMARY KEY,
  exercise_id VARCHAR(36) NOT NULL,
  input_json JSON NOT NULL,
  expected_json JSON NOT NULL,
  description VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  INDEX idx_test_cases_exercise (exercise_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de pistas de ejercicios
CREATE TABLE IF NOT EXISTS exercise_hints (
  id VARCHAR(36) PRIMARY KEY,
  exercise_id VARCHAR(36) NOT NULL,
  hint_level TINYINT UNSIGNED NOT NULL CHECK (hint_level BETWEEN 1 AND 3),
  text VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  INDEX idx_hints_exercise (exercise_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de progreso de lecciones por usuario (sin auth, session_id opcional)
CREATE TABLE IF NOT EXISTS lesson_progress (
  id VARCHAR(36) PRIMARY KEY,
  lesson_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(100) DEFAULT 'anonymous',
  status ENUM('unstarted', 'read', 'attempted', 'approved') NOT NULL DEFAULT 'unstarted',
  opened_at DATETIME DEFAULT NULL,
  attempted_at DATETIME DEFAULT NULL,
  approved_at DATETIME DEFAULT NULL,
  attempts_count INT UNSIGNED DEFAULT 0,
  time_spent_seconds INT UNSIGNED DEFAULT 0,
  last_error TEXT DEFAULT NULL,
  last_activity_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  UNIQUE KEY uk_lesson_progress (lesson_id, user_id),
  INDEX idx_progress_user (user_id),
  INDEX idx_progress_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de resultados de intentos de ejercicios
CREATE TABLE IF NOT EXISTS attempt_results (
  id VARCHAR(36) PRIMARY KEY,
  lesson_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(100) DEFAULT 'anonymous',
  exercise_id VARCHAR(36),
  result ENUM('approved', 'failed', 'attempted') NOT NULL,
  score INT UNSIGNED DEFAULT 0,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE SET NULL,
  INDEX idx_attempts_lesson (lesson_id),
  INDEX idx_attempts_user (user_id),
  INDEX idx_attempts_executed (executed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de días activos (para racha y estadísticas)
CREATE TABLE IF NOT EXISTS active_days (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(100) DEFAULT 'anonymous',
  activity_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_active_day (user_id, activity_date),
  INDEX idx_active_days_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;
