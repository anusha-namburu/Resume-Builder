from flask import Blueprint, jsonify
from app.models import Template

templates_bp = Blueprint('templates', __name__, url_prefix='/api/templates')

DEFAULT_TEMPLATES = [
    {
        "id": "modern-professional",
        "name": "Modern Professional",
        "category": "Professional",
        "description": "Two-column clean layout with deep navy accents, clear visual hierarchy, and balanced white space.",
        "color_scheme": "#1e3a8a",
        "recommended_for": ["Experienced Professionals", "Project Managers", "Tech Consultants"],
        "accent_colors": ["#1e3a8a", "#0f766e", "#3730a3", "#be123c", "#1e293b"],
        "is_premium": False
    },
    {
        "id": "classic-corporate",
        "name": "Classic Corporate",
        "category": "Corporate & Executive",
        "description": "Single-column traditional layout with elegant borders, timeless serif typography, ideal for banking, law & consulting.",
        "color_scheme": "#0f172a",
        "recommended_for": ["Finance", "Legal Counsel", "Executive Leadership", "Operations"],
        "accent_colors": ["#0f172a", "#1e3a8a", "#78350f", "#334155", "#064e3b"],
        "is_premium": False
    },
    {
        "id": "minimal-ats",
        "name": "Minimal ATS-Friendly",
        "category": "ATS Optimized",
        "description": "Ultra-clean single-column layout strictly formatted to achieve maximum readability across automated recruitment systems.",
        "color_scheme": "#334155",
        "recommended_for": ["High-Volume Applications", "Enterprise Systems", "Government Roles"],
        "accent_colors": ["#334155", "#1e293b", "#1e3a8a", "#047857", "#475569"],
        "is_premium": False
    },
    {
        "id": "creative-designer",
        "name": "Creative Designer",
        "category": "Design & Media",
        "description": "Modern styled header banner, badge tags, and sleek visual layout for UX/UI designers, art directors, and creative professionals.",
        "color_scheme": "#4338ca",
        "recommended_for": ["UI/UX Designers", "Graphic Designers", "Creative Directors", "Content Creators"],
        "accent_colors": ["#4338ca", "#7c3aed", "#ec4899", "#0284c7", "#0d9488"],
        "is_premium": False
    },
    {
        "id": "student-fresher",
        "name": "Student / Fresher",
        "category": "Entry-Level",
        "description": "Emphasizes education, academic projects, certifications, internships and technical coursework for new grads.",
        "color_scheme": "#0284c7",
        "recommended_for": ["College Students", "Recent Graduates", "Internship Applicants"],
        "accent_colors": ["#0284c7", "#059669", "#4f46e5", "#ea580c", "#0891b2"],
        "is_premium": False
    },
    {
        "id": "software-developer",
        "name": "Software Developer",
        "category": "Tech & Engineering",
        "description": "Tech stack pills, GitHub repositories, system architecture highlights, and coding proficiencies tailored for engineers.",
        "color_scheme": "#059669",
        "recommended_for": ["Full-Stack Developers", "Backend Engineers", "DevOps", "Data Scientists"],
        "accent_colors": ["#059669", "#2563eb", "#7c3aed", "#d97706", "#0f172a"],
        "is_premium": False
    }
]

@templates_bp.route('', methods=['GET'])
def get_templates():
    db_templates = Template.query.all()
    if db_templates and len(db_templates) >= 6:
        result = []
        for t in db_templates:
            d = t.to_dict()
            matched_default = next((item for item in DEFAULT_TEMPLATES if item['id'] == t.id), None)
            if matched_default:
                d['accent_colors'] = matched_default.get('accent_colors', [])
                d['recommended_for'] = matched_default.get('recommended_for', [])
            result.append(d)
        return jsonify({'success': True, 'templates': result}), 200

    return jsonify({'success': True, 'templates': DEFAULT_TEMPLATES}), 200
