import React from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const EducationSection = () => {
  const { currentResume, addItemToSection, removeItemFromSection, updateItemInSection } = useResume();
  const educations = currentResume.educations || [];

  const handleAddEducation = () => {
    addItemToSection('educations', {
      degree: '',
      institution: '',
      location: '',
      start_year: '',
      graduation_year: '',
      score: '',
      description: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="text-blue-600" size={18} />
            Education
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add your degrees, colleges/universities, honors, and graduation details.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <Plus size={14} /> Add Education
        </button>
      </div>

      {educations.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">No education entries added yet.</p>
          <button
            type="button"
            onClick={handleAddEducation}
            className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            + Add your degree
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Education #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItemFromSection('educations', idx)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Remove entry"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Degree / Qualification *</label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => updateItemInSection('educations', idx, 'degree', e.target.value)}
                    placeholder="e.g. B.S. in Computer Science"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">University / College *</label>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => updateItemInSection('educations', idx, 'institution', e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">City, State / Country</label>
                  <input
                    type="text"
                    value={edu.location || ''}
                    onChange={(e) => updateItemInSection('educations', idx, 'location', e.target.value)}
                    placeholder="e.g. Stanford, CA"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={edu.graduation_year || ''}
                      onChange={(e) => updateItemInSection('educations', idx, 'graduation_year', e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">CGPA / Percentage</label>
                    <input
                      type="text"
                      value={edu.score || ''}
                      onChange={(e) => updateItemInSection('educations', idx, 'score', e.target.value)}
                      placeholder="e.g. 3.9 / 4.0 or 88%"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Relevant Coursework / Honors
                </label>
                <input
                  type="text"
                  value={edu.description || ''}
                  onChange={(e) => updateItemInSection('educations', idx, 'description', e.target.value)}
                  placeholder="e.g. Algorithms, Distributed Systems, Database Design, Dean's List."
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
