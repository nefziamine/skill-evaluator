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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Assessment,
  Security,
  Speed,
  Analytics,
  Quiz,
  Timer,
  BarChart,
  People,
} from '@mui/icons-material'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Home() {
  const features = [
    {
      icon: <Quiz />,
      title: 'Multiple Question Types',
      description:
        'Support for MCQ, True/False, and Short Answer questions to assess various skills comprehensively.',
    },
    {
      icon: <Timer />,
      title: 'Time-Limited Tests',
      description:
        'Automated time management with automatic submission when time expires.',
    },
    {
      icon: <Security />,
      title: 'Secure & Fair',
      description:
        'Question randomization and secure session management ensure fair assessments.',
    },
    {
      icon: <BarChart />,
      title: 'Automatic Scoring',
      description:
        'Instant score calculation and detailed analytics for recruiters.',
    },
    {
      icon: <People />,
      title: 'Role-Based Access',
      description:
        'Separate interfaces for Admins, Recruiters, and Candidates with appropriate permissions.',
    },
    {
      icon: <Analytics />,
      title: 'Candidate Comparison',
      description:
        'Compare candidate performance with comprehensive reporting and analytics.',
    },
  ]

  const roles = [
    {
      title: 'For Candidates',
      description:
        'Take skill assessments in a user-friendly interface. View your results and track your progress.',
      features: [
        'Easy-to-use test interface',
        'Real-time countdown timer',
        'View your test history',
        'Detailed result breakdown',
      ],
      color: 'primary',
    },
    {
      title: 'For Recruiters',
      description:
        'Create tests, manage question banks, and evaluate candidates efficiently.',
      features: [
        'Create custom tests',
        'Manage question bank',
        'View candidate results',
        'Analytics dashboard',
      ],
      color: 'secondary',
    },
    {
      title: 'For Administrators',
      description:
        'Full system control with user management and platform configuration.',
      features: [
        'User management',
        'System statistics',
        'Role assignment',
        'Platform configuration',
      ],
      color: 'error',
    },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            py: 10,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              Skill Evaluator Platform
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Automated Technical Assessment Platform for Modern Recruitment
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Streamline your hiring process with our comprehensive skill
              evaluation system. Create tests, assess candidates, and make
              data-driven hiring decisions.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={Link}
                to="/register"
                sx={{ px: 4 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                component={Link}
                to="/login"
                sx={{ px: 4 }}
              >
                Login
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Key Features
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 6 }}
          >
            Everything you need for efficient technical recruitment
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Roles Section */}
        <Box sx={{ bgcolor: 'background.default', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" component="h2" align="center" gutterBottom>
              Designed for Everyone
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ mb: 6 }}
            >
              Tailored interfaces for different user roles
            </Typography>
            <Grid container spacing={4}>
              {roles.map((role, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderTop: 4,
                      borderColor: `${role.color}.main`,
                    }}
                  >
                    <Typography variant="h5" gutterBottom color={`${role.color}.main`}>
                      {role.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {role.description}
                    </Typography>
                    <List dense>
                      {role.features.map((feature, idx) => (
                        <ListItem key={idx} disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Speed fontSize="small" color={role.color} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            py: 8,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of companies using Skill Evaluator to streamline
              their recruitment process.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to="/register"
              sx={{ px: 4, py: 1.5 }}
            >
              Create Your Account
            </Button>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default Home

