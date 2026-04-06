import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById, getProjectRequests, deleteProject, updateProject } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SkillTag from '../components/SkillTag';
import RequestCard from '../components/RequestCard';
import Modal from '../components/Modal';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  const fetchProject = async () => {
    try {
      const { data } = await getProjectById(id);
      setProject(data);
      setEditForm({ title: data.title, description: data.description, required_members: data.required_members, status: data.status });
    } catch { navigate('/feed'); }
  };

  const fetchRequests = async () => {
    try {
      const { data } = await getProjectRequests(id);
      setRequests(data);
    } catch { /* not owner */ }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchProject();
      setLoading(false);
    };
    init();
  }, [id]);

  useEffect(() => {
    if (project && user && project.owner_id?._id === user._id) {
      fetchRequests();
    }
  }, [project, user]);

  const handleDelete = async () => {
    try {
      await deleteProject(id);
      navigate('/dashboard');
    } catch (err) { console.error(err); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await updateProject(id, editForm);
      await fetchProject();
      setEditModal(false);
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-700 rounded w-1/2" />
        <div className="h-4 bg-slate-700/60 rounded w-1/4" />
        <div className="card h-40" />
      </div>
    </div>
  );

  if (!project) return null;

  const isOwner = user && project.owner_id?._id === user._id;
  const isMember = user && project.members?.some(m => m._id === user._id || m === user._id);
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/feed" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to projects
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Header */}
          <div className="card">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-100 mb-2">{project.title}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span>by <Link to={`/users/${project.owner_id?._id}`} className="text-brand-400 hover:text-brand-300">{project.owner_id?.name}</Link></span>
                  <span>·</span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <span className={`badge border shrink-0 ${project.status === 'open' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-red-500/15 text-red-400 border-red-500/30'}`}>
                {project.status === 'open' ? '● Open' : '● Closed'}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{project.description}</p>
          </div>

          {/* Tech Stack */}
          {project.tech_stack?.length > 0 && (
            <div className="card">
              <h2 className="font-display font-semibold text-slate-200 mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((t, i) => <SkillTag key={t} skill={t} index={i} />)}
              </div>
            </div>
          )}

          {/* Required Skills */}
          {project.required_skills?.length > 0 && (
            <div className="card">
              <h2 className="font-display font-semibold text-slate-200 mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {project.required_skills.map((s, i) => <SkillTag key={s} skill={s} index={i + 3} />)}
              </div>
            </div>
          )}

          {/* Collaboration Requests (Owner only) */}
          {isOwner && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-slate-200">
                  Collaboration Requests
                  {pendingCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30">{pendingCount} pending</span>
                  )}
                </h2>
              </div>
              {requests.length === 0 ? (
                <p className="text-slate-500 text-sm">No requests yet.</p>
              ) : (
                <div className="space-y-4">
                  {requests.map(r => <RequestCard key={r._id} request={r} onUpdate={() => { fetchRequests(); fetchProject(); }} viewMode="owner" />)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Team Info */}
          <div className="card">
            <h3 className="font-display font-semibold text-slate-200 mb-4">Team</h3>
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Members</span>
                <span className="text-slate-200 font-medium">{project.members?.length || 0} / {project.required_members}</span>
              </div>
              <div className="h-2 bg-surface-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((project.members?.length || 0) / project.required_members) * 100)}%` }}
                />
              </div>
            </div>

            {project.members?.length > 0 && (
              <div className="space-y-2">
                {project.members.map((m, idx) => (
                  <Link key={m._id || idx} to={`/users/${m._id}`} className="flex items-center gap-2 group">
                    <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300">
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                      {m.name}
                      {project.owner_id?._id === m._id && <span className="ml-1 text-xs text-brand-500">Owner</span>}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="card space-y-3">
              <h3 className="font-display font-semibold text-slate-200">Manage</h3>
              <button onClick={() => setEditModal(true)} className="btn-secondary w-full text-sm">Edit Project</button>
              <button onClick={() => setDeleteModal(true)} className="w-full py-2.5 px-5 rounded-xl text-sm font-semibold text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-all">
                Delete Project
              </button>
            </div>
          )}

          {/* Member badge */}
          {isMember && !isOwner && (
            <div className="card border-emerald-500/20 bg-emerald-500/5">
              <p className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You're a member of this project
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Project">
        <p className="text-slate-400 text-sm mb-6">Are you sure you want to delete "{project.title}"? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteModal(false)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleDelete} className="flex-1 py-2.5 px-5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Project">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input type="text" className="input-field" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input-field h-28 resize-none" value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Team Size</label>
              <input type="number" className="input-field" min={1} value={editForm.required_members || 1} onChange={e => setEditForm({ ...editForm, required_members: e.target.value })} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input-field" value={editForm.status || 'open'} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setEditModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetailsPage;
