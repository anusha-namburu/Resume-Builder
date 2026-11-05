import React from 'react';
import { Trophy, Globe, Heart, Plus, Trash2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const AdditionalSections = () => {
  const {
    currentResume,
    addItemToSection,
    removeItemFromSection,
    updateItemInSection,
  } = useResume();

  const achievements = currentResume.achievements || [];
  const languages = currentResume.languages || [];
  const interests = currentResume.interests || [];

  return (
    <div className="space-y-6">
      {/* 1. Achievements */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Trophy className="text-amber-500" size={16} />
              Key Achievements & Honors
            </h3>
            <p className="text-[11px] text-slate-500">Awards, hackathon wins, leadership honors.</p>
          </div>
          <button
            type="button"
            onClick={() => addItemToSection('achievements', { title: '', description: '' })}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus size={13} /> Add Achievement
          </button>
        </div>

        {achievements.map((ach, idx) => (
          <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <input
              type="text"
              value={ach.title || ''}
              onChange={(e) => updateItemInSection('achievements', idx, 'title', e.target.value)}
              placeholder="e.g. 1st Place Hackathon Winner"
              className="w-1/3 px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white"
            />
            <input
              type="text"
              value={ach.description || ''}
              onChange={(e) => updateItemInSection('achievements', idx, 'description', e.target.value)}
              placeholder="e.g. Built an accessibility AI agent competing against 50+ teams."
              className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white"
            />
            <button
              type="button"
              onClick={() => removeItemFromSection('achievements', idx)}
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* 2. Languages */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Globe className="text-blue-600" size={16} />
              Languages
            </h3>
            <p className="text-[11px] text-slate-500">Languages you speak and your proficiency level.</p>
          </div>
          <button
            type="button"
            onClick={() => addItemToSection('languages', { title: '', description: 'Fluent' })}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus size={13} /> Add Language
          </button>
        </div>

        {languages.map((lang, idx) => (
          <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <input
              type="text"
              value={lang.title || ''}
              onChange={(e) => updateItemInSection('languages', idx, 'title', e.target.value)}
              placeholder="e.g. English, Spanish, German"
              className="w-1/2 px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white"
            />
            <input
              type="text"
              value={lang.description || ''}
              onChange={(e) => updateItemInSection('languages', idx, 'description', e.target.value)}
              placeholder="e.g. Native, Full Professional, Conversational"
              className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white"
            />
            <button
              type="button"
              onClick={() => removeItemFromSection('languages', idx)}
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* 3. Interests */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Heart className="text-rose-500" size={16} />
              Interests & Hobbies
            </h3>
            <p className="text-[11px] text-slate-500">Extracurricular activities and personal passions.</p>
          </div>
          <button
            type="button"
            onClick={() => addItemToSection('interests', { title: '' })}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus size={13} /> Add Interest
          </button>
        </div>

        {interests.map((int, idx) => (
          <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <input
              type="text"
              value={int.title || ''}
              onChange={(e) => updateItemInSection('interests', idx, 'title', e.target.value)}
              placeholder="e.g. Open Source Contributing, Chess, Robotics"
              className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white"
            />
            <button
              type="button"
              onClick={() => removeItemFromSection('interests', idx)}
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
