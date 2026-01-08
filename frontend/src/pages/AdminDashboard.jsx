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
} from '@mui/material'
import { Add, Edit, Delete, Refresh } from '@mui/icons-material'
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
    role: 'CANDIDATE',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [])

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
        role: 'CANDIDATE',
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
      role: 'CANDIDATE',
    })
  }

  const handleSubmit = async () => {
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
      handleCloseDialog()
      fetchUsers()
      fetchStats()
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed')
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'error'
      case 'RECRUITER':
        return 'primary'
      case 'CANDIDATE':
        return 'success'
      default:
        return 'default'
    }
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create User
        </Button>
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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">{stats.totalUsers || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Admins
              </Typography>
              <Typography variant="h4">{stats.admins || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Recruiters
              </Typography>
              <Typography variant="h4">{stats.recruiters || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Candidates
              </Typography>
              <Typography variant="h4">{stats.candidates || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">User Management</Typography>
          <IconButton onClick={fetchUsers}>
            <Refresh />
          </IconButton>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.enabled ? 'Active' : 'Disabled'}
                      color={user.enabled ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(user.id)}
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
      </Paper>

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
                <MenuItem value="CANDIDATE">Candidate</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Layout>
  )
}

export default AdminDashboard

