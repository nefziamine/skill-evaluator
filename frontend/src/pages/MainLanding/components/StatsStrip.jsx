import { Box, Container, Grid, Typography, Paper } from '@mui/material';

const stats = [
    { label: 'Tests Taken', value: '10k+' },
    { label: 'Verified Profiles', value: '1,200+' },
    { label: 'Avg Completion Time', value: '18 min' },
    { label: 'Skills Covered', value: '50+' },
];

export default function StatsStrip() {
    return (
        <Box sx={{ py: 6, bgcolor: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">
                    {stats.map((stat, i) => (
                        <Grid item xs={6} md={3} key={i}>
                            <Box textAlign="center">
                                <Typography variant="h3" fontWeight={800} color="white" sx={{ mb: 1 }}>{stat.value}</Typography>
                                <Typography variant="body2" fontWeight={600} color="text.secondary" textTransform="uppercase" letterSpacing={1}>{stat.label}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
