import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { AdminPanelSettings, Work, ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material'
import api from '../services/api'

function Login() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const roleParam = queryParams.get('role') || ''

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState('')
  const navigate = useNavigate()
  const theme = useTheme()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', formData)
      const { token, role } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('userRole', role)
      localStorage.setItem('username', response.data.username)

      // Redirect based on role
      if (role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else if (role === 'RECRUITER') {
        navigate('/recruiter/dashboard')
      } else {
        // Candidates should not login here
        localStorage.clear()
        setError('Access denied. Please use the link provided in your invitation.')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError('Please enter your admin email address')
      return
    }

    setResetLoading(true)
    setError('')
    setResetSuccess('')

    try {
      await api.post('/auth/admin/forgot-password', { email: resetEmail })
      setResetSuccess('Password reset instructions have been sent to your email.')
      setResetEmail('')
      setForgotPasswordOpen(false)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to send reset instructions. Please contact system administrator.'
      )
    } finally {
      setResetLoading(false)
    }
  }

  const isRoleAdmin = roleParam.toUpperCase() === 'ADMIN'
  const isRoleRecruiter = roleParam.toUpperCase() === 'RECRUITER'

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#020617',
      color: 'white'
    }}>
      <Container component="main" maxWidth="xs" sx={{ flexGrow: 1, py: 8, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%' }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
            sx={{ mb: 4, color: '#94a3b8', textTransform: 'none' }}
          >
            Back to Home
          </Button>

          <Paper
            elevation={0}
            sx={{
              p: 5,
              width: '100%',
              bgcolor: alpha('#1e293b', 0.5),
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: alpha('#fff', 0.1),
              borderRadius: 6,
              color: 'white'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              {isRoleAdmin ? (
                <AdminPanelSettings sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              ) : isRoleRecruiter ? (
                <Work sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              ) : null}

              <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
                {isRoleAdmin ? 'Admin Auth' : isRoleRecruiter ? 'Recruiter Auth' : 'Sign In'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Skill Evaluator Gateway
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.light,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.error.main, 0.2)
                }}
              >
                {error}
              </Alert>
            )}

            {resetSuccess && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.light,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.success.main, 0.2)
                }}
              >
                {resetSuccess}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: alpha('#fff', 0.2) },
                    '&:hover fieldset': { borderColor: alpha('#fff', 0.3) },
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ color: '#94a3b8', minWidth: 'auto', p: 1 }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: alpha('#fff', 0.2) },
                    '&:hover fieldset': { borderColor: alpha('#fff', 0.3) },
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' }
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                color={isRoleAdmin ? 'secondary' : 'primary'}
                sx={{
                  mt: 4,
                  mb: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Authenticate'}
              </Button>

              {isRoleAdmin && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    onClick={() => setForgotPasswordOpen(true)}
                    sx={{ color: '#94a3b8', textTransform: 'none', fontSize: '0.875rem' }}
                  >
                    Forgot Admin Password?
                  </Button>
                </Box>
              )}
            </Box>
        </Paper>
      </Box>
    </Container>

    {/* Forgot Password Dialog */}
    <Dialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1e293b', color: 'white' }}>
        Admin Password Recovery
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#1e293b', color: 'white', p: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, color: '#94a3b8' }}>
          Enter your admin email address to receive password reset instructions.
        </Typography>
        <TextField
          fullWidth
          label="Admin Email"
          type="email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: alpha('#fff', 0.2) },
              '&:hover fieldset': { borderColor: alpha('#fff', 0.3) },
            },
            '& .MuiInputLabel-root': { color: '#94a3b8' }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#1e293b', p: 3 }}>
        <Button onClick={() => setForgotPasswordOpen(false)} sx={{ color: '#94a3b8' }}>
          Cancel
        </Button>
        <Button
          onClick={handleForgotPassword}
          variant="contained"
          color="secondary"
          disabled={resetLoading}
        >
          {resetLoading ? <CircularProgress size={20} /> : 'Send Reset Instructions'}
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
)

export default Login;
