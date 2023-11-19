import './App.css'
import Project from './project';
import Page2 from './Page2';
import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import {useNavigate} from "react-router-dom"
  
function App() {
  const navigate = useNavigate(); 

  return (
    <>
    <BrowserRouter>
    <Routes>
      
      <Route exact path="/" element={<Project title="project one" url="https://colorlib.com/wp/wp-content/uploads/sites/2/amanda-rache-lee-resume-website-1024x829.jpg.webp"/>}/>

      <Route exact path="/page2" element={<Page2/>}/>
    </Routes>
    </BrowserRouter>
      {/* <Project title="project one" url="https://colorlib.com/wp/wp-content/uploads/sites/2/amanda-rache-lee-resume-website-1024x829.jpg.webp"/>
      <Project title="project two" url="https://colorlib.com/wp/wp-content/uploads/sites/2/amanda-rache-lee-resume-website-1024x829.jpg.webp"/> */}
      {/*<button onClick={()=>navigate("/page2")}>btn</button>*/}
    </>
    
  );
}

export default App;
