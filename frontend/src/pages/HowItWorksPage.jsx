import { Box, Container, Typography, Grid, Paper, Button, Stack, Tab, Tabs, useTheme, alpha, Divider } from '@mui/material';
import {
    Code, Badge, Person, Search, FilterList, CompareArrows,
    AutoAwesome, Speed, Security, Insights, Work, School,
    HistoryEdu, FactCheck
} from '@mui/icons-material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from './MainLanding/components/TopNav';
import FooterLanding from './MainLanding/components/FooterLanding';
import ParticlesBackground from './MainLanding/components/ParticlesBackground';

const developerSteps = [
    {
        icon: <School sx={{ fontSize: 40 }} />,
        title: "1. Skill Selection",
        subtitle: "Choose your path",
        description: "Browse our extensive catalog of technical assessments ranging from Frontend development to Cloud Architecture. Pick the tests that align with your career goals.",
        color: "#3b82f6"
    },
    {
        icon: <Code sx={{ fontSize: 40 }} />,
        title: "2. Technical Assessment",
        subtitle: "Prove your expertise",
        description: "Engage in real-world coding challenges and theoretical questions. Our environment is designed to let you showcase your practical problem-solving skills.",
        color: "#ec4899"
    },
    {
        icon: <AutoAwesome sx={{ fontSize: 40 }} />,
        title: "3. AI Verification",
        subtitle: "Deep evaluation",
        description: "Opt for AI Advanced evaluation where our engine analyzes your code for best practices, efficiency, and security, providing a deeper level of verification.",
        color: "#10b981"
    },
    {
        icon: <Badge sx={{ fontSize: 40 }} />,
        title: "4. Earn Your Credentials",
        subtitle: "Verified status",
        description: "Upon success, receive a digital badge and a detailed skill report. These credentials are live-verified and can be shared with potential employers.",
        color: "#f59e0b"
    }
];

const recruiterSteps = [
    {
        icon: <Search sx={{ fontSize: 40 }} />,
        title: "1. Talent Discovery",
        subtitle: "Global access",
        description: "Search through our pool of verified developers. Filter by specific technologies, experience levels, and verification status to find your perfect match.",
        color: "#3b82f6"
    },
    {
        icon: <Work sx={{ fontSize: 40 }} />,
        title: "2. Custom Campaigns",
        subtitle: "Tailored hiring",
        description: "Create custom assessment campaigns. Invite candidates to take specific tests or build your own question bank to suit your team's needs.",
        color: "#ec4899"
    },
    {
        icon: <Insights sx={{ fontSize: 40 }} />,
        title: "3. Deep Analytics",
        subtitle: "Data-driven decisions",
        description: "Review comprehensive candidate reports. Compare scores across multiple dimensions like speed, accuracy, and code quality.",
        color: "#10b981"
    },
    {
        icon: <FactCheck sx={{ fontSize: 40 }} />,
        title: "4. Confident Hiring",
        subtitle: "Reduced risk",
        description: "Make hiring decisions backed by verified data. Reduce your interview count by focusing only on candidates whose skills are already proven.",
        color: "#f59e0b"
    }
];

