import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get('/api/sessions').then(res => setSessions(res.data));
  }, []);

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6">Published Wellness Sessions</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map(s => (
          <div key={s._id} className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-semibold">{s.title}</h3>
            <p className="text-gray-500">Tags: {s.tags.join(', ')}</p>
            <a
              href={s.json_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 underline mt-2 inline-block"
            >
              Open JSON
            </a>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Dashboard;
