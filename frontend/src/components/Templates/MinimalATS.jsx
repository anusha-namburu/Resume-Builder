import React from 'react';

export const MinimalATS = ({ data }) => {
  const primaryColor = data.color_theme || '#1e293b';
  const pi = data.personal_info || {};
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const certs = data.certifications || [];
  const achievements = data.achievements || [];
  const languages = data.languages || [];

  return (
    <div className="resume-a4-sheet text-slate-900 p-8 text-xs leading-relaxed font-sans min-h-[1123px] bg-white">
      {/* Clean ATS-Optimized Header */}
      <div className="border-b pb-3 mb-4" style={{ borderColor: primaryColor }}>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
          {pi.full_name || 'Your Full Name'}
        </h1>
        <p className="text-xs font-semibold text-slate-700 mt-0.5">
          {pi.professional_title || data.target_role || 'Professional Title'}
        </p>

        {/* Contact info on standard single line */}
        <div className="text-[11px] text-slate-600 mt-1.5 flex flex-wrap gap-x-2">
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>| {pi.phone}</span>}
          {pi.location && <span>| {pi.location}</span>}
          {pi.linkedin && <span>| {pi.linkedin}</span>}
          {pi.github && <span>| {pi.github}</span>}
          {pi.portfolio && <span>| {pi.portfolio}</span>}
        </div>
      </div>

      <div className="space-y-4">
        {/* Professional Summary */}
        {pi.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-900">
              Professional Summary
            </h2>
            <hr className="border-slate-300 mb-1.5" />
            <p className="text-[11px] text-slate-800 leading-normal">
              {pi.summary}
            </p>
          </div>
        )}

        {/* Core Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-900">
              Skills & Proficiencies
            </h2>
            <hr className="border-slate-300 mb-1.5" />
            <div className="text-[11px] text-slate-800">
              <span className="font-semibold">Technical & Core Skills: </span>
              {skills.map((s) => s.name).join(', ')}
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-900">
              Work Experience
            </h2>
            <hr className="border-slate-300 mb-2" />
            <div className="space-y-3">
              {experiences.map((exp, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.job_title} — {exp.company}</span>
                    <span className="font-normal text-slate-600">
                      {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                    </span>
                  </div>
                  {exp.location && <div className="text-[10px] text-slate-600">{exp.location}</div>}
                  {exp.responsibilities && (
                    <div className="text-slate-800 mt-1 whitespace-pre-line pl-3">
                      {exp.responsibilities}
                    </div>
                  )}
                  {exp.achievements && (
                    <div className="text-slate-900 font-medium mt-1 pl-3">
                      • Key Result: {exp.achievements}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-900">
              Education
            </h2>
            <hr className="border-slate-300 mb-2" />
            <div className="space-y-2">
              {educations.map((edu, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{edu.degree} — {edu.institution}</span>
                    <span className="font-normal text-slate-600">{edu.graduation_year}</span>
                  </div>
                  <div className="text-slate-700 text-[10px]">
                    {edu.location && <span>{edu.location}</span>}
                    {edu.score && <span> | GPA: {edu.score}</span>}
                  </div>
                  {edu.description && <p className="text-slate-700 text-[10.5px] mt-0.5">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-900">
              Technical Projects
            </h2>
            <hr className="border-slate-300 mb-2" />
            <div className="space-y-2">
              {projects.map((proj, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="font-bold text-slate-900">
                    {proj.title} {proj.technologies && <span className="font-normal text-slate-600">({proj.technologies})</span>}
                  </div>
                  {proj.project_link && <div className="text-[10px] text-slate-600">{proj.project_link}</div>}
                  {proj.description && <p className="text-slate-800 mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Additional */}
        {certs.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-900">
              Certifications
            </h2>
            <hr className="border-slate-300 mb-1.5" />
            <ul className="text-[11px] text-slate-800 space-y-0.5 pl-4 list-disc">
              {certs.map((c, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{c.name}</span> — {c.issuing_organization} {c.issue_date && `(${c.issue_date})`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {achievements.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-900">
              Honors & Achievements
            </h2>
            <hr className="border-slate-300 mb-1.5" />
            <ul className="text-[11px] text-slate-800 space-y-0.5 pl-4 list-disc">
              {achievements.map((a, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{a.title}:</span> {a.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
