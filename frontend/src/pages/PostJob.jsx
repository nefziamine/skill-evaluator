import { Box, Container, Typography, Grid, Paper, Button, Stack, useTheme, alpha, TextField, MenuItem } from '@mui/material';
import { Create, Assignment, Share, Analytics, AutoAwesome, CheckCircleOutline } from '@mui/icons-material';
import TopNav from './MainLanding/components/TopNav';
import FooterLanding from './MainLanding/components/FooterLanding';
import ParticlesBackground from './MainLanding/components/ParticlesBackground';

export default function PostJob() {
    const theme = useTheme();

    return (
        <Box sx={{ bgcolor: '#0f172a', minHeight: '100vh', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <ParticlesBackground />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <TopNav />

                <Container maxWidth="lg" sx={{ pt: 15, pb: 15 }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h1" sx={{
                                fontSize: { xs: '3rem', md: '4rem' },
                                fontWeight: 900,
                                mb: 3,
                                background: 'linear-gradient(to right, #fff, #94a3b8)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1
                            }}>
                                Hire Smarter with <br />
                                <span style={{ color: theme.palette.primary.main }}>Skill-First</span> Hiring
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 6, fontWeight: 400, lineHeight: 1.6 }}>
                                Skip the resume screening. Define your technical requirements, and let our AI-powered platform invite and assess candidates automatically.
                            </Typography>

                            <Stack spacing={4}>
                                {[
                                    { icon: <Assignment color="primary" />, title: "Assessment-Led Recruitment", desc: "Every job post is automatically paired with a relevant skill test." },
                                    { icon: <AutoAwesome sx={{ color: '#10b981' }} />, title: "AI-Powered Shortlisting", desc: "Our engine ranks candidates based on actual performance, not just keywords." },
                                    { icon: <Share color="secondary" />, title: "Automated Invitations", desc: "Instantly notify qualified talent in our database about your new opening." }
                                ].map((item, i) => (
                                    <Box key={i} sx={{ display: 'flex', gap: 3 }}>
                                        <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 3, height: 'fit-content' }}>
                                            {item.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={700} gutterBottom>{item.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 5,
                                    bgcolor: alpha('#1e293b', 0.6),
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: 8,
                                    border: '1px solid',
                                    borderColor: alpha('#fff', 0.1),
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
                                }}
                            >
                                <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>Post a New Job</Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Job Title"
                                        placeholder="e.g. Senior Backend Engineer"
                                        variant="outlined"
                                        InputLabelProps={{ style: { color: '#94a3b8' } }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: alpha('#fff', 0.1) } }
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        select
                                        label="Required Skill Badge"
                                        defaultValue="react"
                                        variant="outlined"
                                        InputLabelProps={{ style: { color: '#94a3b8' } }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: alpha('#fff', 0.1) } }
                                        }}
                                    >
                                        <MenuItem value="react">React Frontend Professional</MenuItem>
                                        <MenuItem value="node">Node.js Backend Expert</MenuItem>
                                        <MenuItem value="cloud">AWS Infrastructure Architect</MenuItem>
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        placeholder="e.g. Remote or City"
                                        variant="outlined"
                                        InputLabelProps={{ style: { color: '#94a3b8' } }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: alpha('#fff', 0.1) } }
                                        }}
                                    />
                                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 4, border: '1px dashed', borderColor: alpha(theme.palette.primary.main, 0.3) }}>
                                        <Typography variant="subtitle2" sx={{ color: 'primary.light', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircleOutline fontSize="small" /> AI Assessment Active
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Candidates will be required to complete a 45-minute technical assessment for this role.
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        sx={{
                                            py: 2,
                                            borderRadius: 4,
                                            fontWeight: 800,
                                            fontSize: '1.2rem',
                                            textTransform: 'none',
                                            boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.5)'
                                        }}
                                    >
                                        Create Job Assessment
                                    </Button>
                                    <Typography variant="caption" align="center" color="text.disabled">
                                        By posting, you agree to our Terms for Recruiters.
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* How it works for posting */}
                    <Box sx={{ mt: 15 }}>
                        <Typography variant="h3" fontWeight={800} textAlign="center" sx={{ mb: 8 }}>The Hiring Workflow</Typography>
                        <Grid container spacing={4}>
                            {[
                                { step: "01", title: "Define Requirements", desc: "Select the specific skill badges and experience levels you need for the role." },
                                { step: "02", title: "AI Vetting", desc: "Candidates take a custom-built technical test tailored to your job description." },
                                { step: "03", title: "Review Rankings", desc: "Access a stack-ranked list of developers based on their verified test scores." },
                                { step: "04", title: "Direct Connect", desc: "Message top-tier candidates directly through our secure recruiter dashboard." }
                            ].map((s, i) => (
                                <Grid item xs={12} sm={6} md={3} key={i}>
                                    <Paper sx={{ p: 4, height: '100%', bgcolor: alpha('#fff', 0.02), borderRadius: 4, border: '1px solid', borderColor: alpha('#fff', 0.05) }}>
                                        <Typography variant="h2" fontWeight={900} sx={{ color: alpha(theme.palette.primary.main, 0.3), mb: 2 }}>{s.step}</Typography>
                                        <Typography variant="h6" fontWeight={700} gutterBottom>{s.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{s.desc}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>

                <FooterLanding />
            </Box>
        </Box>
    );
}
