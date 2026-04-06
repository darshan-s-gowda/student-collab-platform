import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRequests, getProfile, getProjectRequests } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RequestCard from '../components/RequestCard';

const TAB_MY = 'my';
const TAB_INCOMING = 'incoming';

const RequestsPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(TAB_MY);
  const [myRequests, setMyRequests] = useState([]);
  const [allIncoming, setAllIncoming] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMyRequests = async () => {
    try {
      const { data } = await getMyRequests();
      setMyRequests(data);
    } catch (err) { console.error(err); }
  };

  const fetchMyProjects = async () => {
    try {
      const { data } = await getProfile();
      const projects = data.projectsCreated || [];
      setMyProjects(projects);
      if (projects.length > 0) {
        const firstId = projects[0]._id;
        setSelectedProject(firstId);
        await fetchIncomingForProject(firstId);
      }
    } catch (err) { console.error(err); }
  };

  const fetchIncomingForProject = async (projectId) => {
    if (!projectId) return;
    try {
      const { data } = await getProjectRequests(projectId);
      setAllIncoming(data);
    } catch (err) { setAllIncoming([]); }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchMyRequests(), fetchMyProjects()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleProjectChange = async (projectId) => {
    setSelectedProject(projectId);
    await fetchIncomingForProject(projectId);
  };

  const handleUpdate = () => {
    fetchIncomingForProject(selectedProject);
    fetchMyRequests();
  };

  const pendingMine = myRequests.filter(r => r.status === 'pending').length;
  const pendingIncoming = allIncoming.filter(r => r.status === 'pending').length;

  const statusGroups = {
    pending: myRequests.filter(r => r.status === 'pending'),
    accepted: myRequests.filter(r => r.status === 'accepted'),
    rejected: myRequests.filter(r => r.status === 'rejected'),
  };

  if (loading) return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-700 rounded w-48" />
        <div className="h-10 bg-surface-800 rounded-xl" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-surface-800 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-100 mb-2">Requests Dashboard</h1>
        <p className="text-slate-400">Track collaboration requests you've sent and received</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface-800/60 border border-slate-700/50 rounded-xl w-fit">
        <button
          onClick={() => setTab(TAB_MY)}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === TAB_MY ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          My Requests
          {pendingMine > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${tab === TAB_MY ? 'bg-white/20' : 'bg-amber-500/20 text-amber-400'}`}>
              {pendingMine}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab(TAB_INCOMING)}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === TAB_INCOMING ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Incoming
          {pendingIncoming > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${tab === TAB_INCOMING ? 'bg-white/20' : 'bg-amber-500/20 text-amber-400'}`}>
              {pendingIncoming}
            </span>
          )}
        </button>
      </div>

      {/* My Sent Requests */}
      {tab === TAB_MY && (
        <div className="space-y-6">
          {myRequests.length === 0 ? (
            <div className="card text-center py-14">
              <div className="w-14 h-14 rounded-2xl bg-surface-700 border border-slate-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-slate-300 mb-2">No requests sent yet</h3>
              <p className="text-slate-500 text-sm mb-5">Browse projects and send your first collaboration request.</p>
              <Link to="/feed" className="btn-primary">Explore Projects</Link>
            </div>
          ) : (
            <>
              {(['pending', 'accepted', 'rejected']).map(status => (
                statusGroups[status].length > 0 && (
                  <div key={status}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2 h-2 rounded-full ${
                        status === 'pending' ? 'bg-amber-400' :
                        status === 'accepted' ? 'bg-emerald-400' : 'bg-red-400'
                      }`} />
                      <h2 className="font-display font-semibold text-slate-300 capitalize text-sm tracking-wide uppercase">
                        {status} · {statusGroups[status].length}
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {statusGroups[status].map(r => (
                        <RequestCard key={r._id} request={r} viewMode="student" />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </>
          )}
        </div>
      )}

      {/* Incoming Requests for my projects */}
      {tab === TAB_INCOMING && (
        <div className="space-y-5">
          {myProjects.length === 0 ? (
            <div className="card text-center py-14">
              <div className="w-14 h-14 rounded-2xl bg-surface-700 border border-slate-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-slate-300 mb-2">No projects yet</h3>
              <p className="text-slate-500 text-sm mb-5">Create a project first to receive collaboration requests.</p>
              <Link to="/create-project" className="btn-primary">Create Project</Link>
            </div>
          ) : (
            <>
              {/* Project Selector */}
              <div>
                <label className="label">Select Project</label>
                <select
                  className="input-field max-w-sm"
                  value={selectedProject}
                  onChange={e => handleProjectChange(e.target.value)}
                >
                  {myProjects.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {allIncoming.length === 0 ? (
                <div className="card text-center py-10">
                  <p className="text-slate-400 text-sm">No requests for this project yet.</p>
                  <p className="text-slate-600 text-xs mt-1">Share your project to attract collaborators!</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-sm text-slate-400">
                      {allIncoming.length} request{allIncoming.length !== 1 ? 's' : ''}
                      {pendingIncoming > 0 && <span className="ml-2 text-amber-400">({pendingIncoming} pending)</span>}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {allIncoming.map(r => (
                      <RequestCard key={r._id} request={r} onUpdate={handleUpdate} viewMode="owner" />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
