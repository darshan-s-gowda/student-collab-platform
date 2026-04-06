import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/api';
import SkillTag from '../components/SkillTag';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', required_members: 2, status: 'open'
  });
  const [techInput, setTechInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTag = (value, list, setList, setInput) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput('');
  };

  const removeTag = (item, list, setList) => setList(list.filter(i => i !== item));

  const handleKeyDown = (e, value, list, setList, setInput) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(value, list, setList, setInput);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await createProject({
        ...form,
        tech_stack: techStack,
        required_skills: requiredSkills,
      });
      navigate(`/projects/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-100 mb-2">Create a Project</h1>
        <p className="text-slate-400">Share your idea and find the perfect collaborators</p>
      </div>

      <div className="card border-slate-700/80">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
          )}

          <div>
            <label className="label">Project Title *</label>
            <input type="text" name="title" className="input-field" placeholder="e.g. AI-powered Study Planner" value={form.title} onChange={handleChange} required />
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea name="description" className="input-field h-32 resize-none" placeholder="Describe your project idea, goals, and what you want to build..." value={form.description} onChange={handleChange} required />
          </div>

          <div>
            <label className="label">Tech Stack</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Add technology (press Enter)"
                  value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => handleKeyDown(e, techInput, techStack, setTechStack, setTechInput)}
                />
                <button type="button" onClick={() => addTag(techInput, techStack, setTechStack, setTechInput)} className="btn-secondary px-4 shrink-0">Add</button>
              </div>
              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-surface-900/50 rounded-xl border border-slate-700/50">
                  {techStack.map((t, i) => (
                    <SkillTag key={t} skill={t} index={i} onRemove={() => removeTag(t, techStack, setTechStack)} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="label">Required Skills</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Skill needed (press Enter)"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => handleKeyDown(e, skillInput, requiredSkills, setRequiredSkills, setSkillInput)}
                />
                <button type="button" onClick={() => addTag(skillInput, requiredSkills, setRequiredSkills, setSkillInput)} className="btn-secondary px-4 shrink-0">Add</button>
              </div>
              {requiredSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-surface-900/50 rounded-xl border border-slate-700/50">
                  {requiredSkills.map((s, i) => (
                    <SkillTag key={s} skill={s} index={i} onRemove={() => removeTag(s, requiredSkills, setRequiredSkills)} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Team Size Needed</label>
              <input type="number" name="required_members" className="input-field" min={1} max={20} value={form.required_members} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Status</label>
              <select name="status" className="input-field" value={form.status} onChange={handleChange}>
                <option value="open">Open for collaboration</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;
