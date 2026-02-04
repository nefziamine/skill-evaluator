import { Box, Container, Typography, Grid, Paper, Avatar, Stack } from '@mui/material';

const testimonials = [
    {
        name: "Alex Jensen",
        role: "Senior Developer",
        text: "The AI Advanced test was brutal but fair. Getting the Gold Badge actually helped me land 3 interviews next week.",
        avatar: "A"
    },
    {
        name: "Sarah Chen",
        role: "Tech Recruiter",
        text: "I used to spend hours reviewing GitHub repos. Now I just filter by 'AI Verified Java' and I have a shortlist in minutes.",
        avatar: "S"
    },
    {
        name: "Michael Ross",
        role: "CTO, FinTech Co",
        text: "Standardized testing on this platform allows us to benchmark candidates globally without bias.",
        avatar: "M"
    },
];

export default function Testimonials() {
    return (
        <Box sx={{ py: 12, bgcolor: '#0f172a' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" align="center" fontWeight={800} sx={{ mb: 8 }}>Trusted by the community</Typography>
                <Grid container spacing={4}>
                    {testimonials.map((t, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Paper sx={{ p: 4, height: '100%', borderRadius: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3, color: '#ced4da' }}>"{t.text}"</Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: i === 1 ? 'secondary.main' : 'primary.main' }}>{t.avatar}</Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={700}>{t.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
