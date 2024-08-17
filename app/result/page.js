"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography, Button, Box } from '@mui/material';

export default function ResultPage() {
    const [status, setStatus] = useState('loading');
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            fetch(`/api/checkout_sessions?session_id=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    setStatus(data.status);
                })
                .catch(err => {
                    console.error('Error fetching session:', err);
                    setStatus('error');
                });
        }
    }, [sessionId]);

    if (status === 'loading') {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {status === 'complete' ? (
                    <>
                        <Typography variant="h4" gutterBottom>Thank you for your purchase!</Typography>
                        <Typography variant="body1" paragraph>
                            Your subscription has been successfully processed.
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography variant="h4" gutterBottom>Oops! Something went wrong.</Typography>
                        <Typography variant="body1" paragraph>
                            Could not process your subscription. Please try again.
                        </Typography>
                    </>
                )}
                <Button variant="contained" color="primary" onClick={() => router.push('/')}>
                    Return to Home
                </Button>
            </Box>
        </Container>
    );
}
