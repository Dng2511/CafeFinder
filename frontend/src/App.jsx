import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CafeDetail from "./pages/CafeDetail";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cafes/:id" element={<CafeDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
