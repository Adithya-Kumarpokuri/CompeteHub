import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import './index.css'
import Youtubelinks from './Pages/Youtubelinks';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Pages/Home'
import Contest from './Pages/Contests';
function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contests" element={<Contest />} />
        <Route path='/youtubelinks' element={<Youtubelinks/>} ></Route>
      </Routes>
    </Router>
  );
}
export default App;
