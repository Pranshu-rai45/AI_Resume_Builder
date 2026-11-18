import ModernTemplate from '../templates/ModernTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import CorporateTemplate from '../templates/CorporateTemplate';
import LaTeXTemplate from '../templates/LaTeXTemplate';

const LivePreview = ({ resumeData }) => {
  const templates = {
    latex: LaTeXTemplate,
    modern: ModernTemplate,
    professional: ProfessionalTemplate,
    minimal: MinimalTemplate,
    creative: CreativeTemplate,
    corporate: CorporateTemplate,
  };

  const TemplateComponent = templates[resumeData?.template] || LaTeXTemplate;

  return (
    <div className="w-[794px] min-h-[1123px] bg-white shadow-2xl shadow-black/50">
      <TemplateComponent resumeData={resumeData} />
    </div>
  );
};

export default LivePreview;
