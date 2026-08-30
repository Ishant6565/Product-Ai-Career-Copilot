import { 
  User, UserProfile, Resume, Job, JobMatchDetail, Application, 
  ResumeOptimizeResponse, CoverLetterResponse, InterviewPrepResponse, 
  InterviewAnswerEvaluation, AnalyticsOverview, SkillItem 
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('career_copilot_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...this.getAuthHeaders(),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        let errorDetail = `API Error: ${response.status} ${response.statusText}`;
        try {
          if (errText) {
            const parsed = JSON.parse(errText);
            errorDetail = parsed.detail || errorDetail;
          }
        } catch {
          // ignore json parse error
        }
        throw new Error(errorDetail);
      }

      const text = await response.text().catch(() => '');
      if (!text || text.trim() === '') {
        return {} as T;
      }
      return JSON.parse(text) as T;
    } catch (error: any) {
      console.warn(`Fetch error at ${endpoint}:`, error.message);
      throw error;
    }
  }

  // ==================== Auth ====================
  async login(email: string, password: string):Promise<{ access_token: string; user: User }> {
    return this.request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { email: string; password: string; full_name: string; target_role?: string }): Promise<{ access_token: string; user: User }> {
    return this.request<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async demoLogin(persona: string = 'fullstack'): Promise<{ access_token: string; user: User }> {
    return this.request<{ access_token: string; user: User }>(`/auth/demo-login?persona=${persona}`, {
      method: 'POST',
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // ==================== Profile ====================
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/profile/me');
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addSkill(skill: SkillItem): Promise<SkillItem> {
    return this.request<SkillItem>('/profile/skills', {
      method: 'POST',
      body: JSON.stringify(skill),
    });
  }

  async deleteSkill(skillName: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/profile/skills/${encodeURIComponent(skillName)}`, {
      method: 'DELETE',
    });
  }

  // ==================== Resumes ====================
  async listResumes(): Promise<Resume[]> {
    return this.request<Resume[]>('/resumes');
  }

  async getResume(id: string): Promise<Resume> {
    return this.request<Resume>(`/resumes/${id}`);
  }

  async uploadResume(formData: FormData): Promise<{ message: string; resume: Resume }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('career_copilot_token') : null;
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/resumes/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Resume upload failed');
    }
    return res.json();
  }

  async setPrimaryResume(id: string): Promise<Resume> {
    return this.request<Resume>(`/resumes/${id}/primary`, {
      method: 'PUT',
    });
  }

  async deleteResume(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/resumes/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== Jobs ====================
  async listJobs(params: {
    search?: string;
    job_type?: string;
    experience_level?: string;
    is_remote?: boolean;
    min_match?: number;
  } = {}): Promise<Job[]> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.job_type && params.job_type !== 'All') query.append('job_type', params.job_type);
    if (params.experience_level && params.experience_level !== 'All') query.append('experience_level', params.experience_level);
    if (params.is_remote !== undefined) query.append('is_remote', String(params.is_remote));
    if (params.min_match) query.append('min_match', String(params.min_match));

    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<Job[]>(`/jobs${qs}`);
  }

  async getJob(id: string): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`);
  }

  async getJobMatchReport(id: string): Promise<JobMatchDetail> {
    return this.request<JobMatchDetail>(`/jobs/${id}/match-report`);
  }

  async toggleSaveJob(id: string): Promise<{ saved: boolean; message: string }> {
    return this.request<{ saved: boolean; message: string }>(`/jobs/${id}/save`, {
      method: 'POST',
    });
  }

  async listSavedJobs(): Promise<Job[]> {
    return this.request<Job[]>('/jobs/saved/list');
  }

  async analyzeCustomJD(data: { title?: string; company?: string; description: string }): Promise<JobMatchDetail> {
    return this.request<JobMatchDetail>('/jobs/analyze-jd', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== Applications ====================
  async listApplications(status?: string): Promise<Application[]> {
    const qs = status ? `?status=${status}` : '';
    return this.request<Application[]>(`/applications${qs}`);
  }

  async createApplication(data: Partial<Application>): Promise<Application> {
    return this.request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateApplication(id: string, data: Partial<Application>): Promise<Application> {
    return this.request<Application>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteApplication(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== AI Tools ====================
  async optimizeResume(data: {
    resume_id?: string;
    job_id?: string;
    job_description?: string;
    target_role?: string;
  }): Promise<ResumeOptimizeResponse> {
    return this.request<ResumeOptimizeResponse>('/ai/optimize-resume', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateCoverLetter(data: {
    job_id?: string;
    job_title?: string;
    company_name?: string;
    job_description?: string;
    tone?: string;
    extra_notes?: string;
  }): Promise<CoverLetterResponse> {
    return this.request<CoverLetterResponse>('/ai/generate-cover-letter', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInterviewPrep(data: {
    job_id?: string;
    job_title?: string;
    company_name?: string;
    job_description?: string;
    question_count?: number;
  }): Promise<InterviewPrepResponse> {
    return this.request<InterviewPrepResponse>('/ai/interview-prep', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async evaluateInterviewAnswer(data: {
    question: string;
    question_type: string;
    user_answer: string;
    target_role?: string;
  }): Promise<InterviewAnswerEvaluation> {
    return this.request<InterviewAnswerEvaluation>('/ai/evaluate-answer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== Analytics ====================
  async getAnalytics(): Promise<AnalyticsOverview> {
    return this.request<AnalyticsOverview>('/analytics/overview');
  }
}

export const api = new ApiClient();
