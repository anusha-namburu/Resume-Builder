import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { resumeService } from '../services/api';

const ResumeContext = createContext(null);

const DEFAULT_RESUME_STATE = {
  title: 'Untitled Resume',
  template_id: 'modern-professional',
  target_role: 'Software Engineer',
  color_theme: '#1e3a8a',
  font_family: 'Inter',
  completion_percentage: 20,
  section_order: ['summary', 'experience', 'education', 'projects', 'skills', 'certifications', 'internships', 'achievements', 'languages', 'interests'],
  personal_info: {
    full_name: '',
    professional_title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  educations: [],
  experiences: [],
  internships: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
  languages: [],
  interests: []
};

export const ResumeProvider = ({ children }) => {
  const [currentResume, setCurrentResume] = useState(DEFAULT_RESUME_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Update specific fields of personal info
  const updatePersonalInfo = (field, value) => {
    setCurrentResume((prev) => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [field]: value
      }
    }));
  };

  // Generic update for whole list sections (e.g. educations, experiences, projects, skills, etc.)
  const updateSectionList = (sectionKey, newList) => {
    setCurrentResume((prev) => ({
      ...prev,
      [sectionKey]: newList
    }));
  };

  // Add item to section
  const addItemToSection = (sectionKey, defaultItem) => {
    setCurrentResume((prev) => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] || []), { ...defaultItem, id: Date.now() }]
    }));
  };

  // Remove item from section
  const removeItemFromSection = (sectionKey, index) => {
    setCurrentResume((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter((_, i) => i !== index)
    }));
  };

  // Update single item in section
  const updateItemInSection = (sectionKey, index, field, value) => {
    setCurrentResume((prev) => {
      const updated = [...(prev[sectionKey] || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return {
        ...prev,
        [sectionKey]: updated
      };
    });
  };

  // Update styling & settings
  const updateSettings = (key, value) => {
    setCurrentResume((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Reorder sections
  const updateSectionOrder = (newOrder) => {
    setCurrentResume((prev) => ({
      ...prev,
      section_order: newOrder
    }));
  };

  // Save changes to backend
  const saveResume = async () => {
    if (!currentResume.id) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await resumeService.update(currentResume.id, currentResume);
      if (res.data?.success) {
        setLastSavedTime(new Date());
        setCurrentResume(res.data.resume);
      }
    } catch (err) {
      console.error('Save failed:', err);
      setSaveError(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate local completion percentage
  const calculateLocalCompletion = useCallback(() => {
    let score = 0;
    const pi = currentResume.personal_info || {};
    if (pi.full_name) score += 5;
    if (pi.email) score += 5;
    if (pi.phone) score += 5;
    if (pi.professional_title) score += 5;
    if (pi.summary) score += 5;
    if (currentResume.educations?.length > 0) score += 15;
    if (currentResume.experiences?.length > 0) score += 20;
    if (currentResume.projects?.length > 0) score += 15;
    if (currentResume.skills?.length > 0) score += 15;
    if (currentResume.certifications?.length > 0 || currentResume.achievements?.length > 0) score += 10;
    return Math.min(score, 100);
  }, [currentResume]);

  return (
    <ResumeContext.Provider
      value={{
        currentResume,
        setCurrentResume,
        updatePersonalInfo,
        updateSectionList,
        addItemToSection,
        removeItemFromSection,
        updateItemInSection,
        updateSettings,
        updateSectionOrder,
        saveResume,
        isSaving,
        lastSavedTime,
        saveError,
        completionPercentage: calculateLocalCompletion()
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
