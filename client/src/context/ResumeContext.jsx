import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { resumeService } from '../services/resumeService';
import toast from 'react-hot-toast';

const ResumeContext = createContext(null);

const defaultResumeData = {
  title: 'My Resume',
  template: 'modern',
  colorScheme: '#2563EB',
  fontFamily: 'Inter',
  personalDetails: {
    firstName: '', lastName: '', email: '', phone: '',
    location: '', city: '', country: '', jobTitle: '',
    summary: '', objective: '', website: '',
    linkedin: '', github: '', twitter: '', portfolio: ''
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  achievements: [],
  certifications: [],
  languages: [],
  interests: [],
  sectionOrder: ['personalDetails', 'summary', 'experience', 'education', 'projects', 'skills', 'achievements', 'certifications', 'languages', 'interests']
};

export const ResumeProvider = ({ children }) => {
  const [currentResume, setCurrentResume] = useState(null);
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const autosaveTimer = useRef(null);

  // Autosave every 3 seconds when dirty
  useEffect(() => {
    if (!isDirty || !currentResume?._id) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      try {
        setSaving(true);
        await resumeService.updateResume(currentResume._id, resumeData);
        setIsDirty(false);
      } catch (err) {
        console.error('Autosave failed:', err);
      } finally {
        setSaving(false);
      }
    }, 3000);
    return () => clearTimeout(autosaveTimer.current);
  }, [resumeData, isDirty, currentResume]);

  const loadResume = useCallback(async (id) => {
    const data = await resumeService.getResume(id);
    setCurrentResume(data.data);
    setResumeData({
      ...defaultResumeData,
      ...data.data,
      personalDetails: { ...defaultResumeData.personalDetails, ...data.data.personalDetails }
    });
    setIsDirty(false);
  }, []);

  const updateSection = useCallback((section, value) => {
    setResumeData(prev => ({ ...prev, [section]: value }));
    setIsDirty(true);
  }, []);

  const updatePersonalDetails = useCallback((field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, [field]: value }
    }));
    setIsDirty(true);
  }, []);

  const saveNow = useCallback(async () => {
    if (!currentResume?._id) return;
    try {
      setSaving(true);
      await resumeService.updateResume(currentResume._id, resumeData);
      setIsDirty(false);
      toast.success('Resume saved!');
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }, [currentResume, resumeData]);

  const resetResume = useCallback(() => {
    setCurrentResume(null);
    setResumeData(defaultResumeData);
    setIsDirty(false);
  }, []);

  return (
    <ResumeContext.Provider value={{
      currentResume, resumeData, saving, isDirty,
      loadResume, updateSection, updatePersonalDetails, saveNow, resetResume,
      setResumeData, setCurrentResume, defaultResumeData
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within ResumeProvider');
  return context;
};

export default ResumeContext;
