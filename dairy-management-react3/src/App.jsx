import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dash from "./pages/dash"; // Import the dashboard component
import Morning from "./pages/Morning";
import Evening from "./pages/Evening";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dash />} /> 
        <Route path="/morning" element={<Morning />} />
        <Route path="/evening" element={<Evening />} />
      </Routes>
    </HashRouter>
  );
}

export default App;