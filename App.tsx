import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BookDetail from './pages/BookDetail';
import ChapterEditor from './pages/ChapterEditor';
import Glossary from './pages/Glossary';
import Characters from './pages/Characters';
import Settings from './pages/Settings';
import { NotificationProvider } from './contexts/NotificationContext';

const App: React.FC = () => {
  return (
    <HashRouter>
      <NotificationProvider>
        <Routes>
          <Route 
            path="/" 
            element={<Layout />}
          >
            <Route index element={<Dashboard />} />
            <Route path="books/:bookId" element={<BookDetail />} />
            <Route path="books/:bookId/chapters/new" element={<ChapterEditor />} />
            <Route path="books/:bookId/chapters/:chapterId" element={<ChapterEditor />} />
            <Route path="glossary" element={<Glossary />} />
            <Route path="characters" element={<Characters />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </HashRouter>
  );
};

export default App;
