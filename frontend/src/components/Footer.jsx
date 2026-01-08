import { Box, Container, Typography, Grid, Link } from '@mui/material'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Skill Evaluator Platform
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Automated technical assessment platform for modern recruitment.
              Streamline your hiring process with AI-powered skill evaluation.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Home
              </Link>
              <Link
                href="/login"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                Login
              </Link>
              <Link
                href="/register"
                color="inherit"
                underline="hover"
                sx={{ mb: 1 }}
              >
                Register
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@skillevaluator.com
              <br />
              Phone: +1 (555) 123-4567
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Skill Evaluator Platform. All rights
            reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer

