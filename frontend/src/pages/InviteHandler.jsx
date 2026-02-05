import { useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'

function InviteHandler() {
    const { token } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const testId = searchParams.get('testId')

    useEffect(() => {
        if (token) {
            // Store the token and set the role
            localStorage.setItem('token', token)
            localStorage.setItem('userRole', 'CANDIDATE')

            if (testId) {
                navigate(`/test/${testId}`)
            } else {
                navigate('/')
            }
        }
    }, [token, testId, navigate])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: '#0f172a' }}>
            <CircularProgress sx={{ mb: 3 }} />
            <Typography variant="h6" color="white">Preparing your assessment...</Typography>
        </Box>
    )
}

export default InviteHandler
