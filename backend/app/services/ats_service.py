import re
from collections import Counter

class ATSService:
    COMMON_SKILLS_CORPUS = {
        'react', 'react.js', 'vue', 'angular', 'node', 'node.js', 'express', 'python', 'django', 'flask',
        'fastapi', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'sass', 'sql', 'mysql', 'postgresql',
        'mongodb', 'redis', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'github', 'ci/cd',
        'rest', 'restful', 'graphql', 'microservices', 'agile', 'scrum', 'jira', 'figma', 'linux',
        'data analysis', 'machine learning', 'deep learning', 'pandas', 'numpy', 'scikit-learn',
        'communication', 'leadership', 'collaboration', 'problem solving', 'critical thinking',
        'project management', 'ui/ux', 'unit testing', 'jest', 'cypress', 'system architecture'
    }

    @staticmethod
    def analyze_resume(resume_data, job_description=""):
        """
        Comprehensive ATS Compatibility Analysis:
        1. Structural integrity (Contact info, Summary, Education, Experience, Skills)
        2. Content density (Word count, bullet point metrics, action verbs)
        3. Job Description keyword alignment & semantic match
        4. ATS format safety verification
        """
        # Flatten resume text
        personal = resume_data.get('personal_info', {})
        experiences = resume_data.get('experiences', [])
        educations = resume_data.get('educations', [])
        skills = resume_data.get('skills', [])
        projects = resume_data.get('projects', [])

        full_text_parts = [
            personal.get('full_name', ''),
            personal.get('professional_title', ''),
            personal.get('summary', ''),
        ]
        
        for exp in experiences:
            full_text_parts.extend([
                exp.get('company', ''),
                exp.get('job_title', ''),
                exp.get('responsibilities', ''),
                exp.get('achievements', '')
            ])
            
        for edu in educations:
            full_text_parts.extend([
                edu.get('degree', ''),
                edu.get('institution', ''),
                edu.get('description', '')
            ])
            
        skill_names = [s.get('name', '').lower() for s in skills if s.get('name')]
        full_text_parts.extend(skill_names)
        
        for p in projects:
            full_text_parts.extend([
                p.get('title', ''),
                p.get('description', ''),
                p.get('technologies', '')
            ])

        full_resume_text = " ".join(full_text_parts)
        resume_lower = full_resume_text.lower()
        words = re.findall(r'\b[a-zA-Z0-9_\-\+\#\.]+\b', resume_lower)
        word_count = len(words)

        # 1. Structural Checks (max 35 points)
        structure_score = 0
        formatting_issues = []
        positive_checks = []

        # Check contact info
        if personal.get('email') and '@' in personal.get('email', ''):
            structure_score += 7
            positive_checks.append("Valid email address detected.")
        else:
            formatting_issues.append("Missing or invalid email address.")

        if personal.get('phone'):
            structure_score += 6
            positive_checks.append("Contact phone number found.")
        else:
            formatting_issues.append("Add a telephone number for recruiters to contact you directly.")

        if personal.get('linkedin'):
            structure_score += 4
            positive_checks.append("LinkedIn profile link included.")
        else:
            formatting_issues.append("Include a LinkedIn profile link to improve recruiter searchability.")

        if personal.get('summary') and len(personal.get('summary', '').strip()) > 30:
            structure_score += 6
            positive_checks.append("Engaging professional summary present.")
        else:
            formatting_issues.append("Add a concise 3-4 sentence professional summary.")

        if len(experiences) > 0:
            structure_score += 6
            positive_checks.append(f"{len(experiences)} work experience entries structured.")
        else:
            formatting_issues.append("Add at least one professional experience, internship, or project role.")

        if len(skills) >= 5:
            structure_score += 6
            positive_checks.append(f"Strong skill density ({len(skills)} skills listed).")
        else:
            formatting_issues.append("List at least 6-8 core technical and interpersonal skills.")

        # 2. Content Quality & Metrics (max 30 points)
        content_score = 0
        action_verb_list = ['spearheaded', 'managed', 'engineered', 'developed', 'designed', 'optimized',
                            'implemented', 'accelerated', 'reduced', 'increased', 'orchestrated', 'built', 'led', 'delivered']
        action_verb_count = sum(1 for verb in action_verb_list if verb in resume_lower)
        if action_verb_count >= 4:
            content_score += 12
            positive_checks.append(f"Great use of action verbs ({action_verb_count}+ found).")
        elif action_verb_count >= 1:
            content_score += 6
            formatting_issues.append("Use more decisive action verbs (e.g., 'Engineered', 'Orchestrated', 'Optimized').")
        else:
            formatting_issues.append("Start bullet points with strong action verbs rather than passive duties.")

        # Metric detection (numbers, percentages, $, etc.)
        metrics_found = len(re.findall(r'(\d+[\%kmb\+]|\$\d+|\b\d+\s+(users|clients|projects|features|teams)\b)', resume_lower))
        if metrics_found >= 3:
            content_score += 12
            positive_checks.append(f"Strong quantifiable impact detected ({metrics_found}+ metric instances).")
        elif metrics_found >= 1:
            content_score += 6
            formatting_issues.append("Add more quantifiable numbers or percentage improvements to bullet points.")
        else:
            formatting_issues.append("Quantify your achievements (e.g., 'boosted speed by 35%', 'reduced costs by $15k').")

        # Word count check
        if 200 <= word_count <= 850:
            content_score += 6
            positive_checks.append(f"Ideal resume length ({word_count} words).")
        elif word_count < 200:
            formatting_issues.append(f"Resume is brief ({word_count} words). Expand on responsibilities and project outcomes.")
        else:
            content_score += 3
            formatting_issues.append("Resume exceeds 850 words. Ensure content remains within 1-2 focused pages.")

        # 3. Job Description Alignment (max 35 points)
        alignment_score = 25 # default benchmark if no JD provided
        matched_keywords = []
        missing_keywords = []
        jd_provided = bool(job_description and len(job_description.strip()) > 20)

        if jd_provided:
            alignment_score = 0
            jd_lower = job_description.lower()
            jd_tokens = re.findall(r'\b[a-zA-Z0-9_\-\+\#\.]+\b', jd_lower)
            
            # Find skills and critical tech in JD
            detected_jd_skills = set()
            for token in jd_tokens:
                if token in ATSService.COMMON_SKILLS_CORPUS:
                    detected_jd_skills.add(token)
            
            # Multi-word checks
            for phrase in ['react js', 'node js', 'machine learning', 'data analysis', 'deep learning', 'problem solving', 'project management']:
                if phrase in jd_lower:
                    detected_jd_skills.add(phrase)

            # Also pull high-frequency keywords
            stopwords = {'with', 'that', 'this', 'from', 'have', 'more', 'will', 'your', 'about', 'some', 'their', 'which', 'would', 'could', 'work', 'year', 'experience', 'team', 'teams', 'skills', 'role', 'ability', 'looking', 'join', 'must', 'should', 'candidate', 'apply', 'opportunity'}
            meaningful_jd = [w for w in jd_tokens if len(w) > 3 and w not in stopwords]
            freq = Counter(meaningful_jd)
            top_keywords = [w for w, _ in freq.most_common(18)]

            all_target_terms = list(detected_jd_skills.union(set(top_keywords[:12])))

            for term in all_target_terms:
                if term in resume_lower:
                    matched_keywords.append(term)
                else:
                    missing_keywords.append(term)

            if len(all_target_terms) > 0:
                match_ratio = len(matched_keywords) / len(all_target_terms)
                alignment_score = int(match_ratio * 35)
            else:
                alignment_score = 20
        else:
            # Check presence of standard tech/soft skills
            for s in ATSService.COMMON_SKILLS_CORPUS:
                if s in resume_lower:
                    matched_keywords.append(s)
            matched_keywords = matched_keywords[:10]
            missing_keywords = ["Provide target Job Description to discover missing tailored keywords"]

        total_score = min(structure_score + content_score + alignment_score, 100)

        # Actionable recommendations
        recommendations = []
        if missing_keywords and jd_provided:
            recommendations.append(f"Incorporate missing core keywords: {', '.join(missing_keywords[:6])}.")
        if metrics_found < 2:
            recommendations.append("Strengthen bullet points using the Google XYZ formula: 'Accomplished [X] as measured by [Y] by doing [Z]'.")
        if not personal.get('linkedin') or not personal.get('github'):
            recommendations.append("Add professional URLs (LinkedIn, GitHub, or Portfolio) for instant proof of work.")
        if len(skills) < 8:
            recommendations.append("Expand your skills section with both technical tools and domain methodologies.")
        recommendations.append("Use standard section headings ('Experience', 'Education', 'Projects', 'Skills') so ATS scanners parse them correctly.")

        return {
            "score": total_score,
            "category_scores": {
                "structure": int((structure_score / 35) * 100),
                "content": int((content_score / 30) * 100),
                "alignment": int((alignment_score / 35) * 100) if jd_provided else 75
            },
            "matched_keywords": matched_keywords[:15],
            "missing_keywords": missing_keywords[:15],
            "positive_checks": positive_checks,
            "formatting_issues": formatting_issues,
            "recommendations": recommendations,
            "word_count": word_count,
            "has_job_description": jd_provided,
            "disclaimer": "Note: This ATS compatibility score is an intelligent diagnostic estimation based on common ATS parser algorithms and keyword extraction patterns. It is not an absolute guarantee of passing any specific employer's proprietary ATS scanner."
        }
