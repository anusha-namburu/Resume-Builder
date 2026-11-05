import React from 'react';
import { Mail, Phone, MapPin, Globe, Award, BookOpen, Briefcase, Code, CheckCircle2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../BrandIcons';

export const ModernProfessional = ({ data }) => {
  const primaryColor = data.color_theme || '#1e3a8a';
  const pi = data.personal_info || {};
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const certs = data.certifications || [];
  const internships = data.internships || [];
  const achievements = data.achievements || [];
  const languages = data.languages || [];

  return (
    <div className="resume-a4-sheet text-slate-800 flex flex-col md:flex-row text-xs leading-relaxed font-sans min-h-[1123px]">
      {/* Left Sidebar (35%) */}
      <div 
        className="w-full md:w-[35%] p-6 text-slate-700 border-r border-slate-200 flex flex-col space-y-5"
        style={{ backgroundColor: `${primaryColor}08` }}
      >
        {/* Contact Information */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b" style={{ borderColor: primaryColor, color: primaryColor }}>
            Contact
          </h3>
          <div className="space-y-1.5 text-[11px]">
            {pi.email && (
              <div className="flex items-center gap-2 break-all">
                <Mail size={12} style={{ color: primaryColor }} className="shrink-0" />
                <span>{pi.email}</span>
              </div>
            )}
            {pi.phone && (
              <div className="flex items-center gap-2">
                <Phone size={12} style={{ color: primaryColor }} className="shrink-0" />
                <span>{pi.phone}</span>
              </div>
            )}
            {pi.location && (
              <div className="flex items-center gap-2">
                <MapPin size={12} style={{ color: primaryColor }} className="shrink-0" />
                <span>{pi.location}</span>
              </div>
            )}
            {pi.linkedin && (
              <div className="flex items-center gap-2 break-all">
                <LinkedinIcon size={12} style={{ color: primaryColor }} className="shrink-0" />
                <span>{pi.linkedin}</span>
              </div>
            )}
            {pi.github && (
              <div className="flex items-center gap-2 break-all">
                <GithubIcon size={12} style={{ color: primaryColor }} className="shrink-0" />
                <span>{pi.github}</span>
              </div>
            )}
            {pi.portfolio && (
              <div className="flex items-center gap-2 break-all">
                <Globe size={12} style={{ color: primaryColor }} className="shrink-0" />
                <span>{pi.portfolio}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b" style={{ borderColor: primaryColor, color: primaryColor }}>
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-0.5 rounded text-[10px] font-medium border"
                  style={{ 
                    backgroundColor: `${primaryColor}15`, 
                    color: primaryColor,
                    borderColor: `${primaryColor}30` 
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
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b" style={{ borderColor: primaryColor, color: primaryColor }}>
              Education
            </h3>
            <div className="space-y-3">
              {educations.map((edu, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution}</div>
                  <div className="text-[10px] text-slate-500 flex justify-between mt-0.5">
                    <span>{edu.graduation_year}</span>
                    {edu.score && <span className="font-semibold text-slate-700">GPA: {edu.score}</span>}
                  </div>
                  {edu.description && <p className="text-[10px] text-slate-500 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certs.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b" style={{ borderColor: primaryColor, color: primaryColor }}>
              Certifications
            </h3>
            <div className="space-y-2">
              {certs.map((c, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="text-[10px] text-slate-500">{c.issuing_organization} {c.issue_date && `• ${c.issue_date}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ borderColor: primaryColor, color: primaryColor }}>
              Languages
            </h3>
            <div className="space-y-1 text-[11px]">
              {languages.map((l, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="font-medium text-slate-800">{l.title}</span>
                  <span className="text-slate-500 text-[10px]">{l.description || 'Fluent'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content Area (65%) */}
      <div className="w-full md:w-[65%] p-7 flex flex-col space-y-5 bg-white">
        {/* Name & Title Header */}
        <div className="border-b border-slate-100 pb-3">
          <h1 className="text-2xl font-black tracking-tight" style={{ color: primaryColor }}>
            {pi.full_name || 'Your Full Name'}
          </h1>
          <p className="text-sm font-semibold text-slate-600 mt-0.5">
            {pi.professional_title || data.target_role || 'Professional Title'}
          </p>
        </div>

        {/* Summary */}
        {pi.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <Briefcase size={13} />
              Professional Summary
            </h2>
            <p className="text-slate-600 text-[11px] leading-relaxed text-justify">
              {pi.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <Briefcase size={13} />
              Work Experience
            </h2>
            <div className="space-y-3.5">
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-3 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-[11px]">{exp.job_title}</span>
                    <span className="text-[10px] font-medium text-slate-500">
                      {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.responsibilities && (
                    <div className="text-[10.5px] text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                      {exp.responsibilities}
                    </div>
                  )}
                  {exp.achievements && (
                    <div className="text-[10.5px] font-medium text-emerald-800 bg-emerald-50/60 p-1.5 rounded mt-1.5 border border-emerald-100">
                      <span className="font-bold">Key Impact:</span> {exp.achievements}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internships if any */}
        {internships.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <Briefcase size={13} />
              Internship Experience
            </h2>
            <div className="space-y-2.5">
              {internships.map((intern, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{intern.job_title} — {intern.company}</span>
                    <span className="text-[10px] font-normal text-slate-500">{intern.start_date} - {intern.end_date}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 mt-0.5">{intern.responsibilities}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <Code size={13} />
              Featured Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="bg-slate-50/70 p-2.5 rounded border border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-[11px]">{proj.title}</span>
                    {proj.project_link && (
                      <span className="text-[10px] text-blue-600 font-medium">{proj.project_link}</span>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                      Stack: {proj.technologies}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-[10.5px] text-slate-600 mt-1">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: primaryColor }}>
              <Award size={13} />
              Key Achievements
            </h2>
            <ul className="space-y-1 text-[10.5px] text-slate-600">
              {achievements.map((ach, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">{ach.title}:</strong> {ach.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
