import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/api';
import ProjectCard from '../components/ProjectCard';

const ProjectFeedPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = projects.filter(p => {
    const matchesSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tech_stack?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-100 mb-2">Explore Projects</h1>
        <p className="text-slate-400">Discover projects looking for collaborators like you</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search by title, tech stack, description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'open', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === f
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-800 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-5 bg-slate-700 rounded-lg w-3/4 mb-3" />
              <div className="h-3 bg-slate-700/60 rounded w-1/2 mb-4" />
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-slate-700/40 rounded" />
                <div className="h-3 bg-slate-700/40 rounded w-5/6" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-slate-700/60 rounded-lg w-16" />
                <div className="h-6 bg-slate-700/60 rounded-lg w-14" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-display font-semibold text-slate-300 mb-2">No projects found</h3>
          <p className="text-slate-500 text-sm">{search ? 'Try a different search term' : 'Be the first to post a project!'}</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">{filtered.length} project{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => (
              <ProjectCard key={p._id} project={p} onRequestSent={fetchProjects} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectFeedPage;
