import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  alpha,
  useTheme,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material'
import { AutoAwesome, Logout, Dashboard, Person, AccountCircle, Settings, ExitToApp } from '@mui/icons-material'

function Navbar() {
  const navigate = useNavigate()
  const theme = useTheme()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('userRole')
  const username = localStorage.getItem('username')
  
  const [anchorEl, setAnchorEl] = useState(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
    setProfileMenuOpen(true)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
    setProfileMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    window.location.href = '/'
  }

  const handleProfile = () => {
    handleProfileMenuClose()
    if (role === 'ADMIN') {
      navigate('/admin/profile')
    } else if (role === 'RECRUITER') {
      navigate('/recruiter/profile')
    } else {
      navigate('/candidate/profile')
    }
  }

  const handleSettings = () => {
    handleProfileMenuClose()
    if (role === 'ADMIN') {
      navigate('/admin/settings')
    } else if (role === 'RECRUITER') {
      navigate('/recruiter/settings')
    } else {
      navigate('/candidate/settings')
    }
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: alpha('#1e293b', 0.8),
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: alpha('#fff', 0.05),
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <AutoAwesome sx={{ mr: 1.5, fontSize: 28, color: 'primary.main' }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Skill Evaluator
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {token ? (
              <>
                <Typography variant="body2" sx={{ color: '#94a3b8', mr: 2, display: { xs: 'none', md: 'block' } }}>
                  Logged in as <span style={{ color: 'white', fontWeight: 600 }}>{role}</span>
                </Typography>
                {role === 'ADMIN' && (
                  <Button
                    startIcon={<Dashboard />}
                    color="inherit"
                    component={Link}
                    to="/admin/dashboard"
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Admin
                  </Button>
                )}
                {role === 'RECRUITER' && (
                  <Button
                    startIcon={<Dashboard />}
                    color="inherit"
                    component={Link}
                    to="/recruiter/dashboard"
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Recruiter
                  </Button>
                )}
                
                {/* Profile Icon with Dropdown */}
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    color: 'white',
                    ml: 1,
                    '&:hover': { bgcolor: alpha('#fff', 0.1) }
                  }}
                >
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: role === 'ADMIN' ? 'secondary.main' : 'primary.main',
                    fontSize: '0.875rem'
                  }}>
                    {username ? username.charAt(0).toUpperCase() : <Person />}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={profileMenuOpen}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      bgcolor: '#1e293b',
                      border: '1px solid',
                      borderColor: alpha('#fff', 0.1),
                      mt: 1,
                      minWidth: 200
                    }
                  }}
                >
                  <MenuItem onClick={handleProfile} sx={{ color: 'white', '&:hover': { bgcolor: alpha('#fff', 0.1) } }}>
                    <AccountCircle sx={{ mr: 2, color: '#94a3b8' }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleSettings} sx={{ color: 'white', '&:hover': { bgcolor: alpha('#fff', 0.1) } }}>
                    <Settings sx={{ mr: 2, color: '#94a3b8' }} />
                    Settings
                  </MenuItem>
                  <Divider sx={{ borderColor: alpha('#fff', 0.1) }} />
                  <MenuItem onClick={handleLogout} sx={{ color: 'white', '&:hover': { bgcolor: alpha('#fff', 0.1) } }}>
                    <ExitToApp sx={{ mr: 2, color: '#94a3b8' }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Login
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar

