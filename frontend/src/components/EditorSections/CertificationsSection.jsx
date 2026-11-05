import React from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const CertificationsSection = () => {
  const { currentResume, addItemToSection, removeItemFromSection, updateItemInSection } = useResume();
  const certs = currentResume.certifications || [];

  const handleAddCert = () => {
    addItemToSection('certifications', {
      name: '',
      issuing_organization: '',
      issue_date: '',
      credential_id: '',
      credential_url: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="text-blue-600" size={18} />
            Certifications & Licenses
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add verified credentials from AWS, Google, Microsoft, Coursera, etc.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCert}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <Plus size={14} /> Add Certification
        </button>
      </div>

      {certs.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">No certifications added.</p>
          <button
            type="button"
            onClick={handleAddCert}
            className="mt-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            + Add a certificate
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {certs.map((c, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Certification #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItemFromSection('certifications', idx)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Certification Name *</label>
                  <input
                    type="text"
                    value={c.name || ''}
                    onChange={(e) => updateItemInSection('certifications', idx, 'name', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Issuing Organization *</label>
                  <input
                    type="text"
                    value={c.issuing_organization || ''}
                    onChange={(e) => updateItemInSection('certifications', idx, 'issuing_organization', e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Issue Date / Year</label>
                  <input
                    type="text"
                    value={c.issue_date || ''}
                    onChange={(e) => updateItemInSection('certifications', idx, 'issue_date', e.target.value)}
                    placeholder="e.g. Nov 2024"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Verification URL / ID</label>
                  <input
                    type="text"
                    value={c.credential_url || c.credential_id || ''}
                    onChange={(e) => updateItemInSection('certifications', idx, 'credential_url', e.target.value)}
                    placeholder="e.g. https://aws.amazon.com/verification"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
