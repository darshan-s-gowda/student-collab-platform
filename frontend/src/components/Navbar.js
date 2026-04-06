import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-900/50 group-hover:bg-brand-500 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-white">Student<span className="text-brand-500">Collab</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <Link to="/feed" className={`btn-ghost text-sm ${isActive('/feed') ? 'text-brand-400 bg-brand-500/10' : ''}`}>Explore</Link>
                <Link to="/dashboard" className={`btn-ghost text-sm ${isActive('/dashboard') ? 'text-brand-400 bg-brand-500/10' : ''}`}>Dashboard</Link>
                <Link to="/create-project" className={`btn-ghost text-sm ${isActive('/create-project') ? 'text-brand-400 bg-brand-500/10' : ''}`}>New Project</Link>
                <Link to="/requests" className={`btn-ghost text-sm ${isActive('/requests') ? 'text-brand-400 bg-brand-500/10' : ''}`}>Requests</Link>
                <div className="w-px h-5 bg-slate-700 mx-2" />
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="btn-ghost text-sm text-red-400 hover:text-red-300">Logout</button>
              </>
            ) : (
              <>
                <Link to="/feed" className="btn-ghost text-sm">Explore</Link>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm ml-2">Get Started</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-3 pb-4 border-t border-slate-800 space-y-1">
            {user ? (
              <>
              {[
  ['/feed','Explore'],
  ['/dashboard','Dashboard'],
  ['/create-project','New Project'],
  ['/requests','Requests'],
  ['/profile','Profile']
].map(([path, label]) => (
  <Link
    key={path}
    to={path}
    className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
    onClick={() => setMenuOpen(false)}
  >
    {label}
  </Link>
))}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/feed" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setMenuOpen(false)}>Explore</Link>
                <Link to="/login" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-4 py-2 text-sm text-brand-400 hover:bg-white/5 rounded-lg" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
