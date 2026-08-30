'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, ArrowLeft, CheckCircle2, 
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
    <div className="min-h-screen bg-mono-50 text-black flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-body selection:bg-black selection:text-white">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="font-mono text-2xs uppercase tracking-widest px-2.5 py-1 border border-black bg-black text-white font-bold">
            ONBOARDING PROTOCOL &bull; STEP 0{step}
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black tracking-tight uppercase">
          Configure Candidate Dossier
        </h1>
        <p className="font-serif text-xs text-mono-600 mt-1 max-w-md mx-auto">
          Our semantic engine indexes your engineering capabilities to compute deterministic fit ratios and ATS scoring.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 transition-all duration-200 ${
                i === step 
                  ? 'w-10 bg-black' 
                  : i < step 
                    ? 'w-4 bg-mono-400' 
                    : 'w-4 bg-mono-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Form Step Box */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <div className="border-2 border-black bg-white p-8 sm:p-10 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* STEP 1: Target Role & Experience */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-black pb-3">
                <Badge variant="solid" size="sm">Phase 01 &bull; Identity</Badge>
                <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-black mt-2">Target Role & Seniority Tier</h2>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Target Role Title</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Full-Stack Software Engineer"
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Experience Tier</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full p-3 border-2 border-black bg-white text-black font-mono text-xs focus:outline-none focus:border-b-4 focus:border-black"
                  >
                    <option value="Entry-Level / Graduate">Entry-Level / Graduate (0-2 Years)</option>
                    <option value="Mid-Level (2-4 Years)">Mid-Level (2-4 Years)</option>
                    <option value="Senior Engineer (5+ Years)">Senior Engineer (5+ Years)</option>
                    <option value="Staff / Lead Engineer">Staff / Lead Engineer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Location Base & Modality</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Francisco, CA / Remote"
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Technical Skills Matrix */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-black pb-3">
                <Badge variant="solid" size="sm">Phase 02 &bull; Taxonomy</Badge>
                <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-black mt-2">Technical Capabilities & Frameworks</h2>
                <p className="font-serif text-xs text-mono-600">Register languages, distributed systems, and storage engines in your arsenal.</p>
              </div>

              <div className="flex gap-2 font-mono text-xs">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillTag())}
                  placeholder="e.g. GraphQL, Kubernetes, AWS"
                  className="flex-1 p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                />
                <Button type="button" variant="primary" onClick={addSkillTag} leftIcon={<Plus className="w-4 h-4" />}>
                  Append
                </Button>
              </div>

              <div>
                <div className="font-mono text-2xs uppercase tracking-wider text-mono-500 font-bold mb-2">Registered Capabilities ({skills.length}):</div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black bg-mono-100 text-xs text-black font-mono font-bold"
                    >
                      {s}
                      <button
                        onClick={() => removeSkillTag(s)}
                        className="hover:text-mono-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Education & Academic History */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-black pb-3">
                <Badge variant="solid" size="sm">Phase 03 &bull; Academia</Badge>
                <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-black mt-2">Academic Credentials & University</h2>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Degree & Specialization</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="B.S. in Computer Science"
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Institution / University</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="University of California, Berkeley"
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Conferral Year</label>
                  <input
                    type="text"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    placeholder="2024"
                    className="w-full p-3 border-2 border-black bg-white text-black font-mono text-xs focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Career & Salary Preferences */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-b border-black pb-3">
                <Badge variant="solid" size="sm">Phase 04 &bull; Bounds</Badge>
                <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-black mt-2">Compensation Targets & Modality</h2>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block uppercase tracking-wider font-bold text-mono-700">Minimum Base ($ USD)</label>
                    <input
                      type="number"
                      value={minSalary}
                      onChange={(e) => setMinSalary(Number(e.target.value))}
                      className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block uppercase tracking-wider font-bold text-mono-700">Target Ceiling ($ USD)</label>
                    <input
                      type="number"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(Number(e.target.value))}
                      className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Workplace Arrangement</label>
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
                        className={`flex-1 py-2.5 px-3 font-mono text-xs uppercase tracking-wider font-bold border transition-colors duration-100 ${
                          jobTypes.includes(mode)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-black hover:bg-mono-100'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Resume Upload / Starter */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="border-b border-black pb-3">
                <Badge variant="solid" size="sm">Phase 05 &bull; Ingestion</Badge>
                <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-black mt-2">Dossier Ingestion</h2>
                <p className="font-serif text-xs text-mono-600">Provide existing resume plaintext or launch with initialized telemetry.</p>
              </div>

              <div className="p-6 border-2 border-dashed border-black text-center space-y-3 bg-mono-50 font-mono text-xs">
                <UploadCloud className="w-8 h-8 text-black mx-auto" strokeWidth={1.5} />
                <div>
                  <div className="font-bold text-black uppercase tracking-wider">Paste Resume Raw Plaintext</div>
                  <div className="text-2xs text-mono-500 mt-0.5">Or leave blank to synthesize from Steps 1–4</div>
                </div>
                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste engineering highlights & work history..."
                  className="w-full p-3 border-2 border-black bg-white text-black font-body text-xs focus:outline-none focus:border-b-4 focus:border-black"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-black">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
            ) : <div />}

            {step < 5 ? (
              <Button
                type="button"
                variant="primary"
                onClick={() => setStep(step + 1)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={handleFinish}
                isLoading={isLoading}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Commit & Launch Copilot
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center font-mono text-2xs uppercase tracking-widest text-mono-500">
        AI Career Copilot &bull; High-Throughput Career Infrastructure
      </div>
    </div>
  );
}

