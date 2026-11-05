from flask import Blueprint, request, jsonify
from app.services.ai_service import AIService
from app.utils.auth_middleware import token_required

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

@ai_bp.route('/summary', methods=['POST'])
@token_required
def generate_summary(current_user):
    data = request.get_json() or {}
    role = data.get('role', '')
    experience_years = data.get('experience_years')
    key_skills = data.get('key_skills')
    industry = data.get('industry')

    result = AIService.generate_summary(role, experience_years, key_skills, industry)
    return jsonify({'success': True, 'data': result}), 200

@ai_bp.route('/bullet', methods=['POST'])
@token_required
def improve_bullet(current_user):
    data = request.get_json() or {}
    bullet = data.get('bullet', '').strip()
    role = data.get('role', '')

    if not bullet:
        return jsonify({'success': False, 'message': 'Bullet point text is required'}), 400

    result = AIService.improve_bullet_point(bullet, role)
    return jsonify({'success': True, 'data': result}), 200

@ai_bp.route('/rewrite', methods=['POST'])
@token_required
def rewrite_description(current_user):
    data = request.get_json() or {}
    text = data.get('text', '').strip()
    context_type = data.get('context_type', 'experience')

    if not text:
        return jsonify({'success': False, 'message': 'Description text is required'}), 400

    result = AIService.rewrite_description(text, context_type)
    return jsonify({'success': True, 'data': result}), 200

@ai_bp.route('/skills', methods=['POST'])
@token_required
def suggest_skills(current_user):
    data = request.get_json() or {}
    job_title = data.get('job_title', 'Software Engineer')

    result = AIService.suggest_skills(job_title)
    return jsonify({'success': True, 'data': result}), 200

@ai_bp.route('/optimize-jd', methods=['POST'])
@token_required
def optimize_jd(current_user):
    data = request.get_json() or {}
    resume_text = data.get('resume_text', '')
    job_description = data.get('job_description', '')

    if not job_description:
        return jsonify({'success': False, 'message': 'Target job description is required'}), 400

    result = AIService.optimize_for_job_description(resume_text, job_description)
    return jsonify({'success': True, 'data': result}), 200
