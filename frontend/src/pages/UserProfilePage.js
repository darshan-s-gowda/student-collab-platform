import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById, getGitHubRepos } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SkillTag from '../components/SkillTag';
import ProjectCard from '../components/ProjectCard';

const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await getUserById(id);
        setProfile(data);
        if (data.github_profile) {
          setReposLoading(true);
          try {
            const { data: repoData } = await getGitHubRepos(data.github_profile);
            setRepos(repoData);
          } catch { setRepos([]); }
          finally { setReposLoading(false); }
        }
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    };
    fetchUser();
  }, [id]);

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
      </div>
    </div>
  );

  if (notFound || !profile) return (
    <div className="page-container max-w-2xl mx-auto text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 className="font-display font-bold text-xl text-slate-300 mb-2">User not found</h2>
      <p className="text-slate-500 mb-6">This profile doesn't exist or has been removed.</p>
      <Link to="/feed" className="btn-primary">Back to Feed</Link>
    </div>
  );

  const isOwnProfile = currentUser && currentUser._id === id;

  return (
    <div className="page-container max-w-4xl mx-auto space-y-6">
      {isOwnProfile && (
        <div className="flex items-center justify-between p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-sm text-brand-300">
          <span>You're viewing your own public profile</span>
          <Link to="/profile" className="text-brand-400 hover:text-brand-300 font-medium">Edit profile →</Link>
        </div>
      )}

      {/* Profile Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-3xl font-bold text-white shadow-xl shrink-0">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-bold text-slate-100">{profile.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
              {profile.college && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {profile.college}
                </span>
              )}
              {profile.engineering_branch && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {profile.engineering_branch}
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              {profile.github_profile && (
                <a
                  href={`https://github.com/${profile.github_profile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  @{profile.github_profile}
                </a>
              )}
            </div>
          </div>
        </div>

        {profile.bio && (
          <p className="text-slate-300 text-sm leading-relaxed mt-4 pt-4 border-t border-slate-700/50">{profile.bio}</p>
        )}

        {profile.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.skills.map((s, i) => <SkillTag key={s} skill={s} index={i} />)}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="font-display text-3xl font-bold text-gradient-bright">{profile.projectsCreated?.length || 0}</div>
          <div className="text-sm text-slate-400 mt-1">Projects Created</div>
        </div>
        <div className="card text-center">
          <div className="font-display text-3xl font-bold text-gradient-bright">{profile.projectsJoined?.length || 0}</div>
          <div className="text-sm text-slate-400 mt-1">Projects Joined</div>
        </div>
      </div>

      {/* GitHub Repos */}
      {profile.github_profile && (
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
              <p className="text-slate-500 text-sm">No public repositories found.</p>
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
                    {repo.language && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500" />{repo.language}</span>}
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
      {profile.projectsCreated?.length > 0 && (
        <div>
          <h2 className="section-title mb-4">Projects Created</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {profile.projectsCreated.map(p => <ProjectCard key={p._id} project={p} />)}
          </div>
        </div>
      )}

      {/* Projects Joined */}
      {profile.projectsJoined?.length > 0 && (
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

export default UserProfilePage;
