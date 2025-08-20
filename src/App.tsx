import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddProductPage from './pages/AddProductPage';
import GeneratePDFPage from './pages/GeneratePDFPage';
import { useAppSelector } from './app/hooks';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userInfo } = useAppSelector((state) => state.auth);
  return userInfo ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/add-product" 
            element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/generate-pdf" 
            element={
              <ProtectedRoute>
                <GeneratePDFPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;