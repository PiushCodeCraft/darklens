
import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// GET /api/feed -> Returns ranked list of dark patterns
router.get('/feed', async (req, res) => {
  try {
    const { domain, sort_by } = req.query;

    let query = supabase.from('submissions').select('*');

    // Filter by domain if provided (e.g. /api/feed?domain=booking.com)
    if (domain) {
      query = query.eq('domain', domain.toLowerCase().trim());
    }

    // Sorting logic
    if (sort_by === 'severity') {
      query = query.order('severity', { ascending: false });
    } else {
      // Default sort: highest net_score first, then severity
      query = query
        .order('net_score', { ascending: false })
        .order('severity', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase Feed Fetch Error:', error);
      return res.status(500).json({ error: 'Failed to fetch feed submissions.' });
    }

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('Feed Endpoint Error:', err);
    return res.status(500).json({ error: 'Server error while loading feed.' });
  }
});

// GET /api/feed/:id -> Single submission detail
router.get('/feed/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: 'Server error loading submission details.' });
  }
});

export default router;