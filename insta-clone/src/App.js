import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";      // Importing Home component
import SignUp from "./components/SignUp";  // Importing SignUp component
import SignIn from "./components/SignIn";  // Importing SignIn component
import Profile from "./components/Profile"; // Importing Profile component
import {BrowserRouter,Routes,Route} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/profile" element={<Profile />}></Route> 
      </Routes>  
    </div>
    </BrowserRouter>
  );
}

export default App;
