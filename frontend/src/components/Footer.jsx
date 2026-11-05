import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './BrandIcons';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <FileText size={16} />
              </div>
              <span>ResumeCraft <span className="text-blue-400">AI</span></span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Build high-converting, ATS-optimized resumes backed by artificial intelligence and approved by top industry recruiters.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <GithubIcon size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <LinkedinIcon size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <TwitterIcon size={16} />
              </a>
            </div>
          </div>

          {/* Templates links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Templates
            </h4>
            <ul className="space-y-2">
              <li><Link to="/templates" className="hover:text-white transition-colors">Modern Professional</Link></li>
              <li><Link to="/templates" className="hover:text-white transition-colors">Classic Corporate</Link></li>
              <li><Link to="/templates" className="hover:text-white transition-colors">Minimal ATS-Friendly</Link></li>
              <li><Link to="/templates" className="hover:text-white transition-colors">Creative Designer</Link></li>
              <li><Link to="/templates" className="hover:text-white transition-colors">Student & Fresher</Link></li>
              <li><Link to="/templates" className="hover:text-white transition-colors">Software Developer</Link></li>
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              AI Tools & Features
            </h4>
            <ul className="space-y-2">
              <li><Link to="/ats-checker" className="hover:text-white transition-colors">ATS Compatibility Checker</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">AI Summary Generator</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Bullet Point Enhancer</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Skill Match & Recommendations</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Pixel-Perfect PDF Export</Link></li>
            </ul>
          </div>

          {/* Legal & Platform */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li><a href="/#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
              <li><a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><span className="text-slate-500">Privacy Policy</span></li>
              <li><span className="text-slate-500">Terms of Service</span></li>
              <li><span className="text-slate-500">Security & Encryption</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} ResumeCraft AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart size={11} className="text-rose-500 fill-rose-500" /> for job seekers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};
