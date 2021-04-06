import { useState, useEffect } from 'react';
import { SERVER_URL } from '../constants';

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    const loginUrl = `${SERVER_URL}/login`;
    const refreshUrl = `${SERVER_URL}/refresh`;

    const fetchData = async (url, data) => {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'same-origin', 
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify(data) 
        });
        return response.json();
    };
    
    useEffect(() => {
        fetchData(loginUrl, { code })
        .then(res => {
            const { accessToken, refreshToken, expiresIn } = res;
            setAccessToken(accessToken);
            setExpiresIn(expiresIn);
            setRefreshToken(refreshToken);
            window.history.pushState({}, null, '/');
        })
        .catch((err) =>{
            console.error(err);
            window.location = '/';
        });
        return () => {}
    }, [loginUrl, code]);

    useEffect(() => {
        if (!refreshToken || !expiresIn) return;
        const interval = setInterval(() =>{
            fetchData(refreshUrl, { refreshToken })
            .then(res => {
                const { accessToken, expiresIn } = res;
                setAccessToken(accessToken);
                setExpiresIn(expiresIn);
                window.history.pushState({}, null, '/');
            })
            .catch((err) => {
                console.error(err);
                window.location = '/';
            });
        }, (expiresIn - 60)*1000)
        return () => clearInterval(interval);
    }, [refreshUrl, refreshToken, expiresIn])

    return accessToken;
}
