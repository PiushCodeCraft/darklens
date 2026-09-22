import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// POST /api/vote -> Upvote or Downvote (+1 or -1)
router.post('/vote', async (req, res) => {
  try {
    const { submission_id, session_id, vote_type } = req.body;

    if (!submission_id || !session_id || ![-1, 1].includes(vote_type)) {
      return res.status(400).json({ 
        error: 'Required parameters: submission_id, session_id, vote_type (-1 or 1).' 
      });
    }

    // Insert vote into 'votes' table
    const { error: voteError } = await supabase
      .from('votes')
      .insert([{ submission_id, session_id, vote_type }]);

    if (voteError) {
      if (voteError.code === '23505') { // Postgres unique constraint error
        return res.status(400).json({ error: 'You have already voted on this submission.' });
      }
      console.error('Vote Error:', voteError);
      return res.status(500).json({ error: 'Failed to record vote.' });
    }

    // Fetch current scores to recalculate
    const { data: sub, error: fetchErr } = await supabase
      .from('submissions')
      .select('upvotes, downvotes')
      .eq('id', submission_id)
      .single();

    if (fetchErr || !sub) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    const newUpvotes = vote_type === 1 ? sub.upvotes + 1 : sub.upvotes;
    const newDownvotes = vote_type === -1 ? sub.downvotes + 1 : sub.downvotes;

    // Update submission counters
    const { data: updatedSub, error: updateErr } = await supabase
      .from('submissions')
      .update({ upvotes: newUpvotes, downvotes: newDownvotes })
      .eq('id', submission_id)
      .select()
      .single();

    if (updateErr) {
      return res.status(500).json({ error: 'Failed to update vote score.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Vote recorded!',
      data: updatedSub,
    });
  } catch (err) {
    console.error('Vote Endpoint Error:', err);
    return res.status(500).json({ error: 'Server error processing vote.' });
  }
});

export default router;