import React from 'react';
import { Palette, Globe, Mail, Phone, MapPin, Sparkles, FolderGit2 } from 'lucide-react';

export const CreativeDesigner = ({ data }) => {
  const primaryColor = data.color_theme || '#4338ca';
  const pi = data.personal_info || {};
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const certs = data.certifications || [];
  const achievements = data.achievements || [];

  return (
    <div className="resume-a4-sheet text-slate-800 text-xs leading-relaxed font-sans min-h-[1123px] bg-white overflow-hidden">
      {/* Visual Top Banner */}
      <div 
        className="p-8 text-white relative"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` 
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 backdrop-blur-sm tracking-wide uppercase mb-2">
              Portfolio & Resume
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {pi.full_name || 'Your Full Name'}
            </h1>
            <p className="text-sm font-medium text-white/90 mt-1">
              {pi.professional_title || data.target_role || 'Creative Director & Designer'}
            </p>
          </div>

          <div className="text-[11px] space-y-1 text-white/85 text-left md:text-right">
            {pi.email && <div className="flex md:justify-end items-center gap-1.5"><Mail size={12} /> {pi.email}</div>}
            {pi.phone && <div className="flex md:justify-end items-center gap-1.5"><Phone size={12} /> {pi.phone}</div>}
            {pi.location && <div className="flex md:justify-end items-center gap-1.5"><MapPin size={12} /> {pi.location}</div>}
            {pi.portfolio && <div className="flex md:justify-end items-center gap-1.5 font-bold text-white"><Globe size={12} /> {pi.portfolio}</div>}
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Column (2 cols) */}
        <div className="md:col-span-2 space-y-5">
          {/* Statement */}
          {pi.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: primaryColor }}>
                <Sparkles size={13} />
                Creative Statement
              </h2>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                {pi.summary}
              </p>
            </div>
          )}

          {/* Work History */}
          {experiences.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: primaryColor }}>
                <Palette size={13} />
                Experience & Roles
              </h2>
              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="relative pl-3.5 border-l-2" style={{ borderColor: primaryColor }}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-[11px]">{exp.job_title}</span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-600">{exp.company}</div>
                    {exp.responsibilities && (
                      <p className="text-[10.5px] text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                        {exp.responsibilities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Case Studies / Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: primaryColor }}>
                <FolderGit2 size={13} />
                Selected Case Studies
              </h2>
              <div className="grid grid-cols-1 gap-2.5">
                {projects.map((proj, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/40">
                    <div className="flex justify-between items-baseline font-bold text-slate-900 text-[11px]">
                      <span>{proj.title}</span>
                      {proj.project_link && <span className="text-[10px] font-medium text-indigo-600">{proj.project_link}</span>}
                    </div>
                    {proj.technologies && (
                      <div className="text-[10px] font-medium text-slate-500 mt-0.5">Tools: {proj.technologies}</div>
                    )}
                    {proj.description && <p className="text-[10.5px] text-slate-600 mt-1">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Rail (1 col) */}
        <div className="space-y-5">
          {/* Design Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
                Core Toolset & Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold border shadow-2xs"
                    style={{ 
                      borderColor: `${primaryColor}40`,
                      backgroundColor: `${primaryColor}0d`,
                      color: primaryColor
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
                Education
              </h2>
              <div className="space-y-2.5">
                {educations.map((edu, idx) => (
                  <div key={idx} className="text-[11px]">
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-600">{edu.institution}</div>
                    <div className="text-[10px] text-slate-500">{edu.graduation_year}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Awards */}
          {certs.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
                Certifications
              </h2>
              <div className="space-y-2 text-[10.5px]">
                {certs.map((c, idx) => (
                  <div key={idx} className="border-l-2 pl-2 border-slate-300">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-[10px] text-slate-500">{c.issuing_organization}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
                Recognition
              </h2>
              <div className="space-y-1.5 text-[10.5px]">
                {achievements.map((a, idx) => (
                  <div key={idx} className="text-slate-700">
                    <span className="font-bold text-slate-900">• {a.title}:</span> {a.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
