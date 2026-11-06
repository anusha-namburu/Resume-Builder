from flask import Blueprint, request, jsonify
from app.models import (
    db, Resume, PersonalInformation, Education,
    Experience, Project, Skill, Certification, AdditionalItem
)
from app.utils.auth_middleware import token_required
import json

resume_bp = Blueprint('resumes', __name__, url_prefix='/api/resumes')

@resume_bp.route('', methods=['GET'])
@token_required
def list_resumes(current_user):
    resumes = Resume.query.filter_by(user_id=current_user.id).order_by(Resume.updated_at.desc()).all()
    # Recalculate completion score
    result = []
    for r in resumes:
        r.calculate_completion()
        result.append(r.to_dict(full=False))
    db.session.commit()
    return jsonify({'success': True, 'resumes': result}), 200

@resume_bp.route('', methods=['POST'])
@token_required
def create_resume(current_user):
    data = request.get_json() or {}
    title = data.get('title', 'My Professional Resume').strip()
    template_id = data.get('template_id', 'modern-professional')
    target_role = data.get('target_role', current_user.headline or 'Software Engineer').strip()
    color_theme = data.get('color_theme', '#1e3a8a')
    font_family = data.get('font_family', 'Inter')

    try:
        new_resume = Resume(
            user_id=current_user.id,
            title=title,
            template_id=template_id,
            target_role=target_role,
            color_theme=color_theme,
            font_family=font_family
        )
        db.session.add(new_resume)
        db.session.flush()

        # Seed with initial personal information from user
        personal_info = PersonalInformation(
            resume_id=new_resume.id,
            full_name=current_user.name,
            email=current_user.email,
            professional_title=target_role,
            phone="+1 (555) 234-5678",
            location="San Francisco, CA",
            linkedin=f"linkedin.com/in/{current_user.name.lower().replace(' ', '')}",
            github=f"github.com/{current_user.name.lower().replace(' ', '')}",
            portfolio=f"{current_user.name.lower().replace(' ', '')}.dev",
            summary=f"Dynamic and results-driven {target_role} with expertise in building robust, user-centric solutions. Proven track record of architecting scalable applications and collaborating in high-velocity teams."
        )
        db.session.add(personal_info)

        # Prepopulate with starter education
        edu = Education(
            resume_id=new_resume.id,
            degree="Bachelor of Science in Computer Science",
            institution="State University of Technology",
            location="San Francisco, CA",
            start_year="2020",
            graduation_year="2024",
            score="3.85 / 4.0",
            description="Relevant coursework: Data Structures, Algorithms, Distributed Systems, Software Architecture.",
            sort_order=0
        )
        db.session.add(edu)

        # Prepopulate with starter experience
        exp = Experience(
            resume_id=new_resume.id,
            company="Innovatech Solutions",
            job_title=target_role or "Software Engineer",
            location="San Francisco, CA",
            start_date="Jun 2024",
            end_date="Present",
            is_current=True,
            is_internship=False,
            responsibilities="• Spearheaded the design and deployment of core microservices, handling over 250k daily active requests.\n• Collaborated with UX and product teams to engineer responsive user interfaces using modern web frameworks.",
            achievements="• Improved system latency by 32% by optimizing database queries and implementing Redis caching.",
            sort_order=0
        )
        db.session.add(exp)

        # Prepopulate with starter project
        proj = Project(
            resume_id=new_resume.id,
            title="Real-Time Analytics Dashboard",
            subtitle="Full-Stack Web Application",
            description="Built a high-throughput event processing dashboard that provides live telemetry and predictive metrics for SaaS users.",
            technologies="React.js, Python, Flask, Tailwind CSS, Redis",
            project_link="https://dashboard-demo.dev",
            github_link=f"https://github.com/{current_user.name.lower().replace(' ', '')}/analytics-dashboard",
            sort_order=0
        )
        db.session.add(proj)

        # Starter skills
        starter_skills = [
            ("React.js", "Technical", "Expert"),
            ("Python", "Technical", "Proficient"),
            ("Tailwind CSS", "Technical", "Expert"),
            ("MySQL / PostgreSQL", "Technical", "Proficient"),
            ("RESTful APIs", "Technical", "Expert"),
            ("System Architecture", "Technical", "Intermediate"),
            ("Problem Solving", "Soft", "Expert"),
            ("Cross-Team Collaboration", "Soft", "Expert")
        ]
        for idx, (s_name, s_cat, s_lvl) in enumerate(starter_skills):
            db.session.add(Skill(
                resume_id=new_resume.id,
                name=s_name,
                category=s_cat,
                level=s_lvl,
                sort_order=idx
            ))

        # Starter certification
        cert = Certification(
            resume_id=new_resume.id,
            name="AWS Certified Solutions Architect – Associate",
            issuing_organization="Amazon Web Services",
            issue_date="2024",
            credential_id="AWS-ARC-92819",
            credential_url="https://aws.amazon.com/verify",
            sort_order=0
        )
        db.session.add(cert)

        # Starter additional item (Language & Achievement)
        db.session.add(AdditionalItem(
            resume_id=new_resume.id,
            section_type="achievement",
            title="1st Place - University Annual Hackathon",
            description="Awarded first place among 60+ engineering teams for building an AI-powered accessibility tool.",
            sort_order=0
        ))
        db.session.add(AdditionalItem(
            resume_id=new_resume.id,
            section_type="language",
            title="English",
            description="Native / Full Professional",
            sort_order=0
        ))

        new_resume.calculate_completion()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Resume created successfully!',
            'resume': new_resume.to_dict(full=True)
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Failed to create resume: {str(e)}'}), 500

