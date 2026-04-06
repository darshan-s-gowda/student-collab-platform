import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BRANCHES = ['Computer Science','Information Technology','Electronics','Electrical','Mechanical','Civil','Chemical','Aerospace','Biomedical','Data Science','AI/ML','Other'];

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', gender: 'prefer_not_to_say',
    college: '', engineering_branch: '', github_profile: '', skills: '', bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      const { data } = await registerUser(payload);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-white">Student<span className="text-brand-500">Collab</span></span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-slate-100">Create your account</h1>
          <p className="text-slate-400 mt-2">Join the student collaboration network</p>
        </div>

        <div className="card border-slate-700/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full Name *</label>
                <input type="text" name="name" className="input-field" placeholder="Your full name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-span-2">
                <label className="label">Email *</label>
                <input type="email" name="email" className="input-field" placeholder="you@college.edu" value={form.email} onChange={handleChange} required />
              </div>
              <div className="col-span-2">
                <label className="label">Password *</label>
                <input type="password" name="password" className="input-field" placeholder="Minimum 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
              </div>
              <div>
                <label className="label">Gender</label>
                <select name="gender" className="input-field" value={form.gender} onChange={handleChange}>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Branch *</label>
                <select name="engineering_branch" className="input-field" value={form.engineering_branch} onChange={handleChange} required>
                  <option value="">Select branch</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="label">College *</label>
                <input type="text" name="college" className="input-field" placeholder="Your college name" value={form.college} onChange={handleChange} required />
              </div>
              <div className="col-span-2">
                <label className="label">GitHub Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">github.com/</span>
                  <input type="text" name="github_profile" className="input-field pl-24" placeholder="yourusername" value={form.github_profile} onChange={handleChange} />
                </div>
              </div>
              <div className="col-span-2">
                <label className="label">Skills <span className="text-slate-600">(comma-separated)</span></label>
                <input type="text" name="skills" className="input-field" placeholder="React, Node.js, Python, Machine Learning..." value={form.skills} onChange={handleChange} />
              </div>
              <div className="col-span-2">
                <label className="label">Bio</label>
                <textarea name="bio" className="input-field h-20 resize-none" placeholder="Tell others about yourself..." value={form.bio} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
