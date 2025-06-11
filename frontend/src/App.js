import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./components/CSS/App.css";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import Communityforum from "./components/Communityforum";
import SignUp from "./components/SignUp";
import LogIn from "./components/Login";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/" element={<SignUp />} />
        <Route path="/Communityforum" element={<Communityforum />} />
        <Route path="/Login" element={<LogIn />} />
      </Routes>
    </Router>
  );
}

export default App;
