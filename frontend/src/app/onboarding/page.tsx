'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, ArrowRight, ArrowLeft, CheckCircle2, 
  Briefcase, Code, GraduationCap, DollarSign, UploadCloud, 
  Plus, X, FileText
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { api } from '@/lib/api';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [targetRole, setTargetRole] = useState('Full-Stack Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Entry-Level / Graduate');
  const [location, setLocation] = useState('San Francisco, CA / Remote');
  const [preferredLocations, setPreferredLocations] = useState(['Remote', 'San Francisco, CA', 'New York, NY']);
  const [minSalary, setMinSalary] = useState(110000);
  const [maxSalary, setMaxSalary] = useState(150000);
  const [jobTypes, setJobTypes] = useState(['Full-time', 'Remote']);
  
  // Skills
  const [skills, setSkills] = useState([
    'TypeScript', 'React', 'Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker'
  ]);
  const [newSkill, setNewSkill] = useState('');

  // Education
  const [degree, setDegree] = useState('B.S. in Computer Science');
  const [institution, setInstitution] = useState('University of California, Berkeley');
  const [gradYear, setGradYear] = useState('2024');

  // Resume Upload
  const [resumeText, setResumeText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const addSkillTag = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkillTag = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      // 1. Update Profile
      await api.updateProfile({
        target_role: targetRole,
        experience_level: experienceLevel,
        location,
        preferred_locations: preferredLocations,
        job_types: jobTypes,
        min_salary: Number(minSalary),
        max_salary: Number(maxSalary),
        education: [
          {
            degree,
            institution,
            year: gradYear,
            gpa: '3.85 / 4.0',
            highlights: 'Dean\'s Honor List, Relevant coursework in Distributed Systems and Algorithms'
          }
        ],
        skills: skills.map(s => ({
          skill_name: s,
          category: ['Python', 'FastAPI', 'Go'].includes(s) ? 'backend' : 'frontend',
          proficiency: 'Intermediate',
          years_experience: 2.0,
          is_highlighted: true
        }))
      });

      // 2. If resume text or sample provided, upload it
      const sampleResume = resumeText || `Alex Chen | Full-Stack Software Engineer
Skills: ${skills.join(', ')}
Education: ${degree} at ${institution} (${gradYear})
Experience: Software Engineer building high-throughput web applications with React, Next.js, and FastAPI.`;

      const formData = new FormData();
      formData.append('raw_text', sampleResume);
      formData.append('title', `${targetRole} Onboarding Resume`);
      await api.uploadResume(formData);

      await refreshProfile();
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Onboarding save error:', err);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06090F] text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-cyan-500/10 to-transparent blur-[140px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-extrabold text-base text-white">AI Career Copilot</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Set Up Your Career Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Our AI uses this data to calculate semantic job match scores and personalize resume optimization.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step 
                  ? 'w-8 bg-gradient-to-r from-indigo-500 to-cyan-400' 
                  : i < step 
                    ? 'w-4 bg-emerald-500' 
                    : 'w-4 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Form Step Box */}
      <div className="max-w-2xl mx-auto w-full my-8 relative z-10">
        <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/90 backdrop-blur-md p-6 sm:p-8 shadow-2xl space-y-6">
          {/* STEP 1: Target Role & Experience */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <Badge variant="indigo" size="sm">Step 1 of 5</Badge>
                <h2 className="text-base font-bold text-white mt-1">Target Engineering Role & Seniority</h2>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Primary Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Full-Stack Software Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1422] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Entry-Level / Graduate">Entry-Level / Graduate (0-2 Years)</option>
                  <option value="Mid-Level (2-4 Years)">Mid-Level (2-4 Years)</option>
                  <option value="Senior Engineer (5+ Years)">Senior Engineer (5+ Years)</option>
                  <option value="Staff / Lead Engineer">Staff / Lead Engineer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Location & Preference</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA / Remote"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Technical Skills Matrix */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <Badge variant="cyan" size="sm">Step 2 of 5</Badge>
                <h2 className="text-base font-bold text-white mt-1">Core Technical Skills</h2>
                <p className="text-xs text-slate-400">Add the languages, frameworks, databases, and cloud tools you know.</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillTag())}
                  placeholder="e.g. GraphQL, Kubernetes, AWS"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <Button type="button" variant="secondary" onClick={addSkillTag} leftIcon={<Plus className="w-4 h-4" />}>
                  Add
                </Button>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-400 mb-2">Active Skills List ({skills.length}):</div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-200 font-mono"
                    >
                      {s}
                      <button
                        onClick={() => removeSkillTag(s)}
                        className="hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Education & Academic History */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <Badge variant="violet" size="sm">Step 3 of 5</Badge>
                <h2 className="text-base font-bold text-white mt-1">Education & Background</h2>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Degree / Certification</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="B.S. in Computer Science"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Institution / University</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="University of California, Berkeley"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Graduation Year</label>
                <input
                  type="text"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  placeholder="2024"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Career & Salary Preferences */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <Badge variant="emerald" size="sm">Step 4 of 5</Badge>
                <h2 className="text-base font-bold text-white mt-1">Job Preferences & Salary Targets</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Minimum Base ($ USD)</label>
                  <input
                    type="number"
                    value={minSalary}
                    onChange={(e) => setMinSalary(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Max ($ USD)</label>
                  <input
                    type="number"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Preferred Workplace Mode</label>
                <div className="flex gap-3">
                  {['Remote', 'Hybrid', 'On-Site'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        if (jobTypes.includes(mode)) {
                          setJobTypes(jobTypes.filter(m => m !== mode));
                        } else {
                          setJobTypes([...jobTypes, mode]);
                        }
                      }}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        jobTypes.includes(mode)
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200'
                          : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Resume Upload / Starter */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <Badge variant="cyan" size="sm">Step 5 of 5</Badge>
                <h2 className="text-base font-bold text-white mt-1">Upload Resume (or Start with Structured Profile)</h2>
                <p className="text-xs text-slate-400">Our AI will parse your resume into structured ATS-scorable modules.</p>
              </div>

              <div className="p-6 border-2 border-dashed border-white/15 rounded-2xl text-center space-y-3 bg-white/[0.01] hover:border-cyan-400/40 transition-colors">
                <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto" />
                <div>
                  <div className="text-xs font-semibold text-white">Drag & drop your resume PDF or paste text</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Supports PDF, DOCX, TXT (up to 5MB)</div>
                </div>
                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Or paste your resume summary & achievements text here..."
                  className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {step > 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(step - 1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            ) : <div />}

            {step < 5 ? (
              <Button
                type="button"
                variant="primary"
                onClick={() => setStep(step + 1)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={handleFinish}
                isLoading={isLoading}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Complete Onboarding
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-500">
        AI Career Copilot SaaS &bull; Your data is encrypted and private.
      </div>
    </div>
  );
}
