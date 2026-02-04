import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Home from './pages/MainLanding'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import Tests from './pages/Tests'
import TestSession from './pages/TestSession'
import TestResults from './pages/TestResults'
import CandidateResults from './pages/CandidateResults'
import InviteHandler from './pages/InviteHandler'
import SuccessResults from './pages/SuccessResults'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // Modern blue
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#ec4899', // Modern pink/fuchsia
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    divider: 'rgba(255, 255, 255, 0.05)',
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
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
          <Route path="/invite/:token" element={<InviteHandler />} />
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
          <Route
            path="/test/success/:sessionId"
            element={
              <ProtectedRoute>
                <SuccessResults />
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
