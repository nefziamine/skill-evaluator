import { Box, Container, Typography, Grid, Paper, Avatar, Chip, Button, InputBase, alpha, useTheme, Stack } from '@mui/material';
import { Search, FilterList, Verified, AutoAwesome, LocationOn, Code } from '@mui/icons-material';
import TopNav from './MainLanding/components/TopNav';
import Footer from '../components/Footer';
import ParticlesBackground from './MainLanding/components/ParticlesBackground';

const candidates = [
    {
        name: "Alex Rivera",
        role: "Senior Full Stack Engineer",
        skills: ["React", "Node.js", "AWS", "TypeScript"],
        verification: "AI Advanced",
        location: "San Francisco, CA",
        avatar: "AR",
        score: 98
    },
    {
        name: "Sarah Chen",
        role: "Backend Architect",
        skills: ["Java", "Spring Boot", "Kubernetes", "PostgreSQL"],
        verification: "Standard",
        location: "New York, NY",
        avatar: "SC",
        score: 94
    },
    {
        name: "Marcus Thorne",
        role: "Frontend Specialist",
        skills: ["Vue.js", "Tailwind", "Firebase", "Three.js"],
        verification: "AI Advanced",
        location: "London, UK",
        avatar: "MT",
        score: 96
    },
    {
        name: "Elena Rodriguez",
        role: "DevOps Engineer",
        skills: ["Docker", "Terraform", "CI/CD", "Python"],
        verification: "AI Advanced",
        location: "Madrid, ES",
        avatar: "ER",
        score: 99
    },
    {
        name: "Kenji Sato",
        role: "Mobile Developer",
        skills: ["React Native", "Swift", "Kotlin", "GraphQL"],
        verification: "Standard",
        location: "Tokyo, JP",
        avatar: "KS",
        score: 92
    },
    {
        name: "Maya Patel",
        role: "Cloud Engineer",
        skills: ["Azure", "Python", "Go", "Serverless"],
        verification: "AI Advanced",
        location: "Toronto, CA",
        avatar: "MP",
        score: 97
    }
];

export default function BrowseTalent() {
    const theme = useTheme();

    return (
        <Box sx={{ bgcolor: '#0f172a', minHeight: '100vh', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <ParticlesBackground />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <TopNav />

                <Container maxWidth="xl" sx={{ pt: 15, pb: 10 }}>
                    <Box textAlign="center" mb={8}>
                        <Typography variant="h2" fontWeight={900} gutterBottom sx={{
                            background: 'linear-gradient(to right, #fff, #94a3b8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Verified Technical Talent
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                            Discover pre-vetted developers who have proven their skills through our rigorous AI-powered assessment platform.
                        </Typography>
                    </Box>

                    {/* Search and Filters */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 6,
                            bgcolor: alpha('#1e293b', 0.6),
                            backdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: alpha('#fff', 0.1),
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: { xs: 'wrap', md: 'nowrap' }
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 1,
                            bgcolor: alpha('#0f172a', 0.5),
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            border: '1px solid',
                            borderColor: alpha('#fff', 0.05)
                        }}>
                            <Search sx={{ color: 'text.secondary', mr: 1 }} />
                            <InputBase
                                placeholder="Search by skill, role, or keyword..."
                                sx={{ color: 'white', width: '100%' }}
                            />
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={<FilterList />}
                            sx={{ borderRadius: 2, textTransform: 'none', height: 48, borderColor: alpha('#fff', 0.2), color: 'white' }}
                        >
                            Filters
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ borderRadius: 2, textTransform: 'none', height: 48, px: 4, fontWeight: 700 }}
                        >
                            Search Talent
                        </Button>
                    </Paper>

                    <Grid container spacing={3}>
                        {candidates.map((candidate, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        bgcolor: alpha('#1e293b', 0.4),
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: 6,
                                        border: '1px solid',
                                        borderColor: alpha('#fff', 0.05),
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            borderColor: candidate.verification === 'AI Advanced' ? alpha(theme.palette.primary.main, 0.4) : alpha('#fff', 0.2),
                                            bgcolor: alpha('#1e293b', 0.7)
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                        <Avatar
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                bgcolor: candidate.verification === 'AI Advanced' ? 'primary.main' : 'secondary.main',
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                boxShadow: `0 0 20px ${alpha(candidate.verification === 'AI Advanced' ? theme.palette.primary.main : theme.palette.secondary.main, 0.3)}`
                                            }}
                                        >
                                            {candidate.avatar}
                                        </Avatar>
                                        <Box textAlign="right">
                                            <Chip
                                                icon={candidate.verification === 'AI Advanced' ? <AutoAwesome sx={{ fontSize: '14px !important' }} /> : <Verified sx={{ fontSize: '14px !important' }} />}
                                                label={candidate.verification}
                                                size="small"
                                                sx={{
                                                    bgcolor: alpha(candidate.verification === 'AI Advanced' ? '#10b981' : '#3b82f6', 0.1),
                                                    color: candidate.verification === 'AI Advanced' ? '#10b981' : '#3b82f6',
                                                    fontWeight: 700,
                                                    border: '1px solid',
                                                    borderColor: alpha(candidate.verification === 'AI Advanced' ? '#10b981' : '#3b82f6', 0.2),
                                                    mb: 1
                                                }}
                                            />
                                            <Typography variant="h6" color="primary.light" sx={{ fontWeight: 800 }}>
                                                {candidate.score}%
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">Skill Match</Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="h5" fontWeight={800} gutterBottom>{candidate.name}</Typography>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Code fontSize="small" /> {candidate.role}
                                    </Typography>
                                    <Typography variant="body2" color="text.disabled" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                                        <LocationOn fontSize="small" /> {candidate.location}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                        {candidate.skills.map((skill, si) => (
                                            <Chip
                                                key={si}
                                                label={skill}
                                                size="small"
                                                sx={{ bgcolor: alpha('#fff', 0.05), color: '#94a3b8', border: '1px solid', borderColor: alpha('#fff', 0.05) }}
                                            />
                                        ))}
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            borderColor: alpha('#fff', 0.1),
                                            color: 'white',
                                            '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.05) }
                                        }}
                                    >
                                        View Full Profile
                                    </Button>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    <Box textAlign="center" mt={6}>
                        <Button
                            variant="text"
                            sx={{ color: 'primary.main', fontWeight: 700, fontSize: '1.1rem' }}
                        >
                            Load More Candidates
                        </Button>
                    </Box>
                </Container>

                <Footer />
            </Box>
        </Box>
    );
}
