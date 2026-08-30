'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Briefcase, GraduationCap, Code, Award, 
  DollarSign, Plus, Trash2, CheckCircle2, 
  Save
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { UserProfile, SkillItem, ExperienceItem, EducationItem, ProjectItem } from '@/types';

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'skills' | 'experience' | 'education' | 'projects' | 'preferences'>('info');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local Editable State
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState(110000);
  const [maxSalary, setMaxSalary] = useState(160000);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('backend');
  const [newSkillProficiency, setNewSkillProficiency] = useState('Intermediate');
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [links, setLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setTargetRole(profile.target_role || '');
      setExperienceLevel(profile.experience_level || '');
      setBio(profile.bio || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
      setMinSalary(profile.min_salary || 110000);
      setMaxSalary(profile.max_salary || 160000);
      setSkills(profile.skills || []);
      setExperience(profile.experience || []);
      setEducation(profile.education || []);
      setProjects(profile.projects || []);
      setLinks(profile.links || {});
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await api.updateProfile({
        target_role: targetRole,
        experience_level: experienceLevel,
        bio,
        phone,
        location,
        min_salary: Number(minSalary),
        max_salary: Number(maxSalary),
        skills,
        experience,
        education,
        projects,
        links,
      });
      await refreshProfile();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      const exists = skills.some(s => s.skill_name.toLowerCase() === newSkillName.trim().toLowerCase());
      if (!exists) {
        setSkills([
          ...skills,
          {
            skill_name: newSkillName.trim(),
            category: newSkillCategory,
            proficiency: newSkillProficiency,
            years_experience: 2.0,
            is_highlighted: true,
          }
        ]);
        setNewSkillName('');
      }
    }
  };

  const handleRemoveSkill = (name: string) => {
    setSkills(skills.filter(s => s.skill_name !== name));
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-row font-body selection:bg-black selection:text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader 
          title="Candidate Dossier & Skill Taxonomy" 
          subtitle="Configure structured telemetry, engineering background, and compensation parameters"
          actionButton={
            <Button
              size="sm"
              variant="primary"
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={savedSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
            >
              {savedSuccess ? 'Changes Committed' : 'Commit Dossier'}
            </Button>
          }
        />

        <div className="p-8 space-y-8 max-w-6xl w-full mx-auto">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b-2 border-black pb-3 overflow-x-auto">
            {[
              { id: 'info', label: 'Identity & Bio', icon: User },
              { id: 'skills', label: `Taxonomy (${skills.length})`, icon: Code },
              { id: 'experience', label: `Experience (${experience.length})`, icon: Briefcase },
              { id: 'education', label: `Education (${education.length})`, icon: GraduationCap },
              { id: 'projects', label: `Projects (${projects.length})`, icon: Award },
              { id: 'preferences', label: 'Compensation Targets', icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap border transition-colors duration-100 ${
                    isActive
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-black hover:bg-mono-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Personal Info & Bio */}
          {activeTab === 'info' && (
            <div className="p-8 border-2 border-black bg-white space-y-6">
              <div className="border-b border-black pb-3">
                <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">
                  Candidate Identity & Engineering Narrative
                </h3>
                <p className="font-mono text-2xs uppercase tracking-widest text-mono-500 mt-0.5">Used for ATS header extraction and semantic alignment</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Target Role Title</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Experience Tier</label>
                  <input
                    type="text"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Location Base</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Contact Line</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <label className="block uppercase tracking-wider font-bold text-mono-700">Professional Dossier Summary</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Summarize your systems engineering specialization and verified impact..."
                  className="w-full p-3.5 border-2 border-black bg-white text-black font-body text-sm placeholder:italic placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">GitHub Repository</label>
                  <input
                    type="text"
                    value={links.github || ''}
                    onChange={(e) => setLinks({ ...links, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={links.linkedin || ''}
                    onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Personal Domain</label>
                  <input
                    type="text"
                    value={links.portfolio || ''}
                    onChange={(e) => setLinks({ ...links, portfolio: e.target.value })}
                    placeholder="https://mywebsite.dev"
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Skills Matrix */}
          {activeTab === 'skills' && (
            <div className="p-8 border-2 border-black bg-white space-y-6">
              <div className="border-b border-black pb-3">
                <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">
                  Technical Skill Classification Taxonomy
                </h3>
                <p className="font-mono text-2xs uppercase tracking-widest text-mono-500 mt-0.5">Define verified engineering capabilities and frameworks</p>
              </div>

              {/* Add New Skill Bar */}
              <div className="p-6 border-2 border-black bg-mono-50 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Capability</label>
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g. Kubernetes, Go"
                    className="w-full p-2.5 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Domain Category</label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="w-full p-2.5 border-2 border-black bg-white text-black font-mono text-xs focus:outline-none focus:border-b-4 focus:border-black"
                  >
                    <option value="frontend">Frontend (React, TypeScript)</option>
                    <option value="backend">Backend (Python, FastAPI, Go)</option>
                    <option value="database">Database (PostgreSQL, Redis)</option>
                    <option value="cloud">Cloud & Infra (Docker, AWS, K8s)</option>
                    <option value="ai_ml">AI & Systems (PyTorch, LLMs)</option>
                    <option value="soft">Architectural Leadership</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Proficiency Tier</label>
                  <select
                    value={newSkillProficiency}
                    onChange={(e) => setNewSkillProficiency(e.target.value)}
                    className="w-full p-2.5 border-2 border-black bg-white text-black font-mono text-xs focus:outline-none focus:border-b-4 focus:border-black"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <Button variant="primary" size="sm" onClick={handleAddSkill} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Append Vector
                </Button>
              </div>

              {/* Skills Grid by Category */}
              <div className="space-y-6">
                {['frontend', 'backend', 'database', 'cloud', 'soft'].map((cat) => {
                  const catSkills = skills.filter(s => s.category === cat);
                  if (catSkills.length === 0) return null;

                  return (
                    <div key={cat} className="p-6 border border-black bg-mono-50 space-y-3">
                      <div className="font-mono text-xs uppercase tracking-widest text-black font-bold border-b border-mono-200 pb-1">
                        {cat.toUpperCase()} ({catSkills.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {catSkills.map((s) => (
                          <div
                            key={s.skill_name}
                            className="inline-flex items-center gap-2 px-3 py-1.5 border border-black bg-white text-xs text-black font-mono"
                          >
                            <span className="font-bold">{s.skill_name}</span>
                            <span className="text-2xs bg-black text-white px-1.5 py-0.2">
                              {s.proficiency}
                            </span>
                            <button
                              onClick={() => handleRemoveSkill(s.skill_name)}
                              className="text-mono-400 hover:text-black ml-1"
                            >
                              <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Experience */}
          {activeTab === 'experience' && (
            <div className="p-8 border-2 border-black bg-white space-y-6">
              <div className="flex items-center justify-between border-b border-black pb-3">
                <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">Professional Engineering Record</h3>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setExperience([
                      ...experience,
                      {
                        role: 'Software Engineer',
                        company: 'New Company',
                        location: 'Remote',
                        startDate: '2024-01',
                        endDate: 'Present',
                        current: true,
                        bullets: ['Engineered scalable microservices and user interfaces with modern tech stack.']
                      }
                    ]);
                  }}
                >
                  Add Milestone
                </Button>
              </div>

              <div className="space-y-6">
                {experience.map((exp, expIdx) => (
                  <div key={expIdx} className="p-6 border border-black bg-mono-50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 mr-4 font-mono text-xs">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[expIdx].role = e.target.value;
                            setExperience(updated);
                          }}
                          placeholder="Role"
                          className="p-2 border border-black bg-white text-black font-serif font-bold text-sm"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[expIdx].company = e.target.value;
                            setExperience(updated);
                          }}
                          placeholder="Company"
                          className="p-2 border border-black bg-white text-black font-body text-xs"
                        />
                        <input
                          type="text"
                          value={`${exp.startDate} - ${exp.endDate}`}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[expIdx].startDate = e.target.value;
                            setExperience(updated);
                          }}
                          placeholder="Dates"
                          className="p-2 border border-black bg-white text-black font-mono text-xs"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setExperience(experience.filter((_, i) => i !== expIdx));
                        }}
                        className="text-mono-400 hover:text-black p-1.5"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2 font-mono text-xs">
                      <div className="uppercase tracking-wider font-bold text-mono-700">Verified Technical Deliverables:</div>
                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[expIdx].bullets[bIdx] = e.target.value;
                              setExperience(updated);
                            }}
                            className="flex-1 p-3 border border-black bg-white text-black font-body text-xs focus:outline-none focus:border-b-4 focus:border-black"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Education */}
          {activeTab === 'education' && (
            <div className="p-8 border-2 border-black bg-white space-y-6">
              <div className="flex items-center justify-between border-b border-black pb-3">
                <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">Academic Credentials</h3>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setEducation([
                      ...education,
                      {
                        degree: 'B.S. in Computer Science',
                        institution: 'University Name',
                        year: '2024',
                        gpa: '3.8 / 4.0',
                        highlights: 'Dean\'s Honor List'
                      }
                    ]);
                  }}
                >
                  Add Degree
                </Button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {education.map((edu, eduIdx) => (
                  <div key={eduIdx} className="p-6 border border-black bg-mono-50 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[eduIdx].degree = e.target.value;
                          setEducation(updated);
                        }}
                        placeholder="Degree"
                        className="p-2 border border-black bg-white text-black font-serif font-bold text-sm"
                      />
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[eduIdx].institution = e.target.value;
                          setEducation(updated);
                        }}
                        placeholder="Institution"
                        className="p-2 border border-black bg-white text-black font-body text-xs"
                      />
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[eduIdx].year = e.target.value;
                          setEducation(updated);
                        }}
                        placeholder="Year"
                        className="p-2 border border-black bg-white text-black font-mono text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Projects */}
          {activeTab === 'projects' && (
            <div className="p-8 border-2 border-black bg-white space-y-6">
              <div className="flex items-center justify-between border-b border-black pb-3">
                <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">Architecture & Open-Source Projects</h3>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setProjects([
                      ...projects,
                      {
                        title: 'New AI Project',
                        tech: ['TypeScript', 'FastAPI'],
                        description: 'A distributed system solving high concurrency problems.',
                        github: 'https://github.com/username/project',
                        demo: ''
                      }
                    ]);
                  }}
                >
                  Add Project
                </Button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {projects.map((proj, pIdx) => (
                  <div key={pIdx} className="p-6 border border-black bg-mono-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[pIdx].title = e.target.value;
                          setProjects(updated);
                        }}
                        placeholder="Project Title"
                        className="p-2 border border-black bg-white text-black font-serif font-bold text-sm"
                      />
                      <button
                        onClick={() => setProjects(projects.filter((_, i) => i !== pIdx))}
                        className="text-mono-400 hover:text-black p-1.5"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[pIdx].description = e.target.value;
                        setProjects(updated);
                      }}
                      placeholder="Project description and quantifiable outcomes..."
                      className="w-full p-3 border border-black bg-white text-black font-body text-xs focus:outline-none focus:border-b-4 focus:border-black"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Salary & Preferences */}
          {activeTab === 'preferences' && (
            <div className="p-8 border-2 border-black bg-white space-y-6">
              <div className="border-b border-black pb-3">
                <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">Target Compensation & Work Bounds</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Minimum Base Threshold ($ USD)</label>
                  <input
                    type="number"
                    value={minSalary}
                    onChange={(e) => setMinSalary(Number(e.target.value))}
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Target Upper Boundary ($ USD)</label>
                  <input
                    type="number"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(Number(e.target.value))}
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

