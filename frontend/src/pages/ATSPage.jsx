import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Search, AlertTriangle, CheckCircle2, ArrowRight, 
  FileText, Loader2, Info, Sparkles, Plus, Copy, Check 
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { atsService, resumeService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ATSPage = () => {
  const { isAuthenticated } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      resumeService.getAll().then((res) => {
        if (res.data?.success && res.data.resumes) {
          setResumes(res.data.resumes);
          if (res.data.resumes.length > 0) {
            setSelectedResumeId(res.data.resumes[0].id);
          }
        }
      }).catch(console.error);
    }
  }, [isAuthenticated]);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnalysis(null);

    try {
      let payload = {
        job_description: jobDescription,
      };

      if (selectedResumeId) {
        payload.resume_id = selectedResumeId;
      } else {
        payload.resume_data = {
          personal_info: { summary: resumeText },
          experiences: [{ responsibilities: resumeText, job_title: 'Applicant' }],
          skills: [{ name: 'General' }]
        };
      }

      const res = await atsService.analyze(payload);
      if (res.data?.success) {
        setAnalysis(res.data.data);
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <ShieldCheck size={14} className="text-emerald-600" />
            ATS Keyword Scanner & Parser Audit
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Check Your ATS Compatibility Score
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Compare your resume against any target job posting to reveal missing skills, keyword match rate, and structural readability.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md space-y-5">
          <form onSubmit={handleScan} className="space-y-4">
            {isAuthenticated && resumes.length > 0 ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Resume to Analyze
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.target_role || 'General'})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Paste Resume Content (or sign in to pick a saved resume)
                </label>
                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your professional summary, experience bullet points, and skills list here..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Job Description *
              </label>
              <textarea
                rows={5}
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job post requirements, responsibilities, and qualifications from LinkedIn, Indeed, etc..."
                className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Running ATS Parser Diagnostic...
                </>
              ) : (
                <>
                  <Search size={15} />
                  Analyze Resume Match
                </>
              )}
            </button>
          </form>

          {/* Results Display */}
          {analysis && (
            <div className="pt-6 border-t border-slate-200 space-y-6">
              {/* Scorecard */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Calculated ATS Compatibility Score
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {analysis.score >= 80 ? 'High Compatibility (80%+)' : analysis.score >= 60 ? 'Moderate Compatibility' : 'Optimization Recommended'}
                  </div>
                  <p className="text-xs text-slate-500">
                    Word Count: <strong className="text-slate-700">{analysis.word_count}</strong> words
                  </p>
                </div>

                <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center font-black ${
                  analysis.score >= 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                  analysis.score >= 60 ? 'text-amber-600 bg-amber-50 border-amber-200' :
                  'text-rose-600 bg-rose-50 border-rose-200'
                }`}>
                  <span className="text-3xl leading-none">{analysis.score}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">/ 100</span>
                </div>
              </div>

              {/* Matched vs Missing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    Matching Keywords Detected ({analysis.matched_keywords?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matched_keywords?.map((k, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        ✓ {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                    <AlertTriangle size={15} className="text-rose-600" />
                    Missing Required Keywords ({analysis.missing_keywords?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missing_keywords?.map((k, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                        + {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {analysis.recommendations?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Actionable Improvements:
                  </span>
                  <div className="space-y-1.5">
                    {analysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 flex items-start gap-2 border border-slate-200">
                        <ArrowRight size={14} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-2 text-[11px] text-slate-500">
                <Info size={15} className="shrink-0 mt-0.5 text-slate-400" />
                <span>{analysis.disclaimer}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
