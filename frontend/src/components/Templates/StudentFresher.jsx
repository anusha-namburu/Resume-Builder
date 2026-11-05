import React from 'react';
import { GraduationCap, Award, Briefcase, Code, BookOpen } from 'lucide-react';

export const StudentFresher = ({ data }) => {
  const primaryColor = data.color_theme || '#0284c7';
  const pi = data.personal_info || {};
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const certs = data.certifications || [];
  const internships = data.internships || [];
  const achievements = data.achievements || [];

  return (
    <div className="resume-a4-sheet text-slate-800 p-8 text-xs leading-relaxed font-sans min-h-[1123px] bg-white">
      {/* Header with clean blue accent bar */}
      <div className="border-b-2 pb-3 mb-4" style={{ borderColor: primaryColor }}>
        <div className="flex justify-between items-baseline flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: primaryColor }}>
              {pi.full_name || 'Your Full Name'}
            </h1>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">
              {pi.professional_title || data.target_role || 'Aspiring Software Engineer / Computer Science Graduate'}
            </p>
          </div>
          <div className="text-[10.5px] text-slate-600 text-right space-y-0.5">
            {pi.email && <div>{pi.email}</div>}
            {pi.phone && <div>{pi.phone}</div>}
            {pi.location && <div>{pi.location}</div>}
          </div>
        </div>

        {/* Links bar */}
        <div className="flex flex-wrap gap-3 mt-2 text-[10px] font-medium text-slate-500">
          {pi.linkedin && <span className="text-blue-600 font-semibold">{pi.linkedin}</span>}
          {pi.github && <span className="text-slate-800 font-semibold">• {pi.github}</span>}
          {pi.portfolio && <span className="text-emerald-700 font-semibold">• {pi.portfolio}</span>}
        </div>
      </div>

      <div className="space-y-4">
        {/* Objective / Summary */}
        {pi.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <BookOpen size={13} />
              Career Objective
            </h2>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              {pi.summary}
            </p>
          </div>
        )}

        {/* Education Highlighted First */}
        {educations.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <GraduationCap size={13} />
              Education
            </h2>
            <div className="space-y-2">
              {educations.map((edu, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-100">
                  <div className="flex justify-between items-baseline font-bold text-slate-900 text-[11px]">
                    <span>{edu.degree}</span>
                    <span className="text-[10px] font-medium text-slate-500">{edu.graduation_year}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-700">
                    <span>{edu.institution} {edu.location && `• ${edu.location}`}</span>
                    {edu.score && <span className="font-bold text-blue-700">CGPA / Marks: {edu.score}</span>}
                  </div>
                  {edu.description && <p className="text-[10px] text-slate-600 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical & Core Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <Code size={13} />
              Technical Skills & Coursework
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Academic / Personal Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <Code size={13} />
              Academic & Capstone Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj, idx) => (
                <div key={idx} className="pl-3 border-l-2" style={{ borderColor: primaryColor }}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-[11.5px]">{proj.title}</span>
                    {proj.project_link && (
                      <span className="text-[10px] text-blue-600 font-medium">{proj.project_link}</span>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="text-[10px] font-semibold text-slate-500">Tech: {proj.technologies}</div>
                  )}
                  {proj.description && <p className="text-[10.5px] text-slate-700 mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internships & Training */}
        {(internships.length > 0 || experiences.length > 0) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <Briefcase size={13} />
              Internships & Practical Training
            </h2>
            <div className="space-y-2.5">
              {[...internships, ...experiences].map((exp, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.job_title} — {exp.company}</span>
                    <span className="font-normal text-slate-500">{exp.start_date} – {exp.end_date || 'Present'}</span>
                  </div>
                  {exp.responsibilities && (
                    <p className="text-[10.5px] text-slate-700 mt-0.5 whitespace-pre-line">{exp.responsibilities}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Hackathons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>
                Certifications
              </h3>
              <ul className="text-[10.5px] text-slate-700 space-y-1 list-disc list-inside">
                {certs.map((c, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{c.name}</span> ({c.issuing_organization})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: primaryColor }}>
                <Award size={12} /> Achievements & Co-curricular
              </h3>
              <ul className="text-[10.5px] text-slate-700 space-y-1 list-disc list-inside">
                {achievements.map((a, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{a.title}</span>: {a.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
