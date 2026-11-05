from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(180), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    headline = db.Column(db.String(255), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    resumes = db.relationship('Resume', backref='user', cascade='all, delete-orphan', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'headline': self.headline,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Template(db.Model):
    __tablename__ = 'templates'
    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(64), nullable=False)
    description = db.Column(db.Text, default='')
    thumbnail_url = db.Column(db.String(255), default='')
    is_premium = db.Column(db.Boolean, default=False)
    color_scheme = db.Column(db.String(64), default='navy')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'thumbnail_url': self.thumbnail_url,
            'is_premium': self.is_premium,
            'color_scheme': self.color_scheme
        }

class Resume(db.Model):
    __tablename__ = 'resumes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False, default='Untitled Resume')
    template_id = db.Column(db.String(64), db.ForeignKey('templates.id'), default='modern-professional')
    target_role = db.Column(db.String(120), default='')
    color_theme = db.Column(db.String(32), default='#1e3a8a')
    font_family = db.Column(db.String(64), default='Inter')
    completion_percentage = db.Column(db.Integer, default=0)
    section_order = db.Column(db.Text, default='["summary","experience","education","projects","skills","certifications","internships","achievements","languages","interests"]')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    personal_info = db.relationship('PersonalInformation', backref='resume', uselist=False, cascade='all, delete-orphan')
    educations = db.relationship('Education', backref='resume', cascade='all, delete-orphan', lazy=True, order_by='Education.sort_order')
    experiences = db.relationship('Experience', backref='resume', cascade='all, delete-orphan', lazy=True, order_by='Experience.sort_order')
    projects = db.relationship('Project', backref='resume', cascade='all, delete-orphan', lazy=True, order_by='Project.sort_order')
    skills = db.relationship('Skill', backref='resume', cascade='all, delete-orphan', lazy=True, order_by='Skill.sort_order')
    certifications = db.relationship('Certification', backref='resume', cascade='all, delete-orphan', lazy=True, order_by='Certification.sort_order')
    additional_items = db.relationship('AdditionalItem', backref='resume', cascade='all, delete-orphan', lazy=True, order_by='AdditionalItem.sort_order')
    ats_scans = db.relationship('ATSScan', backref='resume', cascade='all, delete-orphan', lazy=True, order_by='desc(ATSScan.created_at)')

    def calculate_completion(self):
        score = 0
        total = 100
        # personal info: up to 25%
        if self.personal_info:
            if self.personal_info.full_name: score += 5
            if self.personal_info.email: score += 5
            if self.personal_info.phone: score += 5
            if self.personal_info.professional_title: score += 5
            if self.personal_info.summary: score += 5
        # education: 15%
        if self.educations and len(self.educations) > 0:
            score += 15
        # experience: 20%
        if self.experiences and len(self.experiences) > 0:
            score += 20
        # projects: 15%
        if self.projects and len(self.projects) > 0:
            score += 15
        # skills: 15%
        if self.skills and len(self.skills) > 0:
            score += 15
        # certifications / additional: 10%
        if (self.certifications and len(self.certifications) > 0) or (self.additional_items and len(self.additional_items) > 0):
            score += 10
        self.completion_percentage = min(score, 100)
        return self.completion_percentage

    def to_dict(self, full=True):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'template_id': self.template_id,
            'target_role': self.target_role,
            'color_theme': self.color_theme,
            'font_family': self.font_family,
            'completion_percentage': self.completion_percentage,
            'section_order': json.loads(self.section_order) if self.section_order else [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if full:
            data['personal_info'] = self.personal_info.to_dict() if self.personal_info else {}
            data['educations'] = [e.to_dict() for e in self.educations]
            data['experiences'] = [e.to_dict() for e in self.experiences if not e.is_internship]
            data['internships'] = [e.to_dict() for e in self.experiences if e.is_internship]
            data['projects'] = [p.to_dict() for p in self.projects]
            data['skills'] = [s.to_dict() for s in self.skills]
            data['certifications'] = [c.to_dict() for c in self.certifications]
            
            # Additional items split by type
            data['achievements'] = [a.to_dict() for a in self.additional_items if a.section_type == 'achievement']
            data['languages'] = [a.to_dict() for a in self.additional_items if a.section_type == 'language']
            data['interests'] = [a.to_dict() for a in self.additional_items if a.section_type == 'interest']
        return data

class PersonalInformation(db.Model):
    __tablename__ = 'personal_information'
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False, unique=True)
    full_name = db.Column(db.String(150), default='')
    professional_title = db.Column(db.String(150), default='')
    email = db.Column(db.String(180), default='')
    phone = db.Column(db.String(50), default='')
    location = db.Column(db.String(150), default='')
    linkedin = db.Column(db.String(255), default='')
    github = db.Column(db.String(255), default='')
    portfolio = db.Column(db.String(255), default='')
    summary = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'resume_id': self.resume_id,
            'full_name': self.full_name or '',
            'professional_title': self.professional_title or '',
            'email': self.email or '',
            'phone': self.phone or '',
            'location': self.location or '',
            'linkedin': self.linkedin or '',
            'github': self.github or '',
            'portfolio': self.portfolio or '',
            'summary': self.summary or ''
        }

