import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Button,
} from '@mui/material'
import { Visibility } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../services/api'

function CandidateResults() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await api.get('/candidate/sessions')
      setSessions(response.data.filter((s) => s.isCompleted))
    } catch (err) {
      setError('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (sessionId) => {
    try {
      const response = await api.get(`/candidate/sessions/${sessionId}/result`)
      const result = response.data
      alert(
        `Test: ${result.testTitle}\nScore: ${result.score}/${result.totalPoints} (${result.percentage.toFixed(1)}%)\nStatus: ${result.status}`
      )
    } catch (err) {
      setError('Failed to load result details')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return 'success'
      case 'AUTO_SUBMITTED':
        return 'warning'
      case 'EXPIRED':
        return 'error'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Test Results
      </Typography>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {sessions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            You haven't completed any tests yet.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate('/tests')}
          >
            Take a Test
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Test</TableCell>
                <TableCell>Completed At</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Percentage</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.test?.title || 'Unknown Test'}</TableCell>
                  <TableCell>
                    {session.submittedAt
                      ? new Date(session.submittedAt).toLocaleString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {session.score != null
                      ? `${session.score}/${session.totalPoints}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {session.score != null
                      ? `${((session.score * 100) / session.totalPoints).toFixed(1)}%`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={session.status || 'COMPLETED'}
                      color={getStatusColor(session.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewDetails(session.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      </Container>
    </Layout>
  )
}

export default CandidateResults

