import { Box, Container, Typography, Button, Stack, Chip, Grid } from '@mui/material';
import { ArrowForward, CheckCircle, Verified, Psychology, PlayArrow } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <Box sx={{
            pt: { xs: 16, md: 24 },
            pb: { xs: 12, md: 16 },
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 100%)'
        }}>
            {/* Abstract Background Blotches */}
            <Box sx={{ position: 'absolute', top: -100, left: '10%', width: 500, height: 500, bgcolor: 'primary.main', opacity: 0.05, filter: 'blur(100px)', borderRadius: '50%' }} />
            <Box sx={{ position: 'absolute', top: 100, right: '10%', width: 400, height: 400, bgcolor: 'secondary.main', opacity: 0.05, filter: 'blur(100px)', borderRadius: '50%' }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Chip
                    label="New: AI Advanced Assessment"
                    color="secondary"
                    size="small"
                    sx={{ mb: 3, fontWeight: 700, borderRadius: 2 }}
                />

                <Typography variant="h1" sx={{
                    fontSize: { xs: '2.5rem', md: '4.5rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Verify your skills.<br />Get discovered.
                </Typography>

                <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 6, lineHeight: 1.6 }}>
                    The open marketplace for developer talent.
                    Developers prove their expertise with standardized and AI-driven tests.
                    Recruiters find verified talent instantly.
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="center"
                    sx={{ mb: 6 }}
                >
                    <Button
                        component={Link}
                        to="/tests"
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 50 }}
                    >
                        Start Free Skill Test
                    </Button>
                    <Button
                        component={Link}
                        to="/talent"
                        variant="outlined"
                        size="large"
                        sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 50, color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
                    >
                        Browse Verified Talent
                    </Button>
                </Stack>

                <Link to="/ai-advanced" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>
                    See how AI Advanced works <PlayArrow sx={{ fontSize: 16, ml: 0.5 }} />
                </Link>

                <Grid container spacing={3} justifyContent="center" sx={{ mt: 8 }}>
                    {[
                        { icon: <CheckCircle color="primary" />, text: "Standardized tests" },
                        { icon: <Psychology color="secondary" />, text: "AI Advanced verification" },
                        { icon: <Verified color="success" />, text: "Role-based secure platform" },
                    ].map((item, index) => (
                        <Grid item key={index}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: 'rgba(255,255,255,0.03)', px: 2, py: 1, borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                                {item.icon}
                                <Typography variant="body2" fontWeight={600} color="text.secondary">{item.text}</Typography>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>

            </Container>
        </Box>
    );
}
