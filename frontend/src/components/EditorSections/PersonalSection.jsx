import React from 'react';
import { User, Mail, Phone, MapPin, Globe, Briefcase } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../BrandIcons';
import { useResume } from '../../context/ResumeContext';

export const PersonalSection = () => {
  const { currentResume, updatePersonalInfo } = useResume();
  const pi = currentResume.personal_info || {};

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="text-blue-600" size={18} />
          Personal Information
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Provide your primary contact and profile details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={pi.full_name || ''}
              onChange={(e) => updatePersonalInfo('full_name', e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Title *</label>
          <div className="relative">
            <Briefcase size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={pi.professional_title || ''}
              onChange={(e) => updatePersonalInfo('professional_title', e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="email"
              value={pi.email || ''}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="alex.morgan@example.com"
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="tel"
              value={pi.phone || ''}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">City, State / Country</label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={pi.location || ''}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
          <div className="relative">
            <LinkedinIcon size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={pi.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              placeholder="linkedin.com/in/alexmorgan"
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Profile</label>
          <div className="relative">
            <GithubIcon size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={pi.github || ''}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
              placeholder="github.com/alexmorgan"
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio / Website</label>
          <div className="relative">
            <Globe size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={pi.portfolio || ''}
              onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
              placeholder="alexmorgan.dev"
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
