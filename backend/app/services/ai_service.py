import os
import re
import json
import requests
from flask import current_app

class AIService:
    @staticmethod
    def _call_gemini_api(prompt, system_instruction=None):
        """Call Google Gemini REST API if GEMINI_API_KEY is configured."""
        api_key = current_app.config.get('GEMINI_API_KEY') or os.getenv('GEMINI_API_KEY')
        if not api_key:
            return None
        
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 800
                }
            }
            if system_instruction:
                payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}
                
            response = requests.post(url, headers=headers, json=payload, timeout=12)
            if response.status_code == 200:
                data = response.json()
                text = data['candidates'][0]['content']['parts'][0]['text']
                return text.strip()
        except Exception as e:
            print(f"Gemini API call failed or timed out: {e}")
        return None

    @staticmethod
    def generate_summary(role, experience_years=None, key_skills=None, target_industry=None):
        system_prompt = (
            "You are an expert executive resume writer and career coach. "
            "Write a compelling, concise 3-4 sentence professional summary. "
            "Highlight core strengths, impact, and technical proficiencies without exaggerating or making up fake credentials."
        )
        user_prompt = f"Role: {role or 'Professional'}. "
        if experience_years:
            user_prompt += f"Experience: {experience_years}. "
        if key_skills:
            user_prompt += f"Key Skills: {key_skills}. "
        if target_industry:
            user_prompt += f"Industry: {target_industry}. "
        user_prompt += "Generate 3 distinct variations: 1. Impact-Driven, 2. Technical & Specialized, 3. Leadership & Growth."

        gemini_result = AIService._call_gemini_api(user_prompt, system_prompt)
        if gemini_result:
            return {
                "source": "gemini",
                "summary": gemini_result,
                "variations": [
                    {"label": "Standard & Impact", "text": gemini_result}
                ]
            }

        # High-quality smart heuristic fallback
        role_title = role.strip() if role else "Results-driven Professional"
        skills_str = key_skills if key_skills else "strategic problem solving, cross-functional collaboration, and technical execution"
        
        var1 = f"Dedicated and detail-oriented {role_title} with proven expertise in {skills_str}. Adept at designing scalable solutions, driving efficiency, and delivering high-quality outcomes in fast-paced environments. Committed to continuous learning, operational excellence, and contributing to high-impact organizational objectives."
        
        var2 = f"Dynamic {role_title} with a strong foundation in {skills_str}. Recognized for proactive analytical thinking, seamless cross-team communication, and delivering projects on schedule. Passionate about leveraging modern industry best practices to streamline workflows and drive sustainable performance."
        
        var3 = f"Accomplished {role_title} known for solving complex technical and business challenges through {skills_str}. Combines solid hands-on competencies with structured methodologies to elevate product standards and maximize team velocity."

        return {
            "source": "smart_nlp",
            "summary": var1,
            "variations": [
                {"label": "Impact & Results-Oriented", "text": var1},
                {"label": "Technical & Skills-Focused", "text": var2},
                {"label": "Comprehensive & Balanced", "text": var3}
            ]
        }

    @staticmethod
    def improve_bullet_point(bullet_text, role=None):
        if not bullet_text or len(bullet_text.strip()) < 5:
            return {"error": "Please provide a valid sentence or bullet point to improve."}

        system_prompt = (
            "You are a professional resume editor. Rewrite the following resume bullet point using the Google XYZ formula: "
            "'Accomplished [X] as measured by [Y], by doing [Z]'. Start with a powerful action verb, quantify achievements where appropriate, "
            "and eliminate weak filler words. Return 3 improved variations."
        )
        user_prompt = f"Role: {role or 'General'}\nOriginal bullet: {bullet_text}"

        gemini_result = AIService._call_gemini_api(user_prompt, system_prompt)
        if gemini_result:
            return {
                "source": "gemini",
                "improved": gemini_result,
                "original": bullet_text
            }

        # Smart NLP enhancement engine
        clean_text = bullet_text.strip().rstrip('.')
        action_verbs = ["Spearheaded", "Architected", "Engineered", "Orchestrated", "Accelerated", "Streamlined", "Optimized", "Delivered"]
        
        # Replace weak verbs
        weak_verbs_map = {
            r'\bworked on\b': 'engineered and maintained',
            r'\bhelped with\b': 'collaborated across cross-functional teams to deliver',
            r'\bresponsible for\b': 'successfully owned and directed',
            r'\bdid\b': 'executed high-impact initiatives for',
            r'\bmade\b': 'architected and deployed',
            r'\bhandled\b': 'managed end-to-end delivery of',
            r'\bmanaged\b': 'orchestrated lifecycle operations for'
        }
        
        enhanced = clean_text
        for pattern, replacement in weak_verbs_map.items():
            enhanced = re.sub(pattern, replacement, enhanced, flags=re.IGNORECASE)
            
        var1 = f"Spearheaded key initiatives to {enhanced.lower() if enhanced[0].isupper() else enhanced}, enhancing operational efficiency and overall delivery quality."
        var2 = f"Streamlined workflows by actively {enhanced.lower() if enhanced[0].isupper() else enhanced}; successfully reduced cycle times and elevated system reliability."
        var3 = f"Architected and deployed solutions for {enhanced.lower() if enhanced[0].isupper() else enhanced}, driving measurable improvements in team productivity and output."

        return {
            "source": "smart_nlp",
            "original": bullet_text,
            "variations": [
                {"label": "Action-Oriented & Leadership", "text": var1},
                {"label": "Process Optimization & Efficiency", "text": var2},
                {"label": "Technical Architecture & Scalability", "text": var3}
            ]
        }

    @staticmethod
    def rewrite_description(text, context_type="experience"):
        system_prompt = (
            "You are an ATS-compliant resume specialist. Rewrite the following description into polished, professional bullet points or clean prose. "
            "Keep it concise, active, and impactful without fabricating facts."
        )
        user_prompt = f"Context: {context_type}\nOriginal Content: {text}"
        gemini_result = AIService._call_gemini_api(user_prompt, system_prompt)
        if gemini_result:
            return {"source": "gemini", "rewritten": gemini_result}

        # Smart formatting fallback
        lines = [line.strip().lstrip('-*• ') for line in text.split('\n') if line.strip()]
        improved_lines = []
        for line in lines:
            if not line.endswith('.'):
                line += '.'
            improved_lines.append(f"• Successfully executed {line[0].lower() + line[1:]}")

        return {
            "source": "smart_nlp",
            "rewritten": "\n".join(improved_lines) if improved_lines else text
        }

    @staticmethod
    def suggest_skills(job_title, category="all"):
        job_lower = (job_title or "").lower()
        skills_db = {
            "software": {
                "technical": ["React.js", "Node.js", "Python", "TypeScript", "REST APIs", "Docker", "Git / GitHub", "PostgreSQL", "MongoDB", "CI/CD", "AWS", "Microservices"],
                "soft": ["Problem Solving", "Agile / Scrum", "Code Review", "Cross-Functional Collaboration", "System Architecture", "Continuous Learning"]
            },
            "frontend": {
                "technical": ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 & CSS3", "Redux Toolkit", "Webpack / Vite", "RESTful APIs", "Jest", "Responsive Design"],
                "soft": ["Attention to Detail", "User Empathy", "Design System Thinking", "Communication", "Time Management"]
            },
            "backend": {
                "technical": ["Python / Flask / Django", "Node.js / Express", "MySQL", "PostgreSQL", "Redis", "Docker", "GraphQL", "REST APIs", "OAuth2 / JWT", "Kafka"],
                "soft": ["System Design", "Scalability Optimization", "Root Cause Analysis", "Documentation", "Team Mentorship"]
            },
            "data": {
                "technical": ["Python", "SQL", "Pandas & NumPy", "Tableau / PowerBI", "Scikit-Learn", "Data Warehousing", "ETL Pipelines", "Apache Spark", "Machine Learning"],
                "soft": ["Data Storytelling", "Critical Thinking", "Business Acumen", "Hypothesis Testing", "Presentation Skills"]
            },
            "product": {
                "technical": ["Jira / Confluence", "Roadmapping", "A/B Testing", "Figma", "User Journey Mapping", "KPI Tracking", "Google Analytics", "SQL Basics"],
                "soft": ["Stakeholder Management", "Prioritization", "Strategic Vision", "Conflict Resolution", "User Research"]
            },
            "marketing": {
                "technical": ["SEO / SEM", "Google Analytics 4", "Content Strategy", "Email Marketing", "HubSpot", "Social Media Campaigns", "Copywriting", "Paid Ads (PPC)"],
                "soft": ["Creativity", "Market Research", "Brand Consistency", "Audience Engagement", "Adaptability"]
            },
            "design": {
                "technical": ["Figma", "Adobe XD", "Wireframing & Prototyping", "Design Systems", "User Research", "Usability Testing", "Typography & Color Theory"],
                "soft": ["User-Centric Mindset", "Visual Storytelling", "Collaboration", "Constructive Feedback", "Iterative Design"]
            }
        }

        # Match category or default
        matched = None
        for key in skills_db:
            if key in job_lower:
                matched = skills_db[key]
                break
        if not matched:
            matched = skills_db["software"]

        return {
            "job_title": job_title,
            "technical_skills": matched["technical"],
            "soft_skills": matched["soft"],
            "recommended": matched["technical"][:6] + matched["soft"][:4]
        }

    @staticmethod
    def optimize_for_job_description(resume_text, job_description):
        if not job_description or len(job_description.strip()) < 20:
            return {"error": "Please provide a detailed job description."}

        system_prompt = (
            "Analyze the provided resume text against the target job description. "
            "Identify matched requirements, missing critical keywords, and provide 4 actionable sentences to optimize the resume."
        )
        user_prompt = f"RESUME:\n{resume_text}\n\nTARGET JOB DESCRIPTION:\n{job_description}"
        gemini_result = AIService._call_gemini_api(user_prompt, system_prompt)
        
        if gemini_result:
            return {
                "source": "gemini",
                "analysis": gemini_result
            }

        # Built-in keyword extractor and optimizer
        jd_words = re.findall(r'\b[a-zA-Z]{3,}\b', job_description.lower())
        resume_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', resume_text.lower()))
        
        # Stop words filter
        stopwords = {'with', 'that', 'this', 'from', 'have', 'more', 'will', 'your', 'about', 'some', 'their', 'which', 'would', 'could', 'work', 'year', 'experience', 'team', 'teams', 'skills', 'role', 'ability', 'looking', 'join', 'must', 'should'}
        filtered_jd_words = [w for w in jd_words if w not in stopwords]
        
        # Frequency count
        from collections import Counter
        freq = Counter(filtered_jd_words)
        top_jd_keywords = [word for word, count in freq.most_common(20)]
        
        matched = [k for k in top_jd_keywords if k in resume_words]
        missing = [k for k in top_jd_keywords if k not in resume_words][:8]
        
        match_rate = int((len(matched) / max(len(top_jd_keywords), 1)) * 100)
        
        recommendations = [
            f"Integrate missing high-frequency keywords like '{', '.join(missing[:4])}' in your professional summary and experience bullet points.",
            "Align your job titles or headline with the specific terminology used in the target job posting.",
            "Quantify key accomplishments (e.g. % efficiency gains, dollar revenue, team size, scale) to prove concrete business impact.",
            "Ensure technical skills are explicitly enumerated in a dedicated Skills section rather than solely referenced in paragraphs."
        ]

        return {
            "source": "smart_nlp",
            "match_rate": match_rate,
            "matched_keywords": matched,
            "missing_keywords": missing,
            "recommendations": recommendations
        }
