import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Check, Sparkles, ArrowRight, Eye, Palette } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { resumeService } from '../services/api';

export const TemplatesPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [creating, setCreating] = useState(false);

  const templates = [
    {
      id: 'modern-professional',
      name: 'Modern Professional',
      category: 'Professional',
      description: 'Two-column clean layout with deep navy accents, clear visual hierarchy, and balanced white space.',
      recommended: ['Full-Stack Engineers', 'Project Managers', 'Tech Consultants'],
      previewColor: '#1e3a8a',
      popular: true,
    },
    {
      id: 'classic-corporate',
      name: 'Classic Corporate',
      category: 'Corporate',
      description: 'Single-column traditional layout with elegant borders, timeless serif typography, ideal for banking, law & consulting.',
      recommended: ['Financial Analysts', 'Legal Counsel', 'Executives', 'Operations Managers'],
      previewColor: '#0f172a',
      popular: false,
    },
    {
      id: 'minimal-ats',
      name: 'Minimal ATS-Friendly',
      category: 'ATS Optimized',
      description: 'Ultra-clean single-column layout strictly formatted to achieve maximum readability across automated recruitment systems.',
      recommended: ['Enterprise Applicants', 'Government Roles', 'High-Volume Applications'],
      previewColor: '#334155',
      popular: true,
    },
    {
      id: 'creative-designer',
      name: 'Creative Designer',
      category: 'Design & Media',
      description: 'Modern styled header banner, badge tags, and sleek visual layout for UX/UI designers, art directors, and creative professionals.',
      recommended: ['UI/UX Designers', 'Visual Artists', 'Content Strategists'],
      previewColor: '#4338ca',
      popular: false,
    },
    {
      id: 'student-fresher',
      name: 'Student / Fresher',
      category: 'Entry-Level',
      description: 'Emphasizes education, academic projects, certifications, internships and technical coursework for new grads.',
      recommended: ['College Students', 'Recent Graduates', 'Internship Seekers'],
      previewColor: '#0284c7',
      popular: true,
    },
    {
      id: 'software-developer',
      name: 'Software Developer',
      category: 'Tech & Engineering',
      description: 'Tech stack pills, GitHub repositories, system architecture highlights, and coding proficiencies tailored for engineers.',
      recommended: ['Backend Developers', 'DevOps Engineers', 'Data Scientists', 'System Architects'],
      previewColor: '#059669',
      popular: true,
    },
  ];

  const categories = ['All', 'Professional', 'Corporate', 'ATS Optimized', 'Design & Media', 'Entry-Level', 'Tech & Engineering'];

  const filtered = selectedCategory === 'All' 
    ? templates 
    : templates.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = async (templateId) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    setCreating(true);
    try {
      const res = await resumeService.create({
        title: `Resume (${templateId.replace('-', ' ')})`,
        template_id: templateId,
      });

      if (res.data?.success && res.data.resume) {
        navigate(`/editor/${res.data.resume.id}`);
      }
    } catch (err) {
      console.error('Create error:', err);
      navigate('/dashboard');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Engineered For High Impact
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            6 Recruiter-Approved Resume Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Every template is meticulously tuned to ensure full A4 page alignment, clean typography, and high ATS compatibility scores.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-premium transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Header preview thumbnail */}
              <div
                className="h-44 p-6 flex flex-col justify-between text-white relative"
                style={{ backgroundColor: t.previewColor }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">
                    {t.category}
                  </span>
                  {t.popular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                      Popular
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold">{t.name}</h3>
                  <p className="text-xs text-white/80 mt-0.5">A4 Standard • 1-2 Pages</p>
                </div>
              </div>

              {/* Content info */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t.description}
                  </p>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Ideal For:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {t.recommended.map((r, idx) => (
                        <span key={idx} className="text-[10.5px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUseTemplate(t.id)}
                  disabled={creating}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>Use This Template</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
