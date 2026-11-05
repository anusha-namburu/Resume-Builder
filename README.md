# Resume-Builder

## ResumeCraft AI — Modern AI-Powered Resume Builder & ATS Scanner

ResumeCraft AI is a complete, modern, responsive, full-stack web application designed for students, freshers, job seekers, and experienced professionals to create recruiter-approved, ATS-optimized resumes.

Built with **React.js + Vite + Tailwind CSS** on the frontend, **Python Flask REST APIs** on the backend, and **MySQL** (with smart zero-config SQLite fallback) for the database.

---

## 🌟 Key Features

### 1. 🎨 6 Professionally Designed Resume Templates
1. **Modern Professional**: Clean two-column layout with deep navy accents, clear visual hierarchy, and balanced white space.
2. **Classic Corporate**: Timeless single-column layout with formal serif typography and borders (finance, legal, executive).
3. **Minimal ATS-Friendly**: Single-column layout engineered for maximum parser score across high-volume recruiting systems.
4. **Creative Designer**: Modern header banner, showcase badge tags, and styled visual hierarchy for UX/UI designers and creatives.
5. **Student / Fresher**: Emphasizes education, GPA, coursework, academic capstones, hackathons, and certifications.
6. **Software Developer**: Tech stack pills, GitHub repositories, system architecture highlights, and engineering metrics.

### 2. 🤖 AI Resume Assistant
- **Professional Summary Generator**: Creates targeted 3-4 sentence summaries based on target role, experience level, and key competencies.
- **Bullet Point Enhancer**: Rewrites weak bullet points using the **Google XYZ formula** (*"Accomplished [X] as measured by [Y], by doing [Z]"*).
- **Skill Recommendations**: Intelligently recommends relevant technical and soft skills for any job title.
- **Job Description Content Optimizer**: Compares resume text with target job descriptions and provides actionable keyword recommendations.
- **Smart Dual-Engine**: Works seamlessly out-of-the-box using built-in intelligent NLP rules or connects to Google Gemini via `GEMINI_API_KEY`.

### 3. 🎯 Real-Time ATS Keyword & Parser Checker
- Computes ATS compatibility score (0-100%)
- Identifies **Matching Keywords** and **Missing Critical Skills**
- Analyzes structural integrity (email, phone, LinkedIn, word count, metrics density)
- Highlights actionable suggestions before applying
- Includes transparent disclaimer: score is an intelligent diagnostic estimate.

### 4. 📄 High-Fidelity PDF Export
- Instant pixel-perfect A4 export matching exact screen preview (using `html2pdf.js` with client-side canvas rendering)
- Backend PDF generation endpoint (`/api/pdf/<id>`) using Python `reportlab`
- Print-friendly layout (`Ctrl+P` / Print button) with zero extraneous UI buttons

### 5. 🛠 Multi-Step Resume Editor
- **Personal Information**: Name, title, email, phone, location, LinkedIn, GitHub, portfolio
- **Professional Summary**: Elevator pitch with AI generation
- **Work Experience**: Job title, company, dates, responsibilities, quantifiable achievements
- **Education**: Degree, institution, graduation year, CGPA/marks, coursework
- **Projects**: Title, technologies used, live demo, GitHub repository link, description
- **Technical & Soft Skills**: Tagged with proficiency levels
- **Certifications**: Credential name, issuing body, issue date, verification link
- **Additional Sections**: Internships, Achievements, Languages, Interests
- **Dynamic Color Customizer**: Curated palettes and custom color picker

---

## 🧱 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React, Framer Motion, Axios, HTML2PDF |
| **Backend** | Python 3, Flask, Flask-CORS, Flask-SQLAlchemy, PyJWT, ReportLab |
| **Database** | MySQL (Primary, schema provided) / SQLite (Zero-config instant local fallback) |
| **AI Integration** | Google Gemini API + Intelligent Heuristic NLP Engine |

---

## 📂 Project Structure

