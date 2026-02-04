import { Box, Container, Typography, Grid, Paper, Stack, Tab, Tabs } from '@mui/material';
import { Code, Badge, Person, Search, FilterList, CompareArrows } from '@mui/icons-material';
import { useState } from 'react';

const steps = {
    developers: [
        { icon: <Code fontSize="large" color="primary" />, title: '1. Choose a skill test', description: 'Select from over 50+ standardized technical assessments covering all major stacks.' },
        { icon: <Badge fontSize="large" color="secondary" />, title: '2. Get verified', description: 'Complete the assessment to earn a badge. Upgrade to AI Advanced for deeper verification.' },
        { icon: <Person fontSize="large" sx={{ color: '#10b981' }} />, title: '3. Build Profile', description: 'Showcase your verified skills on your public profile to attract top recruiters.' },
    ],
    recruiters: [
        { icon: <Search fontSize="large" color="primary" />, title: '1. Search Talent', description: 'Access a pool of pre-verified developers ready for their next challenge.' },
        { icon: <FilterList fontSize="large" color="secondary" />, title: '2. Filter by Badges', description: 'Quickly shortlist candidates based on Standard or AI Verified credentials.' },
        { icon: <CompareArrows fontSize="large" sx={{ color: '#10b981' }} />, title: '3. Compare', description: 'View side-by-side performance metrics to make data-driven hiring decisions.' },
    ]
};

export default function HowItWorks() {
    const [tab, setTab] = useState(0); // 0 = Developers, 1 = Recruiters

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Box id="how-it-works" sx={{ py: 12, bgcolor: '#0f172a' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={8}>
                    <Typography variant="h2" fontWeight={800} gutterBottom>How it works</Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                        Simple, transparent, and effective for everyone.
                    </Typography>

                    <Tabs
                        value={tab}
                        onChange={handleChange}
                        centered
                        sx={{
                            '& .MuiTabs-indicator': { backgroundColor: 'primary.main', height: 3, borderRadius: 1 },
                            '& .MuiTab-root': { color: 'text.secondary', fontSize: '1.1rem', fontWeight: 600, textTransform: 'none', minWidth: 160 },
                            '& .Mui-selected': { color: 'white !important' }
                        }}
                    >
                        <Tab label="For Developers" />
                        <Tab label="For Recruiters" />
                    </Tabs>
                </Box>

                <Grid container spacing={4}>
                    {(tab === 0 ? steps.developers : steps.recruiters).map((step, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    bgcolor: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: 4,
                                    transition: 'transform 0.3s ease',
                                    '&:hover': { transform: 'translateY(-5px)', bgcolor: 'rgba(255,255,255,0.04)' }
                                }}
                            >
                                <Box sx={{ mb: 3 }}>{step.icon}</Box>
                                <Typography variant="h5" fontWeight={700} gutterBottom>{step.title}</Typography>
                                <Typography variant="body1" color="text.secondary" lineHeight={1.6}>{step.description}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
