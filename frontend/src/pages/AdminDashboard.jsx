import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  Switch,
  Tabs,
  Tab,
  FormControlLabel,
  alpha,
} from '@mui/material'
import { Add, Edit, Delete, Refresh, Search, Settings, People, Dashboard as DashboardIcon, Quiz, Description, Assessment } from '@mui/icons-material'
import Layout from '../components/Layout'
import api from '../services/api'
import { InputAdornment } from '@mui/material'

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'RECRUITER',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [systemSettings, setSystemSettings] = useState({
    platformName: 'Skill Evaluator',
    allowNewRegistrations: true,
    maintenanceMode: false,
    contactEmail: 'admin@skillevaluator.com'
  })
  const [diagnostics, setDiagnostics] = useState({
    status: 'Healthy',
    uptime: '14 days, 6 hours',
    dbConnection: 'Active',
    storageUsage: '14%',
    apiVersion: '1.0.0-PROD',
    lastBackup: '2 hours ago'
  })

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'error'
      case 'RECRUITER': return 'warning'
      case 'CANDIDATE': return 'success'
      default: return 'default'
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchStats()
    fetchSettings()
    fetchDiagnostics()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/settings')
      setSystemSettings(response.data)
    } catch (err) {
      console.error('Failed to load settings', err)
    }
  }

  const fetchDiagnostics = async () => {
    try {
      const response = await api.get('/admin/diagnostics')
      setDiagnostics(response.data)
    } catch (err) {
      console.error('Failed to load diagnostics', err)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data)
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats')
      setStats(response.data)
    } catch (err) {
      console.error('Failed to load stats', err)
    }
  }

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
      })
    } else {
      setEditingUser(null)
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'RECRUITER',
      })
    }
    setOpenDialog(true)
    setError('')
    setSuccess('')
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'RECRUITER',
    })
  }

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.username || !formData.email || (!editingUser && !formData.password)) {
      setError('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      if (editingUser) {
        const updateData = {
          email: formData.email,
          role: formData.role,
        }
        if (formData.password) {
          updateData.password = formData.password
        }
        await api.put(`/admin/users/${editingUser.id}`, updateData)
        setSuccess('User updated successfully!')
      } else {
        await api.post('/admin/users', formData)
        setSuccess('User created successfully!')
      }
      setTimeout(() => {
        handleCloseDialog()
        fetchUsers()
        fetchStats()
      }, 500)
    } catch (err) {
      console.error('Submission error:', err)

      // Handle Spring Boot validation errors
      if (err.response?.status === 400 || err.response?.status === 403) {
        const errorData = err.response?.data

        // Check if it's a Spring validation error with field errors
        if (typeof errorData === 'string' && errorData.includes('Username must be')) {
          setError('Username must be between 3 and 50 characters')
        } else if (typeof errorData === 'string' && errorData.includes('Email')) {
          setError('Please provide a valid email address')
        } else if (typeof errorData === 'string' && errorData.includes('Password')) {
          setError('Password must be at least 6 characters')
        } else {
          // Generic error message extraction
          const msg = errorData?.error || errorData?.message || errorData || 'Operation failed. Please check your input.'
          setError(msg)
        }
      } else {
        const msg = err.response?.data?.error || err.response?.data?.message || 'Operation failed'
        setError(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      await api.delete(`/admin/users/${userId}`)
      setSuccess('User deleted successfully!')
      fetchUsers()
      fetchStats()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user')
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUpdateSettings = async (field, value) => {
    const updated = { ...systemSettings, [field]: value }
    setSystemSettings(updated)
    try {
      await api.post('/admin/settings', { [field]: String(value) })
      setSuccess(`${field} updated successfully`)
    } catch (err) {
      setError('Failed to save setting')
    }
  }

  const runTask = async (task) => {
    try {
      const response = await api.post(`/admin/tasks/${task}`, {})
      setSuccess(response.data.message)
    } catch (err) {
      setError(`Failed to perform ${task}`)
    }
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
            System Administration
          </Typography>
          <Box>
            <IconButton onClick={() => { fetchUsers(); fetchStats(); }} sx={{ mr: 1 }}>
              <Refresh />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{ borderRadius: 2, px: 3 }}
            >
              New User
            </Button>
          </Box>
        </Box>

        <Paper sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<DashboardIcon />} label="Overview" iconPosition="start" />
            <Tab icon={<People />} label="User Management" iconPosition="start" />
            <Tab icon={<Settings />} label="System Settings" iconPosition="start" />
          </Tabs>
        </Paper>

        {activeTab === 0 && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { label: 'Total Users', value: stats.totalUsers, color: '#1976d2', icon: <People /> },
                { label: 'Admins', value: stats.admins, color: '#d32f2f', icon: <Settings /> },
                { label: 'Recruiters', value: stats.recruiters, color: '#ed6c02', icon: <People /> },
                { label: 'Candidates', value: stats.candidates, color: '#2e7d32', icon: <People /> },
                { label: 'Total Tests', value: stats.totalTests, color: '#0288d1', icon: <Quiz /> },
                { label: 'Questions', value: stats.totalQuestions, color: '#7b1fa2', icon: <Description /> },
                { label: 'Assessments', value: stats.totalSessions, color: '#388e3c', icon: <Assessment /> },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography color="textSecondary" variant="overline" sx={{ fontWeight: 600 }}>
                          {stat.label}
                        </Typography>
                        <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 800 }}>{stat.value || 0}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Quick Actions or Recent Activity could go here */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>Administrative Tasks</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Button fullWidth variant="outlined" sx={{ py: 2, borderRadius: 2 }} onClick={() => runTask('audit')}>Audit System Logs</Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button fullWidth variant="outlined" sx={{ py: 2, borderRadius: 2 }} onClick={() => runTask('backup')}>Backup Database</Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button fullWidth variant="outlined" sx={{ py: 2, borderRadius: 2 }} onClick={() => runTask('broadcast')}>Email Broadcast</Button>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}

        {activeTab === 1 && (
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Search users by name, email or role..."
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 400 }}
              />
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.username}</Typography>
                        <Typography variant="caption" color="textSecondary">ID: {user.id}</Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role)}
                          size="small"
                          sx={{ fontWeight: 600, px: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.enabled ? 'Active' : 'Locked'}
                          variant="outlined"
                          color={user.enabled ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpenDialog(user)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Typography color="textSecondary">No users found matching your search.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>General Settings</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                  <TextField
                    label="Platform Name"
                    fullWidth
                    value={systemSettings.platformName}
                    onChange={(e) => handleUpdateSettings('platformName', e.target.value)}
                  />
                  <TextField
                    label="Admin Contact Email"
                    fullWidth
                    value={systemSettings.contactEmail}
                    onChange={(e) => handleUpdateSettings('contactEmail', e.target.value)}
                  />
                  <FormControlLabel
                    control={<Switch checked={systemSettings.allowNewRegistrations} onChange={(e) => handleUpdateSettings('allowNewRegistrations', e.target.checked)} />}
                    label="Allow Public Registrations"
                  />
                  <FormControlLabel
                    control={<Switch checked={systemSettings.maintenanceMode} onChange={(e) => handleUpdateSettings('maintenanceMode', e.target.checked)} color="error" />}
                    label="Enable Maintenance Mode"
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>System Health</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>Database Status: {diagnostics.dbConnection}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>API Version: {diagnostics.apiVersion}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>Last Backup: {diagnostics.lastBackup}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>Storage Usage: {diagnostics.storageUsage}</Typography>
                  <Button
                    variant="contained"
                    onClick={fetchDiagnostics}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                  >
                    Run Diagnostics
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingUser ? 'Edit User' : 'Create New User'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Username"
                fullWidth
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={!!editingUser}
                required
              />
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <TextField
                label={editingUser ? 'New Password (leave empty to keep current)' : 'Password'}
                fullWidth
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!editingUser}
                helperText="Minimum 6 characters"
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="RECRUITER">Recruiter</MenuItem>
                </Select>
              </FormControl>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
              {submitting ? (editingUser ? 'Updating...' : 'Creating...') : (editingUser ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  )
}

export default AdminDashboard

