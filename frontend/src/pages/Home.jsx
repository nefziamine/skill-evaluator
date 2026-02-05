import { Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Stack,
  Fade,
  useTheme,
  alpha,
} from '@mui/material'
import {
  AdminPanelSettings,
  Work,
  AssignmentTurnedIn,
  Email,
  Smartphone,
  AutoAwesome,
  Security,
  BarChart,
} from '@mui/icons-material'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Home() {
  const theme = useTheme()

  const features = [
    {
      icon: <AutoAwesome />,
      title: 'Automated Grading',
      description: 'Instant evaluation and scoring for technical assessments.',
    },
    {
      icon: <Security />,
      title: 'Secure Environment',
      description: 'Safe and fair testing environment for all candidates.',
    },
    {
      icon: <BarChart />,
      title: 'Detailed Analytics',
      description: 'Comprehensive insights into candidate performance.',
    },
  ]

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#0f172a', // Deep dark background
      color: 'white',
      overflowX: 'hidden'
    }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            pt: { xs: 8, md: 15 },
            pb: { xs: 8, md: 12 },
            background: 'radial-gradient(circle at 50% -20%, #1e293b 0%, #0f172a 100%)',
            overflow: 'hidden'
          }}
        >
          {/* Animated Background Elements */}
          <Box sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: '50%',
            filter: 'blur(80px)',
            zIndex: 0
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '400px',
            height: '400px',
            bgcolor: alpha(theme.palette.secondary.main, 0.1),
            borderRadius: '50%',
            filter: 'blur(100px)',
            zIndex: 0
          }} />

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Fade in timeout={1000}>
              <Box textAlign="center">
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '3rem', md: '4.5rem' },
                    fontWeight: 800,
                    mb: 2,
                    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Skill Evaluator Pro
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 5,
                    color: '#94a3b8',
                    maxWidth: '800px',
                    mx: 'auto',
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}
                >
                  The sophisticated platform for technical talent assessment.
                  Streamline your recruitment with data-driven precision.
                </Typography>

                {localStorage.getItem('token') && (
                  <Button
                    component={Link}
                    to={localStorage.getItem('userRole') === 'ADMIN' ? '/admin/dashboard' : '/recruiter/dashboard'}
                    variant="contained"
                    size="large"
                    startIcon={<AutoAwesome />}
                    sx={{
                      py: 2,
                      px: 6,
                      borderRadius: 3,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                      boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.5)'
                    }}
                  >
                    Go to My Dashboard
                  </Button>
                )}

                <Grid container spacing={4} justifyContent="center" sx={{ mt: 6 }}>
                  {features.map((f, i) => (
                    <Grid item xs={12} md={4} key={i}>
                      <Box sx={{
                        p: 3,
                        borderRadius: 4,
                        bgcolor: alpha('#1e293b', 0.5),
                        backdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: alpha('#ffffff', 0.1),
                        height: '100%',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'translateY(-5px)' }
                      }}>
                        <Box sx={{ color: 'primary.light', mb: 2 }}>{f.icon}</Box>
                        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>{f.title}</Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>{f.description}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Container>
        </Box>

        {/* Conditional Management / Portal Section */}
        {localStorage.getItem('token') ? (
          <Container maxWidth="lg" sx={{ py: 12 }}>
            <Box
              sx={{
                p: 6,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid',
                borderColor: alpha('#fff', 0.05),
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                Welcome Back, {localStorage.getItem('username') || 'Professional'}
              </Typography>
              <Typography variant="h6" sx={{ color: '#94a3b8', mb: 6, maxWidth: '600px', mx: 'auto' }}>
                Your management dashboard is ready. Continue overseeing evaluations or manage system configurations.
              </Typography>

              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 3, bgcolor: alpha('#fff', 0.02), borderRadius: 4, border: '1px solid', borderColor: alpha('#fff', 0.05) }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>{localStorage.getItem('userRole') === 'ADMIN' ? '100%' : 'Active'}</Typography>
                    <Typography variant="body2" color="textSecondary">System Status</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 3, bgcolor: alpha('#fff', 0.02), borderRadius: 4, border: '1px solid', borderColor: alpha('#fff', 0.05) }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Ready</Typography>
                    <Typography variant="body2" color="textSecondary">Evaluation Engine</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 3, bgcolor: alpha('#fff', 0.02), borderRadius: 4, border: '1px solid', borderColor: alpha('#fff', 0.05) }}>
                    <Typography variant="h4" color="secondary" sx={{ fontWeight: 800 }}>Secure</Typography>
                    <Typography variant="body2" color="textSecondary">Data Protection</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Button
                component={Link}
                to={localStorage.getItem('userRole') === 'ADMIN' ? '/admin/dashboard' : '/recruiter/dashboard'}
                variant="outlined"
                size="large"
                sx={{
                  mt: 6,
                  px: 8,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 700,
                  borderColor: alpha('#fff', 0.2),
                  color: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.05) }
                }}
              >
                Access {localStorage.getItem('userRole')} Panel
              </Button>
            </Box>
          </Container>
        ) : (
          <Container maxWidth="lg" sx={{ py: 12 }}>
            <Typography
              variant="h3"
              align="center"
              sx={{ mb: 8, fontWeight: 700, color: 'white' }}
            >
              Access Your Workspace
            </Typography>

            <Grid container spacing={6} justifyContent="center">
              {/* Recruiter Portal */}
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    height: '100%',
                    borderRadius: 6,
                    bgcolor: alpha('#1e293b', 0.4),
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    textAlign: 'center',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  <Work sx={{ fontSize: 60, color: 'primary.main', mb: 3 }} />
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Recruiter</Typography>
                  <Typography sx={{ color: '#94a3b8', mb: 4, minHeight: '60px' }}>
                    Manage question banks, create tests, and analyze candidate performance with our advanced dashboard.
                  </Typography>
                  <Button
                    component={Link}
                    to="/login?role=RECRUITER"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      mb: 2,
                      borderRadius: 3,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 10px 20px -10px rgba(59, 130, 246, 0.5)'
                    }}
                  >
                    Recruiter Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register?role=RECRUITER"
                    variant="outlined"
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      color: 'primary.light',
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }
                    }}
                  >
                    Register as Recruiter
                  </Button>
                </Paper>
              </Grid>

              {/* Admin Portal */}
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    height: '100%',
                    borderRadius: 6,
                    bgcolor: alpha('#1e293b', 0.4),
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.secondary.main, 0.2),
                    textAlign: 'center',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      borderColor: theme.palette.secondary.main,
                      boxShadow: `0 0 40px ${alpha(theme.palette.secondary.main, 0.2)}`,
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  <AdminPanelSettings sx={{ fontSize: 60, color: 'secondary.main', mb: 3 }} />
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Administrator</Typography>
                  <Typography sx={{ color: '#94a3b8', mb: 4, minHeight: '60px' }}>
                    Full system control, user management, and platform configuration for organizational oversight.
                  </Typography>
                  <Button
                    component={Link}
                    to="/login?role=ADMIN"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      mb: 2,
                      borderRadius: 3,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 10px 20px -10px rgba(236, 72, 153, 0.5)'
                    }}
                  >
                    Admin Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register?role=ADMIN"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      color: 'secondary.light',
                      borderColor: alpha(theme.palette.secondary.main, 0.5),
                      '&:hover': { borderColor: 'secondary.main', bgcolor: alpha(theme.palette.secondary.main, 0.05) }
                    }}
                  >
                    Register as Admin
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        )}

        {/* Candidate Info Section */}
        <Box sx={{ bgcolor: alpha('#1e293b', 0.3), py: 12 }}>
          <Container maxWidth="md">
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 8 },
                borderRadius: 8,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid',
                borderColor: alpha('#fff', 0.05),
                textAlign: 'center'
              }}
            >
              <AssignmentTurnedIn sx={{ fontSize: 48, color: '#10b981', mb: 3 }} />
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>For Candidates</Typography>
              <Typography variant="h6" sx={{ color: '#94a3b8', mb: 5, fontWeight: 400 }}>
                Are you here to take a test? Candidates do not need to create an account.
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha('#10b981', 0.1), color: '#10b981' }}>
                      <Email />
                    </Box>
                    <Box textAlign="left">
                      <Typography variant="subtitle1" fontWeight={600}>Email Invitation</Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>Check your email for a unique test link.</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha('#10b981', 0.1), color: '#10b981' }}>
                      <Smartphone />
                    </Box>
                    <Box textAlign="left">
                      <Typography variant="subtitle1" fontWeight={600}>SMS Notification</Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>Get instant results and updates via SMS.</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default Home

