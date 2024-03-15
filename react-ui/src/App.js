import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import NavigationPage from './components/NavigationPage';
import FileView from './components/FileView';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="/file" element={<FileView />} />
          {/* Additional routes can be added here */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;