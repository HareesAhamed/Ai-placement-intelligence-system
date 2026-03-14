import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Roadmap from './pages/Roadmap';
import MockTest from './pages/MockTest';
import Analytics from './pages/Analytics';
import ProblemListPage from './pages/ProblemListPage';
import ProblemPage from './pages/ProblemPage';
import SubmissionPage from './pages/SubmissionPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/mock-test" element={<MockTest />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/coding/problems" element={<ProblemListPage />} />
          <Route path="/coding/problems/:problemId" element={<ProblemPage />} />
          <Route path="/coding/submissions" element={<SubmissionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
