import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getSessionId = () => {
  let sessionId = localStorage.getItem('voter_session_id');
  if (!sessionId) {
    sessionId = 'user_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('voter_session_id', sessionId);
  }
  return sessionId;
};

export const fetchFeed = async (sortBy = 'highest_score') => {
  const res = await axios.get(`${API_URL}/feed`, { params: { sort: sortBy } });
  return res.data;
};

export const fetchSubmissionDetail = async (id) => {
  const res = await axios.get(`${API_URL}/feed/${id}`);
  return res.data;
};

export const submitVote = async (submissionId, voteType) => {
  const res = await axios.post(`${API_URL}/vote`, {
    submission_id: submissionId,
    vote_type: voteType,
    session_id: getSessionId()
  });
  return res.data;
};

export const submitScreenshot = async (formData) => {
  const res = await axios.post(`${API_URL}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};