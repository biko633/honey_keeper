import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "../pages/home.jsx";
import { UserForm } from "../pages/userform.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<UserForm />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
