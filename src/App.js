import "./App.scss";
import Login from "./components/Login/Login";
import Nav from "./components/Navigation/Nav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="app-container">
                {/* <Nav /> */}
                <Routes>
                    <Route path="/" element={"home"} />
                    <Route path="/news" element={"news"} />
                    <Route path="/contact" element={"contact"} />
                    <Route path="/about" element={"about"} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={"404 not found"} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
