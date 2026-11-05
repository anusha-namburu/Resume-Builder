import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Save, Download, Sparkles, ShieldCheck, ChevronLeft, ChevronRight, 
  ZoomIn, ZoomOut, RotateCcw, Eye, Edit3, ArrowLeft, Loader2, Check, Printer, Palette, Layout
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useResume } from '../context/ResumeContext';
import { resumeService, pdfService } from '../services/api';
import { PersonalSection } from '../components/EditorSections/PersonalSection';
import { SummarySection } from '../components/EditorSections/SummarySection';
import { ExperienceSection } from '../components/EditorSections/ExperienceSection';
import { EducationSection } from '../components/EditorSections/EducationSection';
import { ProjectsSection } from '../components/EditorSections/ProjectsSection';
import { SkillsSection } from '../components/EditorSections/SkillsSection';
import { CertificationsSection } from '../components/EditorSections/CertificationsSection';
import { AdditionalSections } from '../components/EditorSections/AdditionalSections';
import { TemplateSelector } from '../components/TemplateSelector';
import { ResumeRenderer } from '../components/Templates/ResumeRenderer';
import { AIModal } from '../components/AIModal';
import { ATSModal } from '../components/ATSModal';

export const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentResume, 
    setCurrentResume, 
    saveResume, 
    isSaving, 
    lastSavedTime,
    completionPercentage 
  } = useResume();

  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [mobileView, setMobileView] = useState('editor'); // 'editor' | 'preview'
  const [zoomScale, setZoomScale] = useState(0.85);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);

  const previewContainerRef = useRef(null);

  const steps = [
    { id: 'personal', label: 'Personal Info', component: PersonalSection },
    { id: 'summary', label: 'Summary', component: SummarySection },
    { id: 'experience', label: 'Experience', component: ExperienceSection },
    { id: 'education', label: 'Education', component: EducationSection },
    { id: 'projects', label: 'Projects', component: ProjectsSection },
    { id: 'skills', label: 'Skills', component: SkillsSection },
    { id: 'certifications', label: 'Certifications', component: CertificationsSection },
    { id: 'additional', label: 'Additional', component: AdditionalSections },
    { id: 'templates', label: 'Templates & Colors', component: TemplateSelector },
  ];

  // Fetch resume data on mount
  useEffect(() => {
    const fetchResumeData = async () => {
      setLoading(true);
      try {
        const res = await resumeService.getById(id);
        if (res.data?.success && res.data.resume) {
          setCurrentResume(res.data.resume);
        }
      } catch (err) {
        console.error('Failed to load resume:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResumeData();
    }
  }, [id, setCurrentResume]);

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // High-fidelity client-side PDF export matching exact screen rendering
  const handleClientExportPDF = async () => {
    const element = document.getElementById('resume-preview-container');
    if (!element) return;

    setIsExportingPdf(true);
    try {
      const opt = {
        margin: 0,
        filename: `${(currentResume?.title || 'Resume').replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Client PDF export failed, using backend fallback:', err);
      window.open(pdfService.getDownloadUrl(currentResume.id), '_blank');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <p className="text-xs font-semibold text-slate-500">Opening Resume Editor...</p>
        </div>
      </div>
    );
  }

  const ActiveComponent = steps[activeStep].component;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      {/* Top Application Bar */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <input
                type="text"
                value={currentResume.title || ''}
                onChange={(e) => setCurrentResume({ ...currentResume, title: e.target.value })}
                className="text-sm font-bold text-slate-900 hover:border-slate-300 focus:border-blue-500 border border-transparent rounded px-1.5 py-0.5 transition-colors"
                title="Click to rename"
              />
              <div className="flex items-center gap-2 text-[10.5px] text-slate-400 px-1.5">
                <span>{currentResume.target_role || 'General Resume'}</span>
                <span>•</span>
                <span>Strength: {completionPercentage}%</span>
                {lastSavedTime && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-600 flex items-center gap-0.5">
                      <Check size={11} /> Saved
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Center Tools: AI & ATS */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setShowAiModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-2xs transition-all"
            >
              <Sparkles size={13} />
              AI Assistant
            </button>

            <button
              onClick={() => setShowAtsModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-emerald-400 hover:bg-slate-800 shadow-2xs transition-all border border-slate-800"
            >
              <ShieldCheck size={14} className="text-emerald-400" />
              ATS Score & Audit
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Mobile View Toggle */}
            <div className="flex md:hidden bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setMobileView('editor')}
                className={`p-1.5 rounded text-xs font-semibold ${mobileView === 'editor' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-600'}`}
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => setMobileView('preview')}
                className={`p-1.5 rounded text-xs font-semibold ${mobileView === 'preview' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-600'}`}
              >
                <Eye size={14} />
              </button>
            </div>

            <button
              onClick={saveResume}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors hidden sm:block"
              title="Print Resume"
            >
              <Printer size={16} />
            </button>

            <button
              onClick={handleClientExportPDF}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors disabled:opacity-50"
            >
              {isExportingPdf ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              <span>{isExportingPdf ? 'Exporting...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 gap-6">
        {/* Left Side: Step-by-Step Editor */}
        <div className={`w-full md:w-[48%] lg:w-[45%] flex flex-col space-y-4 ${mobileView === 'preview' ? 'hidden md:flex' : 'flex'}`}>
          {/* Step Pill Navigator */}
          <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeStep === idx
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Form Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex-1 flex flex-col justify-between overflow-y-auto">
            <ActiveComponent />

            {/* Stepper Footer Controls */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={activeStep === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              <span className="text-[11px] font-semibold text-slate-400">
                Step {activeStep + 1} of {steps.length}
              </span>

              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
                >
                  Next <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClientExportPDF}
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
                >
                  <Download size={14} /> Download PDF
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Live Resume Preview */}
        <div className={`w-full md:w-[52%] lg:w-[55%] flex flex-col space-y-3 ${mobileView === 'editor' ? 'hidden md:flex' : 'flex'}`}>
          {/* Zoom and Preview Toolbar */}
          <div className="no-print bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-semibold">
              <Eye size={14} className="text-blue-600" />
              <span>Live A4 Preview</span>
              <span className="text-[10px] text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                {currentResume.template_id}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomScale(Math.max(0.5, zoomScale - 0.1))}
                className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="text-[11px] font-mono text-slate-600 w-10 text-center">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale(Math.min(1.2, zoomScale + 0.1))}
                className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={() => setZoomScale(0.85)}
                className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 ml-1"
                title="Reset Zoom"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* Scaled Preview Frame */}
          <div 
            ref={previewContainerRef}
            className="flex-1 overflow-auto bg-slate-200/70 p-4 rounded-2xl border border-slate-300/80 flex justify-center items-start min-h-[600px]"
          >
            <div 
              style={{ 
                transform: `scale(${zoomScale})`, 
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
              className="origin-top"
            >
              <ResumeRenderer data={currentResume} id="resume-preview-container" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AIModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} />

      {/* ATS Compatibility Checker Modal */}
      <ATSModal isOpen={showAtsModal} onClose={() => setShowAtsModal(false)} />
    </div>
  );
};
