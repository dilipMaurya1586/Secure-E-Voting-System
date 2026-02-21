import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login'
import Register from './pages/Register';
import VoterDashboard from './pages/VoterDashboard';  // ✅ VoterDashboard
import AdminDashboard from './pages/AdminDashboard';
import Voting from './pages/Voting';  // ✅ Voting (vote daalne ka page)
import Results from './pages/Results';
import Profile from './pages/Profile';
import './index.css';
import CreateElection from './pages/CreateElection';
import ManageCandidates from './pages/ManageCandidates';
import AdminResults from './pages/AdminResults';
import VerifyVoters from './pages/VerifyVoters';
import ManageElection from './pages/ManageElection';
import VotingHistory from './pages/VotingHistory';



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Toaster />
          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<PrivateRoute />}>

              <Route path="/voter" element={<VoterDashboard />} />  {/* ✅ Voter Dashboard */}
              <Route path="/vote/:id" element={<Voting />} />      {/* ✅ Voting Page */}

              <Route path="/results" element={<Results />} />
              <Route path="/results/:id" element={<Results />} />

              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/create-election" element={<CreateElection />} />
              <Route path="/admin/elections/:id" element={<ManageElection />} />
              <Route path="/admin/candidates" element={<ManageCandidates />} />
              <Route path="/admin/results" element={<AdminResults />} />
              <Route path="/admin/voters" element={<VerifyVoters />} />
              <Route path="/profile" element={<Profile />} />


              <Route path="/history" element={<VotingHistory />} />

            </Route>

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;