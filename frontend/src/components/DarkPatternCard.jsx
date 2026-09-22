import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { submitVote } from '../services/api';

export default function DarkPatternCard({ item }) {
  const [upvotes, setUpvotes] = useState(item.upvotes || 0);
  const [downvotes, setDownvotes] = useState(item.downvotes || 0);
  const [voted, setVoted] = useState(false);

  const handleVote = async (e, voteType) => {
    e.preventDefault();
    if (voted) return;
    try {
      const result = await submitVote(item.id, voteType);
      setUpvotes(result.data.upvotes);
      setDownvotes(result.data.downvotes);
      setVoted(true);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md dark:hover:border-slate-700 transition duration-200 flex flex-col justify-between">
      <Link to={`/submission/${item.id}`} className="block relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden group">
        <img
          src={item.image_url}
          alt={item.domain}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
          Severity {item.severity}/5
        </span>
        <div className="absolute inset-0 bg-indigo-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-medium text-xs gap-1 backdrop-blur-[2px]">
          <Eye size={16} /> View AI Details
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {item.pattern_type}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{item.domain}</span>
          </div>

          <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 line-clamp-3 leading-relaxed">{item.explanation}</p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleVote(e, 1)}
              disabled={voted}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                voted
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <ThumbsUp size={14} /> {upvotes}
            </button>
            <button
              onClick={(e) => handleVote(e, -1)}
              disabled={voted}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                voted
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              <ThumbsDown size={14} /> {downvotes}
            </button>
          </div>

          <Link
            to={`/submission/${item.id}`}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
}