import React, { useState } from 'react';
import { Sparkles, FileText, Check, Loader2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { aiService } from '../../services/api';

export const SummarySection = () => {
  const { currentResume, updatePersonalInfo } = useResume();
  const pi = currentResume.personal_info || {};
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level (3-5 yrs)');

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setAiSuggestions(null);
    try {
      const skillsStr = (currentResume.skills || []).map((s) => s.name).slice(0, 6).join(', ');
      const res = await aiService.generateSummary({
        role: pi.professional_title || currentResume.target_role || 'Software Professional',
        experience_years: experienceLevel,
        key_skills: skillsStr,
      });

      if (res.data?.success && res.data?.data) {
        setAiSuggestions(res.data.data.variations || [{ label: 'Recommended', text: res.data.data.summary }]);
      }
    } catch (err) {
      console.error('Summary generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyVariation = (text) => {
    updatePersonalInfo('summary', text);
    setAiSuggestions(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="text-blue-600" size={18} />
            Professional Summary
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            A strong 3-4 sentence elevator pitch highlighting your core value and achievements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateSummary}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={13} />
              AI Generate Summary
            </>
          )}
        </button>
      </div>

      <div>
        <textarea
          rows={5}
          value={pi.summary || ''}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          placeholder="e.g. Results-driven Software Engineer with 4+ years of experience designing and deploying high-performance microservices and modern web applications..."
          className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
        />
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
          <span>Recommended length: 40 - 80 words</span>
          <span>{pi.summary ? pi.summary.split(/\s+/).filter(Boolean).length : 0} words</span>
        </div>
      </div>

      {/* AI Suggestions Drawer */}
      {aiSuggestions && (
        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-4 rounded-xl border border-blue-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-600" />
              Choose an AI-Crafted Variation:
            </span>
            <button
              onClick={() => setAiSuggestions(null)}
              className="text-[11px] text-slate-500 hover:text-slate-800"
            >
              Dismiss
            </button>
          </div>

          <div className="space-y-2">
            {aiSuggestions.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:border-blue-400 transition-all flex flex-col justify-between gap-2"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {item.label}
                  </span>
                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">{item.text}</p>
                </div>
                <button
                  type="button"
                  onClick={() => applyVariation(item.text)}
                  className="self-end inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                >
                  <Check size={12} /> Use This Summary
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
