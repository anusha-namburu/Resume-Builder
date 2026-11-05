from flask import Flask, jsonify
from flask_cors import CORS
from app.models import db, Template
from app.routes import auth_bp, resume_bp, templates_bp, ai_bp, ats_bp, pdf_bp
from config import Config
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    missing_keys = [
        key for key in ('SECRET_KEY', 'JWT_SECRET_KEY')
        if not app.config.get(key)
    ]
    if missing_keys:
        raise RuntimeError(
            f"Missing required environment variable(s): {', '.join(missing_keys)}"
        )

    # Enable CORS for all routes
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize Database with intelligent connection handling
    db.init_app(app)

    with app.app_context():
        try:
            db.create_all()
            _seed_default_templates()
        except Exception as e:
            # If MySQL connection fails, switch dynamically to local SQLite fallback
            print(f"Warning: Primary DB connection failed ({e}). Switching to local SQLite database...")
            basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
            sqlite_path = os.path.join(basedir, 'resume_builder.db')
            app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{sqlite_path}"
            db.init_app(app)
            db.create_all()
            _seed_default_templates()

    # Register API Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(templates_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(ats_bp)
    app.register_blueprint(pdf_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'AI Resume Builder API',
            'version': '1.0.0'
        }), 200

    return app

def _seed_default_templates():
    default_templates = [
        Template(
            id='modern-professional',
            name='Modern Professional',
            category='Professional',
            description='Two-column clean layout with deep navy accents, clear visual hierarchy, and balanced white space.',
            color_scheme='#1e3a8a'
        ),
        Template(
            id='classic-corporate',
            name='Classic Corporate',
            category='Corporate & Executive',
            description='Single-column traditional layout with elegant borders, timeless serif typography, ideal for banking, law & consulting.',
            color_scheme='#0f172a'
        ),
        Template(
            id='minimal-ats',
            name='Minimal ATS-Friendly',
            category='ATS Optimized',
            description='Ultra-clean single-column layout strictly formatted to achieve maximum readability across automated recruitment systems.',
            color_scheme='#334155'
        ),
        Template(
            id='creative-designer',
            name='Creative Designer',
            category='Design & Media',
            description='Modern styled header banner, badge tags, and sleek visual layout for UX/UI designers, art directors, and creative professionals.',
            color_scheme='#4338ca'
        ),
        Template(
            id='student-fresher',
            name='Student / Fresher',
            category='Entry-Level',
            description='Emphasizes education, academic projects, certifications, internships and technical coursework for new grads.',
            color_scheme='#0284c7'
        ),
        Template(
            id='software-developer',
            name='Software Developer',
            category='Tech & Engineering',
            description='Tech stack pills, GitHub repositories, system architecture highlights, and coding proficiencies tailored for engineers.',
            color_scheme='#059669'
        )
    ]

    for tmpl in default_templates:
        existing = db.session.get(Template, tmpl.id)
        if not existing:
            db.session.add(tmpl)
    db.session.commit()
