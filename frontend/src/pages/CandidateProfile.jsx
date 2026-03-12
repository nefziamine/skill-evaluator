import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    TextField,
    CircularProgress,
    Alert,
} from '@mui/material'
import Layout from '../components/Layout'
import api from '../services/api'

function CandidateProfile() {
    const { testId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        skills: '',
        experience: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: ''
    })

    useEffect(() => {
        const fetchExistingProfile = async () => {
            try {
                // Load current candidate profile (requires token from invite flow)
                const response = await api.get('/candidate/me');
                if (response.data) {
                    setFormData({
                        firstName: response.data.firstName || '',
                        lastName: response.data.lastName || '',
                        phone: response.data.phone || '',
                        skills: response.data.skills || '',
                        experience: response.data.experience || '',
                        linkedinUrl: response.data.linkedinUrl || '',
                        githubUrl: response.data.githubUrl || '',
                        portfolioUrl: response.data.portfolioUrl || ''
                    });
                }
            } catch (err) {
                console.log("No existing profile found or not logged in properly", err);
            }
        };
        fetchExistingProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.firstName || !formData.lastName) {
            setError('First and Last names are required')
            return
        }

        setLoading(true)
        setError('')

        try {
            console.log("Submitting profile data to candidate profile endpoint:", formData)
            const response = await api.put('/candidate/profile', formData)
            console.log("Profile update response:", response.data)
            // Navigate to the test session
            navigate(`/test/${testId}`)
        } catch (err) {
            console.error("Profile update error details:", err.response)
            const errorMsg = err.response?.data?.error || err.response?.data || err.message || 'Failed to update profile'
            setError(typeof errorMsg === 'string' ? errorMsg : 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Complete Your Profile
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Please provide your information before starting the assessment. This helps recruiters find you in the talent browser.
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                            <TextField
                                required
                                name="firstName"
                                label="First Name"
                                fullWidth
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                name="lastName"
                                label="Last Name"
                                fullWidth
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            <TextField
                                name="phone"
                                label="Phone Number"
                                fullWidth
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <TextField
                                name="experience"
                                label="Years of Experience"
                                fullWidth
                                type="number"
                                value={formData.experience}
                                onChange={handleChange}
                            />
                        </Box>

                        <TextField
                            name="skills"
                            label="Key Skills (comma separated)"
                            fullWidth
                            sx={{ mb: 3 }}
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="e.g. React, Java, Spring Boot, SQL"
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
                            <TextField
                                name="linkedinUrl"
                                label="LinkedIn URL"
                                fullWidth
                                value={formData.linkedinUrl}
                                onChange={handleChange}
                            />
                            <TextField
                                name="githubUrl"
                                label="GitHub URL"
                                fullWidth
                                value={formData.githubUrl}
                                onChange={handleChange}
                            />
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Save and Continue to Test'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Layout>
    )
}

export default CandidateProfile
