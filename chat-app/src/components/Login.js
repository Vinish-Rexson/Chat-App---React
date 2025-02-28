import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const user = {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
      sub: decoded.sub // Google's unique identifier
    };
    
    // Store user info in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    // Navigate to rooms
    navigate('/rooms', { state: { username: user.name } });
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome to Chat App</h1>
        <p>Sign in with Google to continue</p>
        
        <div className="google-login-button">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
          />
        </div>
      </div>
    </div>
  );
}

export default Login; 