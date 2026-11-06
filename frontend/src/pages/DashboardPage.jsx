import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, FileText, Copy, Trash2, Edit3, Download, Sparkles, 
  Clock, ShieldCheck, ArrowRight, Loader2, Check, AlertCircle, UploadCloud 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resumeService, pdfService } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState(user?.headline || 'Software Engineer');
  const [newTemplate, setNewTemplate] = useState('modern-professional');

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await resumeService.getAll();
      if (res.data?.success) {
        setResumes(res.data.resumes || []);
      }
    } catch (err) {
      console.error('Fetch resumes error:', err);
      setError('Failed to load resumes. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreateResume = async (e) => {
    if (e) e.preventDefault();
    setCreating(true);
    try {
      const res = await resumeService.create({
        title: newTitle.trim() || 'My Professional Resume',
        target_role: newRole.trim() || 'Software Engineer',
        template_id: newTemplate,
      });

      if (res.data?.success && res.data.resume) {
        setShowCreateModal(false);
        navigate(`/editor/${res.data.resume.id}`);
      }
    } catch (err) {
      console.error('Create error:', err);
      setError('Could not create resume.');
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await resumeService.duplicate(id);
      if (res.data?.success) {
        fetchResumes();
      }
    } catch (err) {
      console.error('Duplicate error:', err);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const res = await resumeService.delete(id);
        if (res.data?.success) {
          setResumes((prev) => prev.filter((r) => r.id !== id));
        }
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleDownloadPDF = (resumeId, title) => {
    const url = pdfService.getDownloadUrl(resumeId);
    window.open(url, '_blank');
  };

  const totalResumes = resumes.length;
  const avgCompletion = totalResumes > 0
    ? Math.round(resumes.reduce((acc, r) => acc + (r.completion_percentage || 0), 0) / totalResumes)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 text-blue-100">
              <Sparkles size={13} />
              AI Resume Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, {user?.name || 'Professional'}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Manage your resumes, optimize content with AI, and track ATS readiness for every job application.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/ats"
              className="px-4 py-3 rounded-xl font-bold text-xs bg-blue-700/60 hover:bg-blue-700 text-white border border-blue-400/30 transition-all shadow-md flex items-center gap-2"
            >
              <UploadCloud size={16} className="text-emerald-300" />
              <span>Upload & Check ATS %</span>
            </Link>
            <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-xl font-bold text-xs bg-white text-blue-900 hover:bg-blue-50 transition-all shadow-md flex items-center gap-2 group shrink-0"
          >
            <Plus size={16} className="text-blue-600 group-hover:rotate-90 transition-transform" />
            <span>Create New Resume</span>
          </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText size={22} />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Total Resumes</span>
              <span className="text-2xl font-black text-slate-900">{totalResumes}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Avg. Completion</span>
              <span className="text-2xl font-black text-slate-900">{avgCompletion}%</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles size={22} />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">AI Suggestions Used</span>
              <span className="text-2xl font-black text-slate-900">Active</span>
            </div>
          </div>
        </div>

        {/* Resumes Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Your Resumes</h2>
            {totalResumes > 0 && (
              <span className="text-xs text-slate-500">{totalResumes} of unlimited</span>
            )}
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 size={28} className="animate-spin text-blue-600" />
              <p className="text-xs font-semibold">Loading your resumes...</p>
            </div>
          ) : totalResumes === 0 ? (
            <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <FileText size={32} />
              </div>
              <div className="max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-900">No Resumes Found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You haven't built a resume yet. Choose a template and start building your career story.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
              >
                <Plus size={15} />
                Create My First Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => {
                const completion = resume.completion_percentage || 0;
                return (
                  <div
                    key={resume.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-premium transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div className="p-5 space-y-4">
                      {/* Top status */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span 
                            className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white mb-1.5"
                            style={{ backgroundColor: resume.color_theme || '#1e3a8a' }}
                          >
                            {resume.template_id?.replace('-', ' ')}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 tracking-tight line-clamp-1">
                            {resume.title}
                          </h3>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {resume.target_role || 'Target Role Not Specified'}
                          </p>
                        </div>
                      </div>

                      {/* Completion Progress Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>Profile Strength</span>
                          <span>{completion}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              completion >= 80 ? 'bg-emerald-500' : completion >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400">
                        <Clock size={12} />
                        <span>Last updated: {new Date(resume.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                      <Link
                        to={`/editor/${resume.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
                      >
                        <Edit3 size={13} />
                        Edit
                      </Link>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDownloadPDF(resume.id, resume.title)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(resume.id)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
                          title="Duplicate Resume"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(resume.id, resume.title)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Resume"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Create Resume Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create New Resume</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Give your resume a name and select a starting template.
              </p>
            </div>

            <form onSubmit={handleCreateResume} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resume Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer - Q1 2026"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role / Job Title</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Full-Stack Developer"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Choose Template</label>
                <select
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="modern-professional">Modern Professional (Two-Column Navy)</option>
                  <option value="classic-corporate">Classic Corporate (Executive Serif)</option>
                  <option value="minimal-ats">Minimal ATS-Friendly (Parser Optimized)</option>
                  <option value="creative-designer">Creative Designer (Banner Showcase)</option>
                  <option value="student-fresher">Student / Fresher (Education & Projects)</option>
                  <option value="software-developer">Software Developer (Tech Stack Pills)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {creating ? <Loader2 size={13} className="animate-spin" /> : null}
                  {creating ? 'Creating...' : 'Start Building'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