export default function HowItWorksPage() {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);

    const steps = activeTab === 0 ? developerSteps : recruiterSteps;
    const isLoggedIn = !!localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    return (
        <Box sx={{ bgcolor: '#0f172a', minHeight: '100vh', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <ParticlesBackground />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <TopNav />

                {/* Hero Section */}
                <Box sx={{
                    pt: { xs: 15, md: 20 },
                    pb: { xs: 10, md: 15 },
                    background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
                    textAlign: 'center'
                }}>
                    <Container maxWidth="md">
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                fontWeight: 900,
                                mb: 3,
                                background: 'linear-gradient(to right, #fff, #94a3b8)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Redefining Skill Validation
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 400, mb: 6, lineHeight: 1.6 }}>
                            Skill Evaluator provides a seamless, AI-powered ecosystem for developers to prove their worth and for recruiters to find verified talent with zero friction.
                        </Typography>

                        <Tabs
                            value={activeTab}
                            onChange={(e, val) => setActiveTab(val)}
                            centered
                            sx={{
                                mb: 8,
                                '& .MuiTabs-indicator': { height: 4, borderRadius: 2, bgcolor: 'primary.main' },
                                '& .MuiTab-root': {
                                    fontSize: '1.2rem',
                                    fontWeight: 700,
                                    color: 'text.secondary',
                                    textTransform: 'none',
                                    px: 4,
                                    '&.Mui-selected': { color: 'white' }
                                }
                            }}
                        >
                            <Tab label="For Developers" />
                            <Tab label="For Recruiters" />
                        </Tabs>
                    </Container>
                </Box>

                {/* Steps Section */}
                <Container maxWidth="lg" sx={{ pb: 15 }}>
                    <Grid container spacing={4}>
                        {steps.map((step, index) => (
                            <Grid item xs={12} md={6} lg={3} key={index}>
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
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            borderColor: alpha(step.color, 0.4),
                                            bgcolor: alpha('#1e293b', 0.6),
                                            '& .step-icon': {
                                                transform: 'scale(1.1) rotate(5deg)',
                                                color: step.color
                                            }
                                        }
                                    }}
                                >
                                    <Box
                                        className="step-icon"
                                        sx={{
                                            mb: 3,
                                            color: alpha(step.color, 0.8),
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {step.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: step.color }}>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                                        {step.subtitle}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.7 }}>
                                        {step.description}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            position: 'absolute',
                                            bottom: -20,
                                            right: -10,
                                            fontSize: '8rem',
                                            fontWeight: 900,
                                            color: alpha('#fff', 0.02),
                                            userSelect: 'none'
                                        }}
                                    >
                                        {index + 1}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                {/* Core Features Section */}
                <Box sx={{ bgcolor: alpha('#1e293b', 0.3), py: 15 }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={8} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Typography variant="h3" fontWeight={800} sx={{ mb: 4, letterSpacing: '-0.02em' }}>
                                    Advanced AI-Powered <br />
                                    <span style={{ color: theme.palette.primary.main }}>Validation Engine</span>
                                </Typography>
                                <Stack spacing={4}>
                                    <Box sx={{ display: 'flex', gap: 3 }}>
                                        <Box sx={{ p: 1.5, bgcolor: alpha('#3b82f6', 0.1), borderRadius: 3, height: 'fit-content' }}>
                                            <Security color="primary" />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={700} gutterBottom>Integrity First</Typography>
                                            <Typography variant="body2" color="text.secondary">Our platform uses advanced proctoring and pattern recognition to ensure all tests are taken fairly and results are genuine.</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 3 }}>
                                        <Box sx={{ p: 1.5, bgcolor: alpha('#ec4899', 0.1), borderRadius: 3, height: 'fit-content' }}>
                                            <Speed sx={{ color: '#ec4899' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={700} gutterBottom>Rapid Evaluation</Typography>
                                            <Typography variant="body2" color="text.secondary">No more waiting weeks for feedback. Get instant grades and detailed breakdowns of your performance across various sub-skills.</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 3 }}>
                                        <Box sx={{ p: 1.5, bgcolor: alpha('#10b981', 0.1), borderRadius: 3, height: 'fit-content' }}>
                                            <HistoryEdu sx={{ color: '#10b981' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={700} gutterBottom>Dynamic Content</Typography>
                                            <Typography variant="body2" color="text.secondary">Questions are regularly updated and randomized to maintain the highest standard of difficulty and relevance to industry trends.</Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        p: 4,
                                        bgcolor: alpha('#3b82f6', 0.05),
                                        borderRadius: 8,
                                        border: '1px dashed',
                                        borderColor: alpha('#3b82f6', 0.3)
                                    }}
                                >
                                    <Paper sx={{ p: 4, bgcolor: '#1e293b', borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                                        <Typography variant="h6" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AutoAwesome color="primary" /> AI Insights Preview
                                        </Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        <Stack spacing={2}>
                                            <Box sx={{ height: 8, width: '100%', bgcolor: alpha('#fff', 0.05), borderRadius: 4, overflow: 'hidden' }}>
                                                <Box sx={{ height: '100%', width: '85%', bgcolor: 'primary.main' }} />
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">Code Efficiency: 85%</Typography>

                                            <Box sx={{ height: 8, width: '100%', bgcolor: alpha('#fff', 0.05), borderRadius: 4, overflow: 'hidden' }}>
                                                <Box sx={{ height: '100%', width: '92%', bgcolor: '#10b981' }} />
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">Security Best Practices: 92%</Typography>

                                            <Box sx={{ height: 8, width: '100%', bgcolor: alpha('#fff', 0.05), borderRadius: 4, overflow: 'hidden' }}>
                                                <Box sx={{ height: '100%', width: '70%', bgcolor: '#ec4899' }} />
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">Scalability Patterns: 70%</Typography>
                                        </Stack>
                                        <Box sx={{ mt: 4, p: 2, bgcolor: alpha('#3b82f6', 0.1), borderRadius: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                                "Candidate demonstrates exceptional React hooks mastery but could improve in memoization strategies."
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* CTA Section */}
                <Container maxWidth="md" sx={{ py: 15, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={800} sx={{ mb: 3 }}>
                        Ready to get started?
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 6 }}>
                        Join thousands of developers and top-tier recruiters on the world's most advanced skill validation platform.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                        {!isLoggedIn && (
                            <Button
                                component={Link}
                                to="/register"
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 6,
                                    py: 2,
                                    borderRadius: 50,
                                    fontWeight: 800,
                                    fontSize: '1.1rem',
                                    boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.5)'
                                }}
                            >
                                Sign Up Now
                            </Button>
                        )}
                        <Button
                            component={Link}
                            to={isLoggedIn ? (role === 'ADMIN' ? '/admin/dashboard' : '/recruiter/dashboard') : '/login'}
                            variant="outlined"
                            size="large"
                            sx={{
                                px: 6,
                                py: 2,
                                borderRadius: 50,
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                borderColor: alpha('#fff', 0.2),
                                color: 'white',
                                '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.05) }
                            }}
                        >
                            {isLoggedIn ? 'Go to Dashboard' : 'Login to Dashboard'}
                        </Button>
                    </Stack>
                </Container>

                <FooterLanding />
            </Box>
        </Box>
    );
}
