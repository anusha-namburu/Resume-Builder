import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle2, Search, ArrowRight, Loader2, Info } from 'lucide-react';
import { atsService } from '../services/api';
import { useResume } from '../context/ResumeContext';

export const ATSModal = ({ isOpen, onClose }) => {
  const { currentResume } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  if (!isOpen) return null;

  const handleScan = async () => {
    setLoading(true);
    try {
      const res = await atsService.analyze({
        resume_id: currentResume?.id,
        resume_data: currentResume,
        job_description: jobDescription,
        job_title: currentResume?.target_role || 'Target Position'
      });
      if (res.data?.success) {
        setAnalysis(res.data.data);
      }
    } catch (err) {
      console.error('ATS scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold">ATS Resume Compatibility Checker</h2>
              <p className="text-xs text-slate-400">Real-time parser analysis & keyword optimization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* JD Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Paste Target Job Description (Optional for general audit):
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting text here to compare your resume against required keywords, skills, and qualifications..."
              className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans"
            />
            <button
              type="button"
              onClick={handleScan}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Analyzing Resume & Parsing Keywords...
                </>
              ) : (
                <>
                  <Search size={15} />
                  Run Full ATS Compatibility Scan
                </>
              )}
            </button>
          </div>

          {/* Analysis Results Display */}
          {analysis && (
            <div className="space-y-5 border-t border-slate-200 pt-5">
              {/* Scorecard */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Calculated ATS Score
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {analysis.score >= 80 ? 'Excellent Match' : analysis.score >= 60 ? 'Moderate Match' : 'Needs Optimization'}
                  </div>
                  <p className="text-xs text-slate-500">
                    Word Count: <strong className="text-slate-700">{analysis.word_count}</strong> words
                  </p>
                </div>

                <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center font-black ${getScoreColor(analysis.score)} shadow-sm`}>
                  <span className="text-3xl leading-none">{analysis.score}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">/ 100</span>
                </div>
              </div>

              {/* Category Breakdown */}
              {analysis.category_scores && (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Structure</span>
                    <span className="text-lg font-bold text-slate-800">{analysis.category_scores.structure}%</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Content Quality</span>
                    <span className="text-lg font-bold text-slate-800">{analysis.category_scores.content}%</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">JD Alignment</span>
                    <span className="text-lg font-bold text-slate-800">{analysis.category_scores.alignment}%</span>
                  </div>
                </div>
              )}

              {/* Matched vs Missing Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    Matched Keywords ({analysis.matched_keywords?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matched_keywords?.map((k, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
                        ✓ {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                    <AlertTriangle size={15} className="text-rose-600" />
                    Missing Keywords ({analysis.missing_keywords?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missing_keywords?.map((k, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-100 text-rose-800">
                        + {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formatting Issues */}
              {analysis.formatting_issues?.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <AlertTriangle size={15} className="text-amber-600" />
                    Identified Areas for Improvement:
                  </div>
                  <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                    {analysis.formatting_issues.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Actionable Recommendations:
                  </span>
                  <div className="space-y-1.5">
                    {analysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 flex items-start gap-2 border border-slate-200">
                        <ArrowRight size={14} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 flex items-start gap-2 text-[11px] text-slate-500">
                <Info size={14} className="shrink-0 mt-0.5 text-slate-400" />
                <span>{analysis.disclaimer}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
