import { Box, Container, Typography, Grid, Paper, Button, Stack, alpha, Chip, CircularProgress } from '@mui/material';
import { LocationOn, Work, Bolt, Search } from '@mui/icons-material';
import TopNav from './MainLanding/components/TopNav';
import Footer from '../components/Footer';
import ParticlesBackground from './MainLanding/components/ParticlesBackground';
import React from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function PublicJobs() {
    const [jobs, setJobs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        api.get('/jobs').then(res => {
            setJobs(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const handleApply = (testId) => {
        navigate(`/test/${testId}`);
    };

    return (
        <Box sx={{ bgcolor: '#020617', minHeight: '100vh', color: 'white', position: 'relative' }}>
            <ParticlesBackground />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <TopNav />
                <Container maxWidth="lg" sx={{ pt: 15, pb: 10 }}>
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h3" fontWeight={900} gutterBottom>Open Job Assessments</Typography>
                        <Typography variant="h6" color="text.secondary">Prove your skills and skip the resume line for these active roles.</Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {jobs.map((job) => (
                                <Grid item xs={12} key={job.id}>
                                    <Paper sx={{
                                        p: 4, bgcolor: alpha('#1e293b', 0.4), borderRadius: 6, border: '1px solid', borderColor: alpha('#fff', 0.05),
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s',
                                        '&:hover': { bgcolor: alpha('#1e293b', 0.6), borderColor: 'primary.main' }
                                    }}>
                                        <Stack spacing={1}>
                                            <Typography variant="h5" fontWeight={800}>{job.title}</Typography>
                                            <Stack direction="row" spacing={3}>
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                                                    <LocationOn fontSize="small" />
                                                    <Typography variant="body2">{job.location}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                                                    <Work fontSize="small" />
                                                    <Typography variant="body2">{job.skill}</Typography>
                                                </Stack>
                                            </Stack>
                                            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                                <Chip label="Skill-First Enrollment" size="small" color="primary" variant="outlined" />
                                                <Chip icon={<Bolt size={14} />} label="AI Verified" size="small" color="secondary" />
                                            </Stack>
                                        </Stack>
                                        <Button variant="contained" size="large" onClick={() => handleApply(job.test?.id)} sx={{ borderRadius: 3, px: 4 }}>
                                            Take Assessment
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))}
                            {jobs.length === 0 && (
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 10, textAlign: 'center', bgcolor: alpha('#1e293b', 0.2), borderRadius: 8 }}>
                                        <Search sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary">No job assessments active right now. Check back soon!</Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </Container>
                <Footer />
            </Box>
        </Box>
    );
}
