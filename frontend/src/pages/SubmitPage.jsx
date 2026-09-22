import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Upload, Sparkles, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { submitScreenshot } from '../services/api';

export default function SubmitPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [domain, setDomain] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !domain) {
      setError('Please provide a screenshot and domain name.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('screenshot', file);
    formData.append('domain', domain);
    formData.append('target_url', targetUrl);

    try {
      const response = await submitScreenshot(formData);
      const submissionData = response.data;
      setResult(submissionData);

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.error || 'Failed to analyze screenshot. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-6"
        >
          <ArrowLeft size={16} /> Back to Leaderboard
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-colors">
          <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Analyze Website Screenshot</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Upload a screenshot to let Gemini Vision AI identify dark patterns and add it to the live leaderboard.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Screenshot <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition rounded-2xl p-6 text-center cursor-pointer bg-slate-50 dark:bg-slate-800/50 relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {preview ? (
                  <div className="relative h-64 w-full flex items-center justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PNG, JPG, or WEBP (max 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Domain <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. booking.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Page URL <span className="text-slate-400 dark:text-slate-500">(Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/checkout"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${
                loading
                  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing with Gemini Vision AI...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Analyze & Publish
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold mb-2">
                <CheckCircle2 size={20} /> Analysis Complete & Added to Leaderboard!
              </div>
              <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-4">
                <strong>{result.pattern_type}</strong> detected with severity <strong>{result.severity}/5</strong>. Redirecting to leaderboard...
              </p>
              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium text-sm rounded-xl transition"
              >
                Go to Leaderboard Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}