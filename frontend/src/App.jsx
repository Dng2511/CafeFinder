import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import CafeDetail from "./pages/CafeDetail";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CreateCafe from "./pages/CreateCafe";
import MyCafes from "./pages/MyCafes";
import EditCafe from "./pages/EditCafe";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* === AUTH ROUTES (Không có Layout Header/Footer) === */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* === MAIN ROUTES (Có Layout Header/Footer) === */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  {/* Public Routes - Ai cũng xem được */}
                  <Route path="/" element={<Home />} />
                  <Route path="/cafes/:id" element={<CafeDetail />} />

                  {/* User Protected Routes - Cần đăng nhập */}
                  <Route
                    path="/favorites"
                    element={
                      <ProtectedRoute>
                        <Favorites />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-cafe"
                    element={
                      <ProtectedRoute>
                        <CreateCafe />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-cafes"
                    element={
                      <ProtectedRoute>
                        <MyCafes />
                      </ProtectedRoute>
                    }
                  />
                  {/* Route sửa quán, cần ID */}
                  <Route
                    path="/edit-cafe/:id"
                    element={
                      <ProtectedRoute>
                        <EditCafe />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Routes - Chỉ Admin vào (Logic check role nằm trong Header hoặc ProtectedRoute) */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;