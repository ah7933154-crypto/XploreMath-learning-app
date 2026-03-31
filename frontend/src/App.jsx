import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import Select from './Select';
import Questions from './Questions'
import Notes from './Notes'
import Formulas from './Formulas'
import Test from './Test'
import Forum from './Forum'
import Contact from './Contact'
import Curriculum from './curriculum';
import PreExerciseNotes from './PreExerciseNotes';
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/select" element={<Select />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/Notes" element={<Notes />} />
        <Route path="/formulas" element={<Formulas />} />
        <Route path="/test" element={<Test />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/pre-exercise-notes" element={<PreExerciseNotes />} />
      </Routes>
    </Router>
  );
};

export default App;
