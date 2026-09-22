import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LeaderboardPage from './pages/LeaderboardPage';
import SubmitPage from './pages/SubmitPage';
import DetailPage from './pages/DetailPage';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LeaderboardPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/submission/:id" element={<DetailPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}