```
ai-resume-builder/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── models.py            # User, Resume, PersonalInfo, Education, Experience, Projects, Skills, etc.
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # Register, Login, JWT verification
│   │   │   ├── resume.py            # CRUD operations, duplication, completion score
│   │   │   ├── templates.py         # 6 Template metadata and color palettes
│   │   │   ├── ai.py                # AI summary, bullets, rewriter, skill suggestions
│   │   │   ├── ats.py               # ATS compatibility audit & keyword scanner
│   │   │   └── pdf.py               # Backend PDF streaming endpoint
│   │   ├── services/
│   │   │   ├── ai_service.py        # Gemini API + Smart NLP rules engine
│   │   │   ├── ats_service.py       # ATS keyword extraction & parser logic
│   │   │   └── pdf_service.py       # ReportLab A4 PDF generator
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── auth_middleware.py   # JWT token decorator
│   │   └── __init__.py              # Flask app factory, CORS, DB initialization
│   ├── config.py                    # Environment settings (MySQL / SQLite fallback)
│   ├── schema.sql                   # MySQL DDL schema script
│   ├── run.py                       # Backend server entry point
│   ├── test_api.py                  # Automated unittest test suite
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Active environment variables
│   └── .env.example                 # Environment configuration template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BrandIcons.jsx       # Crisp SVG icons for GitHub, LinkedIn, Twitter
│   │   │   ├── Navbar.jsx           # Responsive navigation with user auth dropdown
│   │   │   ├── Footer.jsx           # Clean footer with platform links
│   │   │   ├── ProtectedRoute.jsx   # Route guard for authenticated dashboard/editor
│   │   │   ├── AIModal.jsx          # Interactive AI Assistant modal
│   │   │   ├── ATSModal.jsx         # ATS scanner dialog
│   │   │   ├── TemplateSelector.jsx # Visual gallery & accent color picker
│   │   │   ├── EditorSections/      # Personal, Summary, Experience, Education, Projects, Skills, etc.
│   │   │   └── Templates/           # 6 Resume template components + ResumeRenderer.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Hero, features, how it works, templates, testimonials, FAQ
│   │   │   ├── LoginPage.jsx        # Login with email/password & validation
│   │   │   ├── RegisterPage.jsx     # Registration with headline & validation
│   │   │   ├── DashboardPage.jsx    # User resumes list, stats, duplicate, delete, download
│   │   │   ├── EditorPage.jsx       # Multi-step editor + live A4 preview + zoom + export
│   │   │   ├── ATSPage.jsx          # Dedicated ATS parser scan tool
│   │   │   └── TemplatesPage.jsx    # Showcase gallery of all 6 templates
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Global authentication state
│   │   │   └── ResumeContext.jsx    # Active resume state & live update methods
│   │   ├── services/
│   │   │   └── api.js               # Axios client for all backend REST endpoints
│   │   ├── App.jsx                  # React Router configuration
│   │   ├── main.jsx                 # Vite root mount
│   │   └── index.css                # Tailwind directives & A4 page styling
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 🗄️ MySQL Database Setup

The backend connects to MySQL using PyMySQL and SQLAlchemy.

### Option A: Using MySQL
1. Start your local MySQL service (e.g. via MySQL Workbench, XAMPP, or command line).
2. Open MySQL client and execute the provided `schema.sql`:
   ```bash
   mysql -u root -p < backend/schema.sql
   ```
3. Update `backend/.env` with your credentials:
   ```ini
   SECRET_KEY=<a unique random value>
   JWT_SECRET_KEY=<a different unique random value>
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DB=resume_builder_db
   USE_SQLITE_FALLBACK=false
   ```

### Option B: Zero-Config Local SQLite Fallback
If MySQL is not installed or currently running, the application **automatically falls back to SQLite** (`backend/resume_builder.db`). It automatically creates all required tables, foreign keys, and seeds the 6 templates on first startup!

---

## 🚀 Step-by-Step Running Instructions

### 1. Backend Setup & Run

Open a terminal in the project directory:

```bash
cd backend

# (Optional) Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies (already installed globally or in venv)
pip install -r requirements.txt

# Copy .env.example to .env and set distinct random SECRET_KEY and JWT_SECRET_KEY values.

# Run the Flask backend server
python run.py
```

The backend server starts on:
👉 **http://127.0.0.1:5000**
Health Check: **http://127.0.0.1:5000/api/health**

To run automated backend tests at any time:
```bash
python test_api.py
```

---

### 2. Frontend Setup & Run

Open a second terminal:

```bash
cd frontend

# Run the Vite development server
npm run dev
```

The frontend application will be live at:
👉 **http://localhost:5173**

---

## 🧪 Testing the Complete Application

1. Open **http://localhost:5173** in your browser.
2. Explore the **Landing Page** with interactive preview, features, testimonials, and FAQ.
3. Click **"Get Started Free"** or navigate to `/register` to create an account.
4. In the **Dashboard**, click **"Create New Resume"** to pick a title, target role, and starting template.
5. In the **Resume Editor**:
   - Fill in personal info, experience, and education.
   - Click **"AI Generate Summary"** to generate 3 professional summary variations and apply one with 1 click.
   - Click **"AI Polish Bullets"** on any experience entry to rewrite bullets into Google XYZ impact statements.
   - Click **"AI Suggest Skills"** to auto-populate in-demand technical and soft skills.
   - Switch between all **6 Templates** and change accent colors in real-time.
   - Adjust the live preview zoom (75%, 90%, 100%).
   - Click **"ATS Score & Audit"** to paste a job description and view your match score and missing keywords.
   - Click **"Download PDF"** to export your resume as an A4 PDF!
