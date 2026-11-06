import io
import re
import zipfile
import xml.etree.ElementTree as ET
from app.services.ats_service import ATSService

class ResumeParserService:
    @staticmethod
    def extract_text_from_file(file_storage) -> str:
        """Extract plain text from uploaded PDF, DOCX, or text file."""
        filename = (file_storage.filename or '').lower()
        file_bytes = file_storage.read()
        file_storage.seek(0) # reset stream position

        if filename.endswith('.pdf'):
            return ResumeParserService._extract_from_pdf(file_bytes)
        elif filename.endswith('.docx'):
            return ResumeParserService._extract_from_docx(file_bytes)
        elif filename.endswith(('.txt', '.rtf', '.md', '.csv')):
            try:
                return file_bytes.decode('utf-8')
            except UnicodeDecodeError:
                return file_bytes.decode('latin-1', errors='ignore')
        else:
            # Attempt UTF-8, then fallback
            try:
                return file_bytes.decode('utf-8')
            except Exception:
                return ResumeParserService._extract_from_pdf(file_bytes)

    @staticmethod
    def _extract_from_pdf(file_bytes: bytes) -> str:
        text = ""
        # 1. Try pypdf
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            if text.strip():
                return text.strip()
        except Exception as e:
            print(f"pypdf extraction notice: {e}")

        # 2. Fallback: string heuristic search
        try:
            clean = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]', ' ', file_bytes.decode('latin-1', errors='ignore'))
            readable = " ".join([w for w in clean.split() if len(w) > 1 and re.match(r'^[a-zA-Z0-9@\.\,\-\:\/]+$', w)])
            if len(readable) > 100:
                return readable
        except Exception:
            pass

        return text.strip()

    @staticmethod
    def _extract_from_docx(file_bytes: bytes) -> str:
        # 1. Try python-docx
        try:
            import docx
            doc = docx.Document(io.BytesIO(file_bytes))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            for table in doc.tables:
                for row in table.rows:
                    for cell in row.cells:
                        if cell.text.strip():
                            paragraphs.append(cell.text.strip())
            return "\n".join(paragraphs)
        except Exception as e:
            print(f"python-docx extraction notice: {e}")

        # 2. Fallback: standard zipfile reading word/document.xml
        try:
            with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
                xml_content = z.read('word/document.xml')
                tree = ET.fromstring(xml_content)
                namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                texts = [node.text for node in tree.findall('.//w:t', namespaces) if node.text]
                return "\n".join(texts)
        except Exception as e:
            print(f"zipfile docx fallback failed: {e}")

        return ""

    @staticmethod
    def parse_to_resume_structure(raw_text: str, filename: str = "") -> dict:
        """
        Parses raw text into standard resume structure for ATS scoring and editor import.
        """
        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        
        # 1. Extract contact information
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}', raw_text)
        email = email_match.group(0) if email_match else ""

        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}', raw_text)
        phone = phone_match.group(0) if phone_match else ""

        linkedin_match = re.search(r'linkedin\.com/in/[\w\-]+', raw_text, re.IGNORECASE)
        linkedin = f"https://{linkedin_match.group(0)}" if linkedin_match else ""

        github_match = re.search(r'github\.com/[\w\-]+', raw_text, re.IGNORECASE)
        github = f"https://{github_match.group(0)}" if github_match else ""

        # Extract name: usually first non-empty line without header words
        full_name = ""
        for line in lines[:5]:
            clean_line = re.sub(r'[^a-zA-Z\s]', '', line).strip()
            lower = clean_line.lower()
            if any(skip in lower for skip in ['resume', 'curriculum', 'vitae', 'cv', 'page', 'email', 'phone', 'contact']):
                continue
            if 2 <= len(clean_line.split()) <= 4 and len(clean_line) < 40:
                full_name = clean_line
                break

        if not full_name and filename:
            # Deduce from filename like "Anusha_Namburu_Resume.pdf"
            clean_fn = re.sub(r'[\-_]', ' ', re.sub(r'\.[a-zA-Z0-9]+$', '', filename))
            clean_fn = re.sub(r'(resume|cv|updated|latest|draft)', '', clean_fn, flags=re.IGNORECASE).strip()
            if len(clean_fn) > 2:
                full_name = clean_fn.title()

        if not full_name:
            full_name = "Resume Applicant"

        # 2. Extract Skills
        detected_skills = []
        raw_lower = raw_text.lower()
        for skill in sorted(ATSService.COMMON_SKILLS_CORPUS, key=len, reverse=True):
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, raw_lower):
                detected_skills.append({
                    "name": skill.title() if len(skill) > 3 else skill.upper(),
                    "level": "Proficient",
                    "category": "Technical"
                })

        # 3. Extract Summary / Objective
        summary = ""
        summary_headers = ['professional summary', 'summary', 'about me', 'career objective', 'profile']
        for i, line in enumerate(lines):
            if any(line.lower().startswith(h) for h in summary_headers):
                # Take subsequent 1-3 lines
                next_lines = lines[i+1:i+5]
                summary = " ".join([l for l in next_lines if not any(l.lower().startswith(x) for x in ['experience', 'education', 'skills', 'projects'])])
                break

        if not summary and len(lines) > 2:
            # Take lines between contact info and first section header
            summary = " ".join(lines[1:3])

        # 4. Extract Experiences (basic chunking)
        experiences = []
        exp_indices = []
        for i, line in enumerate(lines):
            if any(kw in line.lower() for kw in ['experience', 'work history', 'employment', 'work experience']):
                exp_indices.append(i)

        if exp_indices:
            start = exp_indices[0] + 1
            exp_text = " ".join(lines[start:start+12])
            experiences.append({
                "job_title": "Professional Experience",
                "company": "Organization",
                "responsibilities": exp_text[:600],
                "achievements": "Demonstrated technical proficiency and team collaboration."
            })
        else:
            experiences.append({
                "job_title": "Applicant / Contributor",
                "company": "Various Projects",
                "responsibilities": raw_text[:500],
                "achievements": ""
            })

        # 5. Extract Education
        educations = []
        edu_matches = re.findall(r'(bachelor|master|b\.tech|b\.e\.|m\.tech|degree|diploma|university|college|institute)[\w\s\,\.]+', raw_text, re.IGNORECASE)
        if edu_matches:
            educations.append({
                "degree": edu_matches[0][:60].strip().title(),
                "institution": "University / College",
                "description": "Graduated with relevant coursework and technical specialization."
            })
        else:
            educations.append({
                "degree": "Higher Education",
                "institution": "University / College",
                "description": ""
            })

        return {
            "title": f"{full_name}'s Uploaded Resume",
            "target_role": "Software Professional",
            "personal_info": {
                "full_name": full_name,
                "email": email or "applicant@example.com",
                "phone": phone or "+1 555-0199",
                "linkedin": linkedin,
                "github": github,
                "summary": summary[:400] if summary else "Results-driven professional with hands-on technical expertise.",
                "professional_title": "Software Professional"
            },
            "experiences": experiences,
            "educations": educations,
            "skills": detected_skills[:15] if detected_skills else [{"name": "Problem Solving", "level": "Proficient"}],
            "projects": [
                {
                    "title": "Technical Project Portfolio",
                    "description": raw_text[:300],
                    "technologies": ", ".join([s["name"] for s in detected_skills[:5]])
                }
            ],
            "raw_text": raw_text
        }
