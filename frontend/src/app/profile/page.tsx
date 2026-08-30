'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Briefcase, GraduationCap, Code, Award, 
  DollarSign, Link2, Plus, Trash2, CheckCircle2, 
  Save, Sparkles, Wand2, RefreshCw
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
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
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-row selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader 
          title="Career Profile & Skill Matrix" 
          subtitle="Configure your structured profile, background, and career targets"
          actionButton={
            <Button
              size="sm"
              variant="primary"
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={savedSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
            >
              {savedSuccess ? 'Saved Changes!' : 'Save Profile'}
            </Button>
          }
        />

        <div className="p-6 space-y-6 max-w-6xl w-full mx-auto">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto">
            {[
              { id: 'info', label: 'Personal & Bio', icon: User },
              { id: 'skills', label: `Skills (${skills.length})`, icon: Code },
              { id: 'experience', label: `Experience (${experience.length})`, icon: Briefcase },
              { id: 'education', label: `Education (${education.length})`, icon: GraduationCap },
              { id: 'projects', label: `Projects (${projects.length})`, icon: Award },
              { id: 'preferences', label: 'Salary & Career Fit', icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Personal Info & Bio */}
          {activeTab === 'info' && (
            <Card className="p-6 space-y-5">
              <CardHeader>
                <CardTitle>Personal Information & Career Narrative</CardTitle>
                <span className="text-xs text-slate-400">Used for ATS headers and AI matching</span>
              </CardHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Job Title</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Experience Level</label>
                  <input
                    type="text"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Professional Bio & Summary</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Summarize your engineering expertise and core impact..."
                  className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">GitHub URL</label>
                  <input
                    type="text"
                    value={links.github || ''}
                    onChange={(e) => setLinks({ ...links, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={links.linkedin || ''}
                    onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Portfolio / Website</label>
                  <input
                    type="text"
                    value={links.portfolio || ''}
                    onChange={(e) => setLinks({ ...links, portfolio: e.target.value })}
                    placeholder="https://mywebsite.dev"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* TAB 2: Skills Matrix */}
          {activeTab === 'skills' && (
            <Card className="p-6 space-y-6">
              <CardHeader>
                <CardTitle>Technical Skills Taxonomy</CardTitle>
                <span className="text-xs text-slate-400">Add or classify your technical skills</span>
              </CardHeader>

              {/* Add New Skill Bar */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Skill Name</label>
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g. Kubernetes, Golang"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1424] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="frontend">Frontend (React, TypeScript, CSS)</option>
                    <option value="backend">Backend (Python, FastAPI, Go)</option>
                    <option value="database">Database (PostgreSQL, Redis)</option>
                    <option value="cloud">Cloud & DevOps (Docker, AWS, K8s)</option>
                    <option value="ai_ml">AI & ML (PyTorch, LangChain)</option>
                    <option value="soft">System Design & Leadership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Proficiency</label>
                  <select
                    value={newSkillProficiency}
                    onChange={(e) => setNewSkillProficiency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1424] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <Button variant="primary" size="sm" onClick={handleAddSkill} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Add Skill
                </Button>
              </div>

              {/* Skills Grid by Category */}
              <div className="space-y-4">
                {['frontend', 'backend', 'database', 'cloud', 'soft'].map((cat) => {
                  const catSkills = skills.filter(s => s.category === cat);
                  if (catSkills.length === 0) return null;

                  return (
                    <div key={cat} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                      <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                        {cat.toUpperCase()} ({catSkills.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {catSkills.map((s) => (
                          <div
                            key={s.skill_name}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-mono"
                          >
                            <span>{s.skill_name}</span>
                            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                              {s.proficiency}
                            </span>
                            <button
                              onClick={() => handleRemoveSkill(s.skill_name)}
                              className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* TAB 3: Experience */}
          {activeTab === 'experience' && (
            <Card className="p-6 space-y-6">
              <CardHeader>
                <CardTitle>Professional Experience</CardTitle>
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
                  Add Experience
                </Button>
              </CardHeader>

              <div className="space-y-6">
                {experience.map((exp, expIdx) => (
                  <div key={expIdx} className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 mr-4">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[expIdx].role = e.target.value;
                            setExperience(updated);
                          }}
                          placeholder="Role"
                          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white font-bold"
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
                          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
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
                          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setExperience(experience.filter((_, i) => i !== expIdx));
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-300">Key Achievements & Responsibilities:</div>
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
                            className="flex-1 p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 4: Education */}
          {activeTab === 'education' && (
            <Card className="p-6 space-y-6">
              <CardHeader>
                <CardTitle>Academic Background</CardTitle>
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
              </CardHeader>

              <div className="space-y-4">
                {education.map((edu, eduIdx) => (
                  <div key={eduIdx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[eduIdx].degree = e.target.value;
                          setEducation(updated);
                        }}
                        placeholder="Degree"
                        className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white font-bold"
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
                        className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
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
                        className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 5: Projects */}
          {activeTab === 'projects' && (
            <Card className="p-6 space-y-6">
              <CardHeader>
                <CardTitle>Highlighted Engineering Projects</CardTitle>
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
              </CardHeader>

              <div className="space-y-4">
                {projects.map((proj, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
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
                        className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white font-bold"
                      />
                      <button
                        onClick={() => setProjects(projects.filter((_, i) => i !== pIdx))}
                        className="text-slate-500 hover:text-rose-400 p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
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
                      className="w-full p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 6: Salary & Preferences */}
          {activeTab === 'preferences' && (
            <Card className="p-6 space-y-5">
              <CardHeader>
                <CardTitle>Target Compensation & Work Preferences</CardTitle>
              </CardHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Minimum Base Salary ($ USD)</label>
                  <input
                    type="number"
                    value={minSalary}
                    onChange={(e) => setMinSalary(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Maximum Target Salary ($ USD)</label>
                  <input
                    type="number"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
