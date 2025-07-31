import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout.jsx';

const Editor = () => {
  const { id: urlId } = useParams(); // id from /editor/:id
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [id, setId] = useState(urlId || null); // Actual ID to use
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [jsonUrl, setJsonUrl] = useState('');

  // Fetch session if editing
  useEffect(() => {
    if (urlId) {
      axios
        .get(`/api/my-sessions/${urlId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setTitle(res.data.title || '');
          setTags(res.data.tags?.join(',') || '');
          setJsonUrl(res.data.json_file_url || '');
        })
        .catch(() => {
          toast.error('Failed to load session');
        });
    }
  }, [urlId]);

  // Auto-save draft every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSave();
    }, 5000);

    return () => clearTimeout(timer);
  }, [title, tags, jsonUrl]);

  // Save Draft
  const handleSave = async () => {
    try {
      const res = await axios.post(
        '/api/my-sessions/save-draft',
        {
          id, // may be null
          title,
          tags: tags.split(',').map((t) => t.trim()),
          json_file_url: jsonUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // store new ID if session was just created
      if (!id) setId(res.data._id);

      toast.success('Draft saved');
    } catch (err) {
      toast.error('Auto-save failed');
    }
  };

  // Publish session
  const handlePublish = async () => {
    if (!id) {
      toast.error('Session ID missing. Please wait for auto-save.');
      return;
    }

    try {
      await axios.post(
        '/api/my-sessions/publish',
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Session published successfully!');
      navigate('/my-sessions');
    } catch (err) {
      console.error(err);
      toast.error('Failed to publish session.');
    }
  };

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen space-y-4">
        <h2 className="text-2xl font-bold">Session Editor</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />

        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Comma-separated tags"
          className="w-full border p-2 rounded"
        />

        <input
          value={jsonUrl}
          onChange={(e) => setJsonUrl(e.target.value)}
          placeholder="JSON File URL"
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Save as Draft
          </button>
          <button
            onClick={handlePublish}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Publish
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Editor;
