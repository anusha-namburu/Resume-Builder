import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, Sparkles, Loader2, Check } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { aiService } from '../../services/api';

export const ExperienceSection = () => {
  const { currentResume, addItemToSection, removeItemFromSection, updateItemInSection } = useResume();
  const experiences = currentResume.experiences || [];
  const [improvingIndex, setImprovingIndex] = useState(null);
  const [aiVariations, setAiVariations] = useState(null);

  const handleAddExperience = () => {
    addItemToSection('experiences', {
      company: '',
      job_title: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      responsibilities: '',
      achievements: ''
    });
  };

  const handleImproveBullet = async (index, text) => {
    if (!text || text.length < 5) return;
    setImprovingIndex(index);
    setAiVariations(null);
    try {
      const exp = experiences[index];
      const res = await aiService.improveBullet({
        bullet: text,
        role: exp?.job_title || currentResume.target_role || 'Professional'
      });
      if (res.data?.success && res.data?.data) {
        setAiVariations({
          index,
          variations: res.data.data.variations || [{ label: 'Enhanced', text: res.data.data.improved }]
        });
      }
    } catch (err) {
      console.error('Bullet improvement error:', err);
    } finally {
      setImprovingIndex(null);
    }
  };

  const applyBulletVariation = (index, improvedText) => {
    updateItemInSection('experiences', index, 'responsibilities', improvedText);
    setAiVariations(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="text-blue-600" size={18} />
            Work Experience
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Highlight your employment history, key responsibilities, and quantified impacts.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddExperience}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <Plus size={14} /> Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">No work experience entries added yet.</p>
          <button
            type="button"
            onClick={handleAddExperience}
            className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            + Add your first role
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Experience #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItemFromSection('experiences', idx)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Remove entry"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    value={exp.company || ''}
                    onChange={(e) => updateItemInSection('experiences', idx, 'company', e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Job Title *</label>
                  <input
                    type="text"
                    value={exp.job_title || ''}
                    onChange={(e) => updateItemInSection('experiences', idx, 'job_title', e.target.value)}
                    placeholder="e.g. Full-Stack Developer"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Location</label>
                  <input
                    type="text"
                    value={exp.location || ''}
                    onChange={(e) => updateItemInSection('experiences', idx, 'location', e.target.value)}
                    placeholder="e.g. New York, NY (or Remote)"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={exp.start_date || ''}
                      onChange={(e) => updateItemInSection('experiences', idx, 'start_date', e.target.value)}
                      placeholder="e.g. Jan 2022"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">End Date</label>
                    <input
                      type="text"
                      disabled={exp.is_current}
                      value={exp.is_current ? 'Present' : (exp.end_date || '')}
                      onChange={(e) => updateItemInSection('experiences', idx, 'end_date', e.target.value)}
                      placeholder="e.g. Present"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-exp-${idx}`}
                  checked={Boolean(exp.is_current)}
                  onChange={(e) => updateItemInSection('experiences', idx, 'is_current', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <label htmlFor={`current-exp-${idx}`} className="text-xs text-slate-600 font-medium">
                  I currently work here
                </label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-semibold text-slate-600">
                    Key Responsibilities & Bullet Points
                  </label>
                  <button
                    type="button"
                    onClick={() => handleImproveBullet(idx, exp.responsibilities)}
                    disabled={improvingIndex === idx || !exp.responsibilities}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-40"
                  >
                    {improvingIndex === idx ? (
                      <>
                        <Loader2 size={11} className="animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={11} />
                        AI Polish Bullets
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={exp.responsibilities || ''}
                  onChange={(e) => updateItemInSection('experiences', idx, 'responsibilities', e.target.value)}
                  placeholder="• Spearheaded the development of scalable REST APIs using Python and Flask..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Measurable Accomplishments / Results
                </label>
                <input
                  type="text"
                  value={exp.achievements || ''}
                  onChange={(e) => updateItemInSection('experiences', idx, 'achievements', e.target.value)}
                  placeholder="e.g. Reduced API latency by 35% through Redis caching; scaled app to 100k DAU."
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* AI Bullet Improvement Drawer */}
              {aiVariations && aiVariations.index === idx && (
                <div className="bg-blue-50/90 p-3 rounded-lg border border-blue-200 space-y-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                      <Sparkles size={12} className="text-blue-600" />
                      Suggested Action-Oriented Improvements:
                    </span>
                    <button
                      onClick={() => setAiVariations(null)}
                      className="text-[10px] text-slate-500 hover:text-slate-800"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {aiVariations.variations.map((v, vIdx) => (
                      <div key={vIdx} className="bg-white p-2 rounded border border-slate-200 text-xs flex justify-between items-center gap-2">
                        <span className="text-slate-700">{v.text}</span>
                        <button
                          type="button"
                          onClick={() => applyBulletVariation(idx, v.text)}
                          className="shrink-0 px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-semibold hover:bg-blue-700 flex items-center gap-0.5"
                        >
                          <Check size={10} /> Apply
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
