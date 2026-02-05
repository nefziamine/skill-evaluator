import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
} from '@mui/material'
import Layout from '../components/Layout'
import api from '../services/api'

function Tests() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      // Clear the state
      window.history.replaceState({}, document.title)
    }
  }, [location])

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      // This endpoint will be created in the backend
      const response = await api.get('/candidate/tests')
      setTests(response.data)
    } catch (err) {
      setError('Failed to load tests')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartTest = (testId) => {
    navigate(`/test/${testId}`)
  }

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </Layout>
    )
  }

  const userRole = localStorage.getItem('userRole')

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Available Tests
        </Typography>
        <Box>
          <Button
            component={Link}
            to="/candidate/results"
            variant="outlined"
            sx={{ mr: 1 }}
          >
            My Results
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {tests.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No tests available at the moment.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {tests.map((test) => (
            <Card key={test.id}>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {test.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {test.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Duration: {test.durationMinutes} minutes
                </Typography>
                <Typography variant="body2">
                  Total Points: {test.totalPoints}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  onClick={() => handleStartTest(test.id)}
                >
                  Start Test
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
      </Container>
    </Layout>
  )
}

export default Tests

