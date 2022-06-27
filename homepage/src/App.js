import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./screens/home";
import Docs from "./screens/docs";
import PrivacyPolicy from "./screens/privacy-policy";
import NotFound from "./screens/404";

import './styling/App.css';
import './styling/screens.css';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="Router">
        <Router>
          <Routes>
            <Route path = "/" element={<Home />} />
            <Route path = "/getting-started" element={<Docs />} />
            <Route path = "/privacy-policy" element={<PrivacyPolicy />} />
            <Route path = "*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
