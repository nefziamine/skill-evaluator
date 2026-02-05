import { Box, Container, Typography, Grid, Paper, Button, Stack, useTheme, alpha, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore, Security, Speed, Settings, SupportAgent, Hub, Storage } from '@mui/icons-material';
import TopNav from './MainLanding/components/TopNav';
import Footer from '../components/Footer';
import ParticlesBackground from './MainLanding/components/ParticlesBackground';

export default function Enterprise() {
    const theme = useTheme();

    return (
        <Box sx={{ bgcolor: '#0f172a', minHeight: '100vh', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <ParticlesBackground />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <TopNav />

                {/* Hero Section */}
                <Box sx={{
                    pt: { xs: 15, md: 25 },
                    pb: { xs: 10, md: 20 },
                    textAlign: 'center',
                    background: 'radial-gradient(circle at 50% 30%, rgba(236, 72, 153, 0.1) 0%, rgba(15, 23, 42, 0) 60%)'
                }}>
                    <Container maxWidth="xl">
                        <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 800, letterSpacing: 3 }}>
                            ENTERPRISE SOLUTIONS
                        </Typography>
                        <Typography variant="h1" sx={{
                            fontSize: { xs: '3rem', md: '5rem' },
                            fontWeight: 900,
                            mb: 4,
                            background: 'linear-gradient(to right, #fff, #94a3b8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1
                        }}>
                            Scaling Technical Excellence
                        </Typography>
                        <Typography variant="h5" color="text.secondary" sx={{ mb: 6, fontWeight: 400, lineHeight: 1.6 }}>
                            The most secure and scalable skill validation infrastructure for global engineering teams and high-growth organizations.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                            <Button variant="contained" color="secondary" size="large" sx={{ px: 6, py: 2, borderRadius: 50, fontWeight: 800 }}>
                                Contact Sales
                            </Button>
                            <Button variant="outlined" size="large" sx={{ px: 6, py: 2, borderRadius: 50, fontWeight: 800, color: 'white', borderColor: alpha('#fff', 0.2) }}>
                                View Security Whitepaper
                            </Button>
                        </Stack>
                    </Container>
                </Box>

                {/* Features Grid */}
                <Container maxWidth="xl" sx={{ pb: 15 }}>
                    <Grid container spacing={4}>
                        {[
                            { icon: <Security sx={{ fontSize: 40 }} />, title: "SSO & Security", desc: "Enterprise-grade SAML SSO, advanced proctoring, and SOC2 compliant data handling." },
                            { icon: <Settings sx={{ fontSize: 40 }} />, title: "Custom Question Banks", desc: "Build private assessment libraries tailored to your internal engineering standards." },
                            { icon: <SupportAgent sx={{ fontSize: 40 }} />, title: "Dedicated Success Manager", desc: "24/7 priority support and personalized onboarding for your recruitment teams." },
                            { icon: <Hub sx={{ fontSize: 40 }} />, title: "ATS Integrations", desc: "Connect seamlessly with Greenhouse, Lever, and Workday for automated workflows." },
                            { icon: <Storage sx={{ fontSize: 40 }} />, title: "Data Residency", desc: "Regional data storage options to meet strict global compliance requirements." },
                            { icon: <Speed sx={{ fontSize: 40 }} />, title: "Unlimited Scalability", desc: "Handle thousands of concurrent assessments with zero latency and high availability." }
                        ].map((f, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        height: '100%',
                                        bgcolor: alpha('#1e293b', 0.4),
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: 6,
                                        border: '1px solid',
                                        borderColor: alpha('#fff', 0.05),
                                        '&:hover': { borderColor: alpha(theme.palette.secondary.main, 0.4), bgcolor: alpha('#1e293b', 0.6) }
                                    }}
                                >
                                    <Box sx={{ mb: 3, color: 'secondary.main' }}>{f.icon}</Box>
                                    <Typography variant="h6" fontWeight={800} gutterBottom>{f.title}</Typography>
                                    <Typography variant="body1" color="text.secondary" lineHeight={1.6}>{f.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                {/* FAQ Style Accordion for Enterprise */}
                <Box sx={{ bgcolor: alpha('#1e293b', 0.3), py: 15 }}>
                    <Container maxWidth="xl">
                        <Typography variant="h3" fontWeight={800} sx={{ mb: 8, textAlign: 'center' }}>Enterprise FAQ</Typography>
                        {[
                            { q: "How does the ATS integration work?", a: "Our platform provides comprehensive REST APIs and pre-built connectors for major ATS platforms. Once integrated, you can trigger assessments directly from your ATS candidate pipeline and receive scores automatically." },
                            { q: "Can we customize the assessment environment?", a: "Yes, Enterprise customers can white-label the assessment portal, including custom branding, welcome videos, and localized instructions for candidates." },
                            { q: "What security measures are in place?", a: "We employ advanced AI-driven proctoring, browser lockdown capabilities, and plagiarism detection (MOS) to ensure the integrity of every assessment taken on our platform." }
                        ].map((item, i) => (
                            <Accordion key={i} sx={{ bgcolor: alpha('#1e293b', 0.5), color: 'white', mb: 2, borderRadius: '12px !important', '&:before': { display: 'none' } }}>
                                <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
                                    <Typography fontWeight={700}>{item.q}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography color="text.secondary">{item.a}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Container>
                </Box>

                {/* Contact CTA */}
                <Container maxWidth="xl" sx={{ py: 20 }}>
                    <Paper
                        sx={{
                            p: { xs: 4, md: 8 },
                            borderRadius: 8,
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                            border: '1px solid',
                            borderColor: alpha(theme.palette.secondary.main, 0.2),
                            textAlign: 'center',
                            boxShadow: `0 30px 60px ${alpha('#000', 0.5)}`
                        }}
                    >
                        <Typography variant="h2" fontWeight={900} sx={{ mb: 3 }}>Scale Your Hiring Today</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
                            Join the world's most innovative companies using Skill Evaluator to build their engineering elite.
                        </Typography>
                        <Button variant="contained" color="secondary" size="large" sx={{ px: 8, py: 2, borderRadius: 50, fontWeight: 800, fontSize: '1.2rem' }}>
                            Book a Demo
                        </Button>
                    </Paper>
                </Container>

                <Footer />
            </Box>
        </Box>
    );
}
