import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
  Grid,
} from '@mui/material'
import Layout from '../components/Layout'
import api from '../services/api'

function TestResults() {
  const { testId } = useParams()
  const [sessions, setSessions] = useState([])
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [testId])

  const fetchData = async () => {
    try {
      const [sessionsRes, testRes] = await Promise.all([
        api.get(`/recruiter/tests/${testId}/sessions`),
        api.get(`/recruiter/tests/${testId}`),
      ])
      setSessions(sessionsRes.data)
      setTest(testRes.data)
    } catch (err) {
      setError('Failed to load results')
    } finally {
      setLoading(false)
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

  const calculateAverage = () => {
    const completed = sessions.filter((s) => s.isCompleted && s.score != null)
    if (completed.length === 0) return 0
    const sum = completed.reduce((acc, s) => acc + s.score, 0)
    return (sum / completed.length).toFixed(2)
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
        Test Results: {test?.title}
      </Typography>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Total Attempts</Typography>
              <Typography variant="h5">{sessions.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Completed</Typography>
              <Typography variant="h5">
                {sessions.filter((s) => s.isCompleted).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Average Score</Typography>
              <Typography variant="h5">{calculateAverage()}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Candidate</TableCell>
              <TableCell>Started At</TableCell>
              <TableCell>Submitted At</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  {session.candidate?.username || 'Unknown'}
                </TableCell>
                <TableCell>
                  {new Date(session.startedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {session.submittedAt
                    ? new Date(session.submittedAt).toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell>
                  {session.score != null
                    ? `${session.score}/${session.totalPoints} (${(
                        (session.score * 100) /
                        session.totalPoints
                      ).toFixed(1)}%)`
                    : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={session.status || 'IN_PROGRESS'}
                    color={getStatusColor(session.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
      </Container>
    </Layout>
  )
}

export default TestResults

