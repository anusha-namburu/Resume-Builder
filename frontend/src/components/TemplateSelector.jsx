import React from 'react';
import { Layout, Check, Palette } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const TEMPLATES = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    category: 'Two-Column',
    description: 'Clean sidebar layout with deep navy accents and balanced white space.',
    previewBg: 'from-blue-900 to-slate-900',
    defaultColor: '#1e3a8a',
    colors: ['#1e3a8a', '#0f766e', '#3730a3', '#be123c', '#0f172a']
  },
  {
    id: 'classic-corporate',
    name: 'Classic Corporate',
    category: 'Executive & Finance',
    description: 'Timeless single-column layout with formal serif typography and borders.',
    previewBg: 'from-slate-800 to-slate-950',
    defaultColor: '#0f172a',
    colors: ['#0f172a', '#1e3a8a', '#78350f', '#334155', '#064e3b']
  },
  {
    id: 'minimal-ats',
    name: 'Minimal ATS-Friendly',
    category: 'High-Volume ATS',
    description: 'Ultra-clean single column structure designed for maximum parser readability.',
    previewBg: 'from-slate-700 to-slate-900',
    defaultColor: '#334155',
    colors: ['#334155', '#1e293b', '#1e3a8a', '#047857', '#475569']
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    category: 'Design & Media',
    description: 'Bold colored header banner, badge tags, and modern visual hierarchy.',
    previewBg: 'from-indigo-700 to-purple-900',
    defaultColor: '#4338ca',
    colors: ['#4338ca', '#7c3aed', '#ec4899', '#0284c7', '#0d9488']
  },
  {
    id: 'student-fresher',
    name: 'Student / Fresher',
    category: 'Entry-Level',
    description: 'Emphasizes education, GPA, coursework, academic projects, and certifications.',
    previewBg: 'from-sky-600 to-blue-800',
    defaultColor: '#0284c7',
    colors: ['#0284c7', '#059669', '#4f46e5', '#ea580c', '#0891b2']
  },
  {
    id: 'software-developer',
    name: 'Software Developer',
    category: 'Tech & Engineering',
    description: 'Tech stack pills, GitHub repositories, and system architecture metrics.',
    previewBg: 'from-emerald-700 to-teal-900',
    defaultColor: '#059669',
    colors: ['#059669', '#2563eb', '#7c3aed', '#d97706', '#0f172a']
  }
];

export const TemplateSelector = () => {
  const { currentResume, updateSettings } = useResume();
  const activeTemplateId = currentResume.template_id || 'modern-professional';
  const activeColor = currentResume.color_theme || '#1e3a8a';

  const currentTemplateObj = TEMPLATES.find((t) => t.id === activeTemplateId) || TEMPLATES[0];

  const handleSelectTemplate = (template) => {
    updateSettings('template_id', template.id);
    if (!currentResume.color_theme) {
      updateSettings('color_theme', template.defaultColor);
    }
  };

  const handleSelectColor = (hex) => {
    updateSettings('color_theme', hex);
  };

  return (
    <div className="space-y-5">
      {/* Accent Color Palette Selector */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Palette size={14} className="text-blue-600" />
            Template Accent Color
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase">{activeColor}</span>
        </div>
        <div className="flex items-center gap-2">
          {currentTemplateObj.colors.map((color, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectColor(color)}
              className="w-7 h-7 rounded-full border-2 border-white shadow-sm flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: color }}
              title={color}
            >
              {activeColor.toLowerCase() === color.toLowerCase() && (
                <Check size={13} className="text-white drop-shadow-xs" />
              )}
            </button>
          ))}
          {/* Custom color picker input */}
          <input
            type="color"
            value={activeColor}
            onChange={(e) => handleSelectColor(e.target.value)}
            className="w-7 h-7 rounded-full cursor-pointer border-0 p-0 ml-1 bg-transparent"
            title="Custom Color"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          Choose Resume Template (6 Available)
        </span>
        <div className="grid grid-cols-1 gap-3">
          {TEMPLATES.map((tmpl) => {
            const isSelected = activeTemplateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Visual Thumbnail */}
                <div className={`w-14 h-18 rounded-md bg-gradient-to-br ${tmpl.previewBg} shrink-0 p-1.5 flex flex-col justify-between text-white/90 shadow-2xs`}>
                  <div className="w-full h-1 bg-white/40 rounded-xs" />
                  <div className="space-y-0.5">
                    <div className="w-3/4 h-0.5 bg-white/50 rounded-xs" />
                    <div className="w-1/2 h-0.5 bg-white/30 rounded-xs" />
                  </div>
                  <div className="w-full h-0.5 bg-white/40 rounded-xs" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{tmpl.name}</span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        <Check size={10} /> Active
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 block mt-0.5">
                    {tmpl.category}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {tmpl.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
