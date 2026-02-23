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
  InputAdornment
} from '@mui/material'
import { Add, Edit, Delete, Refresh, Search, Settings, People, Dashboard as DashboardIcon, Quiz, Description, Assessment } from '@mui/icons-material'
import Layout from '../components/Layout'
import api from '../services/api'

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
      setError(err.response?.data?.error || err.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
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
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{
            fontWeight: 800,
            background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            System Administration
          </Typography>
          <Box>
            <IconButton onClick={() => { fetchUsers(); fetchStats(); }} sx={{ mr: 1, color: '#94a3b8' }}>
              <Refresh />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
            >
              New User
            </Button>
          </Box>
        </Box>

        <Paper sx={{
          mb: 4,
          borderRadius: 4,
          bgcolor: alpha('#1e293b', 0.4),
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: alpha('#fff', 0.05),
          overflow: 'hidden'
        }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{
              borderBottom: 1,
              borderColor: alpha('#fff', 0.05),
              '& .MuiTab-root': { color: '#94a3b8', fontWeight: 600, py: 2 },
              '& .Mui-selected': { color: 'white' }
            }}
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
                { label: 'Total Users', value: stats.totalUsers, color: '#3b82f6', icon: <People /> },
                { label: 'Admins', value: stats.admins, color: '#ef4444', icon: <Settings /> },
                { label: 'Recruiters', value: stats.recruiters, color: '#f59e0b', icon: <People /> },
                { label: 'Candidates', value: stats.candidates, color: '#10b981', icon: <People /> },
                { label: 'Total Tests', value: stats.totalTests, color: '#8b5cf6', icon: <Quiz /> },
                { label: 'Questions', value: stats.totalQuestions, color: '#ec4899', icon: <Description /> },
                { label: 'Assessments', value: stats.totalSessions, color: '#10b981', icon: <Assessment /> },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{
                    borderRadius: 4,
                    bgcolor: alpha('#1e293b', 0.5),
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: alpha('#fff', 0.1),
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="overline" sx={{ fontWeight: 700, color: '#94a3b8' }}>
                          {stat.label}
                        </Typography>
                        <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: 'white' }}>{stat.value || 0}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Paper sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: alpha('#1e293b', 0.4),
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: alpha('#fff', 0.05)
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'white' }}>Administrative Tasks</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={4}>
                  <Button fullWidth variant="outlined" sx={{ py: 2, borderRadius: 2, borderColor: alpha('#fff', 0.1), color: '#94a3b8' }} onClick={() => runTask('audit')}>Audit System Logs</Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button fullWidth variant="outlined" sx={{ py: 2, borderRadius: 2, borderColor: alpha('#fff', 0.1), color: '#94a3b8' }} onClick={() => runTask('backup')}>Backup Database</Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button fullWidth variant="outlined" sx={{ py: 2, borderRadius: 2, borderColor: alpha('#fff', 0.1), color: '#94a3b8' }} onClick={() => runTask('broadcast')}>Email Broadcast</Button>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}

        {activeTab === 1 && (
          <Paper sx={{
            borderRadius: 4,
            bgcolor: alpha('#1e293b', 0.4),
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: alpha('#fff', 0.05),
            overflow: 'hidden'
          }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: alpha('#fff', 0.05), display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Search users..."
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: 400,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: alpha('#fff', 0.1) },
                    '&:hover fieldset': { borderColor: alpha('#fff', 0.2) },
                  }
                }}
              />
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: alpha('#fff', 0.02) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: alpha('#fff', 0.02) } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>{user.username}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>ID: {user.id}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#94a3b8' }}>{user.email}</TableCell>
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
                        <IconButton size="small" onClick={() => handleOpenDialog(user)} sx={{ color: '#94a3b8' }}>
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
              <Paper sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: alpha('#1e293b', 0.4),
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: alpha('#fff', 0.05)
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'white' }}>General Settings</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                  <TextField
                    label="Platform Name"
                    fullWidth
                    value={systemSettings.platformName}
                    onChange={(e) => handleUpdateSettings('platformName', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                  />
                  <TextField
                    label="Admin Contact Email"
                    fullWidth
                    value={systemSettings.contactEmail}
                    onChange={(e) => handleUpdateSettings('contactEmail', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                  />
                  <FormControlLabel
                    control={<Switch checked={systemSettings.allowNewRegistrations} onChange={(e) => handleUpdateSettings('allowNewRegistrations', e.target.checked)} />}
                    label="Allow Public Registrations"
                    sx={{ color: '#94a3b8' }}
                  />
                  <FormControlLabel
                    control={<Switch checked={systemSettings.maintenanceMode} onChange={(e) => handleUpdateSettings('maintenanceMode', e.target.checked)} color="error" />}
                    label="Enable Maintenance Mode"
                    sx={{ color: '#94a3b8' }}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: alpha('#3b82f6', 0.1),
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: alpha('#3b82f6', 0.2),
                color: 'white'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>System Health</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, color: '#94a3b8' }}>Database Status: <span style={{ color: '#10b981' }}>{diagnostics.dbConnection}</span></Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, color: '#94a3b8' }}>API Version: {diagnostics.apiVersion}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, color: '#94a3b8' }}>Last Backup: {diagnostics.lastBackup}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 3, color: '#94a3b8' }}>Storage Usage: {diagnostics.storageUsage}</Typography>
                  <Button
                    variant="contained"
                    onClick={fetchDiagnostics}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  >
                    Run Diagnostics
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingUser ? 'Edit User' : 'Create New User'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Username"
                fullWidth
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!!editingUser}
                required
              />
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <TextField
                label={editingUser ? 'New Password (optional)' : 'Password'}
                fullWidth
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
                helperText="Minimum 6 characters"
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="RECRUITER">Recruiter</MenuItem>
                </Select>
              </FormControl>
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
              {submitting ? 'Processing...' : (editingUser ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  )
}

export default AdminDashboard
