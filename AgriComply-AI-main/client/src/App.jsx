import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { VaultProvider } from './contexts/VaultContext';

// Import Pages
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import ComplianceView from './pages/ComplianceView';
import GrowthView from './pages/GrowthView';
import VaultView from './pages/VaultView';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register'; 
import LoanCalculator from './pages/LoanCalculator'; // <--- 1. IMPORT THIS
import ChatbotWidget from './components/common/ChatbotWidget';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function Layout({ children }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onToggleChatbot={() => setIsChatbotOpen((prev) => !prev)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
      <ChatbotWidget
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen((prev) => !prev)}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <VaultProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/growth" element={<GrowthView />} />
                    
                    {/* 2. MAKE SURE THIS LINE EXISTS HERE */}
                    <Route path="/loan-check" element={<LoanCalculator />} />
                    
                    <Route path="/vault" element={<VaultView />} />
                    <Route path="/compliance" element={<ComplianceView />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </VaultProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
