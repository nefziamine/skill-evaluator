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
  Grid,
} from '@mui/material'
import { Person, ArrowBack, Link as LinkIcon, Phone } from '@mui/icons-material'
import api from '../services/api'

function CandidateSetup() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const testId = searchParams.get('testId')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
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

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First and Last names are required')
      return
    }

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
      // 1. Set up the candidate password
      await api.post('/auth/candidate/setup-password', {
        token: token,
        password: formData.password,
      })

      // 2. Set token temporarily to update candidate profile details
      const originalToken = localStorage.getItem('token')
      localStorage.setItem('token', token)

      await api.put('/candidate/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        githubUrl: formData.githubUrl,
      })

      // Restore token, but if they are moving directly to test we keep the token
      if (testId) {
         // Keep the invite token active for taking the test
      } else if (originalToken) {
        localStorage.setItem('token', originalToken)
      } else {
        localStorage.removeItem('token')
      }

      setSuccess('Profile configured successfully! Redirecting to your assessment...')
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
        'Failed to set up profile. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (validatingToken) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#020617', color: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ mb: 3 }} />
        <Typography variant="h6">Validating invitation...</Typography>
      </Box>
    )
  }

  if (error && !candidateInfo) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#020617', color: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ mb: 3, bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.light, border: '1px solid', borderColor: alpha(theme.palette.error.main, 0.2) }}>
          {error}
        </Alert>
        <Button component="a" href="/" sx={{ color: '#94a3b8', textTransform: 'none' }}>
          Return to Home
        </Button>
      </Box>
    )
  }

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': { borderColor: alpha('#fff', 0.2) },
      '&:hover fieldset': { borderColor: alpha('#fff', 0.3) },
    },
    '& .MuiInputLabel-root': { color: '#94a3b8' }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#020617', color: 'white' }}>
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 6, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%' }}>
          <Button component="a" href="/" startIcon={<ArrowBack />} sx={{ mb: 4, color: '#94a3b8', textTransform: 'none' }}>
            Back to Home
          </Button>

          <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, width: '100%', bgcolor: alpha('#1e293b', 0.5), backdropFilter: 'blur(20px)', border: '1px solid', borderColor: alpha('#fff', 0.1), borderRadius: 6, color: 'white' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
                Complete Your Profile
              </Typography>
              <Typography variant="body1" sx={{ color: '#94a3b8', maxWidth: '600px', mx: 'auto' }}>
                Welcome <strong>{candidateInfo?.email}</strong>! Please fill out your personal details and set a secure password to proceed to your assessment.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.light, border: '1px solid', borderColor: alpha(theme.palette.error.main, 0.2) }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.light, border: '1px solid', borderColor: alpha(theme.palette.success.main, 0.2) }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.light', borderBottom: '1px solid', borderColor: alpha('#fff', 0.1), pb: 1 }}>
                Personal Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth name="firstName" label="First Name" id="firstName" value={formData.firstName} onChange={handleChange} sx={inputStyles} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth name="lastName" label="Last Name" id="lastName" value={formData.lastName} onChange={handleChange} sx={inputStyles} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="phone" label="Phone Number" id="phone" value={formData.phone} onChange={handleChange} sx={inputStyles} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="linkedinUrl" label="LinkedIn Profile URL" id="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} sx={inputStyles} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="githubUrl" label="GitHub Profile URL" id="githubUrl" value={formData.githubUrl} onChange={handleChange} sx={inputStyles} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="portfolioUrl" label="Personal Portfolio URL" id="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} sx={inputStyles} />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mb: 2, mt: 5, color: 'primary.light', borderBottom: '1px solid', borderColor: alpha('#fff', 0.1), pb: 1 }}>
                Security Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth name="password" label="New Password" type="password" id="password" value={formData.password} onChange={handleChange} sx={inputStyles} helperText={<Typography variant="caption" sx={{ color: '#64748b' }}>Minimum 6 characters</Typography>} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth name="confirmPassword" label="Confirm Password" type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} sx={inputStyles} />
                </Grid>
              </Grid>

              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
                sx={{ mt: 5, mb: 2, py: 1.5, borderRadius: 3, fontWeight: 600, textTransform: 'none', fontSize: '1.1rem', boxShadow: '0 10px 20px -10px rgba(59, 130, 246, 0.5)' }}>
                {loading ? <CircularProgress size={24} /> : 'Save Profile & Start Assessment'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default CandidateSetup
