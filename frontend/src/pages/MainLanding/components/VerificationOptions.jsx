import { Box, Container, Typography, Grid, Paper, Button, Chip, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Check, AutoAwesome, Bolt } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function VerificationOptions() {
    return (
        <Box id="ai-advanced" sx={{ py: 12, bgcolor: '#1e293b' }}>
            <Container maxWidth="lg">
                <Typography variant="h2" align="center" fontWeight={800} gutterBottom>Two ways to get verified</Typography>
                <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}>
                    Choose the assessment level that matches your needs.
                </Typography>

                <Grid container spacing={4} alignItems="stretch">
                    {/* Standard */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{
                            p: 5,
                            height: '100%',
                            borderRadius: 4,
                            bgcolor: 'background.default',
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={2}>STANDARD</Typography>
                                <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>Free</Typography>
                                <Typography variant="body2" color="text.secondary">Forever.</Typography>
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            <List sx={{ mb: 'auto' }}>
                                <ListItem disableGutters>
                                    <ListItemIcon><Check color="primary" /></ListItemIcon>
                                    <ListItemText primary="Pre-built standardized question banks" secondary="Consistent across all candidates" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><Check color="primary" /></ListItemIcon>
                                    <ListItemText primary="Junior, Mid, Senior levels" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><Check color="primary" /></ListItemIcon>
                                    <ListItemText primary="Standard Profile Badge" />
                                </ListItem>
                            </List>

                            <Box sx={{ mt: 4 }}>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                                    <Chip label="Verified Java" size="small" variant="outlined" />
                                    <Chip label="Verified Python" size="small" variant="outlined" />
                                </Stack>
                                <Button component={Link} to="/tests" variant="outlined" fullWidth size="large" sx={{ py: 1.5, borderRadius: 3 }}>Start Standard Test</Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* AI Advanced */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{
                            p: 5,
                            height: '100%',
                            borderRadius: 4,
                            background: 'linear-gradient(145deg, rgba(236,72,153,0.1) 0%, rgba(30,41,59,1) 100%)',
                            border: '1px solid',
                            borderColor: 'secondary.main',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Box sx={{ position: 'absolute', top: 0, right: 0, p: 2, bgcolor: 'secondary.main', color: 'white', borderBottomLeftRadius: 16, fontWeight: 700 }}>
                                RECOMMENDED
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="overline" color="secondary.light" fontWeight={700} letterSpacing={2}>AI ADVANCED</Typography>
                                <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>Premium</Typography>
                                <Typography variant="body2" color="text.secondary">Deep assessment.</Typography>
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            <List sx={{ mb: 'auto' }}>
                                <ListItem disableGutters>
                                    <ListItemIcon><AutoAwesome color="secondary" /></ListItemIcon>
                                    <ListItemText primary="AI-generated dynamic scenarios" secondary="Adapts to your code in real-time" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><AutoAwesome color="secondary" /></ListItemIcon>
                                    <ListItemText primary="Deeper difficulty & anti-cheat" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><AutoAwesome color="secondary" /></ListItemIcon>
                                    <ListItemText primary="Gold 'AI Verified' Badges" secondary="Highest trust signal for recruiters" />
                                </ListItem>
                            </List>

                            <Box sx={{ mt: 4 }}>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                                    <Chip icon={<Bolt />} label="AI Verified Java" size="small" color="secondary" />
                                    <Chip icon={<Bolt />} label="AI Verified SQL" size="small" color="secondary" />
                                </Stack>
                                <Button component={Link} to="/ai-tests" variant="contained" color="secondary" fullWidth size="large" sx={{ py: 1.5, borderRadius: 3, boxShadow: '0 8px 20px -5px rgba(236,72,153,0.5)' }}>Try AI Advanced</Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

import { Stack } from '@mui/material'; // Forgot to import Stack
