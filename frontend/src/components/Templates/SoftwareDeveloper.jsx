import React from 'react';
import { Terminal, Globe, Mail, Phone, MapPin, ExternalLink, Cpu } from 'lucide-react';
import { GithubIcon } from '../BrandIcons';

export const SoftwareDeveloper = ({ data }) => {
  const primaryColor = data.color_theme || '#059669';
  const pi = data.personal_info || {};
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const certs = data.certifications || [];
  const achievements = data.achievements || [];

  const techSkills = skills.filter((s) => s.category === 'Technical' || !s.category);
  const softSkills = skills.filter((s) => s.category === 'Soft');

  return (
    <div className="resume-a4-sheet text-slate-800 p-7 text-xs leading-relaxed font-sans min-h-[1123px] bg-white">
      {/* Dev Header */}
      <div className="border-b-2 pb-3 mb-4" style={{ borderColor: primaryColor }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: primaryColor }}>
                $whoami
              </span>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {pi.full_name || 'Your Full Name'}
              </h1>
            </div>
            <p className="text-xs font-mono font-semibold mt-1" style={{ color: primaryColor }}>
              &gt; {pi.professional_title || data.target_role || 'Senior Software Engineer | Full-Stack'}
            </p>
          </div>

          {/* Socials / Links */}
          <div className="text-[10.5px] font-mono text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
            {pi.email && <span className="flex items-center gap-1"><Mail size={11} /> {pi.email}</span>}
            {pi.phone && <span className="flex items-center gap-1"><Phone size={11} /> {pi.phone}</span>}
            {pi.location && <span className="flex items-center gap-1"><MapPin size={11} /> {pi.location}</span>}
            {pi.github && <span className="flex items-center gap-1 font-bold text-slate-900"><GithubIcon size={11} /> {pi.github}</span>}
            {pi.portfolio && <span className="flex items-center gap-1 text-emerald-700 font-bold"><Globe size={11} /> {pi.portfolio}</span>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Technical Summary */}
        {pi.summary && (
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <Terminal size={12} />
              // ABOUT & ARCHITECTURE PHILOSOPHY
            </h2>
            <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
              {pi.summary}
            </p>
          </div>
        )}

        {/* Technical Stack Pills */}
        {techSkills.length > 0 && (
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <Cpu size={12} />
              // TECHNICAL PROFICIENCIES
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {techSkills.map((s, idx) => (
                <span 
                  key={idx} 
                  className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1"
                  style={{ 
                    borderColor: `${primaryColor}40`, 
                    backgroundColor: `${primaryColor}0f`,
                    color: primaryColor 
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  {s.name}
                  {s.level && <span className="text-[9px] opacity-70">({s.level})</span>}
                </span>
              ))}
            </div>
            {softSkills.length > 0 && (
              <div className="text-[10px] font-sans text-slate-600 mt-1">
                <span className="font-semibold">Core Practices: </span>
                {softSkills.map((s) => s.name).join(' • ')}
              </div>
            )}
          </div>
        )}

        {/* Engineering Experience */}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <Terminal size={12} />
              // PRODUCTION EXPERIENCE
            </h2>
            <div className="space-y-3.5">
              {experiences.map((exp, idx) => (
                <div key={idx} className="pl-3 border-l-2" style={{ borderColor: `${primaryColor}60` }}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-[11.5px] font-sans">{exp.job_title}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      [{exp.start_date} – {exp.is_current ? 'PRESENT' : exp.end_date}]
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.responsibilities && (
                    <div className="text-[10.5px] text-slate-700 mt-1 font-sans whitespace-pre-line leading-relaxed">
                      {exp.responsibilities}
                    </div>
                  )}
                  {exp.achievements && (
                    <div className="text-[10.5px] font-sans font-medium text-emerald-800 bg-emerald-50/70 p-1.5 rounded mt-1 border border-emerald-200">
                      <strong>Impact:</strong> {exp.achievements}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Engineering Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <Terminal size={12} />
              // REPOSITORIES & SYSTEMS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-2.5 rounded border border-slate-200 bg-slate-50/50">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-[11px] font-mono">{proj.title}</span>
                    {proj.project_link && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 font-mono font-medium">
                        <ExternalLink size={10} /> link
                      </span>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="font-mono text-[9.5px] text-slate-500 mt-0.5">
                      Stack: {proj.technologies}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-[10.5px] text-slate-700 mt-1 font-sans">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {educations.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>
                // EDUCATION
              </h3>
              <div className="space-y-1.5">
                {educations.map((edu, idx) => (
                  <div key={idx} className="text-[10.5px]">
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-600">{edu.institution} ({edu.graduation_year})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certs.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>
                // CERTIFICATIONS
              </h3>
              <div className="space-y-1 text-[10.5px]">
                {certs.map((c, idx) => (
                  <div key={idx} className="text-slate-700">
                    <span className="font-semibold text-slate-900">{c.name}</span> — {c.issuing_organization}
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
