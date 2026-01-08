import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Quiz,
  Assessment,
} from '@mui/icons-material'
import Layout from '../components/Layout'
import api from '../services/api'

function RecruiterDashboard() {
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)
  const [tests, setTests] = useState([])
  const [questions, setQuestions] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [loading, setLoading] = useState(true)
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false)
  const [editingTest, setEditingTest] = useState(null)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [testFormData, setTestFormData] = useState({
    title: '',
    description: '',
    durationMinutes: 60,
    questionIds: [],
    isActive: true,
  })
  const [questionFormData, setQuestionFormData] = useState({
    text: '',
    type: 'MCQ',
    skill: '',
    difficulty: 'MEDIUM',
    options: '',
    correctAnswer: '',
    explanation: '',
    points: 1,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchData()
  }, [tabValue])

  useEffect(() => {
    if (tabValue === 1 && questions.length === 0) {
      fetchQuestions()
    }
  }, [tabValue])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (tabValue === 0) {
        await Promise.all([fetchTests(), fetchAnalytics()])
      } else if (tabValue === 1) {
        await fetchQuestions()
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchTests = async () => {
    const response = await api.get('/recruiter/tests')
    setTests(response.data)
  }

  const fetchQuestions = async () => {
    const response = await api.get('/recruiter/questions')
    setQuestions(response.data)
  }

  const fetchAnalytics = async () => {
    const response = await api.get('/recruiter/analytics')
    setAnalytics(response.data)
  }

  const handleTestDialogOpen = (test = null) => {
    if (test) {
      setEditingTest(test)
      setTestFormData({
        title: test.title,
        description: test.description || '',
        durationMinutes: test.durationMinutes,
        questionIds: test.questions?.map((q) => q.id) || [],
        isActive: test.isActive,
      })
    } else {
      setEditingTest(null)
      setTestFormData({
        title: '',
        description: '',
        durationMinutes: 60,
        questionIds: [],
        isActive: true,
      })
    }
    setTestDialogOpen(true)
  }

  const handleQuestionDialogOpen = (question = null) => {
    if (question) {
      setEditingQuestion(question)
      setQuestionFormData({
        text: question.text,
        type: question.type,
        skill: question.skill,
        difficulty: question.difficulty,
        options: question.options || '',
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || '',
        points: question.points,
      })
    } else {
      setEditingQuestion(null)
      setQuestionFormData({
        text: '',
        type: 'MCQ',
        skill: '',
        difficulty: 'MEDIUM',
        options: '',
        correctAnswer: '',
        explanation: '',
        points: 1,
      })
    }
    setQuestionDialogOpen(true)
  }

  const handleTestSubmit = async () => {
    try {
      if (editingTest) {
        await api.put(`/recruiter/tests/${editingTest.id}`, testFormData)
        setSuccess('Test updated successfully!')
      } else {
        await api.post('/recruiter/tests', testFormData)
        setSuccess('Test created successfully!')
      }
      setTestDialogOpen(false)
      fetchTests()
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed')
    }
  }

  const handleQuestionSubmit = async () => {
    try {
      if (editingQuestion) {
        await api.put(`/recruiter/questions/${editingQuestion.id}`, questionFormData)
        setSuccess('Question updated successfully!')
      } else {
        await api.post('/recruiter/questions', questionFormData)
        setSuccess('Question created successfully!')
      }
      setQuestionDialogOpen(false)
      fetchQuestions()
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed')
    }
  }

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return
    try {
      await api.delete(`/recruiter/tests/${testId}`)
      setSuccess('Test deleted successfully!')
      fetchTests()
    } catch (err) {
      setError('Failed to delete test')
    }
  }

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return
    try {
      await api.delete(`/recruiter/questions/${questionId}`)
      setSuccess('Question deleted successfully!')
      fetchQuestions()
    } catch (err) {
      setError('Failed to delete question')
    }
  }

  const handleViewResults = (testId) => {
    navigate(`/recruiter/tests/${testId}/results`)
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Recruiter Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab icon={<Assessment />} label="Tests" />
          <Tab icon={<Quiz />} label="Question Bank" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Tests</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleTestDialogOpen()}
            >
              Create Test
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Total Tests</Typography>
                  <Typography variant="h5">{analytics.totalTests || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Active Tests</Typography>
                  <Typography variant="h5">{analytics.activeTests || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Completed Sessions</Typography>
                  <Typography variant="h5">{analytics.completedSessions || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Questions</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.title}</TableCell>
                    <TableCell>{test.durationMinutes} min</TableCell>
                    <TableCell>{test.questions?.length || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={test.isActive ? 'Active' : 'Inactive'}
                        color={test.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewResults(test.id)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleTestDialogOpen(test)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTest(test.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tabValue === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Question Bank</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleQuestionDialogOpen()}
            >
              Create Question
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Text</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Skill</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>
                      {question.text.substring(0, 50)}...
                    </TableCell>
                    <TableCell>{question.type}</TableCell>
                    <TableCell>{question.skill}</TableCell>
                    <TableCell>{question.difficulty}</TableCell>
                    <TableCell>{question.points}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleQuestionDialogOpen(question)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteQuestion(question.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Test Dialog */}
      <Dialog
        open={testDialogOpen}
        onClose={() => setTestDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingTest ? 'Edit Test' : 'Create New Test'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={testFormData.title}
              onChange={(e) =>
                setTestFormData({ ...testFormData, title: e.target.value })
              }
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={testFormData.description}
              onChange={(e) =>
                setTestFormData({
                  ...testFormData,
                  description: e.target.value,
                })
              }
            />
            <TextField
              label="Duration (minutes)"
              type="number"
              fullWidth
              value={testFormData.durationMinutes}
              onChange={(e) =>
                setTestFormData({
                  ...testFormData,
                  durationMinutes: parseInt(e.target.value),
                })
              }
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={testFormData.isActive}
                  onChange={(e) =>
                    setTestFormData({
                      ...testFormData,
                      isActive: e.target.checked,
                    })
                  }
                />
              }
              label="Active"
            />
            <FormControl fullWidth>
              <InputLabel>Select Questions</InputLabel>
              <Select
                multiple
                value={testFormData.questionIds}
                onChange={(e) =>
                  setTestFormData({
                    ...testFormData,
                    questionIds: e.target.value,
                  })
                }
                renderValue={(selected) =>
                  `${selected.length} question(s) selected`
                }
              >
                {questions.map((q) => (
                  <MenuItem key={q.id} value={q.id}>
                    {q.text.substring(0, 60)}... ({q.skill} - {q.difficulty})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleTestSubmit} variant="contained">
            {editingTest ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Question Dialog */}
      <Dialog
        open={questionDialogOpen}
        onClose={() => setQuestionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingQuestion ? 'Edit Question' : 'Create New Question'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Question Text"
              fullWidth
              multiline
              rows={3}
              value={questionFormData.text}
              onChange={(e) =>
                setQuestionFormData({
                  ...questionFormData,
                  text: e.target.value,
                })
              }
              required
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={questionFormData.type}
                label="Type"
                onChange={(e) =>
                  setQuestionFormData({
                    ...questionFormData,
                    type: e.target.value,
                  })
                }
              >
                <MenuItem value="MCQ">Multiple Choice</MenuItem>
                <MenuItem value="TRUE_FALSE">True/False</MenuItem>
                <MenuItem value="SHORT_ANSWER">Short Answer</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Skill"
              fullWidth
              value={questionFormData.skill}
              onChange={(e) =>
                setQuestionFormData({
                  ...questionFormData,
                  skill: e.target.value,
                })
              }
              required
            />
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={questionFormData.difficulty}
                label="Difficulty"
                onChange={(e) =>
                  setQuestionFormData({
                    ...questionFormData,
                    difficulty: e.target.value,
                  })
                }
              >
                <MenuItem value="EASY">Easy</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HARD">Hard</MenuItem>
              </Select>
            </FormControl>
            {questionFormData.type === 'MCQ' && (
              <TextField
                label="Options (comma-separated)"
                fullWidth
                value={questionFormData.options}
                onChange={(e) =>
                  setQuestionFormData({
                    ...questionFormData,
                    options: e.target.value,
                  })
                }
                helperText="e.g., Option A, Option B, Option C, Option D"
              />
            )}
            <TextField
              label="Correct Answer"
              fullWidth
              value={questionFormData.correctAnswer}
              onChange={(e) =>
                setQuestionFormData({
                  ...questionFormData,
                  correctAnswer: e.target.value,
                })
              }
              required
              helperText={
                questionFormData.type === 'MCQ'
                  ? 'Enter option letter (A, B, C, etc.)'
                  : questionFormData.type === 'TRUE_FALSE'
                  ? 'Enter "true" or "false"'
                  : 'Enter expected answer'
              }
            />
            <TextField
              label="Explanation (optional)"
              fullWidth
              multiline
              rows={2}
              value={questionFormData.explanation}
              onChange={(e) =>
                setQuestionFormData({
                  ...questionFormData,
                  explanation: e.target.value,
                })
              }
            />
            <TextField
              label="Points"
              type="number"
              fullWidth
              value={questionFormData.points}
              onChange={(e) =>
                setQuestionFormData({
                  ...questionFormData,
                  points: parseInt(e.target.value),
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleQuestionSubmit} variant="contained">
            {editingQuestion ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Layout>
  )
}

export default RecruiterDashboard

