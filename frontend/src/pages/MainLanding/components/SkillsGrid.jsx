import { Box, Container, Typography, Grid, Card, CardActionArea, CardContent, Chip } from '@mui/material';
import { Terminal, Code, Storage, DataObject, Functions, Web } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const skills = [
    { name: 'Java', icon: <Code />, category: 'Backend' },
    { name: 'Spring Boot', icon: <Storage />, category: 'Framework' },
    { name: 'Python', icon: <Terminal />, category: 'Data/Backend' },
    { name: 'JavaScript', icon: <Web />, category: 'Frontend' },
    { name: 'SQL', icon: <DataObject />, category: 'Database' },
    { name: 'Algorithms', icon: <Functions />, category: 'Computer Science' },
];

export default function SkillsGrid() {
    return (
        <Box sx={{ py: 12, bgcolor: '#0f172a' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight={800} sx={{ mb: 6 }} align="center">
                    Popular Skill Tracks
                </Typography>

                <Grid container spacing={3}>
                    {skills.map((skill) => (
                        <Grid item xs={12} sm={6} md={4} key={skill.name}>
                            <Card sx={{
                                bgcolor: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 4,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    transform: 'translateY(-4px)'
                                }
                            }}>
                                <CardActionArea component={Link} to="/tests" sx={{ p: 2 }}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ p: 1, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 2, color: 'primary.main' }}>
                                                {skill.icon}
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" fontWeight={700}>{skill.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{skill.category}</Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="caption" fontWeight={700} color="primary.main">Start ›</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