class Education(db.Model):
    __tablename__ = 'education'
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False, index=True)
    degree = db.Column(db.String(150), nullable=False)
    institution = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(120), default='')
    start_year = db.Column(db.String(30), default='')
    graduation_year = db.Column(db.String(30), default='')
    score = db.Column(db.String(50), default='')
    description = db.Column(db.Text, default='')
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'resume_id': self.resume_id,
            'degree': self.degree or '',
            'institution': self.institution or '',
            'location': self.location or '',
            'start_year': self.start_year or '',
            'graduation_year': self.graduation_year or '',
            'score': self.score or '',
            'description': self.description or '',
            'sort_order': self.sort_order
        }

class Experience(db.Model):
    __tablename__ = 'experience'
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False, index=True)
    company = db.Column(db.String(180), nullable=False)
    job_title = db.Column(db.String(150), nullable=False)
    location = db.Column(db.String(120), default='')
    start_date = db.Column(db.String(40), default='')
    end_date = db.Column(db.String(40), default='')
    is_current = db.Column(db.Boolean, default=False)
    is_internship = db.Column(db.Boolean, default=False)
    responsibilities = db.Column(db.Text, default='')
    achievements = db.Column(db.Text, default='')
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'resume_id': self.resume_id,
            'company': self.company or '',
            'job_title': self.job_title or '',
            'location': self.location or '',
            'start_date': self.start_date or '',
            'end_date': self.end_date or '',
            'is_current': bool(self.is_current),
            'is_internship': bool(self.is_internship),
            'responsibilities': self.responsibilities or '',
            'achievements': self.achievements or '',
            'sort_order': self.sort_order
        }

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False, index=True)
    title = db.Column(db.String(180), nullable=False)
    subtitle = db.Column(db.String(150), default='')
    description = db.Column(db.Text, default='')
    technologies = db.Column(db.String(255), default='')
    project_link = db.Column(db.String(255), default='')
    github_link = db.Column(db.String(255), default='')
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'resume_id': self.resume_id,
            'title': self.title or '',
            'subtitle': self.subtitle or '',
            'description': self.description or '',
            'technologies': self.technologies or '',
            'project_link': self.project_link or '',
            'github_link': self.github_link or '',
            'sort_order': self.sort_order
        }

class Skill(db.Model):
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), default='Technical') # Technical, Soft
    level = db.Column(db.String(30), default='Proficient') # Beginner, Intermediate, Proficient, Expert
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'resume_id': self.resume_id,
            'name': self.name or '',
            'category': self.category or 'Technical',
            'level': self.level or 'Proficient',
            'sort_order': self.sort_order
        }

class Certification(db.Model):
    __tablename__ = 'certifications'
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(200), nullable=False)
    issuing_organization = db.Column(db.String(180), default='')
    issue_date = db.Column(db.String(50), default='')
    credential_id = db.Column(db.String(100), default='')
    credential_url = db.Column(db.String(255), default='')
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'resume_id': self.resume_id,
            'name': self.name or '',
            'issuing_organization': self.issuing_organization or '',
            'issue_date': self.issue_date or '',
            'credential_id': self.credential_id or '',
            'credential_url': self.credential_url or '',
            'sort_order': self.sort_order
        }

class AdditionalItem(db.Model):
    __tablename__ = 'additional_items'
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False, index=True)
    section_type = db.Column(db.String(50), nullable=False) # achievement, language, interest
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default='')
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'resume_id': self.resume_id,
            'section_type': self.section_type,
            'title': self.title or '',
            'description': self.description or '',
            'sort_order': self.sort_order
        }

class ATSScan(db.Model):
    __tablename__ = 'ats_scans'
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False)
    job_title = db.Column(db.String(150), default='')
    score = db.Column(db.Integer, nullable=False, default=0)
    matched_keywords = db.Column(db.Text, default='[]')
    missing_keywords = db.Column(db.Text, default='[]')
    feedback = db.Column(db.Text, default='[]')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'resume_id': self.resume_id,
            'job_title': self.job_title,
            'score': self.score,
            'matched_keywords': json.loads(self.matched_keywords) if self.matched_keywords else [],
            'missing_keywords': json.loads(self.missing_keywords) if self.missing_keywords else [],
            'feedback': json.loads(self.feedback) if self.feedback else [],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
