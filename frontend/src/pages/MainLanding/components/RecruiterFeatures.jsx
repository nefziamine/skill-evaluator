import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { Search, VerifiedUser, PieChart, Compare } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const features = [
    { title: 'Talent Search & Filters', desc: 'Drill down by specific skills, scores, and experience levels.', icon: <Search /> },
    { title: 'Badge-based Shortlisting', desc: 'Instantly spot top talent with Standard and AI Verified badges.', icon: <VerifiedUser /> },
    { title: 'Skill Breakdown Analytics', desc: 'Detailed report cards showing strengths and weaknesses.', icon: <PieChart /> },
    { title: 'Candidate Comparison', desc: 'Side-by-side view of test results to break decision ties.', icon: <Compare /> },
];

export default function RecruiterFeatures() {
    return (
        <Box id="for-recruiters" sx={{ py: 12, bgcolor: '#1e293b' }}>
            <Container maxWidth="lg">
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={5}>
                        <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={1.5}>FOR RECRUITERS</Typography>
                        <Typography variant="h3" fontWeight={800} sx={{ mt: 2, mb: 3 }}>
                            Hire with confidence.<br />Skip the guesswork.
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, lineHeight: 1.8 }}>
                            Stop wasting engineering hours on initial screening. Our platform delivers
                            verified candidates with deep insights into their actual coding capabilities.
                        </Typography>

                        <Button
                            component={Link}
                            to="/talent"
                            variant="contained"
                            size="large"
                            sx={{ px: 4, borderRadius: 3 }}
                        >
                            Find Developers Now
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Grid container spacing={3}>
                            {features.map((f, i) => (
                                <Grid item xs={12} sm={6} key={i}>
                                    <Paper sx={{ p: 3, height: '100%', bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Box sx={{ color: 'primary.main', mb: 2 }}>{f.icon}</Box>
                                        <Typography variant="h6" fontWeight={700} gutterBottom>{f.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
