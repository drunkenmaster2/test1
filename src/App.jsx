import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import './index.css'
import Main from './page/Main';


const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Main />} />
    </Routes>
  </Router>
  );
};

export default App;
