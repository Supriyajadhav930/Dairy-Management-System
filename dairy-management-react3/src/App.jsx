
import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dash from "./pages/dash";
import Morning from "./pages/Morning";
import Evening from "./pages/Evening";
import AddFarmer from "./pages/Add_Farmer";
import GenerateBill from "./pages/GenerateBill";
import Bill from "./pages/Bill";
import Rate from "./pages/rate";

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
        <Route path="/add-farmer" element={<AddFarmer />} />
        <Route path="/generate-bill" element={<GenerateBill />} />
        <Route path="/bill-statement" element={<Bill />} />
        <Route path="/rate" element={<Rate />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
