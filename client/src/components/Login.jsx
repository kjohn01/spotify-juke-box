// import React from 'react';
import { CLIENT_ID, REDIRECT_URI } from '../constants';
import { Container, Button } from 'react-bootstrap';

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`

export default function Login() {
    return (
        <Container className="d-flex justify-content-center align-items-center" 
        style={{ minHeight: '100vh' }}>
            <Button variant="success" size="lg" href={AUTH_URL}>
                Login with Spotify
            </Button>
        </Container>
    )
}
