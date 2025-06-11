import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./components/CSS/App.css";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import Communityforum from "./components/Communityforum";
import SignUp from "./components/SignUp";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/HomePage" element={<Homepage />} />
        <Route path="/Communityforum" element={<Communityforum />} />
      </Routes>
    </Router>
  );
}

export default App;
