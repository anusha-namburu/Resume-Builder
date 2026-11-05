import unittest
import json
import time
import random
from app import create_app
from app.models import db, User, Resume

class ResumeBuilderAPITest(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    def test_create_app_requires_signing_keys(self):
        class MissingSigningKeys:
            SECRET_KEY = None
            JWT_SECRET_KEY = None

        with self.assertRaisesRegex(RuntimeError, 'SECRET_KEY, JWT_SECRET_KEY'):
            create_app(MissingSigningKeys)

    def test_01_health_check(self):
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'healthy')
        print("[PASS] Health check API passed")

    def test_02_register_and_login(self):
        email = f"testuser_{int(time.time())}_{random.randint(100, 999)}@example.com"
        reg_payload = {
            "name": "Jane Developer",
            "email": email,
            "password": "Password123!",
            "headline": "Lead Cloud Architect"
        }
        reg_res = self.client.post('/api/auth/register', json=reg_payload)
        self.assertEqual(reg_res.status_code, 201)
        
        login_res = self.client.post('/api/auth/login', json={
            "email": email,
            "password": "Password123!"
        })
        self.assertEqual(login_res.status_code, 200)
        data = json.loads(login_res.data)
        self.assertTrue(data['success'])
        self.assertIn('token', data)
        print("[PASS] Authentication (Register + Login + JWT) passed")
        return data['token']

    def test_03_templates_list(self):
        res = self.client.get('/api/templates')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertGreaterEqual(len(data['templates']), 6)
        print(f"[PASS] Templates API returned {len(data['templates'])} templates")

    def test_04_resume_lifecycle(self):
        token = self.test_02_register_and_login()
        headers = {'Authorization': f'Bearer {token}'}

        # 1. Create Resume
        create_res = self.client.post('/api/resumes', headers=headers, json={
            "title": "Cloud Architect 2026",
            "template_id": "software-developer",
            "target_role": "Senior Cloud Engineer"
        })
        self.assertEqual(create_res.status_code, 201)
        create_data = json.loads(create_res.data)
        resume_id = create_data['resume']['id']
        self.assertIsNotNone(resume_id)

        # 2. Get Resume
        get_res = self.client.get(f'/api/resumes/{resume_id}', headers=headers)
        self.assertEqual(get_res.status_code, 200)
        get_data = json.loads(get_res.data)
        self.assertEqual(get_data['resume']['template_id'], 'software-developer')

        # 3. Update Resume
        update_res = self.client.put(f'/api/resumes/{resume_id}', headers=headers, json={
            "title": "Cloud Architect (Updated)",
            "personal_info": {
                "full_name": "Jane Cloud Dev",
                "email": "jane@cloud.io",
                "phone": "+1 555 999 8888",
                "professional_title": "Principal Architect",
                "summary": "Proven executive engineer with 8+ years scaling infrastructure on AWS and Kubernetes."
            },
            "skills": [
                {"name": "AWS", "category": "Technical", "level": "Expert"},
                {"name": "Kubernetes", "category": "Technical", "level": "Expert"},
                {"name": "Python", "category": "Technical", "level": "Proficient"}
            ]
        })
        self.assertEqual(update_res.status_code, 200)
        print("[PASS] Resume Lifecycle (Create -> Get -> Update) passed")

        # 4. Duplicate Resume
        dup_res = self.client.post(f'/api/resumes/{resume_id}/duplicate', headers=headers)
        self.assertEqual(dup_res.status_code, 201)
        print("[PASS] Resume Duplication passed")

        # 5. ATS Scanner
        ats_res = self.client.post('/api/ats/analyze', headers=headers, json={
            "resume_id": resume_id,
            "job_description": "We are seeking a Principal Architect with deep experience in AWS, Kubernetes, Docker, and CI/CD pipelines to scale distributed systems."
        })
        self.assertEqual(ats_res.status_code, 200)
        ats_data = json.loads(ats_res.data)
        self.assertTrue(ats_data['success'])
        self.assertGreater(ats_data['data']['score'], 0)
        self.assertIn('aws', [k.lower() for k in ats_data['data']['matched_keywords']])
        print(f"[PASS] ATS Scanner passed (Score: {ats_data['data']['score']})")

        # 6. AI Suggestions
        ai_sum_res = self.client.post('/api/ai/summary', headers=headers, json={
            "role": "Principal Cloud Architect",
            "experience_years": "8+ years",
            "key_skills": "AWS, Kubernetes, Terraform"
        })
        self.assertEqual(ai_sum_res.status_code, 200)
        ai_data = json.loads(ai_sum_res.data)
        self.assertTrue(ai_data['success'])
        self.assertIn('summary', ai_data['data'])
        print("[PASS] AI Summary Generation passed")

        # 7. AI Bullet Polish
        ai_bul_res = self.client.post('/api/ai/bullet', headers=headers, json={
            "bullet": "Worked on the server and made it faster.",
            "role": "Backend Engineer"
        })
        self.assertEqual(ai_bul_res.status_code, 200)
        print("[PASS] AI Bullet Point Enhancement passed")

        # 8. PDF Download Stream
        pdf_res = self.client.get(f'/api/pdf/{resume_id}', headers=headers)
        self.assertEqual(pdf_res.status_code, 200)
        self.assertEqual(pdf_res.mimetype, 'application/pdf')
        self.assertGreater(len(pdf_res.data), 1000)
        print(f"[PASS] PDF Generation passed (Streamed {len(pdf_res.data)} bytes A4 PDF)")

if __name__ == '__main__':
    unittest.main()
