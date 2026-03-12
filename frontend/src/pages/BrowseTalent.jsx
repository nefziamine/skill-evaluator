import { useMemo, useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Avatar,
    Chip,
    Button,
    InputBase,
    alpha,
    useTheme,
    CircularProgress,
    Drawer,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
} from '@mui/material';
import { Search, FilterList, Verified, Code, Lock, Link as LinkIcon } from '@mui/icons-material';
import TopNav from './MainLanding/components/TopNav';
import Footer from '../components/Footer';
import ParticlesBackground from './MainLanding/components/ParticlesBackground';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function BrowseTalent() {
    const theme = useTheme();
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const canViewContact = isLoggedIn && (userRole === 'RECRUITER' || userRole === 'ADMIN');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [activeCandidate, setActiveCandidate] = useState(null);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
    const [visibleCount, setVisibleCount] = useState(12);
    const [filters, setFilters] = useState({
        skill: 'ALL',
        minExp: 0,
        maxExp: 20,
    });

    useEffect(() => {
        const fetchTalent = async () => {
            try {
                const response = await api.get('/recruiter/talent-browser');
                setCandidates(response.data);
            } catch (err) {
                console.error("Failed to fetch talent", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTalent();
    }, []);

    const openProfile = (candidate) => {
        setActiveCandidate(candidate);
        setProfileOpen(true);
    };

    const handleContact = (candidate) => {
        if (!canViewContact) {
            setToast({
                open: true,
                severity: 'warning',
                message: 'Login as a recruiter to view contact details and reach out to candidates.',
            });
            navigate('/login?role=RECRUITER');
            return;
        }

        // If recruiter/admin: open dialog focused on contact, or mailto if available
        if (candidate?.email) {
            window.location.href = `mailto:${candidate.email}`;
        } else {
            setToast({
                open: true,
                severity: 'info',
                message: 'Contact details are not available for this candidate.',
            });
        }
    };

    const allSkills = useMemo(() => {
        const set = new Set();
        candidates.forEach((c) => {
            if (c.skills) {
                c.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => set.add(s));
            }
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [candidates]);

    const filteredCandidates = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return candidates.filter((c) => {
            const name = `${c.firstName || ''} ${c.lastName || ''}`.trim().toLowerCase();
            const skills = (c.skills || '').toLowerCase();
            const exp = parseInt(c.experience || '0', 10);

            const matchesQuery = !q || name.includes(q) || skills.includes(q);
            const matchesSkill = filters.skill === 'ALL' || (c.skills || '').split(',').map(s => s.trim()).includes(filters.skill);
            const matchesExp = !Number.isNaN(exp) && exp >= filters.minExp && exp <= filters.maxExp;

            return matchesQuery && matchesSkill && matchesExp;
        });
    }, [candidates, searchQuery, filters]);

    const handleSearch = () => {
        // No server call required; filtering is client-side.
        // Keep for UX parity with the existing button.
    };

    const visibleCandidates = useMemo(
        () => filteredCandidates.slice(0, visibleCount),
        [filteredCandidates, visibleCount]
    );

    return (
        <Box sx={{ bgcolor: '#020617', minHeight: '100vh', color: 'white', position: 'relative', overflow: 'hidden' }}>
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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSearch();
                                }}
                            />
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={<FilterList />}
                            onClick={() => setFiltersOpen(true)}
                            sx={{ borderRadius: 2, textTransform: 'none', height: 48, borderColor: alpha('#fff', 0.2), color: 'white' }}
                        >
                            Filters
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            sx={{ borderRadius: 2, textTransform: 'none', height: 48, px: 4, fontWeight: 700 }}
                        >
                            Search Talent
                        </Button>
                    </Paper>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
                            <CircularProgress sx={{ color: 'white' }} />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {visibleCandidates.map((candidate) => (
                                <Grid item xs={12} md={6} lg={4} key={candidate.id}>
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
                                                borderColor: alpha(theme.palette.primary.main, 0.4),
                                                bgcolor: alpha('#1e293b', 0.7)
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                            <Avatar
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    bgcolor: 'primary.main',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 700,
                                                    boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`
                                                }}
                                            >
                                                {(candidate.firstName?.[0] || 'C')}{(candidate.lastName?.[0] || '')}
                                            </Avatar>
                                            <Box textAlign="right">
                                                <Chip
                                                    icon={<Verified sx={{ fontSize: '14px !important' }} />}
                                                    label="Verified Candidate"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha('#10b981', 0.1),
                                                        color: '#10b981',
                                                        fontWeight: 700,
                                                        border: '1px solid',
                                                        borderColor: alpha('#10b981', 0.2),
                                                        mb: 1
                                                    }}
                                                />
                                                {canViewContact ? (
                                                    <>
                                                        <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 800 }}>
                                                            {candidate.email}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">Contact available</Typography>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#94a3b8' }}>
                                                            <Lock sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'text-bottom' }} />
                                                            Contact locked
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">Login to view contact</Typography>
                                                    </>
                                                )}
                                            </Box>
                                        </Box>

                                        <Typography variant="h5" fontWeight={800} gutterBottom>
                                            {(candidate.firstName || 'Candidate')} {candidate.lastName || ''}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Code fontSize="small" /> {candidate.experience ? `${candidate.experience} Years Exp` : 'Experience not provided'}
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                            {(candidate.skills ? candidate.skills.split(',') : ['No skills provided']).map((skill, si) => (
                                                <Chip
                                                    key={si}
                                                    label={(skill || '').trim() || 'No skills provided'}
                                                    size="small"
                                                    sx={{ bgcolor: alpha('#fff', 0.05), color: '#94a3b8', border: '1px solid', borderColor: alpha('#fff', 0.05) }}
                                                />
                                            ))}
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={() => openProfile(candidate)}
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    borderColor: alpha('#fff', 0.1),
                                                    color: 'white',
                                                    '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.05) }
                                                }}
                                            >
                                                View Profile
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={canViewContact ? <LinkIcon /> : <Lock />}
                                                onClick={() => handleContact(candidate)}
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 800,
                                                    px: 2,
                                                    minWidth: 150,
                                                }}
                                            >
                                                {canViewContact ? 'Contact' : 'Login'}
                                            </Button>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    <Box textAlign="center" mt={6}>
                        {filteredCandidates.length === 0 && (
                            <Typography sx={{ color: '#94a3b8', fontWeight: 700, mb: 2 }}>
                                No candidates found. Try clearing filters or search.
                            </Typography>
                        )}
                        <Button
                            variant="text"
                            onClick={() => setVisibleCount((prev) => Math.min(prev + 12, filteredCandidates.length))}
                            disabled={visibleCount >= filteredCandidates.length}
                            sx={{ color: 'primary.main', fontWeight: 700, fontSize: '1.1rem' }}
                        >
                            {visibleCount >= filteredCandidates.length ? 'No more candidates' : 'Load More Candidates'}
                        </Button>
                    </Box>
                </Container>

                <Footer />
            </Box>

            {/* Filters Drawer */}
            <Drawer
                anchor="right"
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 380 },
                        bgcolor: '#0b1220',
                        color: 'white',
                        p: 3,
                        borderLeft: `1px solid ${alpha('#fff', 0.08)}`,
                    }
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Filters</Typography>
                <Divider sx={{ borderColor: alpha('#fff', 0.08), mb: 3 }} />

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel sx={{ color: '#94a3b8' }}>Skill</InputLabel>
                    <Select
                        value={filters.skill}
                        label="Skill"
                        onChange={(e) => setFilters(prev => ({ ...prev, skill: e.target.value }))}
                        sx={{
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#fff', 0.15) },
                        }}
                    >
                        <MenuItem value="ALL">All skills</MenuItem>
                        {allSkills.map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1, fontWeight: 700 }}>
                    Years of experience
                </Typography>
                <Slider
                    value={[filters.minExp, filters.maxExp]}
                    onChange={(_, v) => {
                        const [minExp, maxExp] = v;
                        setFilters(prev => ({ ...prev, minExp, maxExp }));
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    max={20}
                    sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setFilters({ skill: 'ALL', minExp: 0, maxExp: 20 })}
                        sx={{ borderColor: alpha('#fff', 0.2), color: 'white', fontWeight: 800, borderRadius: 2 }}
                    >
                        Reset
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setFiltersOpen(false)}
                        sx={{ fontWeight: 900, borderRadius: 2 }}
                    >
                        Apply
                    </Button>
                </Box>
            </Drawer>

            {/* Profile Dialog (public view; contact gated) */}
            <Dialog
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 900 }}>
                    Candidate Profile
                </DialogTitle>
                <DialogContent dividers sx={{ bgcolor: '#0b1220', color: 'white' }}>
                    {activeCandidate ? (
                        <Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontWeight: 900 }}>
                                    {activeCandidate.firstName?.[0]}
                                    {activeCandidate.lastName?.[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 900, color: 'white' }}>
                                        {activeCandidate.firstName} {activeCandidate.lastName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Code sx={{ fontSize: 16 }} />
                                        {activeCandidate.experience ? `${activeCandidate.experience} Years Exp` : 'Candidate'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 800, mb: 1 }}>
                                Skills
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                {(activeCandidate.skills || '')
                                    .split(',')
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                                    .map((skill) => (
                                        <Chip
                                            key={skill}
                                            label={skill}
                                            size="small"
                                            sx={{
                                                bgcolor: alpha('#fff', 0.05),
                                                color: '#94a3b8',
                                                border: '1px solid',
                                                borderColor: alpha('#fff', 0.06),
                                            }}
                                        />
                                    ))}
                            </Box>

                            <Divider sx={{ borderColor: alpha('#fff', 0.08), my: 2 }} />

                            <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 800, mb: 1 }}>
                                Contact & Links
                            </Typography>

                            {canViewContact ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    <Typography variant="body2"><strong>Email:</strong> {activeCandidate.email || 'N/A'}</Typography>
                                    <Typography variant="body2"><strong>Phone:</strong> {activeCandidate.phone || 'N/A'}</Typography>
                                    <Typography variant="body2"><strong>LinkedIn:</strong> {activeCandidate.linkedinUrl || 'N/A'}</Typography>
                                    <Typography variant="body2"><strong>GitHub:</strong> {activeCandidate.githubUrl || 'N/A'}</Typography>
                                    <Typography variant="body2"><strong>Portfolio:</strong> {activeCandidate.portfolioUrl || 'N/A'}</Typography>
                                </Box>
                            ) : (
                                <Alert
                                    severity="info"
                                    sx={{
                                        bgcolor: alpha('#3b82f6', 0.12),
                                        color: '#93c5fd',
                                        border: '1px solid',
                                        borderColor: alpha('#3b82f6', 0.25),
                                        '& .MuiAlert-icon': { color: '#93c5fd' },
                                    }}
                                >
                                    Contact details are hidden for visitors. Log in as a recruiter to contact candidates.
                                </Alert>
                            )}
                        </Box>
                    ) : null}
                </DialogContent>
                <DialogActions sx={{ bgcolor: '#0b1220' }}>
                    <Button onClick={() => setProfileOpen(false)} sx={{ color: 'white' }}>
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleContact(activeCandidate)}
                        startIcon={canViewContact ? <LinkIcon /> : <Lock />}
                        sx={{ fontWeight: 900 }}
                    >
                        {canViewContact ? 'Contact' : 'Login to Contact'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={toast.open}
                autoHideDuration={3500}
                onClose={() => setToast((p) => ({ ...p, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setToast((p) => ({ ...p, open: false }))}
                    severity={toast.severity}
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