@resume_bp.route('/<int:resume_id>', methods=['GET'])
@token_required
def get_resume(current_user, resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first()
    if not resume:
        return jsonify({'success': False, 'message': 'Resume not found'}), 404
    
    resume.calculate_completion()
    return jsonify({
        'success': True,
        'resume': resume.to_dict(full=True)
    }), 200

@resume_bp.route('/<int:resume_id>', methods=['PUT'])
@token_required
def update_resume(current_user, resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first()
    if not resume:
        return jsonify({'success': False, 'message': 'Resume not found'}), 404

    data = request.get_json() or {}

    try:
        # 1. Update basic fields
        if 'title' in data: resume.title = data['title']
        if 'template_id' in data: resume.template_id = data['template_id']
        if 'target_role' in data: resume.target_role = data['target_role']
        if 'color_theme' in data: resume.color_theme = data['color_theme']
        if 'font_family' in data: resume.font_family = data['font_family']
        if 'section_order' in data:
            resume.section_order = json.dumps(data['section_order']) if isinstance(data['section_order'], list) else data['section_order']

        # 2. Update Personal Info
        if 'personal_info' in data:
            pi_data = data['personal_info']
            if not resume.personal_info:
                resume.personal_info = PersonalInformation(resume_id=resume.id)
                db.session.add(resume.personal_info)
            resume.personal_info.full_name = pi_data.get('full_name', '')
            resume.personal_info.professional_title = pi_data.get('professional_title', '')
            resume.personal_info.email = pi_data.get('email', '')
            resume.personal_info.phone = pi_data.get('phone', '')
            resume.personal_info.location = pi_data.get('location', '')
            resume.personal_info.linkedin = pi_data.get('linkedin', '')
            resume.personal_info.github = pi_data.get('github', '')
            resume.personal_info.portfolio = pi_data.get('portfolio', '')
            resume.personal_info.summary = pi_data.get('summary', '')

        # 3. Update Education list
        if 'educations' in data and isinstance(data['educations'], list):
            Education.query.filter_by(resume_id=resume.id).delete()
            for idx, edu in enumerate(data['educations']):
                if edu.get('degree') or edu.get('institution'):
                    db.session.add(Education(
                        resume_id=resume.id,
                        degree=edu.get('degree', ''),
                        institution=edu.get('institution', ''),
                        location=edu.get('location', ''),
                        start_year=edu.get('start_year', ''),
                        graduation_year=edu.get('graduation_year', ''),
                        score=edu.get('score', ''),
                        description=edu.get('description', ''),
                        sort_order=idx
                    ))

        # 4. Update Experiences (and Internships)
        all_experiences_payload = []
        if 'experiences' in data and isinstance(data['experiences'], list):
            for e in data['experiences']:
                e_copy = dict(e)
                e_copy['is_internship'] = False
                all_experiences_payload.append(e_copy)
        if 'internships' in data and isinstance(data['internships'], list):
            for i in data['internships']:
                i_copy = dict(i)
                i_copy['is_internship'] = True
                all_experiences_payload.append(i_copy)
        
        if 'experiences' in data or 'internships' in data:
            Experience.query.filter_by(resume_id=resume.id).delete()
            for idx, exp in enumerate(all_experiences_payload):
                if exp.get('company') or exp.get('job_title'):
                    db.session.add(Experience(
                        resume_id=resume.id,
                        company=exp.get('company', ''),
                        job_title=exp.get('job_title', ''),
                        location=exp.get('location', ''),
                        start_date=exp.get('start_date', ''),
                        end_date=exp.get('end_date', ''),
                        is_current=bool(exp.get('is_current', False)),
                        is_internship=bool(exp.get('is_internship', False)),
                        responsibilities=exp.get('responsibilities', ''),
                        achievements=exp.get('achievements', ''),
                        sort_order=idx
                    ))

        # 5. Update Projects
        if 'projects' in data and isinstance(data['projects'], list):
            Project.query.filter_by(resume_id=resume.id).delete()
            for idx, proj in enumerate(data['projects']):
                if proj.get('title'):
                    db.session.add(Project(
                        resume_id=resume.id,
                        title=proj.get('title', ''),
                        subtitle=proj.get('subtitle', ''),
                        description=proj.get('description', ''),
                        technologies=proj.get('technologies', ''),
                        project_link=proj.get('project_link', ''),
                        github_link=proj.get('github_link', ''),
                        sort_order=idx
                    ))

        # 6. Update Skills
        if 'skills' in data and isinstance(data['skills'], list):
            Skill.query.filter_by(resume_id=resume.id).delete()
            for idx, skill in enumerate(data['skills']):
                if skill.get('name'):
                    db.session.add(Skill(
                        resume_id=resume.id,
                        name=skill.get('name', ''),
                        category=skill.get('category', 'Technical'),
                        level=skill.get('level', 'Proficient'),
                        sort_order=idx
                    ))

        # 7. Update Certifications
        if 'certifications' in data and isinstance(data['certifications'], list):
            Certification.query.filter_by(resume_id=resume.id).delete()
            for idx, cert in enumerate(data['certifications']):
                if cert.get('name'):
                    db.session.add(Certification(
                        resume_id=resume.id,
                        name=cert.get('name', ''),
                        issuing_organization=cert.get('issuing_organization', ''),
                        issue_date=cert.get('issue_date', ''),
                        credential_id=cert.get('credential_id', ''),
                        credential_url=cert.get('credential_url', ''),
                        sort_order=idx
                    ))

        # 8. Update Additional Items (achievements, languages, interests)
        if any(k in data for k in ['achievements', 'languages', 'interests']):
            AdditionalItem.query.filter_by(resume_id=resume.id).delete()
            idx = 0
            for ach in data.get('achievements', []):
                if ach.get('title'):
                    db.session.add(AdditionalItem(resume_id=resume.id, section_type='achievement', title=ach.get('title'), description=ach.get('description', ''), sort_order=idx))
                    idx += 1
            for lang in data.get('languages', []):
                if lang.get('title'):
                    db.session.add(AdditionalItem(resume_id=resume.id, section_type='language', title=lang.get('title'), description=lang.get('description', ''), sort_order=idx))
                    idx += 1
            for interest in data.get('interests', []):
                if interest.get('title'):
                    db.session.add(AdditionalItem(resume_id=resume.id, section_type='interest', title=interest.get('title'), description=interest.get('description', ''), sort_order=idx))
                    idx += 1

        resume.calculate_completion()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Resume updated successfully!',
            'resume': resume.to_dict(full=True)
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Failed to update resume: {str(e)}'}), 500

@resume_bp.route('/<int:resume_id>/duplicate', methods=['POST'])
@token_required
def duplicate_resume(current_user, resume_id):
    original = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first()
    if not original:
        return jsonify({'success': False, 'message': 'Resume not found'}), 404

    try:
        new_resume = Resume(
            user_id=current_user.id,
            title=f"{original.title} (Copy)",
            template_id=original.template_id,
            target_role=original.target_role,
            color_theme=original.color_theme,
            font_family=original.font_family,
            completion_percentage=original.completion_percentage,
            section_order=original.section_order
        )
        db.session.add(new_resume)
        db.session.flush()

        if original.personal_info:
            db.session.add(PersonalInformation(
                resume_id=new_resume.id,
                full_name=original.personal_info.full_name,
                professional_title=original.personal_info.professional_title,
                email=original.personal_info.email,
                phone=original.personal_info.phone,
                location=original.personal_info.location,
                linkedin=original.personal_info.linkedin,
                github=original.personal_info.github,
                portfolio=original.personal_info.portfolio,
                summary=original.personal_info.summary
            ))

        for e in original.educations:
            db.session.add(Education(
                resume_id=new_resume.id,
                degree=e.degree,
                institution=e.institution,
                location=e.location,
                start_year=e.start_year,
                graduation_year=e.graduation_year,
                score=e.score,
                description=e.description,
                sort_order=e.sort_order
            ))

        for exp in original.experiences:
            db.session.add(Experience(
                resume_id=new_resume.id,
                company=exp.company,
                job_title=exp.job_title,
                location=exp.location,
                start_date=exp.start_date,
                end_date=exp.end_date,
                is_current=exp.is_current,
                is_internship=exp.is_internship,
                responsibilities=exp.responsibilities,
                achievements=exp.achievements,
                sort_order=exp.sort_order
            ))

        for p in original.projects:
            db.session.add(Project(
                resume_id=new_resume.id,
                title=p.title,
                subtitle=p.subtitle,
                description=p.description,
                technologies=p.technologies,
                project_link=p.project_link,
                github_link=p.github_link,
                sort_order=p.sort_order
            ))

        for s in original.skills:
            db.session.add(Skill(
                resume_id=new_resume.id,
                name=s.name,
                category=s.category,
                level=s.level,
                sort_order=s.sort_order
            ))

        for c in original.certifications:
            db.session.add(Certification(
                resume_id=new_resume.id,
                name=c.name,
                issuing_organization=c.issuing_organization,
                issue_date=c.issue_date,
                credential_id=c.credential_id,
                credential_url=c.credential_url,
                sort_order=c.sort_order
            ))

        for a in original.additional_items:
            db.session.add(AdditionalItem(
                resume_id=new_resume.id,
                section_type=a.section_type,
                title=a.title,
                description=a.description,
                sort_order=a.sort_order
            ))

        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Resume duplicated successfully',
            'resume': new_resume.to_dict(full=True)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Duplication failed: {str(e)}'}), 500

@resume_bp.route('/<int:resume_id>', methods=['DELETE'])
@token_required
def delete_resume(current_user, resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first()
    if not resume:
        return jsonify({'success': False, 'message': 'Resume not found'}), 404

    try:
        db.session.delete(resume)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Resume deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Failed to delete resume: {str(e)}'}), 500


@resume_bp.route('/import-parsed', methods=['POST'])
@token_required
def import_parsed_resume(current_user):
    data = request.get_json() or {}
    parsed = data.get('parsed_resume', {})
    template_id = data.get('template_id', 'modern-professional')
    title = data.get('title', parsed.get('title', f"{current_user.name}'s Imported Resume")).strip()
    target_role = data.get('target_role', parsed.get('target_role', current_user.headline or 'Software Professional')).strip()
    personal = parsed.get('personal_info', {})

    try:
        new_resume = Resume(
            user_id=current_user.id,
            title=title,
            template_id=template_id,
            target_role=target_role,
            color_theme='#2563eb',
            font_family='Inter'
        )
        db.session.add(new_resume)
        db.session.flush()

        # Add Personal Info
        personal_info = PersonalInformation(
            resume_id=new_resume.id,
            full_name=personal.get('full_name', current_user.name),
            email=personal.get('email', current_user.email),
            professional_title=personal.get('professional_title', target_role),
            phone=personal.get('phone', ''),
            location=personal.get('location', ''),
            linkedin=personal.get('linkedin', ''),
            github=personal.get('github', ''),
            portfolio=personal.get('portfolio', ''),
            summary=personal.get('summary', '')
        )
        db.session.add(personal_info)

        # Add Educations
        for i, edu_data in enumerate(parsed.get('educations', [])):
            db.session.add(Education(
                resume_id=new_resume.id,
                degree=edu_data.get('degree', 'Degree / Coursework'),
                institution=edu_data.get('institution', 'University / College'),
                location=edu_data.get('location', ''),
                start_year=edu_data.get('start_year', '2020'),
                graduation_year=edu_data.get('graduation_year', '2024'),
                score=edu_data.get('score', ''),
                description=edu_data.get('description', ''),
                sort_order=i
            ))

        # Add Experiences
        for i, exp_data in enumerate(parsed.get('experiences', [])):
            db.session.add(Experience(
                resume_id=new_resume.id,
                company=exp_data.get('company', 'Organization'),
                job_title=exp_data.get('job_title', 'Professional'),
                location=exp_data.get('location', ''),
                start_date=exp_data.get('start_date', '2022'),
                end_date=exp_data.get('end_date', 'Present'),
                is_current=True,
                responsibilities=exp_data.get('responsibilities', ''),
                achievements=exp_data.get('achievements', ''),
                sort_order=i
            ))

        # Add Projects
        for i, proj_data in enumerate(parsed.get('projects', [])):
            db.session.add(Project(
                resume_id=new_resume.id,
                title=proj_data.get('title', 'Project Portfolio'),
                technologies=proj_data.get('technologies', ''),
                description=proj_data.get('description', ''),
                link=proj_data.get('link', ''),
                sort_order=i
            ))

        # Add Skills
        for i, s_data in enumerate(parsed.get('skills', [])):
            db.session.add(Skill(
                resume_id=new_resume.id,
                name=s_data.get('name', 'Skill'),
                level=s_data.get('level', 'Proficient'),
                category=s_data.get('category', 'Technical'),
                sort_order=i
            ))

        new_resume.calculate_completion()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Resume imported successfully',
            'resume': new_resume.to_dict(full=True)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Import failed: {str(e)}'}), 500
