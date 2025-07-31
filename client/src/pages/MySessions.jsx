import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { toast } from 'react-toastify';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get('/api/my-sessions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const filtered = res.data.filter(session => session.status !== 'deleted');
      setSessions(filtered);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load sessions');
    }
  };

  const handleEdit = (id) => {
    navigate(`/editor/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;

    try {
      await axios.post(`/api/my-sessions/${id}/delete`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Session moved to trash');
      setSessions(prev => prev.filter(session => session._id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete session');
    }
  };

  const handleCreateNew = () => {
    navigate('/editor');
  };

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Sessions</h2>
          <button
            onClick={handleCreateNew}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Create New
          </button>
        </div>

        {sessions.length === 0 ? (
          <p className="text-gray-500">No active sessions found.</p>
        ) : (
          sessions.map(session => (
            <div key={session._id} className="bg-white p-4 rounded shadow mb-4">
              <h3 className="text-lg font-semibold">{session.title}</h3>
              <p className="text-sm text-gray-600">Status: {session.status}</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleEdit(session._id)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(session._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default MySessions;
