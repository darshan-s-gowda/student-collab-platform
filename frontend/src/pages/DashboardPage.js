import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { getProfile, getMyRequests, sendRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const StatCard = ({ icon, value, label, color }) => (
  <div style={{ background: 'linear-gradient(145deg, #0f172a, #1e293b)', border: `1px solid ${color}22`, borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{ fontSize: '1.8rem' }}>{icon}</div>
    <div>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 800, color }}>{value}</p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>{label}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, reqRes] = await Promise.all([getProfile(), getMyRequests()]);
        setProfile(profileRes.data);
        setMyRequests(reqRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleSendRequest = async () => {
    setSubmitting(true);
    try {
      await sendRequest({ project_id: selectedProject._id, message });
      setSelectedProject(null);
      showToast('Request sent!');
    } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); }
    finally { setSubmitting(false); }
  };

  const pendingRequests = myRequests.filter(r => r.status === 'pending');
  const acceptedRequests = myRequests.filter(r => r.status === 'accepted');

  if (loading) return <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Loading dashboard...</div>;

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: '#020617', padding: '48px 16px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Welcome */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: '#64748b' }}>{user?.college} · {user?.engineering_branch}</p>
          </div>
          <Link to="/create-project"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', padding: '12px 24px', borderRadius: '14px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
            + Post New Project
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          <StatCard icon="🚀" value={profile?.projectsCreated?.length || 0} label="Projects Created" color="#818cf8" />
          <StatCard icon="🤝" value={profile?.projectsJoined?.length || 0} label="Projects Joined" color="#34d399" />
          <StatCard icon="⏳" value={pendingRequests.length} label="Pending Requests" color="#fbbf24" />
          <StatCard icon="✅" value={acceptedRequests.length} label="Accepted" color="#60a5fa" />
        </div>

        {/* My Projects */}
        {profile?.projectsCreated?.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>My Projects</h2>
              <Link to="/projects" style={{ color: '#818cf8', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {profile.projectsCreated.slice(0, 3).map(p => <ProjectCard key={p._id} project={p} />)}
            </div>
          </div>
        )}

        {/* Request Activity */}
        {myRequests.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '20px' }}>
              My Collaboration Requests
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {myRequests.slice(0, 5).map(req => {
                const sc = { pending: { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' }, accepted: { bg: 'rgba(16,185,129,0.15)', text: '#34d399', border: 'rgba(16,185,129,0.3)' }, rejected: { bg: 'rgba(239,68,68,0.15)', text: '#f87171', border: 'rgba(239,68,68,0.3)' } }[req.status];
                return (
                  <div key={req._id} style={{ background: 'linear-gradient(145deg, #0f172a, #1e293b)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem', marginBottom: '3px' }}>{req.project_id?.title || 'Unknown Project'}</p>
                      <p style={{ color: '#64748b', fontSize: '0.78rem' }}>{new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <span style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, padding: '3px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>
                );
              })}
              {myRequests.length > 5 && (
                <Link to="/requests" style={{ color: '#818cf8', textAlign: 'center', padding: '12px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>View all requests →</Link>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!profile?.projectsCreated?.length && !myRequests.length && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🌱</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>Your journey starts here</h3>
            <p style={{ color: '#64748b', marginBottom: '28px' }}>Post your first project or browse existing ones to collaborate.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/create-project" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>Post a Project</Link>
              <Link to="/projects" style={{ background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>Browse Projects</Link>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: toast.type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(16,185,129,0.95)', color: 'white', padding: '12px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '0.875rem', zIndex: 9999, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
