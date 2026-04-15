import { Box, Container, Typography, Grid, Paper, TextField, Button, alpha, Stack } from '@mui/material';
import { CalendarMonth, Group, Speed, Insights } from '@mui/icons-material';
import TopNav from './MainLanding/components/TopNav';
import Footer from '../components/Footer';
import ParticlesBackground from './MainLanding/components/ParticlesBackground';

export default function Demo() {
    return (
        <Box sx={{ bgcolor: '#020617', minHeight: '100vh', color: 'white', position: 'relative' }}>
            <ParticlesBackground />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <TopNav />
                <Container maxWidth="lg" sx={{ pt: 20, pb: 10 }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h2" fontWeight={900} sx={{ mb: 3 }}>Book a Personalized Demo</Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
                                See how Skill Evaluator can transform your technical hiring process. Our specialists will show you:
                            </Typography>
                            <Stack spacing={4}>
                                {[
                                    { icon: <Insights color="primary" />, title: "AI-Driven Insights", desc: "Detailed candidate performance analysis." },
                                    { icon: <Speed color="primary" />, title: "Automated Workflows", desc: "Integration with your existing ATS." },
                                    { icon: <Group color="primary" />, title: "Team Management", desc: "Scale verification across global teams." }
                                ].map((item, i) => (
                                    <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                                        {item.icon}
                                        <Box>
                                            <Typography fontWeight={700}>{item.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 5, bgcolor: alpha('#1e293b', 0.6), borderRadius: 8, border: '1px solid', borderColor: alpha('#fff', 0.1) }}>
                                <Typography variant="h5" fontWeight={800} sx={{ mb: 4 }}>Schedule Your Session</Typography>
                                <Stack spacing={3}>
                                    <TextField fullWidth label="Full Name" variant="outlined" />
                                    <TextField fullWidth label="Work Email" variant="outlined" />
                                    <TextField fullWidth label="Company Name" variant="outlined" />
                                    <Button variant="contained" size="large" fullWidth sx={{ py: 2, borderRadius: 4, fontWeight: 800 }}>
                                        Schedule Demo
                                    </Button>
                                    <Typography variant="caption" color="text.secondary" align="center">
                                        Expect a response within 4 business hours.
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
                <Footer />
            </Box>
        </Box>
    );
}
