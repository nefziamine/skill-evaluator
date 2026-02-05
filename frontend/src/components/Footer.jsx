import { Box, Container, Typography, Grid, Link, alpha, Stack, Divider } from '@mui/material'
import { LinkedIn, GitHub, VerifiedUser } from '@mui/icons-material'

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
      <Container maxWidth="xl">
        <Grid container spacing={8}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <VerifiedUser sx={{ color: '#3b82f6' }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>Skill Evaluator</Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8, maxWidth: 300, mb: 3 }}>
              The open standard for developer skill verification. Bridging the gap between talent and opportunity with AI-powered assessments.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link href="#" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}><GitHub /></Link>
              <Link href="#" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 24, height: 24, fill: 'currentColor' }}>
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298l13.312 17.404z" />
                </svg>
              </Link>
              <Link href="#" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}><LinkedIn /></Link>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>Platform</Typography>
            <Stack spacing={1.5}>
              <Link href="/tests" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: 'white', transform: 'translateX(5px)' }, transition: 'all 0.2s' }}>Tests</Link>
              <Link href="/how-it-works" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: 'white', transform: 'translateX(5px)' }, transition: 'all 0.2s' }}>How it Works</Link>
              <Link href="#" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>AI Advanced</Link>
              <Link href="#" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>Pricing</Link>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>For Recruiters</Typography>
            <Stack spacing={1.5}>
              <Link href="/talent" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>Browse Talent</Link>
              <Link href="/post-job" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>Post a Job</Link>
              <Link href="/enterprise" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>Enterprise</Link>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>Company</Typography>
            <Stack spacing={1.5}>
              <Link href="#" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>About</Link>
              <Link href="#" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>Careers</Link>
              <Link href="#" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>Contact</Link>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>Legal</Typography>
            <Stack spacing={1.5}>
              <Link href="#" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>Terms</Link>
              <Link href="#" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: 'white' } }}>Privacy</Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: alpha('#fff', 0.05) }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            © {new Date().getFullYear()} Skill Evaluator. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer

