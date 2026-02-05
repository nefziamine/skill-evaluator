import { Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  alpha,
  useTheme,
} from '@mui/material'
import { AutoAwesome, Logout, Dashboard } from '@mui/icons-material'

function Navbar() {
  const navigate = useNavigate()
  const theme = useTheme()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('userRole')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    window.location.href = '/'
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
            <Button
              component={Link}
              to="/how-it-works"
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                fontWeight: 600,
                display: { xs: 'none', sm: 'block' },
                '&:hover': { color: 'primary.main' }
              }}
            >
              How it Works
            </Button>
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
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  color="inherit"
                  startIcon={<Logout />}
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: alpha('#fff', 0.2),
                    '&:hover': { borderColor: 'white' }
                  }}
                >
                  Logout
                </Button>
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
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/register"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: 'none'
                  }}
                >
                  Get Started
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

