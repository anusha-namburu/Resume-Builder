import React from 'react';

export const ClassicCorporate = ({ data }) => {
  const primaryColor = data.color_theme || '#0f172a';
  const pi = data.personal_info || {};
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const certs = data.certifications || [];
  const achievements = data.achievements || [];
  const languages = data.languages || [];

  return (
    <div className="resume-a4-sheet text-slate-900 p-8 text-xs leading-relaxed font-serif min-h-[1123px] bg-white">
      {/* Centered Classic Header */}
      <div className="text-center pb-4 border-b-2" style={{ borderColor: primaryColor }}>
        <h1 className="text-2xl font-bold tracking-wider uppercase font-serif" style={{ color: primaryColor }}>
          {pi.full_name || 'YOUR FULL NAME'}
        </h1>
        <p className="text-sm font-sans tracking-widest text-slate-600 uppercase mt-1">
          {pi.professional_title || data.target_role || 'Executive Professional'}
        </p>

        {/* Contact Strip */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[10.5px] font-sans text-slate-600 mt-2.5">
          {pi.location && <span>{pi.location}</span>}
          {pi.phone && <span>• {pi.phone}</span>}
          {pi.email && <span>• {pi.email}</span>}
          {pi.linkedin && <span>• {pi.linkedin}</span>}
          {pi.portfolio && <span>• {pi.portfolio}</span>}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        {/* Executive Summary */}
        {pi.summary && (
          <div>
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest mb-1.5 pb-0.5 border-b border-slate-300" style={{ color: primaryColor }}>
              Executive Summary
            </h2>
            <p className="text-[11px] font-serif text-slate-700 leading-relaxed text-justify">
              {pi.summary}
            </p>
          </div>
        )}

        {/* Professional Experience */}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest mb-2 pb-0.5 border-b border-slate-300" style={{ color: primaryColor }}>
              Professional Experience
            </h2>
            <div className="space-y-3.5">
              {experiences.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline font-sans">
                    <span className="font-bold text-slate-900 text-[11px]">{exp.company}</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline italic text-[11px] text-slate-700 font-serif">
                    <span>{exp.job_title}</span>
                    {exp.location && <span className="font-sans text-[10px] text-slate-500 not-italic">{exp.location}</span>}
                  </div>
                  {exp.responsibilities && (
                    <div className="text-[10.5px] font-sans text-slate-700 mt-1 pl-3 border-l-2 border-slate-200 whitespace-pre-line">
                      {exp.responsibilities}
                    </div>
                  )}
                  {exp.achievements && (
                    <p className="text-[10px] font-sans text-slate-800 font-semibold mt-1">
                      Key Result: {exp.achievements}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div>
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest mb-2 pb-0.5 border-b border-slate-300" style={{ color: primaryColor }}>
              Education & Credentials
            </h2>
            <div className="space-y-2">
              {educations.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold font-sans text-[11px] text-slate-900">{edu.degree}</span>
                    <span className="text-slate-700 text-[11px]">, {edu.institution}</span>
                    {edu.score && <span className="text-slate-600 text-[10px]"> (Score: {edu.score})</span>}
                  </div>
                  <span className="text-[10px] font-sans text-slate-500">{edu.graduation_year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Competencies & Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest mb-2 pb-0.5 border-b border-slate-300" style={{ color: primaryColor }}>
              Core Competencies
            </h2>
            <div className="grid grid-cols-3 gap-2 text-[10.5px] font-sans text-slate-700">
              {skills.map((s, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects / Case Studies */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest mb-2 pb-0.5 border-b border-slate-300" style={{ color: primaryColor }}>
              Selected Projects & Engagements
            </h2>
            <div className="space-y-2">
              {projects.map((proj, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="font-bold font-sans text-slate-900">{proj.title}</div>
                  {proj.description && <p className="text-[10.5px] font-serif text-slate-700 mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Languages */}
        {(certs.length > 0 || languages.length > 0) && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            {certs.length > 0 && (
              <div>
                <h3 className="text-[11px] font-bold font-sans uppercase tracking-wider mb-1 text-slate-900">
                  Certifications
                </h3>
                <ul className="list-disc list-inside text-[10px] font-sans text-slate-700 space-y-0.5">
                  {certs.map((c, idx) => (
                    <li key={idx}>{c.name} ({c.issuing_organization})</li>
                  ))}
                </ul>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <h3 className="text-[11px] font-bold font-sans uppercase tracking-wider mb-1 text-slate-900">
                  Languages
                </h3>
                <p className="text-[10px] font-sans text-slate-700">
                  {languages.map((l) => `${l.title}${l.description ? ` (${l.description})` : ''}`).join(', ')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
