import React, { useState } from 'react';
import { Cpu, Plus, X, Sparkles, Loader2, Check } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { aiService } from '../../services/api';

export const SkillsSection = () => {
  const { currentResume, updateSectionList, addItemToSection } = useResume();
  const skills = currentResume.skills || [];
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Technical');
  const [newSkillLevel, setNewSkillLevel] = useState('Proficient');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState(null);

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    if (!newSkillName.trim()) return;

    // Check duplicate
    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setNewSkillName('');
      return;
    }

    addItemToSection('skills', {
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel
    });
    setNewSkillName('');
  };

  const handleRemoveSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    updateSectionList('skills', updated);
  };

  const handleFetchAISkills = async () => {
    setIsSuggesting(true);
    try {
      const res = await aiService.suggestSkills({
        job_title: currentResume.personal_info?.professional_title || currentResume.target_role || 'Software Engineer'
      });
      if (res.data?.success && res.data?.data) {
        setSuggestedSkills(res.data.data);
      }
    } catch (err) {
      console.error('Fetch skills error:', err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const addSuggestedSkill = (name, category = 'Technical') => {
    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    addItemToSection('skills', {
      name,
      category,
      level: 'Proficient'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="text-blue-600" size={18} />
            Skills & Competencies
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add both technical tools and interpersonal strengths.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFetchAISkills}
          disabled={isSuggesting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all disabled:opacity-50"
        >
          {isSuggesting ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Finding Skills...
            </>
          ) : (
            <>
              <Sparkles size={13} />
              AI Suggest Skills
            </>
          )}
        </button>
      </div>

      {/* Add Skill Form */}
      <form onSubmit={handleAddSkill} className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <input
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="Skill name (e.g. React.js, Python, System Design)..."
          className="flex-1 min-w-[180px] px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        />

        <select
          value={newSkillCategory}
          onChange={(e) => setNewSkillCategory(e.target.value)}
          className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
        >
          <option value="Technical">Technical</option>
          <option value="Soft">Soft Skill</option>
        </select>

        <select
          value={newSkillLevel}
          onChange={(e) => setNewSkillLevel(e.target.value)}
          className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Proficient">Proficient</option>
          <option value="Expert">Expert</option>
        </select>

        <button
          type="submit"
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
        >
          <Plus size={14} /> Add
        </button>
      </form>

      {/* Suggested Skills Banner */}
      {suggestedSkills && (
        <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
              <Sparkles size={13} className="text-blue-600" />
              Recommended for "{suggestedSkills.job_title}":
            </span>
            <button
              onClick={() => setSuggestedSkills(null)}
              className="text-[10px] text-slate-500 hover:text-slate-700"
            >
              Dismiss
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedSkills.recommended?.map((sName, idx) => {
              const alreadyHas = skills.some((s) => s.name.toLowerCase() === sName.toLowerCase());
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => !alreadyHas && addSuggestedSkill(sName)}
                  disabled={alreadyHas}
                  className={`px-2 py-0.5 text-[10.5px] rounded-full border transition-all flex items-center gap-1 ${
                    alreadyHas
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                      : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100 shadow-2xs'
                  }`}
                >
                  {alreadyHas ? <Check size={10} /> : <Plus size={10} />}
                  {sName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Skills List */}
      <div className="space-y-3">
        <div>
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            Active Skills ({skills.length})
          </span>
          {skills.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 shadow-2xs text-slate-800"
                >
                  <span>{skill.name}</span>
                  <span className="text-[9.5px] text-slate-400 px-1 py-0.2 rounded bg-slate-50 border border-slate-100">
                    {skill.level}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                    title="Remove skill"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
