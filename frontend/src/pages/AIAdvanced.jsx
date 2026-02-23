import { Box, Container, Typography, Grid, Paper, Stack, Button, useTheme, alpha, Divider } from '@mui/material';
import { AutoAwesome, Psychology, Speed, Shield, Code, Memory, Insights, RocketLaunch } from '@mui/icons-material';
import TopNav from './MainLanding/components/TopNav';
import Footer from '../components/Footer';
import ParticlesBackground from './MainLanding/components/ParticlesBackground';

export default function AIAdvanced() {
    const theme = useTheme();

    const features = [
        {
            icon: <Code sx={{ fontSize: 40 }} />,
            title: "Semantic Code Intelligence",
            desc: "Our AI doesn't just check if code runs; it understands the architectural intent, pattern adherence, and long-term maintainability.",
            color: '#3b82f6'
        },
        {
            icon: <Psychology sx={{ fontSize: 40 }} />,
            title: "Cognitive Load Mapping",
            desc: "Understand how a candidate thinks. We track problem-solving patterns, refactor cycles, and decision-making speed.",
            color: '#8b5cf6'
        },
        {
            icon: <Shield sx={{ fontSize: 40 }} />,
            title: "Advanced Bio-Verification",
            desc: "Multi-layered proctoring using behavioral biometrics to ensure 100% integrity without invasive surveillance.",
            color: '#10b981'
        },
        {
            icon: <Insights sx={{ fontSize: 40 }} />,
            title: "Predictive Performance",
            desc: "Go beyond 'can they code' to 'how will they perform'. AI-driven predictions on team fit and ramp-up time.",
            color: '#f59e0b'
        }
    ];

    const thinkingSteps = [
        {
            step: "01",
            title: "Signal Acquisition",
            desc: "Capturing 150+ data points during the assessment: keystroke dynamics, eye-tracking (optional), and logic flow."
        },
        {
            step: "02",
            title: "Contextual Processing",
            desc: "Our Neural Engine processes signals against a database of 10M+ verified professional solutions."
        },
        {
            step: "03",
            title: "Bias Sanitization",
            desc: "Proprietary algorithms strip away demographic indicators to ensure pure merit-based evaluation."
        },
        {
            step: "04",
            title: "Synthesis & Ranking",
            desc: "Final generation of a comprehensive skill DNA profile with stack-ranking across our global talent pool."
        }
    ];

    return (
        <Box sx={{ bgcolor: '#020617', minHeight: '100vh', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <ParticlesBackground />

            {/* Ambient Background Glows */}
            <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                filter: 'blur(100px)',
                zIndex: 1
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '10%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 70%)`,
                filter: 'blur(100px)',
                zIndex: 1
            }} />

            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <TopNav />

                {/* Hero Section */}
                <Container maxWidth="lg" sx={{ pt: { xs: 20, md: 25 }, pb: 15 }}>
                    <Box textAlign="center" mb={15}>
                        <Box sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1.5,
                            px: 3,
                            py: 1,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            borderRadius: 10,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                            mb: 4
                        }}>
                            <AutoAwesome sx={{ color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.light', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Next-Gen Intelligence
                            </Typography>
                        </Box>

                        <Typography variant="h1" sx={{
                            fontSize: { xs: '3.5rem', md: '5.5rem' },
                            fontWeight: 900,
                            mb: 4,
                            lineHeight: 1,
                            background: 'linear-gradient(to bottom, #fff 30%, #94a3b8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.04em'
                        }}>
                            The Science of <br />
                            Professional <span style={{ color: theme.palette.primary.main }}>Truth</span>
                        </Typography>

                        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 8, fontWeight: 400, lineHeight: 1.6 }}>
                            Move beyond resumes. Our AI Advanced engine decodes technical DNA to find the top 1% of talent with mathematical precision.
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                            <Button variant="contained" size="large" sx={{
                                px: 6,
                                py: 2,
                                borderRadius: 4,
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.3)}`
                            }}>
                                Request Access
                            </Button>
                            <Button variant="outlined" size="large" sx={{
                                px: 6,
                                py: 2,
                                borderRadius: 4,
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                borderColor: alpha('#fff', 0.2),
                                color: 'white',
                                '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.05) }
                            }}>
                                View Documentation
                            </Button>
                        </Stack>
                    </Box>

                    {/* Features Grid */}
                    <Grid container spacing={4} sx={{ mb: 20 }}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Paper elevation={0} sx={{
                                    p: 5,
                                    height: '100%',
                                    bgcolor: alpha('#1e293b', 0.3),
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 8,
                                    border: '1px solid',
                                    borderColor: alpha('#fff', 0.05),
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-10px)',
                                        borderColor: alpha(feature.color, 0.4),
                                        bgcolor: alpha('#1e293b', 0.5),
                                        boxShadow: `0 20px 40px -20px ${alpha(feature.color, 0.3)}`
                                    }
                                }}>
                                    <Box sx={{ color: feature.color, mb: 3 }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h4" fontWeight={800} gutterBottom sx={{ mb: 2 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                                        {feature.desc}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Thinking Flow Section */}
                    <Box sx={{
                        py: 12,
                        px: { xs: 4, md: 10 },
                        bgcolor: alpha('#1e293b', 0.2),
                        borderRadius: 12,
                        border: '1px solid',
                        borderColor: alpha('#fff', 0.05),
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ textAlign: 'center', mb: 10 }}>
                            <Typography variant="h3" fontWeight={900} gutterBottom>Our Thinking Flow</Typography>
                            <Typography variant="h6" color="text.secondary">How our AI reconstructs the candidate's journey</Typography>
                        </Box>

                        <Grid container spacing={6}>
                            {thinkingSteps.map((step, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Typography variant="h1" sx={{
                                            position: 'absolute',
                                            top: -40,
                                            left: -10,
                                            fontSize: '6rem',
                                            fontWeight: 900,
                                            color: alpha('#fff', 0.03),
                                            lineHeight: 1
                                        }}>
                                            {step.step}
                                        </Typography>
                                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                                            <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ mb: 2 }}>
                                                {step.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                                {step.desc}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Visual Connector Line (Desktop Only) */}
                        <Box sx={{
                            display: { xs: 'none', md: 'block' },
                            position: 'absolute',
                            top: '65%',
                            left: '10%',
                            right: '10%',
                            height: '2px',
                            background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0)}, ${alpha(theme.palette.primary.main, 0.5)}, ${alpha(theme.palette.primary.main, 0)})`,
                            zIndex: 0
                        }} />
                    </Box>

                    {/* Call to Action */}
                    <Box sx={{ mt: 20, textAlign: 'center' }}>
                        <Paper sx={{
                            p: 8,
                            borderRadius: 10,
                            bgcolor: 'primary.main',
                            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                            color: 'white'
                        }}>
                            <Typography variant="h3" fontWeight={900} gutterBottom>
                                Ready to Upgrade Your Pipeline?
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 5, opacity: 0.9 }}>
                                Join 500+ forward-thinking companies using AI Advanced.
                            </Typography>
                            <Button variant="contained" size="large" sx={{
                                bgcolor: 'white',
                                color: 'primary.main',
                                px: 8,
                                py: 2,
                                borderRadius: 4,
                                fontWeight: 900,
                                fontSize: '1.2rem',
                                '&:hover': { bgcolor: alpha('#fff', 0.9) }
                            }}>
                                Start Free Trial
                            </Button>
                        </Paper>
                    </Box>
                </Container>

                <Footer />
            </Box>
        </Box>
    );
}
