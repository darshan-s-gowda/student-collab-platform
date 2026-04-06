import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendRequest } from '../services/api';
import SkillTag from './SkillTag';
import Modal from './Modal';

const ProjectCard = ({ project, onRequestSent }) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const isOwner = user && project.owner_id?._id === user._id;
  const isMember = user && project.members?.some(m => m._id === user._id || m === user._id);

  const handleSendRequest = async () => {
    setLoading(true);
    setError('');
    try {
      await sendRequest({ project_id: project._id, message });
      setSent(true);
      setModalOpen(false);
      if (onRequestSent) onRequestSent();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = project.status === 'open'
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    : 'bg-red-500/15 text-red-400 border-red-500/30';

  return (
    <>
      <div className="card-hover cursor-pointer flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link to={`/projects/${project._id}`} className="block">
              <h3 className="font-display font-semibold text-slate-100 hover:text-brand-400 transition-colors line-clamp-1 text-lg">
                {project.title}
              </h3>
            </Link>
            <p className="text-sm text-slate-500 mt-0.5">
              by <Link to={`/users/${project.owner_id?._id}`} className="text-slate-400 hover:text-brand-400 transition-colors">{project.owner_id?.name}</Link>
              {project.owner_id?.college && <span className="text-slate-600"> · {project.owner_id.college}</span>}
            </p>
          </div>
          <span className={`badge border ${statusColor} shrink-0`}>
            {project.status === 'open' ? '● Open' : '● Closed'}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{project.description}</p>

        {/* Tech Stack */}
        {project.tech_stack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.slice(0, 5).map((tech, i) => (
              <SkillTag key={tech} skill={tech} index={i} />
            ))}
            {project.tech_stack.length > 5 && (
              <span className="badge bg-slate-700/50 text-slate-400 text-xs">+{project.tech_stack.length - 5}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 mt-auto">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {project.members?.length || 0}/{project.required_members} members
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(project.created_at).toLocaleDateString()}
            </span>
          </div>

          {user && !isOwner && !isMember && project.status === 'open' && (
            <button
              onClick={() => setModalOpen(true)}
              disabled={sent}
              className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-all ${
                sent
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-brand-600 hover:bg-brand-500 text-white'
              }`}
            >
              {sent ? '✓ Requested' : 'Collaborate'}
            </button>
          )}
          {isOwner && (
            <Link to={`/projects/${project._id}`} className="text-xs text-brand-400 hover:text-brand-300 font-medium">
              Manage →
            </Link>
          )}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Request to Collaborate">
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Send a collaboration request to join <span className="text-slate-200 font-medium">"{project.title}"</span>
          </p>
          <div>
            <label className="label">Message (optional)</label>
            <textarea
              className="input-field h-28 resize-none"
              placeholder="Tell the owner why you'd be a great collaborator..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleSendRequest} disabled={loading} className="btn-primary flex-1">
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProjectCard;
