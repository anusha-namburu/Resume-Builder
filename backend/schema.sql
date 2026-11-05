-- AI-Powered Resume Builder - MySQL Database Schema
-- Database: resume_builder_db

CREATE DATABASE IF NOT EXISTS resume_builder_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE resume_builder_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    headline VARCHAR(255) DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Templates Table
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(255) DEFAULT '',
    is_premium BOOLEAN DEFAULT FALSE,
    color_scheme VARCHAR(64) DEFAULT 'navy',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL DEFAULT 'Untitled Resume',
    template_id VARCHAR(64) NOT NULL DEFAULT 'modern-professional',
    target_role VARCHAR(120) DEFAULT '',
    color_theme VARCHAR(32) DEFAULT '#1e3a8a',
    font_family VARCHAR(64) DEFAULT 'Inter',
    completion_percentage INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON UPDATE CASCADE,
    INDEX idx_user_resumes (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Personal Information
CREATE TABLE IF NOT EXISTS personal_information (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL DEFAULT '',
    professional_title VARCHAR(150) DEFAULT '',
    email VARCHAR(180) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    location VARCHAR(150) DEFAULT '',
    linkedin VARCHAR(255) DEFAULT '',
    github VARCHAR(255) DEFAULT '',
    portfolio VARCHAR(255) DEFAULT '',
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Education
CREATE TABLE IF NOT EXISTS education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    degree VARCHAR(150) NOT NULL,
    institution VARCHAR(200) NOT NULL,
    location VARCHAR(120) DEFAULT '',
    start_year VARCHAR(30) DEFAULT '',
    graduation_year VARCHAR(30) DEFAULT '',
    score VARCHAR(50) DEFAULT '',
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    INDEX idx_edu_resume (resume_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Experience (Work Experience & Internships)
CREATE TABLE IF NOT EXISTS experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    company VARCHAR(180) NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    location VARCHAR(120) DEFAULT '',
    start_date VARCHAR(40) DEFAULT '',
    end_date VARCHAR(40) DEFAULT '',
    is_current BOOLEAN DEFAULT FALSE,
    is_internship BOOLEAN DEFAULT FALSE,
    responsibilities TEXT,
    achievements TEXT,
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    INDEX idx_exp_resume (resume_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Projects
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    title VARCHAR(180) NOT NULL,
    subtitle VARCHAR(150) DEFAULT '',
    description TEXT,
    technologies VARCHAR(255) DEFAULT '',
    project_link VARCHAR(255) DEFAULT '',
    github_link VARCHAR(255) DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    INDEX idx_proj_resume (resume_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Skills
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Technical', -- Technical, Soft, Tool, Language
    level VARCHAR(30) DEFAULT 'Proficient', -- Beginner, Intermediate, Proficient, Expert
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    INDEX idx_skill_resume (resume_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Certifications
CREATE TABLE IF NOT EXISTS certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    issuing_organization VARCHAR(180) DEFAULT '',
    issue_date VARCHAR(50) DEFAULT '',
    credential_id VARCHAR(100) DEFAULT '',
    credential_url VARCHAR(255) DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    INDEX idx_cert_resume (resume_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Additional Sections (Achievements, Languages, Interests)
CREATE TABLE IF NOT EXISTS additional_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    section_type VARCHAR(50) NOT NULL, -- achievement, language, interest
    title VARCHAR(200) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    INDEX idx_additional_resume (resume_id, section_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. ATS Analysis Logs
CREATE TABLE IF NOT EXISTS ats_scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    job_title VARCHAR(150) DEFAULT '',
    score INT NOT NULL DEFAULT 0,
    matched_keywords JSON,
    missing_keywords JSON,
    feedback JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Templates
INSERT INTO templates (id, name, category, description, color_scheme) VALUES
('modern-professional', 'Modern Professional', 'Professional', 'Two-column clean layout with deep navy accents, clear hierarchy, and balanced white space.', '#1e3a8a'),
('classic-corporate', 'Classic Corporate', 'Corporate', 'Single-column traditional layout with elegant borders, timeless serif headings, ideal for banking, law & consulting.', '#0f172a'),
('minimal-ats', 'Minimal ATS-Friendly', 'ATS Optimized', 'Ultra-clean, single column layout designed to achieve maximum readability and compatibility across all ATS scanners.', '#334155'),
('creative-designer', 'Creative Designer', 'Design & Media', 'Bold modern header, showcase badge tags, and styled visual hierarchy for UX/UI designers and creatives.', '#4338ca'),
('student-fresher', 'Student / Fresher', 'Entry-Level', 'Emphasizes education, projects, certifications and academic achievements for new grads and internship seekers.', '#0284c7'),
('software-developer', 'Software Developer', 'Tech & Engineering', 'Tech stack badges, project architecture highlights, GitHub and live demo links crafted for engineers.', '#059669')
ON DUPLICATE KEY UPDATE name=VALUES(name);
