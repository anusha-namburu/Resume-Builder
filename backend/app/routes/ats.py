from flask import Blueprint, request, jsonify
from app.models import db, Resume, ATSScan
from app.services.ats_service import ATSService
from app.utils.auth_middleware import token_required
import json

ats_bp = Blueprint('ats', __name__, url_prefix='/api/ats')

@ats_bp.route('/analyze', methods=['POST'])
@token_required
def analyze_resume(current_user):
    data = request.get_json() or {}
    resume_id = data.get('resume_id')
    job_description = data.get('job_description', '')
    raw_resume_data = data.get('resume_data')

    resume_obj = None
    if resume_id:
        resume_obj = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first()
        if resume_obj and not raw_resume_data:
            raw_resume_data = resume_obj.to_dict(full=True)

    if not raw_resume_data:
        return jsonify({'success': False, 'message': 'Resume data or valid resume_id is required'}), 400

    analysis = ATSService.analyze_resume(raw_resume_data, job_description)

    # If linked to a resume record, save to ATSScan table
    if resume_obj:
        try:
            scan = ATSScan(
                resume_id=resume_obj.id,
                job_title=data.get('job_title', resume_obj.target_role or 'General'),
                score=analysis['score'],
                matched_keywords=json.dumps(analysis['matched_keywords']),
                missing_keywords=json.dumps(analysis['missing_keywords']),
                feedback=json.dumps(analysis['recommendations'])
            )
            db.session.add(scan)
            db.session.commit()
            analysis['scan_id'] = scan.id
        except Exception as e:
            db.session.rollback()
            print(f"Failed to record ATS scan history: {e}")

    return jsonify({
        'success': True,
        'data': analysis
    }), 200

@ats_bp.route('/history/<int:resume_id>', methods=['GET'])
@token_required
def get_ats_history(current_user, resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first()
    if not resume:
        return jsonify({'success': False, 'message': 'Resume not found'}), 404

    scans = ATSScan.query.filter_by(resume_id=resume.id).order_by(ATSScan.created_at.desc()).limit(10).all()
    return jsonify({
        'success': True,
        'scans': [s.to_dict() for s in scans]
    }), 200
