import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
} from '@mui/material'
import { Person, ArrowBack } from '@mui/icons-material'
import api from '../services/api'

function CandidateSetup() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const testId = searchParams.get('testId')
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  const [candidateInfo, setCandidateInfo] = useState(null)
  const navigate = useNavigate()
  const theme = useTheme()

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Set the token temporarily for validation
        const originalToken = localStorage.getItem('token')
        localStorage.setItem('token', token)
        
        const response = await api.get('/auth/me')
        const user = response.data
        
        if (user.role !== 'CANDIDATE') {
          setError('This setup link is only for candidates.')
          return
        }
        
        setCandidateInfo(user)
        setValidatingToken(false)
        
        // Restore original token
        if (originalToken) {
          localStorage.setItem('token', originalToken)
        } else {
          localStorage.removeItem('token')
        }
      } catch (err) {
        setError('Invalid or expired invitation link.')
        setValidatingToken(false)
        localStorage.removeItem('token')
      }
    }

    if (token) {
      validateToken()
    } else {
      setError('No invitation token provided.')
      setValidatingToken(false)
    }
  }, [token])

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
      // Set up the candidate password
      await api.post('/auth/candidate/setup-password', {
        token: token,
        password: formData.password,
      })

      setSuccess('Password set successfully! Redirecting to your assessment...')
      setTimeout(() => {
        if (testId) {
          navigate(`/test/${testId}/profile`)
        } else {
          navigate('/login?role=CANDIDATE')
        }
      }, 2000)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to set password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (validatingToken) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#020617',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress sx={{ mb: 3 }} />
        <Typography variant="h6">Validating invitation...</Typography>
      </Box>
    )
  }

  if (error && !candidateInfo) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#020617',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
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
        <Button
          component="a"
          href="/"
          sx={{ color: '#94a3b8', textTransform: 'none' }}
        >
          Return to Home
        </Button>
      </Box>
    )
  }

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
            component="a"
            href="/"
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
              <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
                Set Your Password
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Welcome {candidateInfo?.email || 'Candidate'}! Please set your password to continue.
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
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
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
                autoComplete="new-password"
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
                {loading ? <CircularProgress size={24} /> : 'Set Password'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default CandidateSetup
