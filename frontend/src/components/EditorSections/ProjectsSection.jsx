import React from 'react';
import { FolderGit2, Plus, Trash2, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../BrandIcons';
import { useResume } from '../../context/ResumeContext';

export const ProjectsSection = () => {
  const { currentResume, addItemToSection, removeItemFromSection, updateItemInSection } = useResume();
  const projects = currentResume.projects || [];

  const handleAddProject = () => {
    addItemToSection('projects', {
      title: '',
      subtitle: '',
      technologies: '',
      description: '',
      project_link: '',
      github_link: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="text-blue-600" size={18} />
            Projects
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Showcase key personal, academic, or open-source projects.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <Plus size={14} /> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">No projects added yet.</p>
          <button
            type="button"
            onClick={handleAddProject}
            className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            + Add your first project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Project #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItemFromSection('projects', idx)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Remove project"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Title *</label>
                  <input
                    type="text"
                    value={proj.title || ''}
                    onChange={(e) => updateItemInSection('projects', idx, 'title', e.target.value)}
                    placeholder="e.g. AI-Powered Resume Builder"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Technologies Used</label>
                  <input
                    type="text"
                    value={proj.technologies || ''}
                    onChange={(e) => updateItemInSection('projects', idx, 'technologies', e.target.value)}
                    placeholder="e.g. React.js, Tailwind CSS, Python Flask, MySQL"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Live Demo Link</label>
                  <div className="relative">
                    <ExternalLink size={13} className="absolute left-2.5 top-2 text-slate-400" />
                    <input
                      type="text"
                      value={proj.project_link || ''}
                      onChange={(e) => updateItemInSection('projects', idx, 'project_link', e.target.value)}
                      placeholder="https://myproject.com"
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">GitHub Repository Link</label>
                  <div className="relative">
                    <GithubIcon size={13} className="absolute left-2.5 top-2 text-slate-400" />
                    <input
                      type="text"
                      value={proj.github_link || ''}
                      onChange={(e) => updateItemInSection('projects', idx, 'github_link', e.target.value)}
                      placeholder="https://github.com/user/project"
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Description & Outcomes</label>
                <textarea
                  rows={2}
                  value={proj.description || ''}
                  onChange={(e) => updateItemInSection('projects', idx, 'description', e.target.value)}
                  placeholder="Engineered an end-to-end web platform featuring multi-template rendering, live preview, and automated ATS keyword compatibility scanning..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
