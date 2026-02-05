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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
} from '@mui/material'
import { PersonAdd, ArrowBack } from '@mui/icons-material'
import api from '../services/api'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'RECRUITER',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const roleParam = params.get('role')
    if (roleParam && (roleParam === 'ADMIN' || roleParam === 'RECRUITER')) {
      setFormData(prev => ({ ...prev, role: roleParam }))
    }
  }, [location])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#0f172a',
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
              <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
                Join Platform
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Create your professional account
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

            {success && (
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
                {success}
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
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
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
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: alpha('#fff', 0.2) },
                    '&:hover fieldset': { borderColor: alpha('#fff', 0.3) },
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' }
                }}
                helperText={<Typography variant="caption" sx={{ color: '#64748b' }}>Minimum 6 characters</Typography>}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
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

              {/* Register As section hidden as per request */}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 4,
                  mb: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 10px 20px -10px rgba(59, 130, 246, 0.5)'
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default Register

