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
  CircularProgress,
  LinearProgress,
  alpha,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Quiz,
  Assessment,
  Group,
  Description,
  TrendingUp,
  BarChart,
  PersonAdd,
  ContentCopy,
  Send,
  AutoFixHigh,
  AssignmentTurnedIn,
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
  const [completedSessions, setCompletedSessions] = useState([])
  const [selectedSessions, setSelectedSessions] = useState([])
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([])
  const [reportDetails, setReportDetails] = useState(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [generatedInviteLink, setGeneratedInviteLink] = useState('')
  const [selectedTestToInvite, setSelectedTestToInvite] = useState(null)
  const [inviteFormData, setInviteFormData] = useState({ testId: '' })
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [aiFormData, setAiFormData] = useState({ skill: 'Java', difficulty: 'MEDIUM', count: 5 })
  const [generatingAi, setGeneratingAi] = useState(false)
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
      } else if (tabValue === 2 || tabValue === 3) {
        await fetchCompletedSessions()
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

  const fetchCompletedSessions = async () => {
    const response = await api.get('/recruiter/sessions/completed')
    setCompletedSessions(response.data)
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

  const handleBatchDeleteQuestions = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedQuestionIds.length} questions?`)) return
    try {
      await api.post('/recruiter/questions/batch-delete', selectedQuestionIds)
      setSuccess('Questions deleted successfully!')
      setSelectedQuestionIds([])
      fetchQuestions()
    } catch (err) {
      setError('Failed to delete questions')
    }
  }

  const handleSelectAllQuestions = (e) => {
    if (e.target.checked) {
      setSelectedQuestionIds(questions.map(q => q.id))
    } else {
      setSelectedQuestionIds([])
    }
  }

  const handleSelectQuestion = (id) => {
    setSelectedQuestionIds(prev =>
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    )
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

  const handleSessionSelection = (sessionId) => {
    setSelectedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    )
  }

  const handleOpenReport = async (sessionId) => {
    try {
      const response = await api.get(`/recruiter/sessions/${sessionId}/details`)
      setReportDetails(response.data)
    } catch (err) {
      setError('Failed to load report details')
    }
  }

  const handleOpenInvite = (test) => {
    setSelectedTestToInvite(test)
    setInviteEmail('')
    setGeneratedInviteLink('')
    setInviteDialogOpen(true)
  }

  const handleInviteSubmit = async () => {
    try {
      const testId = selectedTestToInvite ? selectedTestToInvite.id : inviteFormData.testId
      if (!testId || isNaN(testId)) {
        setError('Please select a valid test')
        return
      }
      const response = await api.post('/recruiter/invite-candidate', {
        email: inviteEmail,
        testId: parseInt(testId)
      })
      setGeneratedInviteLink(response.data.inviteLink)
      setSuccess('Invitation link generated!')
    } catch (err) {
      console.error("Invite Error:", err)
      if (err.response?.status === 403) {
        setError('Permission denied: You may need to log out and log back in to refresh permissions.')
      } else {
        setError(err.response?.data?.error || 'Failed to generate invitation link')
      }
    }
  }

  const handleAiGenerate = async () => {
    setGeneratingAi(true)
    setError('')
    try {
      await api.post('/recruiter/generate-ai-test', aiFormData)
      setSuccess('Test generated successfully with AI!')
      setAiDialogOpen(false)
      fetchData()
    } catch (err) {
      setError('Failed to generate test with AI')
    } finally {
      setGeneratingAi(false)
    }
  }

  const handleOpenGlobalInvite = () => {
    setSelectedTestToInvite(null)
    setInviteEmail('')
    setGeneratedInviteLink('')
    setInviteFormData({ testId: '' })
    setInviteDialogOpen(true)
  }

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{
            fontWeight: 800,
            background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Recruiter Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<AutoFixHigh />}
              onClick={() => setAiDialogOpen(true)}
              sx={{ borderRadius: 2, px: 3 }}
            >
              AI Generate
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleTestDialogOpen()}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Create Test
            </Button>
            <Button
              variant="outlined"
              startIcon={<PersonAdd />}
              onClick={handleOpenGlobalInvite}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Invite Candidate
            </Button>
          </Box>
        </Box>

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

        <Paper sx={{
          mb: 3,
          borderRadius: 4,
          bgcolor: alpha('#1e293b', 0.4),
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: alpha('#fff', 0.05),
          overflow: 'hidden'
        }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: alpha('#fff', 0.05),
              '& .MuiTab-root': { color: '#94a3b8', fontWeight: 600 },
              '& .Mui-selected': { color: 'white' }
            }}
          >
            <Tab icon={<Assessment />} label="Tests" iconPosition="start" />
            <Tab icon={<Quiz />} label="Question Bank" iconPosition="start" />
            <Tab icon={<Group />} label="Candidate Comparison" iconPosition="start" />
            <Tab icon={<Description />} label="Evaluation Reports" iconPosition="start" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { label: 'Total Tests', value: analytics.totalTests, color: '#3b82f6', icon: <Quiz /> },
                { label: 'Active Assessments', value: analytics.activeTests, color: '#10b981', icon: <AssignmentTurnedIn /> },
                { label: 'Invitations Sent', value: analytics.totalSessions, color: '#6366f1', icon: <Send /> },
                { label: 'Completed', value: analytics.completedSessions, color: '#f59e0b', icon: <BarChart /> },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{
                    borderRadius: 4,
                    bgcolor: alpha('#1e293b', 0.5),
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: alpha('#fff', 0.1),
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          p: 1.5,
                          borderRadius: 3,
                          bgcolor: alpha(stat.color, 0.1),
                          color: stat.color,
                          display: 'flex'
                        }}>
                          {stat.icon}
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                          {stat.value || 0}
                        </Typography>
                      </Box>
                      <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <TableContainer component={Paper} sx={{
              bgcolor: alpha('#1e293b', 0.4),
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid',
              borderColor: alpha('#fff', 0.05)
            }}>
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
                          onClick={() => handleOpenInvite(test)}
                          color="primary"
                          title="Invite Candidate"
                        >
                          <PersonAdd />
                        </IconButton>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6">Question Bank</Typography>
                {selectedQuestionIds.length > 0 && (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    onClick={handleBatchDeleteQuestions}
                  >
                    Delete Selected ({selectedQuestionIds.length})
                  </Button>
                )}
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleQuestionDialogOpen()}
              >
                Create Question
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{
              bgcolor: alpha('#1e293b', 0.4),
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid',
              borderColor: alpha('#fff', 0.05)
            }}>
              <Table>
                <TableHead sx={{ bgcolor: alpha('#fff', 0.02) }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedQuestionIds.length > 0 && selectedQuestionIds.length < questions.length}
                        checked={questions.length > 0 && selectedQuestionIds.length === questions.length}
                        onChange={handleSelectAllQuestions}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>Text</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>Skill</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>Difficulty</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>Points</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id} selected={selectedQuestionIds.includes(question.id)} sx={{ '&:hover': { bgcolor: alpha('#fff', 0.02) } }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedQuestionIds.includes(question.id)}
                          onChange={() => handleSelectQuestion(question.id)}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {question.text.substring(0, 50)}...
                      </TableCell>
                      <TableCell sx={{ color: '#94a3b8' }}>{question.type}</TableCell>
                      <TableCell>
                        <Chip label={question.skill} size="small" variant="outlined" sx={{ borderColor: alpha('#fff', 0.1), color: '#94a3b8' }} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={question.difficulty}
                          size="small"
                          sx={{
                            bgcolor: alpha(question.difficulty === 'HARD' ? '#ef4444' : question.difficulty === 'MEDIUM' ? '#f59e0b' : '#10b981', 0.1),
                            color: question.difficulty === 'HARD' ? '#ef4444' : question.difficulty === 'MEDIUM' ? '#f59e0b' : '#10b981',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700 }}>{question.points}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleQuestionDialogOpen(question)}
                          sx={{ color: '#94a3b8' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteQuestion(question.id)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {tabValue === 2 && (
          <Paper sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: alpha('#1e293b', 0.4),
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: alpha('#fff', 0.05)
          }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>
                Candidate Comparison Matrix
              </Typography>
              <Button
                startIcon={<BarChart />}
                variant="contained"
                disabled={selectedSessions.length < 2}
                onClick={() => setSuccess('Generating comparison view...')}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Compare {selectedSessions.length} Candidates
              </Button>
            </Box>
            <Alert
              severity="info"
              sx={{
                mb: 3,
                bgcolor: alpha('#3b82f6', 0.1),
                color: '#60a5fa',
                border: '1px solid',
                borderColor: alpha('#3b82f6', 0.2),
                '& .MuiAlert-icon': { color: '#60a5fa' }
              }}
            >
              Select at least two candidates to compare their performance across skills and difficulty levels.
            </Alert>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: alpha('#fff', 0.02) }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>SELECT</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>CANDIDATE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>TEST TITLE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>SCORE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>KNOWLEDGE BASE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>SUBMITTED AT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedSessions.map((session) => (
                    <TableRow key={session.id} hover selected={selectedSessions.includes(session.id)} sx={{ '&:hover': { bgcolor: alpha('#fff', 0.02) } }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedSessions.includes(session.id)}
                          onChange={() => handleSessionSelection(session.id)}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>{session.candidate?.username}</TableCell>
                      <TableCell sx={{ color: '#94a3b8' }}>{session.test?.title}</TableCell>
                      <TableCell>
                        <Typography fontWeight={800} sx={{ color: '#3b82f6' }}>
                          {session.score}/{session.totalPoints}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          ({Math.round(session.score * 100 / session.totalPoints)}%)
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {session.skillBreakdown && Object.entries(JSON.parse(session.skillBreakdown)).map(([skill, score]) => (
                            <Chip
                              key={skill}
                              label={`${skill}: ${score}`}
                              size="small"
                              variant="outlined"
                              sx={{ borderColor: alpha('#fff', 0.1), color: '#94a3b8', fontSize: '0.75rem' }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#64748b' }}>{new Date(session.submittedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tabValue === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: alpha('#1e293b', 0.4),
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: alpha('#fff', 0.05)
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, color: 'white' }}>
                  Recent Evaluation Reports
                </Typography>
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {completedSessions.map((session) => (
                    <Box key={session.id} sx={{
                      p: 2.5,
                      bgcolor: alpha('#fff', 0.02),
                      border: '1px solid',
                      borderColor: alpha('#fff', 0.05),
                      borderRadius: 3,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: alpha('#fff', 0.04), borderColor: alpha('#3b82f6', 0.3) }
                    }}>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: 'white' }}>{session.candidate?.username} - {session.test?.title}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Submitted on {new Date(session.submittedAt).toLocaleString()}</Typography>
                      </Box>
                      <Button
                        variant="text"
                        startIcon={<TrendingUp />}
                        onClick={() => handleOpenReport(session.id)}
                        sx={{ fontWeight: 700, color: '#60a5fa' }}
                      >
                        View Report
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Report Analytics</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>Avg. Hiring Time: 12 days</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>Candidate ROI: +24%</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>Top Performer Accuracy: 88%</Typography>
                    <Button fullWidth variant="contained" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}>
                      Request Custom Report
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        {/* Report Detail Dialog */}
        <Dialog open={!!reportDetails} onClose={() => setReportDetails(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Candidate Performance Report</Typography>
            <Chip
              label={`Score: ${reportDetails?.score}/${reportDetails?.totalPoints}`}
              color="primary"
              variant="filled"
              sx={{ fontWeight: 700 }}
            />
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: 'background.default' }}>
            {reportDetails && (
              <Box>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5 }}>CANDIDATE</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{reportDetails.candidate?.username}</Typography>
                    <Typography variant="body2" color="textSecondary">{reportDetails.candidate?.email}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5 }}>TEST TITLE</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{reportDetails.test?.title}</Typography>
                    <Typography variant="body2" color="textSecondary">Submitted: {new Date(reportDetails.submittedAt).toLocaleString()}</Typography>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChart fontSize="small" /> Skill Breakdown
                </Typography>
                <Grid container spacing={2}>
                  {reportDetails.skillBreakdown && Object.entries(JSON.parse(reportDetails.skillBreakdown)).map(([skill, score]) => (
                    <Grid item xs={12} key={skill}>
                      <Box sx={{ mb: 1, p: 2, bgcolor: alpha('#fff', 0.02), borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="body2" fontWeight={600}>{skill}</Typography>
                          <Typography variant="body2" fontWeight={700} color="primary">{score} / 10 Points</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, (score / 10) * 100)}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: alpha('#fff', 0.05),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                              background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 4, p: 3, bgcolor: alpha('#3b82f6', 0.05), borderRadius: 3, border: '1px solid', borderColor: alpha('#3b82f6', 0.1) }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>Automated Assessment Insights</Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                    Candidate "{reportDetails.candidate?.username}" demonstrated {reportDetails.score > (reportDetails.totalPoints * 0.8) ? 'exceptional' : 'solid'} proficiency in {Object.keys(JSON.parse(reportDetails.skillBreakdown || '{}'))[0] || 'the core competencies'}.
                    Their overall performance score of {Math.round(reportDetails.score * 100 / reportDetails.totalPoints)}% places them in the top-tier of applicants for this assessment.
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
            <Button onClick={() => setReportDetails(null)} sx={{ fontWeight: 600 }}>Close Report</Button>
            <Button variant="contained" startIcon={<Description />} sx={{ fontWeight: 600, borderRadius: 2 }}>Export to PDF</Button>
          </DialogActions>
        </Dialog>

        {/* Invite Candidate Dialog */}
        <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {selectedTestToInvite ? `Invite to ${selectedTestToInvite.title}` : 'Invite Candidate to Assessment'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {!generatedInviteLink ? (
                <>
                  <Typography variant="body2" color="textSecondary">
                    Select a test and enter the candidate's email address to generate a secure invitation link.
                  </Typography>
                  {!selectedTestToInvite && (
                    <FormControl fullWidth>
                      <InputLabel>Select Test</InputLabel>
                      <Select
                        value={inviteFormData?.testId || ''}
                        label="Select Test"
                        onChange={(e) => setInviteFormData({ ...inviteFormData, testId: e.target.value })}
                      >
                        {tests.filter(t => t.isActive).map(test => (
                          <MenuItem key={test.id} value={test.id}>{test.title}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  <TextField
                    label="Candidate Email"
                    fullWidth
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="candidate@example.com"
                  />
                </>
              ) : (
                <Box sx={{ p: 3, bgcolor: alpha('#fff', 0.02), borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" gutterBottom color="primary">Invitation Link Ready</Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={generatedInviteLink}
                      InputProps={{ readOnly: true }}
                    />
                    <IconButton
                      onClick={() => navigator.clipboard.writeText(generatedInviteLink)}
                      color="primary"
                    >
                      <ContentCopy />
                    </IconButton>
                  </Box>
                  <Typography variant="caption" sx={{ mt: 2, display: 'block', color: '#94a3b8' }}>
                    Note: This link allows the candidate to bypass standard login for this specific assessment.
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
            {!generatedInviteLink ? (
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={handleInviteSubmit}
                disabled={!inviteEmail}
              >
                Generate Link
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => setInviteDialogOpen(false)}
              >
                Done
              </Button>
            )}
          </DialogActions>
        </Dialog>

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

        {/* AI Generation Dialog */}
        <Dialog open={aiDialogOpen} onClose={() => setAiDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoFixHigh color="secondary" />
            AI Test Generator
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="body2" color="textSecondary">
                Describe the skill you want to assess. Our AI will generate a tailored test with relevant questions.
              </Typography>
              <TextField
                label="Skill / Topic"
                placeholder="e.g. React, Java, SQL, Machine Learning..."
                fullWidth
                value={aiFormData.skill}
                onChange={(e) => setAiFormData({ ...aiFormData, skill: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={aiFormData.difficulty}
                  label="Difficulty"
                  onChange={(e) => setAiFormData({ ...aiFormData, difficulty: e.target.value })}
                >
                  <MenuItem value="EASY">Easy</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HARD">Hard</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Number of Questions"
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 1, max: 20 } }}
                value={aiFormData.count}
                onChange={(e) => setAiFormData({ ...aiFormData, count: parseInt(e.target.value) })}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setAiDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAiGenerate}
              variant="contained"
              color="secondary"
              disabled={generatingAi || !aiFormData.skill}
              startIcon={generatingAi ? <CircularProgress size={20} color="inherit" /> : <AutoFixHigh />}
            >
              {generatingAi ? 'Generating...' : 'Generate Test'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  )
}

export default RecruiterDashboard

