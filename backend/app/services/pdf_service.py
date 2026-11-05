import io
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib import colors
from reportlab.lib.units import inch

class PDFService:
    @staticmethod
    def generate_pdf(resume_data):
        """
        Generate a professional, ATS-friendly A4 PDF document for the resume.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Color parsing
        theme_hex = resume_data.get('color_theme') or '#1e3a8a'
        try:
            primary_color = colors.HexColor(theme_hex)
        except Exception:
            primary_color = colors.HexColor('#1e3a8a')

        # Custom Typography Styles
        title_style = ParagraphStyle(
            'ResumeTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=20,
            leading=24,
            textColor=primary_color,
            spaceAfter=4
        )
        
        subtitle_style = ParagraphStyle(
            'ResumeSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#475569'),
            spaceAfter=6
        )

        contact_style = ParagraphStyle(
            'ContactInfo',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#334155'),
            spaceAfter=12
        )

        section_heading = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=12,
            leading=16,
            textColor=primary_color,
            spaceBefore=10,
            spaceAfter=4,
            textTransform='uppercase'
        )

        item_title = ParagraphStyle(
            'ItemTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=10,
            leading=13,
            textColor=colors.HexColor('#0f172a')
        )

        item_subtitle = ParagraphStyle(
            'ItemSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#64748b'),
            spaceAfter=3
        )

        body_style = ParagraphStyle(
            'ItemBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=13,
            textColor=colors.HexColor('#334155'),
            spaceAfter=6
        )

        story = []

        personal = resume_data.get('personal_info', {})
        full_name = personal.get('full_name') or 'Candidate Name'
        prof_title = personal.get('professional_title') or resume_data.get('target_role') or ''

        # 1. Header
        story.append(Paragraph(full_name, title_style))
        if prof_title:
            story.append(Paragraph(prof_title, subtitle_style))

        # Contact line
        contact_parts = []
        if personal.get('email'): contact_parts.append(personal['email'])
        if personal.get('phone'): contact_parts.append(personal['phone'])
        if personal.get('location'): contact_parts.append(personal['location'])
        if personal.get('linkedin'): contact_parts.append(personal['linkedin'])
        if personal.get('github'): contact_parts.append(personal['github'])
        if personal.get('portfolio'): contact_parts.append(personal['portfolio'])

        contact_text = " • ".join(contact_parts)
        if contact_text:
            story.append(Paragraph(contact_text, contact_style))

        story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=8))

        # 2. Professional Summary
        summary = personal.get('summary')
        if summary:
            story.append(Paragraph("Professional Summary", section_heading))
            story.append(Paragraph(summary, body_style))
            story.append(Spacer(1, 4))

        # 3. Work Experience
        experiences = resume_data.get('experiences', [])
        if experiences:
            story.append(Paragraph("Professional Experience", section_heading))
            for exp in experiences:
                company = exp.get('company', '')
                job_title = exp.get('job_title', '')
                start = exp.get('start_date', '')
                end = 'Present' if exp.get('is_current') else exp.get('end_date', '')
                date_str = f"{start} - {end}" if start or end else ''
                loc = exp.get('location', '')
                
                header_text = f"<b>{job_title}</b> — {company}"
                if date_str:
                    header_text += f" <font color='#64748b'>({date_str}{', ' + loc if loc else ''})</font>"
                story.append(Paragraph(header_text, item_title))
                
                if exp.get('responsibilities'):
                    story.append(Paragraph(exp['responsibilities'].replace('\n', '<br/>'), body_style))
                if exp.get('achievements'):
                    story.append(Paragraph(f"<b>Key Achievements:</b> {exp['achievements'].replace(chr(10), '<br/>')}", body_style))
                story.append(Spacer(1, 4))

        # 4. Education
        educations = resume_data.get('educations', [])
        if educations:
            story.append(Paragraph("Education", section_heading))
            for edu in educations:
                degree = edu.get('degree', '')
                inst = edu.get('institution', '')
                grad = edu.get('graduation_year', '')
                score = edu.get('score', '')
                
                edu_text = f"<b>{degree}</b> — {inst}"
                if grad:
                    edu_text += f" <font color='#64748b'>({grad})</font>"
                if score:
                    edu_text += f" | Grade/GPA: {score}"
                story.append(Paragraph(edu_text, item_title))
                if edu.get('description'):
                    story.append(Paragraph(edu['description'], body_style))
                story.append(Spacer(1, 4))

        # 5. Projects
        projects = resume_data.get('projects', [])
        if projects:
            story.append(Paragraph("Projects", section_heading))
            for proj in projects:
                title = proj.get('title', '')
                tech = proj.get('technologies', '')
                link = proj.get('project_link', '')
                desc = proj.get('description', '')
                
                proj_text = f"<b>{title}</b>"
                if tech:
                    proj_text += f" <font color='#64748b'>[{tech}]</font>"
                if link:
                    proj_text += f" | <a href='{link}'>{link}</a>"
                story.append(Paragraph(proj_text, item_title))
                if desc:
                    story.append(Paragraph(desc, body_style))
                story.append(Spacer(1, 4))

        # 6. Skills
        skills = resume_data.get('skills', [])
        if skills:
            story.append(Paragraph("Technical & Professional Skills", section_heading))
            tech_skills = [s['name'] for s in skills if s.get('category') == 'Technical' or not s.get('category')]
            soft_skills = [s['name'] for s in skills if s.get('category') == 'Soft']
            
            if tech_skills:
                story.append(Paragraph(f"<b>Technical Skills:</b> {', '.join(tech_skills)}", body_style))
            if soft_skills:
                story.append(Paragraph(f"<b>Core Competencies:</b> {', '.join(soft_skills)}", body_style))
            story.append(Spacer(1, 4))

        # 7. Certifications
        certs = resume_data.get('certifications', [])
        if certs:
            story.append(Paragraph("Certifications & Licenses", section_heading))
            for cert in certs:
                name = cert.get('name', '')
                org = cert.get('issuing_organization', '')
                date = cert.get('issue_date', '')
                cert_str = f"• <b>{name}</b>"
                if org: cert_str += f" — {org}"
                if date: cert_str += f" ({date})"
                story.append(Paragraph(cert_str, body_style))

        # 8. Additional Items (Achievements, Languages, Interests)
        achievements = resume_data.get('achievements', [])
        if achievements:
            story.append(Paragraph("Achievements & Honors", section_heading))
            for a in achievements:
                story.append(Paragraph(f"• <b>{a.get('title', '')}</b>: {a.get('description', '')}", body_style))

        languages = resume_data.get('languages', [])
        if languages:
            story.append(Paragraph("Languages", section_heading))
            lang_str = ", ".join([f"{l.get('title', '')} ({l.get('description', 'Fluent')})" if l.get('description') else l.get('title', '') for l in languages])
            story.append(Paragraph(lang_str, body_style))

        doc.build(story)
        buffer.seek(0)
        return buffer
