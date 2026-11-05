import React from 'react';
import { ModernProfessional } from './ModernProfessional';
import { ClassicCorporate } from './ClassicCorporate';
import { MinimalATS } from './MinimalATS';
import { CreativeDesigner } from './CreativeDesigner';
import { StudentFresher } from './StudentFresher';
import { SoftwareDeveloper } from './SoftwareDeveloper';

export const ResumeRenderer = ({ data, id = 'resume-preview-container' }) => {
  const templateId = data?.template_id || 'modern-professional';

  const renderTemplate = () => {
    switch (templateId) {
      case 'classic-corporate':
        return <ClassicCorporate data={data} />;
      case 'minimal-ats':
        return <MinimalATS data={data} />;
      case 'creative-designer':
        return <CreativeDesigner data={data} />;
      case 'student-fresher':
        return <StudentFresher data={data} />;
      case 'software-developer':
        return <SoftwareDeveloper data={data} />;
      case 'modern-professional':
      default:
        return <ModernProfessional data={data} />;
    }
  };

  return (
    <div id={id} className="w-full flex justify-center">
      {renderTemplate()}
    </div>
  );
};
