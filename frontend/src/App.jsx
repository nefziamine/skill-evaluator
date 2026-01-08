import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import Tests from './pages/Tests'
import TestSession from './pages/TestSession'
import TestResults from './pages/TestResults'
import CandidateResults from './pages/CandidateResults'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tests"
            element={
              <ProtectedRoute>
                <Tests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/:testId"
            element={
              <ProtectedRoute>
                <TestSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/tests/:testId/results"
            element={
              <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
                <TestResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/results"
            element={
              <ProtectedRoute>
                <CandidateResults />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
