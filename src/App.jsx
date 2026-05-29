import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';
import About from './pages/About';
import Navbar from './components/Navbar';
import { useScanHistory } from './hooks/useScanHistory';

function AppInner() {
  const { history } = useScanHistory();
  return (
    <>
      <Navbar historyCount={history.length} />
      <main style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
