import { Box, Container, Typography, Grid, Link, alpha } from '@mui/material'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0f172a',
        borderTop: '1px solid',
        borderColor: alpha('#fff', 0.05),
        py: 8,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
              SkillPro
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.7 }}>
              The definitive platform for technical assessment.
              Empowering recruiters with data-driven insights and automated workflows.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Home
              </Link>
              <Link href="/login" sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Authentication
              </Link>
              <Link href="/register" sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Join Platform
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
              Support
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
              Email: hello@skillpro.ai
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Available 24/7 for our enterprise partners.
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid', borderColor: alpha('#fff', 0.05) }}>
          <Typography variant="body2" sx={{ color: '#64748b' }} align="center">
            © {new Date().getFullYear()} SkillPro Evaluation System. Excellence in Assessment.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer

