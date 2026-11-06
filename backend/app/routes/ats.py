from flask import Blueprint, request, jsonify
from app.models import db, Resume, ATSScan
from app.services.ats_service import ATSService
from app.services.parser_service import ResumeParserService
from app.utils.auth_middleware import token_required, optional_token
import json

ats_bp = Blueprint('ats', __name__, url_prefix='/api/ats')

@ats_bp.route('/analyze', methods=['POST'])
@optional_token
def analyze_resume(current_user):
    data = request.get_json() or {}
    resume_id = data.get('resume_id')
    job_description = data.get('job_description', '')
    raw_resume_data = data.get('resume_data')

    resume_obj = None
    if resume_id and current_user:
        resume_obj = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first()
        if resume_obj and not raw_resume_data:
            raw_resume_data = resume_obj.to_dict(full=True)

    if not raw_resume_data:
        return jsonify({'success': False, 'message': 'Resume data or valid resume_id is required'}), 400

    analysis = ATSService.analyze_resume(raw_resume_data, job_description)

    # If linked to a resume record, save to ATSScan table
    if resume_obj and current_user:
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

@ats_bp.route('/upload-and-scan', methods=['POST'])
@optional_token
def upload_and_scan_resume(current_user):
    """
    Accepts an uploaded resume file (PDF, DOCX, TXT), parses it,
    and runs ATS compatibility scoring and percentage analysis.
    """
    if 'resume_file' not in request.files:
        return jsonify({'success': False, 'message': 'No resume file uploaded'}), 400

    file = request.files['resume_file']
    if not file or file.filename == '':
        return jsonify({'success': False, 'message': 'Selected file is empty'}), 400

    job_description = request.form.get('job_description', '')
    job_title = request.form.get('job_title', '')

    try:
        # Extract plain text
        raw_text = ResumeParserService.extract_text_from_file(file)
        if not raw_text or len(raw_text.strip()) < 20:
            return jsonify({
                'success': False,
                'message': 'Could not extract readable text from this file. Please make sure it is not a scanned image PDF, or try a text/DOCX file.'
            }), 400

        # Parse into structured resume data
        structured_resume = ResumeParserService.parse_to_resume_structure(raw_text, file.filename)
        if job_title:
            structured_resume['target_role'] = job_title

        # Run ATS scoring
        analysis = ATSService.analyze_resume(structured_resume, job_description)
        analysis['filename'] = file.filename
        analysis['parsed_resume'] = structured_resume
        analysis['raw_text_preview'] = raw_text[:500]

        return jsonify({
            'success': True,
            'message': 'Resume parsed and analyzed successfully',
            'data': analysis
        }), 200

    except Exception as e:
        print(f"Upload and scan error: {e}")
        return jsonify({
            'success': False,
            'message': f'Failed to process file: {str(e)}'
        }), 500

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
