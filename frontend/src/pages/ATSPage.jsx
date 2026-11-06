import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, Search, AlertTriangle, CheckCircle2, ArrowRight, 
  FileText, Loader2, Info, Sparkles, UploadCloud, FileUp, X, Check,
  Briefcase, Award, TrendingUp, Layers, RefreshCw, Edit3
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { atsService, resumeService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ATSPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'upload' | 'saved' | 'paste'
  const [activeTab, setActiveTab] = useState('upload');
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Saved resume state
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  // Paste text state
  const [resumeText, setResumeText] = useState('');

  // Target job description
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  // Scan state
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [copiedKeyword, setCopiedKeyword] = useState('');

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    setError('');
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.rtf'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(ext)) {
      setError(`Invalid file type. Please upload a PDF, DOCX, or TXT file.`);
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAnalysis(null);

    try {
      if (activeTab === 'upload') {
        if (!selectedFile) {
          setError('Please select or drag-and-drop a resume file to upload.');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('resume_file', selectedFile);
        formData.append('job_description', jobDescription);
        formData.append('job_title', jobTitle);

        const res = await atsService.uploadAndScan(formData);
        if (res.data?.success) {
          setAnalysis(res.data.data);
        } else {
          setError(res.data?.message || 'Failed to scan uploaded resume.');
        }

      } else if (activeTab === 'saved') {
        if (!selectedResumeId) {
          setError('Please select a saved resume to scan.');
          setLoading(false);
          return;
        }

        const res = await atsService.analyze({
          resume_id: selectedResumeId,
          job_description: jobDescription,
          job_title: jobTitle
        });
        if (res.data?.success) {
          setAnalysis(res.data.data);
        } else {
          setError(res.data?.message || 'Failed to analyze saved resume.');
        }

      } else {
        // Paste text
        if (!resumeText.trim() || resumeText.length < 50) {
          setError('Please paste at least 50 characters of your resume content.');
          setLoading(false);
          return;
        }

        const res = await atsService.analyze({
          resume_data: {
            personal_info: { summary: resumeText.slice(0, 300) },
            experiences: [{ responsibilities: resumeText, job_title: jobTitle || 'Professional' }],
            skills: [{ name: 'Technical' }]
          },
          job_description: jobDescription,
          job_title: jobTitle
        });

        if (res.data?.success) {
          setAnalysis(res.data.data);
        } else {
          setError(res.data?.message || 'Failed to analyze resume text.');
        }
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.response?.data?.message || 'An error occurred while scanning your resume. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportToEditor = async () => {
    if (!analysis?.parsed_resume) return;

    if (!isAuthenticated) {
      navigate('/login?redirect=/ats');
      return;
    }

    setImporting(true);
    try {
      const res = await resumeService.importParsed({
        parsed_resume: analysis.parsed_resume,
        title: `${analysis.parsed_resume.personal_info?.full_name || 'My'} Resume (Uploaded)`,
        target_role: jobTitle || analysis.parsed_resume.target_role || 'Software Engineer',
      });

      if (res.data?.success && res.data.resume) {
        navigate(`/editor/${res.data.resume.id}`);
      } else {
        setError(res.data?.message || 'Could not import resume into editor.');
      }
    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to import into editor.');
    } finally {
      setImporting(false);
    }
  };

  const handleCopyKeyword = (kw) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(''), 2000);
  };

  const sampleJDPrompts = [
    { title: 'Full Stack Engineer', text: 'Looking for a Full Stack Software Engineer proficient in React, Node.js, Python, PostgreSQL, REST APIs, Docker, CI/CD, and agile development methodologies. Must demonstrate system architecture skills.' },
    { title: 'Frontend Developer', text: 'Frontend Developer required with deep expertise in React.js, TypeScript, Tailwind CSS, Redux, responsive web design, performance optimization, and cross-browser compatibility.' },
    { title: 'Data Analyst / Python', text: 'Seeking a Data Analyst experienced in Python, SQL, Pandas, NumPy, Tableau, machine learning models, ETL pipelines, and statistical analysis to drive business decisions.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <ShieldCheck size={14} className="text-emerald-600" />
            ATS Keyword Scanner & Percentage Calculator
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Check Your ATS Resume Score Percentage
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Upload your resume (PDF or Word) to immediately calculate your ATS compatibility percentage, discover missing keywords, and get recruiter-ready.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md space-y-6">
          {/* Tab Selection */}
          <div className="flex border-b border-slate-200 gap-2 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <UploadCloud size={16} />
              Upload Resume File (PDF / DOCX)
            </button>

            {isAuthenticated && resumes.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === 'saved'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText size={16} />
                Select Saved Resume ({resumes.length})
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'paste'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Edit3 size={16} />
              Paste Plain Text
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleScan} className="space-y-5">
            {/* Tab 1: File Upload */}
            {activeTab === 'upload' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Upload Your Resume (PDF, DOCX, TXT) *
                </label>

                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      dragOver
                        ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
                        : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc,.txt,.rtf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                      <FileUp size={28} />
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      Click to upload or drag & drop your resume file
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PDF, Microsoft Word (.docx), or plain text (.txt) up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{selectedFile.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB • Ready for ATS Percentage Analysis
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Saved Resumes */}
            {activeTab === 'saved' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Choose from Your Saved Resumes *
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
            )}

            {/* Tab 3: Paste Text */}
            {activeTab === 'paste' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Paste Resume Content *
                </label>
                <textarea
                  rows={5}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your professional summary, experience bullet points, skills list, and education here..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>
            )}

            {/* Job Title & Job Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Job Title (Optional)
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Target Job Description (Recommended for Match %)
                  </label>
                  <span className="text-[10px] text-slate-400">Optional</span>
                </div>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements from LinkedIn, Indeed, etc. to calculate keyword match percentage..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans"
                />
                
                {/* Sample JD Prompts */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Try sample JD:</span>
                  {sampleJDPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setJobTitle(p.title);
                        setJobDescription(p.text);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      + {p.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scan Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Extracting Text & Calculating ATS Percentage...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Calculate ATS Score & Match Percentage
                </>
              )}
            </button>
          </form>

          {/* Results Display */}
          {analysis && (
            <div className="pt-6 border-t border-slate-200 space-y-6 animate-in fade-in duration-300">
              {/* Header / Score Banner */}
              <div className="flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white gap-6 shadow-lg">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-emerald-300">
                    <ShieldCheck size={13} />
                    Verified ATS Parser Analysis
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {analysis.score >= 80 ? 'ATS Optimized & High Match! 🎉' :
                     analysis.score >= 60 ? 'Good Baseline — Optimization Recommended 👍' :
                     'Action Required — Low ATS Compatibility ⚠️'}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-lg">
                    {analysis.score >= 80 
                      ? 'Your resume passes major ATS structural checks and features strong technical density for recruiter screens.'
                      : 'Recruiter scanners may overlook key qualifications. Follow the actionable recommendations below to boost your score.'}
                  </p>
                  {analysis.filename && (
                    <div className="text-[11px] text-slate-400 flex items-center justify-center md:justify-start gap-1.5">
                      <FileText size={12} />
                      Scanned File: <strong className="text-white">{analysis.filename}</strong> ({analysis.word_count} words)
                    </div>
                  )}
                </div>

                {/* Score Circular Percentage Gauge */}
                <div className="flex flex-col items-center justify-center">
                  <div className={`relative w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center font-black shadow-inner ${
                    analysis.score >= 80 ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500' :
                    analysis.score >= 60 ? 'text-amber-400 bg-amber-950/40 border-amber-500' :
                    'text-rose-400 bg-rose-950/40 border-rose-500'
                  }`}>
                    <span className="text-4xl leading-none tracking-tight">{analysis.score}%</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 mt-1">ATS Score</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2 font-semibold">
                    {analysis.score >= 80 ? 'Top 10% Match' : analysis.score >= 60 ? 'Average Match' : 'Below Threshold'}
                  </span>
                </div>
              </div>

              {/* 3-Category Breakdown Meters */}
              {analysis.category_scores && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Structure & Format</span>
                      <span className="text-blue-600 font-black">{analysis.category_scores.structure}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${analysis.category_scores.structure}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block">Headers, contact info & layout safety</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Content & Metrics</span>
                      <span className="text-purple-600 font-black">{analysis.category_scores.content}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${analysis.category_scores.content}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block">Action verbs, metrics & word density</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Keyword Alignment</span>
                      <span className="text-emerald-600 font-black">{analysis.category_scores.alignment}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${analysis.category_scores.alignment}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block">Skills matched against target role</span>
                  </div>
                </div>
              )}

              {/* Import to Editor Action (When uploaded file parsed) */}
              {analysis.parsed_resume && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <span className="text-xs font-bold text-blue-950 flex items-center justify-center sm:justify-start gap-1.5">
                      <Sparkles size={14} className="text-blue-600" />
                      Candidate Detected: {analysis.parsed_resume.personal_info?.full_name || 'Professional'}
                    </span>
                    <p className="text-[11px] text-blue-700">
                      We extracted {analysis.parsed_resume.skills?.length || 0} skills and work history from your file. You can open and edit it directly in our 6 resume templates!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleImportToEditor}
                    disabled={importing}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 transition-colors shrink-0 disabled:opacity-50"
                  >
                    {importing ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Opening Editor...
                      </>
                    ) : (
                      <>
                        <Edit3 size={14} />
                        Edit in Resume Builder
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Matched vs Missing Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      Matching Keywords Detected ({analysis.matched_keywords?.length || 0})
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Found in your resume</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.matched_keywords && analysis.matched_keywords.length > 0 ? (
                      analysis.matched_keywords.map((k, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ✓ {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No specific keywords matched yet.</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle size={15} className="text-rose-600" />
                      Missing Required Keywords ({analysis.missing_keywords?.length || 0})
                    </span>
                    <span className="text-[10px] text-rose-700 font-semibold">Click keyword to copy</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.missing_keywords && analysis.missing_keywords.length > 0 ? (
                      analysis.missing_keywords.map((k, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleCopyKeyword(k)}
                          className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200 transition-colors flex items-center gap-1"
                          title="Click to copy"
                        >
                          {copiedKeyword === k ? <Check size={11} className="text-emerald-700" /> : '+'}
                          <span>{k}</span>
                        </button>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-700 font-medium">All targeted keywords are present!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Passed Checks vs Issues */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Passed */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Passed ATS Criteria ({analysis.positive_checks?.length || 0})
                  </span>
                  <div className="space-y-1">
                    {analysis.positive_checks?.map((check, idx) => (
                      <div key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>{check}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Issues */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-amber-600" />
                    Formatting & Content Alerts ({analysis.formatting_issues?.length || 0})
                  </span>
                  <div className="space-y-1">
                    {analysis.formatting_issues?.length > 0 ? (
                      analysis.formatting_issues.map((issue, idx) => (
                        <div key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold shrink-0">!</span>
                          <span>{issue}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-[11px] text-emerald-700">No formatting issues detected!</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {analysis.recommendations?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Actionable Improvement Recommendations:
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

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-200 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAnalysis(null);
                    setSelectedFile(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={13} />
                  Scan Another Resume
                </button>

                {analysis.parsed_resume && (
                  <button
                    type="button"
                    onClick={handleImportToEditor}
                    disabled={importing}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors flex items-center gap-2"
                  >
                    <Edit3 size={14} />
                    Import & Edit in Builder
                  </button>
                )}
              </div>

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
