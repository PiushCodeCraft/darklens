import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DarkPatternCard from '../components/DarkPatternCard';
import { fetchFeed } from '../services/api';
import { Filter, Loader2, AlertCircle } from 'lucide-react';

export default function LeaderboardPage() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('highest_score');

  const loadFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFeed(sortBy);
      const items = response.data || response;
      const allItems = Array.isArray(items) ? items : [];

      // Filter out clean screenshots where no dark pattern was detected
      const darkPatternItems = allItems.filter(
        (item) => item.pattern_type && item.pattern_type.toLowerCase() !== 'none'
      );

      setFeed(darkPatternItems);
    } catch (err) {
      console.error('Failed to load feed:', err);
      setError('Failed to fetch submissions. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Deceptive Patterns Leaderboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Community submissions classified in real-time by Gemini Vision AI
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400 dark:text-slate-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
            >
              <option value="highest_score">Highest Score / Severity</option>
              <option value="most_upvoted">Most Upvoted</option>
              <option value="latest">Latest Submissions</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
            <Loader2 size={32} className="animate-spin text-indigo-600 dark:text-indigo-400 mb-3" />
            <p className="text-sm font-medium">Fetching live submissions from database...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-6 text-center max-w-lg mx-auto my-12">
            <AlertCircle size={32} className="text-red-500 dark:text-red-400 mx-auto mb-2" />
            <h3 className="font-semibold text-red-900 dark:text-red-200">Database Connection Error</h3>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
            <button
              onClick={loadFeed}
              className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-xl text-xs font-medium hover:bg-red-700 dark:hover:bg-red-600 transition"
            >
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && feed.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <p className="text-slate-700 dark:text-slate-200 font-medium">No deceptive patterns recorded yet.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Be the first to submit a screenshot with deceptive UI elements!
            </p>
          </div>
        )}

        {!loading && !error && feed.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feed.map((item) => (
              <DarkPatternCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}