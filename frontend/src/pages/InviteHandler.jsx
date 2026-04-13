import { useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import api from '../services/api'

function InviteHandler() {
    const { token } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const testId = searchParams.get('testId')

    useEffect(() => {
        const handleInviteToken = async () => {
            if (token) {
                const existingToken = localStorage.getItem('token')
                const existingRole = localStorage.getItem('userRole')
                
                // Check if user is already authenticated as recruiter or admin
                if (existingToken && existingRole && (existingRole === 'RECRUITER' || existingRole === 'ADMIN')) {
                    try {
                        // Verify existing token is still valid
                        await api.get('/auth/me')
                        
                        // If token is valid and user is recruiter/admin, don't overwrite
                        // Instead, open the test in a new context or show a message
                        if (testId) {
                            // Navigate to test preview instead of taking over session
                            navigate(`/recruiter/tests/${testId}/preview`)
                        } else {
                            navigate('/recruiter/dashboard')
                        }
                        return
                    } catch (error) {
                        // Existing token is invalid, proceed with invite token
                        console.log('Existing token invalid, proceeding with invite token')
                    }
                }
                
                // For new candidates or invalid existing tokens, proceed with invite token
                localStorage.setItem('token', token)
                localStorage.setItem('userRole', 'CANDIDATE')

                try {
                    // Check if candidate needs to set up password
                    const response = await api.get('/auth/me')
                    const user = response.data
                    
                    // Check if password is still the default "invited" (backend will handle this check)
                    // For now, redirect to password setup page for all candidates
                    navigate(`/candidate/setup?token=${token}${testId ? `&testId=${testId}` : ''}`)
                } catch (error) {
                    // If we can't validate the user, still proceed to setup
                    navigate(`/candidate/setup?token=${token}${testId ? `&testId=${testId}` : ''}`)
                }
            }
        }
        
        handleInviteToken()
    }, [token, testId, navigate])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: '#020617' }}>
            <CircularProgress sx={{ mb: 3 }} />
            <Typography variant="h6" color="white">Preparing your assessment...</Typography>
        </Box>
    )
}

export default InviteHandler
