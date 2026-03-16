import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Roadmap from './pages/Roadmap';
import Analytics from './pages/Analytics';
import ProblemWorkspace from './pages/ProblemWorkspace';
import Contests from './pages/Contests';
import Profile from './pages/Profile';
import Tutorials from './pages/Tutorials';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:problemId" element={<ProblemWorkspace />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
