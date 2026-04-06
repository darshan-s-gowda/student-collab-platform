import React from 'react';
import { Link } from 'react-router-dom';
import { acceptRequest, rejectRequest } from '../services/api';

const RequestCard = ({ request, onUpdate, viewMode = 'owner' }) => {
  const [loading, setLoading] = React.useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptRequest(request._id);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await rejectRequest(request._id);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusStyles = {
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    accepted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  const student = request.student_id;
  const project = request.project_id;

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-base font-bold text-brand-300">
            {student?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <Link to={`/users/${student?._id}`} className="font-semibold text-slate-100 hover:text-brand-400 transition-colors text-sm">
              {student?.name}
            </Link>
            <p className="text-xs text-slate-500">{student?.college} · {student?.engineering_branch}</p>
          </div>
        </div>
        <span className={`badge border ${statusStyles[request.status] || statusStyles.pending} text-xs`}>
          {request.status}
        </span>
      </div>

      {viewMode === 'student' && project && (
        <p className="text-xs text-slate-500">
          Project: <Link to={`/projects/${project._id}`} className="text-brand-400 hover:text-brand-300">{project.title}</Link>
        </p>
      )}

      {student?.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {student.skills.slice(0, 4).map(s => (
            <span key={s} className="px-2 py-0.5 rounded text-xs bg-slate-700/60 text-slate-400 font-mono">{s}</span>
          ))}
        </div>
      )}

      {request.message && (
        <div className="bg-surface-900/60 border border-slate-700/50 rounded-xl p-3">
          <p className="text-sm text-slate-300 italic">"{request.message}"</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-600">{new Date(request.created_at).toLocaleDateString()}</span>
        {viewMode === 'owner' && request.status === 'pending' && (
          <div className="flex gap-2">
            <button onClick={handleReject} disabled={loading} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-colors">
              Reject
            </button>
            <button onClick={handleAccept} disabled={loading} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors">
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
