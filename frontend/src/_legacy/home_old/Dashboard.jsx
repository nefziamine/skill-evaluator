import { Container, Typography, Box, Paper } from '@mui/material'

function Dashboard() {
  const username = localStorage.getItem('username')
  const role = localStorage.getItem('userRole')

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {username}!
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Role: {role}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recruiter Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is where you'll manage tests, view candidate results, and create assessments.
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Dashboard

