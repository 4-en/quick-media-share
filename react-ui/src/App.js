import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import NavigationPage from './components/NavigationPage';
import FileView from './components/FileView';

function App() {
  return (
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/navigate/" element={<NavigationPage />} />
          <Route path="/navigate/:folderPath*" element={<NavigationPage />} />
          <Route path="/file/:filePath" element={<FileView />} />
          {/* Additional routes can be added here */}
        </Routes>
      </Router>
  );
}

export default App;