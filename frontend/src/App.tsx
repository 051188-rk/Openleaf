import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { TemplateSelector } from './pages/TemplateSelector';
import { InputForm } from './pages/InputForm';
import { ResultView } from './pages/ResultView';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
        <Header />
        <Routes>
          <Route path="/" element={<TemplateSelector />} />
          <Route path="/input" element={<InputForm />} />
          <Route path="/result" element={<ResultView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
