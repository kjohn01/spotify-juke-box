import { useState, useEffect } from 'react';

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    const url = 'http://localhost:3001/login';
    const fetchData = async (url, code) => {
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
            body: JSON.stringify({ code }) 
        });
        return response.json();
    };
    
    useEffect(() => {
        fetchData(url, code)
        .then(res => {
            // console.log(res);
            const { accessToken, refreshToken, expiresIn } = res;
            setAccessToken(accessToken);
            setExpiresIn(expiresIn);
            setRefreshToken(refreshToken);
            window.history.pushState({}, null, '/');
        })
        .catch((err) =>{
            window.location = '/';
        });
        return () => {}
    }, [code]);

    return accessToken;
}
