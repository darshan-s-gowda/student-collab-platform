import React from 'react';
import { Link } from 'react-router-dom';
import SkillTag from './SkillTag';

const ProfileCard = ({ user }) => {
  if (!user) return null;
  return (
    <div className="card-hover">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-xl font-bold text-white shadow-lg shrink-0">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/users/${user._id}`} className="font-display font-semibold text-slate-100 hover:text-brand-400 transition-colors block truncate">
            {user.name}
          </Link>
          <p className="text-sm text-slate-400 truncate">{user.college}</p>
          <p className="text-xs text-slate-500 mt-0.5">{user.engineering_branch}</p>
        </div>
      </div>
      {user.bio && <p className="text-sm text-slate-400 mt-3 line-clamp-2 leading-relaxed">{user.bio}</p>}
      {user.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {user.skills.slice(0, 4).map((s, i) => <SkillTag key={s} skill={s} index={i} />)}
          {user.skills.length > 4 && <span className="badge bg-slate-700/50 text-slate-400 text-xs">+{user.skills.length - 4}</span>}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
