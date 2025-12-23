import React, { useEffect } from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodPartnerLogin = () => {

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Function called by Google SDK upon successful login (for partners)
  const handleCredentialResponse = async (response) => {
    try {
        const res = await axios.post(`${API_URL}http://localhost:3000/api/auth/google/food-partner`, {
            idToken: response.credential
        }, { withCredentials: true });
    
        console.log("Google Partner Login Success:", res.data);
        navigate("/create-food"); // Redirect to partner page
    } catch (error) {
        console.error("Google Partner login failed:", error.response?.data?.message || "An error occurred");
        alert("Google Partner Login failed. See console for details.");
    }
  };


  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('Missing VITE_GOOGLE_CLIENT_ID in env');
      return;
    }

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID, // replaces YOUR_GOOGLE_CLIENT_ID
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
        const response = await axios.post(`${API_URL}/api/auth/food-partner/login`, {
          email,
          password
        }, { withCredentials: true });
    
        console.log(response.data);
        navigate("/create-food"); // Redirect to create food page after login
    } catch (error) {
        console.error("Standard Partner Login failed:", error.response?.data?.message || "An error occurred");
        alert(error.response?.data?.message || "Login failed.");
    }
  };


  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        <header>
          <h1 id="partner-login-title" className="auth-title">Partner login</h1>
          <p className="auth-subtitle">Access your dashboard and manage orders.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            {/* START FIX: Correctly structured input wrapper for icon embedding */}
            <div className="input-with-icon">
                <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" />
                <span className="input-icon" aria-hidden="true">
                    {/* Mail icon SVG */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
            </div>
            {/* END FIX */}
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            {/* START FIX: Correctly structured input wrapper for icon embedding */}
            <div className="input-with-icon">
                <input id="password" name="password" type="password" placeholder="Password" autoComplete="current-password" />
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
            <div id="google-partner-button" style={{marginTop: '15px'}} />
        </div>
        
        <div className="auth-alt-action">
          New partner? <a href="/food-partner/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
