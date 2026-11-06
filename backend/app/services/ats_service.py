import re
from collections import Counter

class ATSService:
    SAFE_ATS_FONTS = {
        'inter', 'roboto', 'arial', 'helvetica', 'calibri', 'georgia', 
        'garamond', 'lato', 'open sans', 'times new roman', 'cambria', 'verdana', 'trebuchet ms'
    }

    COMMON_SKILLS_CORPUS = {
        'react', 'react.js', 'vue', 'angular', 'node', 'node.js', 'express', 'python', 'django', 'flask',
        'fastapi', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'sass', 'sql', 'mysql', 'postgresql',
        'mongodb', 'redis', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'github', 'ci/cd',
        'rest', 'restful', 'graphql', 'microservices', 'agile', 'scrum', 'jira', 'figma', 'linux',
        'data analysis', 'machine learning', 'deep learning', 'pandas', 'numpy', 'scikit-learn',
        'communication', 'leadership', 'collaboration', 'problem solving', 'critical thinking',
        'project management', 'ui/ux', 'unit testing', 'jest', 'cypress', 'system architecture',
        'java', 'c++', 'c#', 'spring boot', 'go', 'golang', 'rust', 'ruby', 'php', 'solidity',
        'next.js', 'redux', 'mobx', 'webpack', 'vite', 'tableau', 'power bi', 'devops', 'terraform'
    }

    COMMON_TECH_CASING = {
        'javascript': 'JavaScript',
        'typescript': 'TypeScript',
        'github': 'GitHub',
        'reactjs': 'React',
        'react': 'React',
        'nodejs': 'Node.js',
        'node.js': 'Node.js',
        'python': 'Python',
        'mysql': 'MySQL',
        'postgresql': 'PostgreSQL',
        'mongodb': 'MongoDB',
        'html': 'HTML',
        'css': 'CSS',
        'aws': 'AWS',
        'gcp': 'GCP',
        'api': 'API',
        'apis': 'APIs',
        'rest': 'REST',
        'ci/cd': 'CI/CD',
        'docker': 'Docker',
        'kubernetes': 'Kubernetes',
        'linux': 'Linux',
        'figma': 'Figma',
        'tailwind': 'Tailwind CSS'
    }

    COMMON_SPELLING_TYPOS = {
        'teh': 'the',
        'recieve': 'receive',
        'seperate': 'separate',
        'occurance': 'occurrence',
        'managment': 'management',
        'experiance': 'experience',
        'developement': 'development',
        'maintainance': 'maintenance',
        'succesful': 'successful',
        'definately': 'definitely',
        'reponsibility': 'responsibility',
        'responsibilites': 'responsibilities',
        'acheivement': 'achievement',
        'acheive': 'achieve',
        'collabration': 'collaboration',
        'programing': 'programming',
        'flas': 'flask',
        'enviornment': 'environment'
    }

    PASSIVE_VOICE_PHRASES = [
        'was responsible for', 'were responsible for', 'assisted with', 'helped to',
        'duties included', 'worked on', 'tasked with', 'handled the', 'part of a team that'
    ]

    ACTION_VERBS = {
        'spearheaded', 'architected', 'engineered', 'developed', 'designed', 'optimized',
        'implemented', 'accelerated', 'orchestrated', 'built', 'led', 'delivered',
        'automated', 'reduced', 'increased', 'scaled', 'mentored', 'transformed',
        'resolved', 'authored', 'pioneered', 'executed', 'refactored', 'streamlined'
    }

    @staticmethod
    def analyze_resume(resume_data, job_description=""):
        personal = resume_data.get('personal_info', {})
        experiences = resume_data.get('experiences', [])
        educations = resume_data.get('educations', [])
        skills = resume_data.get('skills', [])
        projects = resume_data.get('projects', [])
        font_family = resume_data.get('font_family', 'Inter').lower()
        template_id = resume_data.get('template_id', 'modern-professional')

        # -------------------------------------------------------------
        # Gather text corpus
        # -------------------------------------------------------------
        bullet_points = []
        full_text_parts = [
            personal.get('full_name', ''),
            personal.get('professional_title', ''),
            personal.get('summary', ''),
        ]

        for exp in experiences:
            resp = exp.get('responsibilities', '')
            ach = exp.get('achievements', '')
            full_text_parts.extend([
                exp.get('company', ''),
                exp.get('job_title', ''),
                resp,
                ach
            ])
            if resp:
                bullet_points.extend([b.strip() for b in resp.split('\n') if len(b.strip()) > 5])
            if ach:
                bullet_points.extend([b.strip() for b in ach.split('\n') if len(b.strip()) > 5])

        for edu in educations:
            full_text_parts.extend([
                edu.get('degree', ''),
                edu.get('institution', ''),
                edu.get('description', '')
            ])

        skill_names = [s.get('name', '').strip() for s in skills if s.get('name')]
        full_text_parts.extend(skill_names)

        for p in projects:
            full_text_parts.extend([
                p.get('title', ''),
                p.get('description', ''),
                p.get('technologies', '')
            ])
            p_desc = p.get('description', '')
            if p_desc:
                bullet_points.extend([b.strip() for b in p_desc.split('\n') if len(b.strip()) > 5])

        raw_resume_text = " ".join([t for t in full_text_parts if t])
        resume_lower = raw_resume_text.lower()
        words = re.findall(r'\b[a-zA-Z0-9_\-\+\#\.]+\b', resume_lower)
        word_count = len(words)

        grammar_issues = []
        font_issues = []
        alignment_issues = []
        positive_checks = []

        # -------------------------------------------------------------
        # 1. GRAMMAR, SPELLING & SYNTAX AUDIT (0 - 100%)
        # -------------------------------------------------------------
        grammar_score = 100

        # A. Check Typos
        detected_typos = []
        for word in words:
            clean_w = word.strip('.,()')
            if clean_w in ATSService.COMMON_SPELLING_TYPOS:
                correct = ATSService.COMMON_SPELLING_TYPOS[clean_w]
                detected_typos.append(f"'{clean_w}' -> should be '{correct}'")

        if detected_typos:
            deduction = min(len(detected_typos) * 6, 25)
            grammar_score -= deduction
            grammar_issues.append(f"Spelling error(s) found: {', '.join(detected_typos[:4])}.")
        else:
            positive_checks.append("No common spelling errors detected.")

        # B. Check Passive Voice & Weak Phrases
        detected_passive = []
        for phrase in ATSService.PASSIVE_VOICE_PHRASES:
            if phrase in resume_lower:
                detected_passive.append(f"'{phrase}'")

        if detected_passive:
            deduction = min(len(detected_passive) * 5, 20)
            grammar_score -= deduction
            grammar_issues.append(f"Replace passive phrasing ({', '.join(detected_passive[:3])}) with decisive action verbs like 'Engineered' or 'Architected'.")
        else:
            positive_checks.append("Strong active voice used with minimal passive phrasing.")

        # C. Bullet point capitalization & punctuation consistency
        lowercase_bullet_count = 0
        unpunctuated_bullets = 0
        for bp in bullet_points:
            clean_b = re.sub(r'^[•\-\*\d\.\s]+', '', bp).strip()
            if clean_b and clean_b[0].isalpha() and clean_b[0].islower():
                lowercase_bullet_count += 1
            if clean_b and not clean_b.endswith(('.', ';', '!')):
                unpunctuated_bullets += 1

        if lowercase_bullet_count > 0:
            grammar_score -= min(lowercase_bullet_count * 4, 15)
            grammar_issues.append(f"{lowercase_bullet_count} bullet point(s) start with a lowercase letter. Start every bullet with a capitalized action verb.")

        if 0 < unpunctuated_bullets < len(bullet_points):
            grammar_score -= 5
            grammar_issues.append("Inconsistent punctuation at the end of bullet points. Ensure all bullets either consistently end with a period or omit it.")

        # D. Double spaces and repeated words
        if '  ' in raw_resume_text:
            grammar_score -= 4
            grammar_issues.append("Multiple consecutive whitespace characters detected.")

        repeated_word_matches = re.findall(r'\b([a-zA-Z]{3,})\s+\1\b', resume_lower)
        if repeated_word_matches:
            grammar_score -= 8
            grammar_issues.append(f"Accidental word repetition found: '{repeated_word_matches[0]} {repeated_word_matches[0]}'.")

        grammar_score = max(min(grammar_score, 100), 20)

        # -------------------------------------------------------------
        # 2. FONT, TYPOGRAPHY & LAYOUT AUDIT (0 - 100%)
        # -------------------------------------------------------------
        font_score = 100
        clean_font = font_family.strip().lower()

        # Check font compatibility with ATS
        is_safe_font = any(sf in clean_font for sf in ATSService.SAFE_ATS_FONTS)
        if is_safe_font:
            positive_checks.append(f"Standard ATS-compliant typography ({font_family.title()}) enables 100% OCR parser readability.")
        else:
            font_score -= 25
            font_issues.append(f"Custom font '{font_family}' may cause character encoding errors in legacy ATS software. Switch to Inter, Roboto, Arial, or Calibri.")

        # Check length & visual hierarchy
        if word_count < 150:
            font_score -= 25
            font_issues.append(f"Resume is very brief ({word_count} words). ATS scanners flag sparse pages for lack of technical depth.")
        elif word_count > 900:
            font_score -= 15
            font_issues.append(f"Resume is dense ({word_count} words). High likelihood of spilling across 2+ pages uncomfortably.")
        else:
            positive_checks.append(f"Optimal document length ({word_count} words) fits clean single/two page visual layout.")

        # Check font casing for technologies
        tech_casing_alerts = []
        for raw_kw, standard_casing in ATSService.COMMON_TECH_CASING.items():
            pattern = r'\b' + re.escape(raw_kw) + r'\b'
            matches = re.findall(pattern, raw_resume_text)
            for m in matches:
                if m != standard_casing and standard_casing not in tech_casing_alerts and len(tech_casing_alerts) < 4:
                    tech_casing_alerts.append(f"'{m}' -> '{standard_casing}'")

        if tech_casing_alerts:
            font_score -= min(len(tech_casing_alerts) * 4, 15)
            font_issues.append(f"Standardize industry casing for terms: {', '.join(tech_casing_alerts)}.")

        font_score = max(min(font_score, 100), 30)

        # -------------------------------------------------------------
        # 3. ALIGNMENT & STRUCTURAL INTEGRITY (0 - 100%)
        # -------------------------------------------------------------
        alignment_score = 100

        # Contact info check
        email = personal.get('email', '')
        phone = personal.get('phone', '')
        linkedin = personal.get('linkedin', '')
        github = personal.get('github', '')
        summary = personal.get('summary', '').strip()

        if not email or '@' not in email:
            alignment_score -= 20
            alignment_issues.append("Missing valid contact email. Recruiters and ATS bots cannot route interview invites.")
        else:
            positive_checks.append("Valid contact email verified.")

        if not phone or len(re.findall(r'\d', phone)) < 7:
            alignment_score -= 15
            alignment_issues.append("Contact telephone number missing or malformed.")
        else:
            positive_checks.append("Direct contact telephone number formatted.")

        if not linkedin:
            alignment_score -= 10
            alignment_issues.append("Missing LinkedIn URL. Recruiter searchability reduced by up to 40%.")

        if not summary or len(summary) < 40:
            alignment_score -= 15
            alignment_issues.append("Professional Summary section is missing or too short (<40 characters). Add a 3-4 sentence elevator pitch.")
        else:
            positive_checks.append("Engaging professional summary present.")

        # Experience structure
        if len(experiences) == 0:
            alignment_score -= 25
            alignment_issues.append("No work experience or internship entries provided.")
        else:
            # Check date alignments
            date_formats = []
            for exp in experiences:
                s_date = exp.get('start_date', '')
                e_date = exp.get('end_date', '')
                if not s_date or not e_date:
                    date_formats.append("missing")

            if date_formats:
                alignment_score -= 10
                alignment_issues.append("Incomplete start/end dates in experience timeline. ATS parser cannot compute years of experience.")
            else:
                positive_checks.append(f"{len(experiences)} experience role(s) chronologically aligned.")

        # Bullet point length alignment
        unbalanced_bullets = [b for b in bullet_points if len(b) < 30 or len(b) > 280]
        if len(unbalanced_bullets) > 2:
            alignment_score -= 12
            alignment_issues.append(f"{len(unbalanced_bullets)} bullet points are poorly balanced (either < 30 chars or > 280 chars). Aim for 1-2 lines per bullet.")

        alignment_score = max(min(alignment_score, 100), 25)

        # -------------------------------------------------------------
        # 4. TERMS, METRICS & KEYWORD RELEVANCE (0 - 100%)
        # -------------------------------------------------------------
        terms_score = 0
        matched_keywords = []
        missing_keywords = []

        # A. Action Verbs Count (max 25 pts)
        action_verb_count = sum(1 for verb in ATSService.ACTION_VERBS if verb in resume_lower)
        if action_verb_count >= 5:
            terms_score += 25
            positive_checks.append(f"Strong action verb variety ({action_verb_count}+ high-impact verbs).")
        elif action_verb_count >= 2:
            terms_score += 15
        elif action_verb_count == 1:
            terms_score += 8
        else:
            terms_score += 2

        # B. Metrics & Quantifiable Proof (max 25 pts)
        metric_matches = re.findall(r'(\d+[\%kmb\+]|\$\d+|\b\d+\s+(users|clients|projects|features|teams|ms|requests|services)\b)', resume_lower)
        metric_count = len(metric_matches)
        if metric_count >= 3:
            terms_score += 25
            positive_checks.append(f"High measurable impact ({metric_count}+ data points/percentages).")
        elif metric_count >= 1:
            terms_score += 15
        else:
            terms_score += 5

        # C. Technical Skills Density (max 25 pts)
        found_skills = set()
        for s in ATSService.COMMON_SKILLS_CORPUS:
            if s in resume_lower:
                found_skills.add(s)

        matched_skills_list = sorted(list(found_skills))
        if len(matched_skills_list) >= 10:
            terms_score += 25
        elif len(matched_skills_list) >= 5:
            terms_score += 18
        elif len(matched_skills_list) >= 2:
            terms_score += 10
        else:
            terms_score += 4

        # D. Job Description Alignment (max 25 pts)
        jd_provided = bool(job_description and len(job_description.strip()) > 20)
        if jd_provided:
            jd_lower = job_description.lower()
            jd_tokens = re.findall(r'\b[a-zA-Z0-9_\-\+\#\.]+\b', jd_lower)

            target_jd_terms = set()
            for token in jd_tokens:
                if token in ATSService.COMMON_SKILLS_CORPUS:
                    target_jd_terms.add(token)

            stopwords = {'with', 'that', 'this', 'from', 'have', 'more', 'will', 'your', 'about', 'some', 'their', 'which', 'would', 'could', 'work', 'year', 'experience', 'team', 'teams', 'skills', 'role', 'ability', 'looking', 'join', 'must', 'should', 'candidate', 'apply', 'opportunity'}
            meaningful_jd = [w for w in jd_tokens if len(w) > 3 and w not in stopwords]
            freq = Counter(meaningful_jd)
            for w, _ in freq.most_common(12):
                target_jd_terms.add(w)

            all_targets = list(target_jd_terms)
            for term in all_targets:
                if term in resume_lower:
                    matched_keywords.append(term)
                else:
                    missing_keywords.append(term)

            if all_targets:
                ratio = len(matched_keywords) / len(all_targets)
                terms_score += int(ratio * 25)
            else:
                terms_score += 15
        else:
            # Dynamic calculation based on candidate role and skill spread
            matched_keywords = matched_skills_list[:12]
            # Suggest next-level skills based on target role
            role_lower = (personal.get('professional_title', '') or '').lower()
            if 'frontend' in role_lower or 'react' in resume_lower:
                for candidate_kw in ['typescript', 'tailwind', 'redux', 'jest', 'next.js', 'ci/cd', 'webpack']:
                    if candidate_kw not in resume_lower:
                        missing_keywords.append(candidate_kw)
            elif 'data' in role_lower or 'python' in resume_lower:
                for candidate_kw in ['pandas', 'numpy', 'scikit-learn', 'docker', 'sql', 'tableau', 'aws']:
                    if candidate_kw not in resume_lower:
                        missing_keywords.append(candidate_kw)
            else:
                for candidate_kw in ['docker', 'kubernetes', 'aws', 'ci/cd', 'microservices', 'redis', 'postgresql']:
                    if candidate_kw not in resume_lower:
                        missing_keywords.append(candidate_kw)

            missing_keywords = missing_keywords[:6]
            terms_score += min(len(matched_skills_list) * 2, 22)

        terms_score = max(min(terms_score, 100), 20)

        # -------------------------------------------------------------
        # 5. OVERALL COMPOSITE WEIGHTED SCORE (0 - 100%)
        # -------------------------------------------------------------
        # Weighting: 35% Terms & Keywords, 25% Grammar & Syntax, 20% Font/Typography, 20% Alignment
        total_score = round(
            (0.35 * terms_score) +
            (0.25 * grammar_score) +
            (0.20 * font_score) +
            (0.20 * alignment_score)
        )
        total_score = max(min(total_score, 100), 10)

        # -------------------------------------------------------------
        # Actionable Recommendations
        # -------------------------------------------------------------
        recommendations = []
        if grammar_issues:
            recommendations.append(f"Grammar/Spelling: {grammar_issues[0]}")
        if missing_keywords:
            recommendations.append(f"Missing Keywords: Integrate critical terms like {', '.join(missing_keywords[:4])} into your experience bullet points.")
        if metric_count < 2:
            recommendations.append("Impact Metrics: Quantify achievements using the Google XYZ formula (e.g. 'Improved response time by 35% across 50k users').")
        if font_issues:
            recommendations.append(f"Typography: {font_issues[0]}")
        if alignment_issues:
            recommendations.append(f"Alignment: {alignment_issues[0]}")

        return {
            "score": total_score,
            "category_scores": {
                "terms": terms_score,
                "grammar": grammar_score,
                "font": font_score,
                "alignment": alignment_score,
                # Backwards compatible aliases for existing UI
                "structure": alignment_score,
                "content": terms_score
            },
            "matched_keywords": matched_keywords[:15],
            "missing_keywords": missing_keywords[:12],
            "grammar_issues": grammar_issues,
            "font_issues": font_issues,
            "alignment_issues": alignment_issues,
            "positive_checks": positive_checks,
            "formatting_issues": grammar_issues + font_issues + alignment_issues,
            "recommendations": recommendations,
            "word_count": word_count,
            "has_job_description": jd_provided,
            "font_family_detected": font_family.title(),
            "disclaimer": "Scored using multi-factor ATS criteria: Terms & Keyword Relevance, Grammar & Spelling, Font & Typography Compatibility, and Section Alignment."
        }
