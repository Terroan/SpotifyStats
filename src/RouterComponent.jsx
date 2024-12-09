import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlaylistCreated from './PlaylistCreated';
import HomePage from './App'; // 

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/playlist-created" element={<PlaylistCreated />} /> 
      </Routes>
    </Router>
  );
};

export default RouterComponent;
