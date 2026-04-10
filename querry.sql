-- Create database
CREATE DATABASE IF NOT EXISTS exam_eval;
USE exam_eval;

-- Enable OQgraph plugin if not already enabled
INSTALL SONAME 'ha_oqgraph';

-- Students table
CREATE TABLE students (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;



-- Users table for authentication
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Student','Teacher') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;



-- Subjects table (per‑student aggregated scores)
CREATE TABLE subjects (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    subject VARCHAR(100) NOT NULL,
    total_score FLOAT DEFAULT 0,
    obtained_score FLOAT DEFAULT 0,
    percentage FLOAT GENERATED ALWAYS AS (IF(total_score>0, obtained_score/total_score*100, 0)) STORED,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_subject (student_id, subject)
) ENGINE=InnoDB;

-- OCR results table
CREATE TABLE ocr_results (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    page_number INT NOT NULL,
    raw_text TEXT,
    corrected_text TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX (student_id)
) ENGINE=InnoDB;

-- Question sheets table
CREATE TABLE question_sheets (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    question_id VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    max_marks FLOAT DEFAULT 0,
    metadata JSON,
    UNIQUE KEY unique_question (subject, question_id)
) ENGINE=InnoDB;

-- Evaluation results table
CREATE TABLE evaluation_results (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    subject VARCHAR(100) NOT NULL,
    question_id VARCHAR(50) NOT NULL,
    raw_score FLOAT,
    corrected_score FLOAT,
    themis_feedback TEXT,
    themis_strengths JSON,
    themis_weaknesses JSON,
    covered_concepts JSON,
    missing_concepts JSON,
    semantic_score FLOAT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX (student_id, subject)
) ENGINE=InnoDB;

-- Knowledge graph nodes (concepts)
CREATE TABLE concept_nodes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    topic VARCHAR(100)
) ENGINE=InnoDB;

-- Backing table for student‑concept edges
CREATE TABLE student_concept (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    concept_id INT UNSIGNED NOT NULL,
    relationship ENUM('KNOWS','WEAK_IN') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (concept_id) REFERENCES concept_nodes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_concept (student_id, concept_id, relationship)
) ENGINE=InnoDB;

-- OQGRAPH virtual table for graph algorithms
CREATE TABLE student_concept_edges (
    latch VARCHAR(32) NULL,
    origid BIGINT UNSIGNED NULL,
    destid BIGINT UNSIGNED NULL,
    weight DOUBLE NULL,
    seq BIGINT UNSIGNED NULL,
    linkid BIGINT UNSIGNED NULL,
    KEY (latch, origid, destid) USING HASH,
    KEY (latch, destid, origid) USING HASH
) ENGINE=OQGRAPH
data_table='student_concept' origid='student_id' destid='concept_id';

-- Semantic index (embeddings stored as JSON)
CREATE TABLE semantic_index (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    content_id VARCHAR(50) NOT NULL,
    embedding JSON NOT NULL,
    source TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX (student_id)
) ENGINE=InnoDB;
