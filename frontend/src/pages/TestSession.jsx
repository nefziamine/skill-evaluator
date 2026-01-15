import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  LinearProgress,
} from '@mui/material'
import Layout from '../components/Layout'
import api from '../services/api'

function TestSession() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [sessionId, setSessionId] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    startTestSession()
  }, [testId])

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeRemaining])

  const startTestSession = async () => {
    try {
      const response = await api.post(`/candidate/tests/${testId}/start`)
      setTest(response.data.test)
      setQuestions(response.data.questions)
      setTimeRemaining(response.data.timeRemaining)
      setSessionId(response.data.sessionId)
    } catch (err) {
      setError('Failed to start test session')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleAutoSubmit = async () => {
    await submitTest(true)
  }

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit the test?')) {
      await submitTest(false)
    }
  }

  const submitTest = async (autoSubmit = false) => {
    setSubmitting(true)
    try {
      const response = await api.post(`/candidate/tests/${testId}/submit`, {
        answers,
        autoSubmit,
      })
      const message = `Test submitted successfully! Score: ${response.data.score}/${response.data.totalPoints}`
      navigate(`/test/success/${sessionId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit test')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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

  if (!test || questions.length === 0) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="error">Test not found or no questions available</Alert>
        </Container>
      </Layout>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h1">
              {test.title}
            </Typography>
            <Typography
              variant="h6"
              color={timeRemaining < 300 ? 'error' : 'primary'}
              sx={{ fontWeight: 'bold' }}
            >
              Time Remaining: {formatTime(timeRemaining)}
            </Typography>
          </Box>

          <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {currentQuestion.text}
            </Typography>

            {currentQuestion.type === 'MCQ' && (
              <FormControl component="fieldset">
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                >
                  {currentQuestion.options?.split(',').map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={String.fromCharCode(65 + index)}
                      control={<Radio />}
                      label={option.trim()}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {currentQuestion.type === 'TRUE_FALSE' && (
              <FormControl component="fieldset">
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                >
                  <FormControlLabel value="true" control={<Radio />} label="True" />
                  <FormControlLabel value="false" control={<Radio />} label="False" />
                </RadioGroup>
              </FormControl>
            )}

            {currentQuestion.type === 'SHORT_ANSWER' && (
              <TextField
                fullWidth
                multiline
                rows={4}
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Enter your answer here..."
              />
            )}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Box>
              {currentQuestionIndex < questions.length - 1 ? (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Submit Test'}
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Layout>
  )
}

export default TestSession

