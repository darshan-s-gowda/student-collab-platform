import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FeatureCard = ({ icon, title, desc }) => (
  <div className="card group hover:border-brand-500/30 transition-all duration-300">
    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
      {icon}
    </div>
    <h3 className="font-display font-semibold text-slate-100 mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-600/5 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            Open for collaboration
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Build Projects<br />
            <span className="text-gradient">Together.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            StudentCollab connects engineering students across colleges to collaborate on real projects. 
            Find teammates, build your portfolio, and launch ideas — together.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <>
                <Link to="/feed" className="btn-primary text-base px-8 py-3">Explore Projects</Link>
                <Link to="/create-project" className="btn-secondary text-base px-8 py-3">Post a Project</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-base px-8 py-3">Get Started Free</Link>
                <Link to="/feed" className="btn-secondary text-base px-8 py-3">Browse Projects</Link>
              </>
            )}
          </div>

          <p className="text-sm text-slate-600 mt-6">No credit card required · Free forever for students</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-slate-800/60">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { val: '500+', label: 'Students' },
            { val: '120+', label: 'Projects' },
            { val: '50+', label: 'Colleges' },
          ].map(({ val, label }) => (
            <div key={label}>
              <div className="font-display text-3xl font-bold text-gradient-bright">{val}</div>
              <div className="text-sm text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Everything you need to collaborate
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">Built specifically for engineering students who want to build real projects with real teammates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              title="Post Project Ideas"
              desc="Share your project idea, define the tech stack, and specify what kind of teammates you're looking for."
            />
            <FeatureCard
              icon={<svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              title="Find Collaborators"
              desc="Browse students from different colleges and send collaboration requests to join exciting projects."
            />
            <FeatureCard
              icon={<svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
              title="Skill-based Matching"
              desc="Projects list required skills so you can instantly see where your expertise is needed most."
            />
            <FeatureCard
              icon={<svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
              title="GitHub Integration"
              desc="Connect your GitHub profile to showcase your repositories and demonstrate your technical abilities."
            />
            <FeatureCard
              icon={<svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
              title="Request Dashboard"
              desc="Manage all collaboration requests in one place — accept, reject, and track them easily."
            />
            <FeatureCard
              icon={<svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              title="Rich Student Profiles"
              desc="Showcase your skills, branch, college, and all the projects you've built or joined."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card glow-indigo border-brand-500/20">
            <h2 className="font-display text-3xl font-bold text-slate-100 mb-4">Ready to start building?</h2>
            <p className="text-slate-400 mb-8">Join hundreds of engineering students already collaborating on StudentCollab.</p>
            {user ? (
              <Link to="/feed" className="btn-primary text-base px-10 py-3">Explore Projects →</Link>
            ) : (
              <Link to="/register" className="btn-primary text-base px-10 py-3">Create Free Account →</Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
