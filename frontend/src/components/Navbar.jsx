import { Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material'
import { Assessment } from '@mui/icons-material'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    navigate('/')
  }

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Assessment sx={{ mr: 2, fontSize: 32 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
            }}
          >
            Skill Evaluator
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {token ? (
              <>
                {localStorage.getItem('userRole') === 'ADMIN' && (
                  <Button color="inherit" component={Link} to="/admin/dashboard">
                    Admin
                  </Button>
                )}
                {(localStorage.getItem('userRole') === 'RECRUITER' ||
                  localStorage.getItem('userRole') === 'ADMIN') && (
                  <Button
                    color="inherit"
                    component={Link}
                    to="/recruiter/dashboard"
                  >
                    Recruiter
                  </Button>
                )}
                <Button color="inherit" component={Link} to="/tests">
                  Tests
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/register"
                  sx={{ ml: 1 }}
                >
                  Sign Up
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

