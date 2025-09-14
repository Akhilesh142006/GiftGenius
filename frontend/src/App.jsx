import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Welcome from './components/Welcome';
import RelationshipOccasion from './components/RelationshipOccasion';
import BudgetAge from './components/BudgetAge';
import Interests from './components/Interests';
import Loading from './components/Loading';
import Results from './components/Results';
import APITest from './components/APITest';
import Chatbot from './components/Chatbot';
import { GiftContextProvider } from './context/GiftContext';
import './App.css';

function App() {
  return (
    <GiftContextProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/relationship-occasion" element={<RelationshipOccasion />} />
              <Route path="/budget-age" element={<BudgetAge />} />
              <Route path="/interests" element={<Interests />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/results" element={<Results />} />
              <Route path="/test" element={<APITest />} />
            </Routes>
          </main>
          <Chatbot />
        </div>
      </Router>
    </GiftContextProvider>
  );
}

export default App;