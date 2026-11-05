import React, { useState } from 'react';
import { X, Sparkles, Send, Copy, Check, FileText, Briefcase, Cpu, ShieldAlert, Loader2 } from 'lucide-react';
import { aiService } from '../services/api';
import { useResume } from '../context/ResumeContext';

export const AIModal = ({ isOpen, onClose }) => {
  const { currentResume, updatePersonalInfo, updateSectionList } = useResume();
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'bullet' | 'rewrite' | 'skills' | 'jd'
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  // Form states
  const [roleInput, setRoleInput] = useState(currentResume?.target_role || currentResume?.personal_info?.professional_title || '');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [bulletInput, setBulletInput] = useState('');
  const [rewriteInput, setRewriteInput] = useState('');
  const [jdInput, setJdInput] = useState('');

  // Results
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplySummary = (text) => {
    updatePersonalInfo('summary', text);
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (activeTab === 'summary') {
        const skillsStr = (currentResume.skills || []).map((s) => s.name).join(', ');
        const res = await aiService.generateSummary({
          role: roleInput || 'Software Engineer',
          experience_years: experienceLevel,
          key_skills: skillsStr
        });
        if (res.data?.success) setResult(res.data.data);
      } else if (activeTab === 'bullet') {
        const res = await aiService.improveBullet({
          bullet: bulletInput,
          role: roleInput
        });
        if (res.data?.success) setResult(res.data.data);
      } else if (activeTab === 'rewrite') {
        const res = await aiService.rewriteDescription({
          text: rewriteInput,
          context_type: 'experience'
        });
        if (res.data?.success) setResult(res.data.data);
      } else if (activeTab === 'skills') {
        const res = await aiService.suggestSkills({
          job_title: roleInput || 'Full-Stack Developer'
        });
        if (res.data?.success) setResult(res.data.data);
      } else if (activeTab === 'jd') {
        const resumeRaw = JSON.stringify(currentResume);
        const res = await aiService.optimizeJD({
          resume_text: resumeRaw,
          job_description: jdInput
        });
        if (res.data?.success) setResult(res.data.data);
      }
    } catch (err) {
      console.error('AI assistant error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Sparkles size={20} className="text-blue-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">AI Resume Assistant</h2>
              <p className="text-xs text-blue-200">Instant resume polishing, bullet improvement & JD optimization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'summary', label: 'Summary Generator', icon: FileText },
            { id: 'bullet', label: 'Bullet Improver', icon: Briefcase },
            { id: 'rewrite', label: 'Rewrite & Tone', icon: Sparkles },
            { id: 'skills', label: 'Suggest Skills', icon: Cpu },
            { id: 'jd', label: 'JD Optimizer', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setResult(null);
                }}
                className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? 'border-blue-600 text-blue-700 font-bold bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'summary' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Professional Role</label>
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Entry-Level / Fresher (0-1 yrs)">Entry-Level / Fresher (0-1 yrs)</option>
                  <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
                  <option value="Senior / Lead (5-10 yrs)">Senior / Lead (5-10 yrs)</option>
                  <option value="Executive / Director (10+ yrs)">Executive / Director (10+ yrs)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'bullet' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paste a Weak or Draft Bullet Point:
                </label>
                <textarea
                  rows={3}
                  value={bulletInput}
                  onChange={(e) => setBulletInput(e.target.value)}
                  placeholder="e.g. Worked on the website and fixed bugs and made it faster."
                  className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>
            </div>
          )}

          {activeTab === 'rewrite' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Text to Polish & Grammar-Check:
                </label>
                <textarea
                  rows={4}
                  value={rewriteInput}
                  onChange={(e) => setRewriteInput(e.target.value)}
                  placeholder="Paste paragraph or notes here to transform into high-impact ATS bullet points..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title / Domain</label>
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="e.g. Frontend Developer, Data Scientist, Product Manager"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'jd' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Job Description (Paste Here):
                </label>
                <textarea
                  rows={5}
                  value={jdInput}
                  onChange={(e) => setJdInput(e.target.value)}
                  placeholder="Paste the full job post requirements, responsibilities, and qualifications..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>
            </div>
          )}

          {/* Trigger button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                AI is generating suggestions...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate AI Insights
              </>
            )}
          </button>

          {/* Result Presentation */}
          {result && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600" />
                  AI Output:
                </span>
                {result.summary && (
                  <button
                    type="button"
                    onClick={() => handleApplySummary(result.summary)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {applied ? <Check size={12} className="text-emerald-600" /> : null}
                    {applied ? 'Applied to Resume!' : 'Apply to Summary'}
                  </button>
                )}
              </div>

              {/* Variations */}
              {result.variations && (
                <div className="space-y-2">
                  {result.variations.map((v, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-900 text-[10px] uppercase">{v.label}</span>
                        <button
                          onClick={() => handleCopy(v.text)}
                          className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-[10px]"
                        >
                          <Copy size={11} /> Copy
                        </button>
                      </div>
                      <p className="leading-relaxed">{v.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Rewritten Text */}
              {result.rewritten && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2">
                  <p className="whitespace-pre-line leading-relaxed">{result.rewritten}</p>
                  <button
                    onClick={() => handleCopy(result.rewritten)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Copy size={12} /> Copy to Clipboard
                  </button>
                </div>
              )}

              {/* Skills Suggested */}
              {result.technical_skills && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">Recommended Technical Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.technical_skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-blue-100 text-blue-800 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 block mt-2">Recommended Soft Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.soft_skills?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-800 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* JD Optimization */}
              {result.recommendations && (
                <div className="space-y-2 text-xs">
                  {result.match_rate !== undefined && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-slate-800">Keyword Match Rate:</span>
                      <span className="px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                        {result.match_rate}%
                      </span>
                    </div>
                  )}
                  {result.missing_keywords?.length > 0 && (
                    <div>
                      <span className="font-semibold text-rose-700 block mb-1">Missing High-Impact Keywords:</span>
                      <div className="flex flex-wrap gap-1">
                        {result.missing_keywords.map((k, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10.5px] bg-rose-50 text-rose-700 border border-rose-200">
                            + {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-slate-800 block mb-1 mt-2">Actionable Suggestions:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {result.recommendations.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
