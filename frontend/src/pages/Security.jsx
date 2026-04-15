import { Box, Container, Typography, Grid, Paper, alpha, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Security, VerifiedUser, PrivacyTip, Gavel, Storage, Lock } from '@mui/icons-material';
import TopNav from './MainLanding/components/TopNav';
import Footer from '../components/Footer';
import ParticlesBackground from './MainLanding/components/ParticlesBackground';

export default function SecurityWhitepaper() {
    return (
        <Box sx={{ bgcolor: '#020617', minHeight: '100vh', color: 'white', position: 'relative' }}>
            <ParticlesBackground />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <TopNav />
                <Container maxWidth="lg" sx={{ pt: 20, pb: 10 }}>
                    <Box sx={{ textAlign: 'center', mb: 10 }}>
                        <Typography variant="h2" fontWeight={900} sx={{ mb: 3 }}>Security & Compliance</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
                            We take data security seriously. Skill Evaluator is built on industry-leading standards to ensure the integrity of your technical assessments.
                        </Typography>
                    </Box>

                    <Grid container spacing={6}>
                        <Grid item xs={12} md={7}>
                            <Typography variant="h4" fontWeight={800} gutterBottom>Our Security Posture</Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Our platform employs a multi-layered security approach, covering everything from physical infrastructure to application-level proctoring.
                            </Typography>
                            <List>
                                {[
                                    { icon: <Lock color="primary" />, title: "End-to-End Encryption", desc: "All data in transit is encrypted using TLS 1.3, and data at rest uses AES-256." },
                                    { icon: <VerifiedUser color="primary" />, title: "SOC2 Type II Compliant", desc: "Our processes are audited annually to maintain the highest trust levels." },
                                    { icon: <Storage color="primary" />, title: "Data Isolation", desc: "Each customer's assessment data is logically isolated in protected partitions." }
                                ].map((item, i) => (
                                    <ListItem key={i} sx={{ px: 0, py: 2 }}>
                                        <ListItemIcon sx={{ minWidth: 50 }}>{item.icon}</ListItemIcon>
                                        <ListItemText 
                                            primary={<Typography variant="h6" fontWeight={700}>{item.title}</Typography>}
                                            secondary={<Typography variant="body2" color="text.secondary">{item.desc}</Typography>}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Paper sx={{ p: 4, bgcolor: alpha('#1e293b', 0.8), borderRadius: 8, border: '1px solid', borderColor: 'primary.main' }}>
                                <Typography variant="h6" fontWeight={800} gutterBottom>Compliance Badges</Typography>
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    {[1, 2, 3, 4].map((i) => (
                                        <Grid item xs={6} key={i}>
                                            <Box sx={{ height: 80, bgcolor: alpha('#fff', 0.05), borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Security sx={{ opacity: 0.3 }} />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4, textAlign: 'center' }}>
                                    Trust Services Criteria certified
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
                <Footer />
            </Box>
        </Box>
    );
}
