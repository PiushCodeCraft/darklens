import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ThumbsUp, ThumbsDown, ArrowLeft, ShieldAlert, AlertTriangle, ExternalLink } from 'lucide-react';
import { fetchSubmissionDetail, submitVote } from '../services/api';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [voted, setVoted] = useState(false);
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetchSubmissionDetail(id);
        const data = response.data;
        setItem(data);
        setUpvotes(data.upvotes || 0);
        setDownvotes(data.downvotes || 0);
      } catch (err) {
        console.error('Error fetching detail:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const handleVote = async (voteType) => {
    if (voted || !id) return;
    try {
      const result = await submitVote(id, voteType);
      setUpvotes(result.data.upvotes);
      setDownvotes(result.data.downvotes);
      setVoted(true);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 flex items-center justify-center">
      <div className="p-20 text-center">Loading submission details...</div>
    </div>
  );
  if (!item) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 flex items-center justify-center">
      <div className="p-20 text-center">Submission not found.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition"
        >
          <ArrowLeft size={16} /> Back to Leaderboard
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
          <div className="bg-slate-950 p-4 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
            <img
              src={item.image_url}
              alt="Dark Pattern Screenshot"
              className="max-h-[500px] w-auto object-contain rounded-lg"
            />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/60">
                  {item.pattern_type}
                </span>
                <h1 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{item.domain}</h1>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/60">
                  Severity: {item.severity} / 5
                </span>
                {item.confidence && (
                  <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
                    Confidence: {(item.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                <ShieldAlert size={16} className="text-indigo-600 dark:text-indigo-400" /> Gemini Vision AI Breakdown
              </h3>
              <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{item.explanation}</p>
            </div>

            {item.target_url && (
              <div className="mb-6">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Target URL
                </span>
                <a
                  href={item.target_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 font-mono break-all"
                >
                  {item.target_url} <ExternalLink size={14} />
                </a>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Community Verdict:</span>
                <button
                  onClick={() => handleVote(1)}
                  disabled={voted}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    voted
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  <ThumbsUp size={16} /> {upvotes}
                </button>

                <button
                  onClick={() => handleVote(-1)}
                  disabled={voted}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    voted
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <ThumbsDown size={16} /> {downvotes}
                </button>
              </div>

              <button
                onClick={() => setFlagged(true)}
                disabled={flagged}
                className={`flex items-center gap-1.5 text-xs font-medium transition px-3 py-1.5 rounded-lg border ${
                  flagged
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <AlertTriangle size={14} />
                {flagged ? 'Flagged for Moderation' : 'Report / Flag'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}