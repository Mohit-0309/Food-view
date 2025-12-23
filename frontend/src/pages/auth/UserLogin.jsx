import React, { useEffect } from 'react';
import '../../styles/auth-shared.css';
import '../../styles/reels.css'; // Added import for reels.css
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Function called by Google SDK upon successful login
  const handleCredentialResponse = async (response) => {
    try {
        // IMPORTANT: Replace with your actual GOOGLE_CLIENT_ID or dynamically load it
        const res = await axios.post(`${API_URL}/api/auth/user/login`, {
            idToken: response.credential
        }, { withCredentials: true });
    
        console.log("Google Login Success:", res.data);
        navigate("/feed"); // Redirect to the feed page
    } catch (error) {
        console.error("Google login failed:", error.response?.data?.message || "An error occurred");
        alert("Google Login failed. See console for details.");
    }
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('Missing VITE_GOOGLE_CLIENT_ID in env');
      return;
    }

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, [GOOGLE_CLIENT_ID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        const response = await axios.post("http://localhost:3000/api/auth/user/login", {
          email,
          password
        }, { withCredentials: true });
    
        console.log(response.data);
        navigate("/feed"); // Redirect to the new feed page after login
    } catch (error) {
        console.error("Standard Login failed:", error.response?.data?.message || "An error occurred");
        alert(error.response?.data?.message || "Login failed.");
    }
  };


  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="user-login-title">
        <header>
          <h1 id="user-login-title" className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your food journey.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            {/* START FIX: Wrap input field with icon */}
            <div className="input-with-icon">
                <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
                <span className="input-icon" aria-hidden="true">
                    {/* Mail icon SVG */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
            </div>
            {/* END FIX */}
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            {/* START FIX: Wrap input field with icon */}
            <div className="input-with-icon">
                <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
                <span className="input-icon" aria-hidden="true">
                    {/* Lock icon SVG */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
            </div>
            {/* END FIX */}
          </div>
          <button className="auth-submit" type="submit">Sign In</button>
        </form>
        
        {/* Google Sign-In button container - centered */}
        <div style={{display:'flex', justifyContent: 'center', margin: '16px 0 0 0', padding: '1px 0', borderTop: '1px solid var(--color-border)'}}>
            <div id="google-user-button" style={{marginTop: '15px'}} />
        </div>
        
        <div className="auth-alt-action">
          New here? <a href="/user/register">Create account</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
