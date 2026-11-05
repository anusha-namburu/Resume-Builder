import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Download, 
  FileText, Zap, Star, ChevronDown, ChevronUp, Eye, Compass, Layout
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState('modern-professional');

  const faqs = [
    {
      q: 'How does the AI Resume Assistant help me write my resume?',
      a: 'Our AI analyzes your job role, target industry, and key strengths to generate compelling 3-4 sentence professional summaries, rewrite weak bullet points using the Google XYZ formula (Accomplished [X] measured by [Y] by doing [Z]), and recommend role-specific skills.'
    },
    {
      q: 'Will my resume pass Applicant Tracking Systems (ATS)?',
      a: 'Yes! All 6 templates are built using standard typography, readable heading hierarchies, and parseable section blocks. Our built-in ATS Keyword Scanner also tests your resume against actual job descriptions to report matching keywords, gaps, and an estimated compatibility score.'
    },
    {
      q: 'Can I download my resume as a PDF for free?',
      a: 'Yes, absolutely. You can download print-ready, high-resolution A4 PDFs with selectable text, standard margins, and zero watermarks at any time.'
    },
    {
      q: 'Can I customize the resume templates with my own colors?',
      a: 'Yes! You can choose from our curated color palettes (navy, royal blue, emerald, indigo, slate) or pick any custom hex code to align with your personal brand.'
    },
    {
      q: 'Is my data secure?',
      a: 'Your personal information and resumes are stored securely using salted password hashing, JWT authorization, and encrypted REST APIs. We never sell or share your data.'
    }
  ];

  const templatesList = [
    { id: 'modern-professional', name: 'Modern Professional', tag: 'Most Popular', role: 'Full-Stack Developer', color: '#1e3a8a' },
    { id: 'classic-corporate', name: 'Classic Corporate', tag: 'Executive Choice', role: 'Finance Director', color: '#0f172a' },
    { id: 'minimal-ats', name: 'Minimal ATS-Friendly', tag: 'Maximum Parser Score', role: 'Data Analyst', color: '#334155' },
    { id: 'creative-designer', name: 'Creative Designer', tag: 'Visual Impact', role: 'UI/UX Lead', color: '#4338ca' },
    { id: 'student-fresher', name: 'Student / Fresher', tag: 'Entry-Level Focus', role: 'Computer Science Grad', color: '#0284c7' },
    { id: 'software-developer', name: 'Software Developer', tag: 'Tech Stack Pills', role: 'DevOps & Cloud Engineer', color: '#059669' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 shadow-2xs">
                <Sparkles size={14} className="text-blue-600" />
                <span>Next-Gen AI Resume Builder & ATS Checker</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Build a Resume That <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-600">
                  Gets You Hired
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Craft job-winning, recruiter-approved resumes in minutes with AI summary generation, Google XYZ bullet point enhancement, real-time ATS keyword matching, and pixel-perfect PDF export.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Build My Resume Free</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/templates"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  <Layout size={16} className="text-slate-500" />
                  <span>Explore 6 Templates</span>
                </Link>
              </div>

              {/* Proof badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={15} className="text-emerald-600" /> No Credit Card Required
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={15} className="text-emerald-600" /> ATS-Friendly Formatting
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={15} className="text-emerald-600" /> High-Resolution PDF
                </span>
              </div>
            </div>

            {/* Right Column: Hero Preview Illustration */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating Decorative Elements */}
                <div className="absolute -top-6 -left-6 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-20 animate-bounce duration-1000">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">ATS Score</span>
                    <span className="text-sm font-black text-slate-800">96 / 100 Optimized</span>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Rewriter</span>
                    <span className="text-xs font-bold text-slate-800">Bullet points polished</span>
                  </div>
                </div>

                {/* Resume Card Preview */}
                <div className="bg-white rounded-2xl shadow-resume border border-slate-200/80 p-5 overflow-hidden transition-all">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-[11px] text-slate-500">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText size={13} className="text-blue-600" /> Live Resume Preview
                    </span>
                    <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                      A4 Standard
                    </span>
                  </div>

                  {/* Mini resume mock layout */}
                  <div className="mt-4 p-4 rounded-xl bg-slate-50/70 border border-slate-100 text-left space-y-3 font-sans">
                    <div className="border-b pb-2" style={{ borderColor: '#1e3a8a' }}>
                      <div className="h-5 w-40 bg-blue-900 rounded font-bold text-white text-xs px-2 flex items-center">
                        Alex Morgan
                      </div>
                      <div className="text-[10px] text-slate-600 font-semibold mt-1">
                        Senior Full-Stack Software Engineer • San Francisco, CA
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[9px] font-bold uppercase text-blue-900 tracking-wider">
                        Professional Summary
                      </div>
                      <p className="text-[9.5px] text-slate-600 leading-snug">
                        Results-driven engineer with 5+ years of experience architecting distributed cloud systems, high-concurrency microservices, and modern web applications.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[9px] font-bold uppercase text-blue-900 tracking-wider">
                        Experience
                      </div>
                      <div className="text-[9.5px] font-bold text-slate-800">
                        Lead Engineer — Innovatech Corp (2022 - Present)
                      </div>
                      <p className="text-[9px] text-slate-600 leading-tight">
                        • Scaled backend API infrastructure handling 1.2M daily transactions, reducing average latency by 38%.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[9px] font-bold uppercase text-blue-900 tracking-wider">
                        Skills
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {['React.js', 'Python', 'Flask', 'MySQL', 'Docker', 'AWS'].map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-blue-100 text-blue-900 rounded text-[8.5px] font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Powerful Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Land Interviews
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Built by senior engineers and hiring managers to help applicants stand out from thousands of generic resumes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-premium transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Sparkles size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Resume Assistant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically generate tailored professional summaries, turn passive job descriptions into measurable accomplishments, and refine language with tone enhancement.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-premium transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">ATS Keyword Matcher</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste any job description to discover missing required skills, keyword density match, and an actionable compatibility scorecard before submitting your application.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-premium transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Download size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Pixel-Perfect PDF Export</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download cleanly formatted A4 resumes with selectable text, standard margins, and zero layout shift between editor preview and final PDF output.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-premium transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Layout size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">6 Designer Templates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose from Modern Professional, Classic Corporate, Minimal ATS-Friendly, Creative Designer, Student / Fresher, and Software Developer layouts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-premium transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Zap size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Instant Live Preview</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Watch your resume adapt immediately as you type. Switch templates and accent color palettes dynamically with zero page reloads.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-premium transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Compass size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Multi-Step Resume Builder</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured sections for Education, Work Experience, Internships, Projects, Technical & Soft Skills, Certifications, and Extracurricular Achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Blank Page to Dream Job in 10 Minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-center sm:text-left">
              <span className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm mx-auto sm:mx-0">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900">Select a Proven Template</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick a recruiter-tested layout that matches your industry, whether software engineering, corporate executive, or new college grad.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-center sm:text-left">
              <span className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm mx-auto sm:mx-0">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900">Add Content with AI Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fill in your details or let our AI generate professional summaries, suggest high-demand skills, and rewrite weak bullet points.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-center sm:text-left">
              <span className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm mx-auto sm:mx-0">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900">Scan ATS & Export PDF</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Run the built-in ATS compatibility check against your target job post, fix missing keywords, and download your clean PDF ready to apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Template Gallery
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Designed for Every Career Stage
              </h2>
            </div>
            <Link
              to="/templates"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View all 6 templates <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templatesList.map((t) => (
              <div
                key={t.id}
                className="group rounded-2xl border border-slate-200 overflow-hidden bg-white hover:shadow-premium transition-all flex flex-col"
              >
                <div 
                  className="h-44 p-6 flex flex-col justify-between text-white relative"
                  style={{ backgroundColor: t.color }}
                >
                  <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                    {t.tag}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{t.name}</h3>
                    <p className="text-xs text-white/80">{t.role}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between text-xs border-t border-slate-100 bg-slate-50/50">
                  <span className="font-semibold text-slate-600">A4 • 1-2 Pages • ATS Ready</span>
                  <Link
                    to="/register"
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Use Template <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              User Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Trusted by 50,000+ Job Seekers
            </h2>
            <p className="text-slate-400 text-sm">
              Read how candidates landed interviews at top tech firms, Fortune 500 corporations, and high-growth startups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "The ATS checker alone is worth its weight in gold. I pasted the Google job description, found 6 missing keywords, and got a callback within 48 hours."
              </p>
              <div>
                <span className="font-bold text-sm block">David Chen</span>
                <span className="text-xs text-slate-400">Software Engineer @ Tech Unicorn</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "As a college senior with minimal full-time experience, the Student/Fresher template and AI bullet suggestions helped me articulate my hackathons and projects cleanly."
              </p>
              <div>
                <span className="font-bold text-sm block">Priya Sharma</span>
                <span className="text-xs text-slate-400">Associate Product Manager</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "The live side-by-side preview with instant PDF download saved me hours. The design is sleek, modern, and looks 10x more polished than Microsoft Word."
              </p>
              <div>
                <span className="font-bold text-sm block">Marcus Wright</span>
                <span className="text-xs text-slate-400">Senior Financial Analyst</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-all bg-slate-50/50"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex justify-between items-center text-xs font-bold text-slate-800 hover:text-blue-600"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Build Your Winning Resume?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            Join thousands of professionals landing interviews today. Start free with our AI resume generator and 6 ATS-optimized templates.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-blue-900 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles size={16} className="text-blue-600" />
              Create My Free Resume Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
