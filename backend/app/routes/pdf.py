from flask import Blueprint, request, send_file, jsonify
from app.models import Resume
from app.services.pdf_service import PDFService
from app.utils.auth_middleware import token_required

pdf_bp = Blueprint('pdf', __name__, url_prefix='/api/pdf')

@pdf_bp.route('/<int:resume_id>', methods=['GET'])
@token_required
def download_resume_pdf(current_user, resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first()
    if not resume:
        return jsonify({'success': False, 'message': 'Resume not found'}), 404

    resume_data = resume.to_dict(full=True)
    pdf_buffer = PDFService.generate_pdf(resume_data)

    safe_title = "".join(c for c in resume.title if c.isalnum() or c in (' ', '_', '-')).strip() or 'Resume'
    filename = f"{safe_title.replace(' ', '_')}.pdf"

    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=filename
    )

@pdf_bp.route('/export', methods=['POST'])
@token_required
def export_custom_pdf(current_user):
    data = request.get_json() or {}
    resume_data = data.get('resume_data')
    if not resume_data:
        return jsonify({'success': False, 'message': 'resume_data is required'}), 400

    pdf_buffer = PDFService.generate_pdf(resume_data)
    title = resume_data.get('title', 'Resume')
    safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '_', '-')).strip() or 'Resume'

    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"{safe_title.replace(' ', '_')}.pdf"
    )
