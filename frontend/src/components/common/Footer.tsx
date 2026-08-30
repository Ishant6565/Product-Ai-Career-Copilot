import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white text-black text-xs py-16 px-6 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Col 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-black bg-black text-white flex items-center justify-center font-mono font-bold text-xs">
              AC
            </div>
            <span className="font-serif font-bold text-base tracking-tight text-black">
              AI CAREER COPILOT
            </span>
          </div>
          <p className="text-mono-600 font-serif leading-relaxed text-xs">
            The autonomous intelligence platform engineered for software professionals seeking career velocity without computational compromise.
          </p>
          <div className="font-mono text-2xs uppercase tracking-widest text-mono-400">
            ISSN 2026-COPILOT &bull; ED. 01
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <div className="font-mono font-bold text-black mb-4 uppercase tracking-widest text-2xs border-b border-black pb-2">
            System Modules
          </div>
          <ul className="space-y-2.5 font-mono text-2xs uppercase tracking-wider text-mono-600">
            <li><Link href="/dashboard" className="hover:text-black hover:underline transition-all">01. Command Center</Link></li>
            <li><Link href="/jobs" className="hover:text-black hover:underline transition-all">02. Semantic Job Discovery</Link></li>
            <li><Link href="/resumes" className="hover:text-black hover:underline transition-all">03. ATS Audit Registry</Link></li>
            <li><Link href="/tracker" className="hover:text-black hover:underline transition-all">04. Application Kanban</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <div className="font-mono font-bold text-black mb-4 uppercase tracking-widest text-2xs border-b border-black pb-2">
            AI Intelligence
          </div>
          <ul className="space-y-2.5 font-mono text-2xs uppercase tracking-wider text-mono-600">
            <li><Link href="/ai-tools" className="hover:text-black hover:underline transition-all">Resume Bullet Studio</Link></li>
            <li><Link href="/ai-tools" className="hover:text-black hover:underline transition-all">Cover Letter Architect</Link></li>
            <li><Link href="/ai-tools" className="hover:text-black hover:underline transition-all">STAR Interview Coach</Link></li>
            <li><Link href="/analytics" className="hover:text-black hover:underline transition-all">Conversion Analytics</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <div className="font-mono font-bold text-black mb-4 uppercase tracking-widest text-2xs border-b border-black pb-2">
            Telemetry & Rigor
          </div>
          <div className="p-4 border border-black bg-mono-50 space-y-2">
            <div className="flex items-center gap-2 font-mono text-2xs uppercase tracking-widest font-bold">
              <span className="w-2 h-2 bg-black inline-block" />
              Production Active
            </div>
            <p className="text-2xs text-mono-600 font-serif leading-normal">
              pgvector similarity models &bull; Zero generative hallucination guarantee.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-mono-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-mono-500 font-mono text-2xs uppercase tracking-wider">
        <div>
          &copy; {new Date().getFullYear()} AI Career Copilot. All Rights Reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
          <Link href="/security" className="hover:text-black transition-colors">Security Protocol</Link>
        </div>
      </div>
    </footer>
  );
}

