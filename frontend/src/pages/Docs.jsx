import { Box, Container, Typography, Grid, Paper, Stack, alpha } from '@mui/material';
import { Book, Code, Terminal, IntegrationInstructions, Storage, Security } from '@mui/icons-material';
import TopNav from './MainLanding/components/TopNav';
import Footer from '../components/Footer';
import ParticlesBackground from './MainLanding/components/ParticlesBackground';

export default function Docs() {
    return (
        <Box sx={{ bgcolor: '#020617', minHeight: '100vh', color: 'white', position: 'relative' }}>
            <ParticlesBackground />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <TopNav />
                <Container maxWidth="lg" sx={{ pt: 20, pb: 10 }}>
                    <Box sx={{ textAlign: 'center', mb: 10 }}>
                        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 2 }}>
                            KNOWLEDGE BASE
                        </Typography>
                        <Typography variant="h2" fontWeight={900} sx={{ mt: 2, mb: 3 }}>
                            Documentation
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            Everything you need to integrate Skill Evaluator into your hiring workflow.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {[
                            { icon: <Terminal />, title: "Getting Started", desc: "Learn the basics of creating assessments and inviting candidates." },
                            { icon: <IntegrationInstructions />, title: "API Reference", desc: "Integrate our verification engine directly into your custom platform." },
                            { icon: <Code />, title: "SDKs & Tools", desc: "Official libraries for Node.js, Python, and Java applications." },
                            { icon: <Storage />, title: "Webhooks", desc: "Real-time updates for assessment starts, submissions, and results." },
                            { icon: <Security />, title: "Authentication", desc: "Secure your requests using OAuth2 and API keys." },
                            { icon: <Book />, title: "Best Practices", desc: "Optimize your hiring pipeline with our recommended workflows." }
                        ].map((doc, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Paper sx={{
                                    p: 4, bgcolor: alpha('#1e293b', 0.5), borderRadius: 6, border: '1px solid', borderColor: alpha('#fff', 0.05),
                                    transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)', borderColor: 'primary.main' }
                                }}>
                                    <Box sx={{ color: 'primary.main', mb: 2 }}>{doc.icon}</Box>
                                    <Typography variant="h6" fontWeight={800} gutterBottom>{doc.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{doc.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
                <Footer />
            </Box>
        </Box>
    );
}
