const express = require('express');
const Session = require('../models/Session');
const auth = require('../middleware/auth');
const router = express.Router();

// GET all published sessions (public)
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' }).sort('-updated_at');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch sessions' });
  }
});

// GET logged-in user's sessions (excluding deleted)
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const sessions = await Session.find({
      user_id: req.user,
      status: { $ne: 'deleted' }
    }).sort('-updated_at');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch user sessions' });
  }
});

// GET a specific session by ID
router.get('/my-sessions/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user_id: req.user });
    if (!session || session.status === 'deleted') {
      return res.status(404).json({ msg: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch session' });
  }
});

// Save or update a draft session
router.post('/my-sessions/save-draft', auth, async (req, res) => {
  try {
    const { id, title, tags, json_file_url } = req.body;
    let session;

    if (id) {
      session = await Session.findOneAndUpdate(
        { _id: id, user_id: req.user },
        { title, tags, json_file_url, status: 'draft' },
        { new: true }
      );
    } else {
      session = new Session({ user_id: req.user, title, tags, json_file_url, status: 'draft' });
      await session.save();
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save draft' });
  }
});

// Publish a session
router.post('/my-sessions/publish', auth, async (req, res) => {
  try {
    const { id } = req.body;
    const session = await Session.findOneAndUpdate(
      { _id: id, user_id: req.user },
      { status: 'published' },
      { new: true }
    );
    if (!session) return res.status(404).json({ msg: 'Session not found to publish' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to publish session' });
  }
});

// Soft-delete a session
router.post('/my-sessions/:id/delete', auth, async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user },
      { status: 'deleted' }
    );
    if (!session) return res.status(404).json({ msg: 'Session not found to delete' });
    res.json({ msg: 'Session soft-deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed' });
  }
});

module.exports = router;
