import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, getGitHubRepos } from '../services/api';
import SkillTag from '../components/SkillTag';
import ProjectCard from '../components/ProjectCard';

const BRANCHES = ['Computer Science','Information Technology','Electronics','Electrical','Mechanical','Civil','Chemical','Aerospace','Biomedical','Data Science','AI/ML','Other'];

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', college: '', engineering_branch: '',
    github_profile: '', bio: '', gender: 'prefer_not_to_say', skills: []
  });

  const fetchProfile = async () => {
    try {
      const { data } = await getProfile();
      setProfile(data);
      setForm({
        name: data.name || '',
        email: data.email || '',
        college: data.college || '',
        engineering_branch: data.engineering_branch || '',
        github_profile: data.github_profile || '',
        bio: data.bio || '',
        gender: data.gender || 'prefer_not_to_say',
        skills: data.skills || []
      });
      if (data.github_profile) fetchRepos(data.github_profile);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchRepos = async (username) => {
    if (!username) return;
    setReposLoading(true);
    try {
      const { data } = await getGitHubRepos(username);
      setRepos(data);
    } catch { setRepos([]); }
    finally { setReposLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm({ ...form, skills: [...form.skills, trimmed] });
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => setForm({ ...form, skills: form.skills.filter(s => s !== skill) });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await updateProfile(form);
      updateUser(data);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="animate-pulse space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-slate-700 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-6 bg-slate-700 rounded w-40" />
            <div className="h-4 bg-slate-700/60 rounded w-56" />
          </div>
        </div>
        <div className="card h-48" />
      </div>
    </div>
  );

  return (
    <div className="page-container max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-3xl font-bold text-white shadow-xl shrink-0">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-bold text-slate-100">{profile?.name}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{profile?.email}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
              {profile?.college && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {profile.college}
                </span>
              )}
              {profile?.engineering_branch && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {profile.engineering_branch}
                </span>
              )}
              {profile?.github_profile && (
                <a
                  href={`https://github.com/${profile.github_profile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  github.com/{profile.github_profile}
                </a>
              )}
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className={editing ? 'btn-secondary' : 'btn-primary'}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {profile?.bio && !editing && (
          <p className="text-slate-300 text-sm leading-relaxed mt-4 pt-4 border-t border-slate-700/50">{profile.bio}</p>
        )}

        {profile?.skills?.length > 0 && !editing && (
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.skills.map((s, i) => <SkillTag key={s} skill={s} index={i} />)}
          </div>
        )}
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="card border-brand-500/20 animate-fade-in">
          <h2 className="font-display font-semibold text-slate-100 mb-5">Edit Profile</h2>
          <form onSubmit={handleSave} className="space-y-4">
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>}
            {success && <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-emerald-400">{success}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input type="text" name="name" className="input-field" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" name="email" className="input-field" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">College</label>
                <input type="text" name="college" className="input-field" value={form.college} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Branch</label>
                <select name="engineering_branch" className="input-field" value={form.engineering_branch} onChange={handleChange}>
                  <option value="">Select branch</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
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
                <label className="label">GitHub Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">github.com/</span>
                  <input type="text" name="github_profile" className="input-field pl-24" value={form.github_profile} onChange={handleChange} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="label">Bio</label>
                <textarea name="bio" className="input-field h-24 resize-none" value={form.bio} onChange={handleChange} placeholder="Tell others about yourself..." />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Add skill and press Enter"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  />
                  <button type="button" onClick={addSkill} className="btn-secondary px-4 shrink-0">Add</button>
                </div>
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-surface-900/50 rounded-xl border border-slate-700/50">
                    {form.skills.map((s, i) => <SkillTag key={s} skill={s} index={i} onRemove={removeSkill} />)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {success && !editing && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-emerald-400 animate-fade-in">{success}</div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="font-display text-3xl font-bold text-gradient-bright">{profile?.projectsCreated?.length || 0}</div>
          <div className="text-sm text-slate-400 mt-1">Projects Created</div>
        </div>
        <div className="card text-center">
          <div className="font-display text-3xl font-bold text-gradient-bright">{profile?.projectsJoined?.length || 0}</div>
          <div className="text-sm text-slate-400 mt-1">Projects Joined</div>
        </div>
      </div>

      {/* GitHub Repos */}
      {profile?.github_profile && (
        <div>
          <h2 className="section-title mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub Repositories
          </h2>
          {reposLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="card h-24 animate-pulse" />)}
            </div>
          ) : repos.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-slate-500 text-sm">No public repositories found for <span className="text-slate-400">@{profile.github_profile}</span></p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {repos.map(repo => (
                <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                  className="card-hover group block">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-mono text-sm font-medium text-brand-400 group-hover:text-brand-300 transition-colors truncate">{repo.name}</h3>
                    <svg className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  {repo.description && <p className="text-xs text-slate-500 line-clamp-2 mb-2">{repo.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                        {repo.language}
                      </span>
                    )}
                    <span>★ {repo.stargazers_count}</span>
                    <span>⑂ {repo.forks_count}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Projects Created */}
      {profile?.projectsCreated?.length > 0 && (
        <div>
          <h2 className="section-title mb-4">Projects Created</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {profile.projectsCreated.map(p => <ProjectCard key={p._id} project={p} />)}
          </div>
        </div>
      )}

      {/* Projects Joined */}
      {profile?.projectsJoined?.length > 0 && (
        <div>
          <h2 className="section-title mb-4">Projects Joined</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {profile.projectsJoined.map(p => <ProjectCard key={p._id} project={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
