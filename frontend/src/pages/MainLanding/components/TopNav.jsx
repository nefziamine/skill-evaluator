import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, useTheme, useScrollTrigger, Menu, MenuItem, alpha } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { VerifiedUser, KeyboardArrowDown } from '@mui/icons-material';

function ScrollElevation({ children }) {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
        sx: {
            backgroundColor: trigger ? 'rgba(30, 41, 59, 0.9)' : 'transparent',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease',
            borderBottom: trigger ? 1 : 0,
            borderColor: 'rgba(255,255,255,0.05)'
        }
    });
}

export default function TopNav() {
    const theme = useTheme();
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleRecruiterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <ScrollElevation>
            <AppBar position="fixed" color="transparent" elevation={0}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ height: 80 }}>
                        {/* Logo */}
                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                flexGrow: 1
                            }}
                        >
                            <VerifiedUser sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
                                Skill Evaluator
                            </Typography>
                        </Box>

                        {/* Desktop Links */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center', mr: 2 }}>
                            <Button
                                component={Link}
                                to="/tests"
                                sx={{ 
                                    color: 'text.secondary', 
                                    fontWeight: 700, 
                                    px: 2,
                                    textTransform: 'none', 
                                    letterSpacing: '-0.01em',
                                    fontSize: '0.95rem',
                                    '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) } 
                                }}
                            >
                                Tests
                            </Button>
                            <Button
                                component={Link}
                                to="/ai-advanced"
                                sx={{ 
                                    color: 'text.secondary', 
                                    fontWeight: 700, 
                                    px: 2,
                                    textTransform: 'none', 
                                    letterSpacing: '-0.01em',
                                    fontSize: '0.95rem',
                                    '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) } 
                                }}
                            >
                                AI Advanced
                            </Button>
                            <Button
                                component={Link}
                                to="/jobs"
                                sx={{ 
                                    color: 'text.secondary', 
                                    fontWeight: 700, 
                                    px: 2,
                                    textTransform: 'none', 
                                    letterSpacing: '-0.01em',
                                    fontSize: '0.95rem',
                                    '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) } 
                                }}
                            >
                                Jobs board
                            </Button>
                            <Button
                                onClick={handleRecruiterClick}
                                endIcon={<KeyboardArrowDown />}
                                sx={{ 
                                    color: 'text.secondary', 
                                    fontWeight: 700, 
                                    px: 2,
                                    textTransform: 'none', 
                                    letterSpacing: '-0.01em',
                                    fontSize: '0.95rem',
                                    '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) } 
                                }}
                            >
                                Hire
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                disableScrollLock={true}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                PaperProps={{
                                    sx: {
                                        bgcolor: '#0f172a',
                                        color: 'white',
                                        border: '1px solid',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: 3,
                                        mt: 1.5,
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                        '& .MuiMenuItem-root': { px: 3, py: 1.5, fontWeight: 600, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }
                                    }
                                }}
                            >
                                <MenuItem onClick={handleClose} component={Link} to="/talent">Browse Talent</MenuItem>
                                <MenuItem onClick={handleClose} component={Link} to="/post-job">Post a Job</MenuItem>
                                <MenuItem onClick={handleClose} component={Link} to="/enterprise">Enterprise</MenuItem>
                            </Menu>
                            <Button
                                component={Link}
                                to="/how-it-works"
                                sx={{ 
                                    color: 'text.secondary', 
                                    fontWeight: 700, 
                                    px: 2,
                                    textTransform: 'none', 
                                    letterSpacing: '-0.01em',
                                    fontSize: '0.95rem',
                                    '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) } 
                                }}
                            >
                                How it works
                            </Button>
                        </Box>

                        {/* Auth Buttons */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                            {isLoggedIn ? (
                                <Button
                                    component={Link}
                                    to={role === 'ADMIN' ? '/admin/dashboard' : role === 'RECRUITER' ? '/recruiter/dashboard' : '/tests'}
                                    variant="contained"
                                    sx={{ borderRadius: 50, px: 3, fontWeight: 700 }}
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        variant="text"
                                        sx={{ fontWeight: 600, color: 'text.primary', textTransform: 'none' }}
                                    >
                                        Log in
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/register"
                                        variant="contained"
                                        sx={{
                                            borderRadius: 50,
                                            px: 3,
                                            fontWeight: 700,
                                            textTransform: 'none',
                                            boxShadow: `0 8px 20px -4px ${theme.palette.primary.main}80`
                                        }}
                                    >
                                        Sign up
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </ScrollElevation>
    );
}
