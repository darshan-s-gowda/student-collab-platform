import React from 'react';

const colorMap = [
  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
];

const SkillTag = ({ skill, index = 0, onRemove }) => {
  const color = colorMap[index % colorMap.length];
  return (
    <span className={`badge border ${color} gap-1 font-mono text-xs`}>
      {skill}
      {onRemove && (
        <button onClick={() => onRemove(skill)} className="ml-1 opacity-70 hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default SkillTag;
