import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/auth-shared.css';

const Landing = () => {
    const navigate = useNavigate();

    // Check if user is already logged in and redirect to feed if so
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if authenticated as a regular user by hitting a protected route
                await axios.get("http://localhost:3000/api/food", { withCredentials: true });
                navigate("/feed"); 
            } catch (userError) {
                // Not authenticated, stay on landing page
            }
        };
        checkAuth();
    }, [navigate]);


    return (
        <div className="auth-page-wrapper">
            <div className="landing-content">
                
                {/* Main Header and Tagline */}
                <header className="landing-header">
                    <h1 className="landing-tagline">Food View: Discover & Serve</h1>
                    <p className="landing-subtitle">
                        Your central hub for finding and showcasing the most vibrant food videos online. 
                        <br />
                        Join the community today.
                    </p>
                </header>

                {/* Two Action Cards (Side-by-Side on Desktop) */}
                <div className="landing-cards-grid">
                    
                    {/* Card 1: Consumer User - Discover */}
                    <div className="landing-card" role="region" aria-labelledby="card-user-title">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-accent)'}}><path d="M14.5 10c-.8-1.5-2-2-3.5-2C8.5 8 7 9.5 7 12c0 2.5 1.5 4 3.5 4 1.5 0 2.7-.5 3.5-2"/><path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12s4.5 10 10 10 10-4.5 10-10z"/></svg>
                        
                        <h2 id="card-user-title" className="landing-card-title">Customer: Discover</h2>
                        
                        <p className="landing-card-desc">
                            Dive into an endless feed of food reels. Like, save, and connect 
                            with culinary partners based on your unique tastes and preferences.
                        </p>
                        
                        <Link to="/user/login" className="landing-card-button primary">
                            Start Discovery (User Sign In)
                        </Link>
                    </div>

                    {/* Card 2: Food Partner/Creator - Serve */}
                    <div className="landing-card" role="region" aria-labelledby="card-partner-title">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-accent)'}}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        
                        <h2 id="card-partner-title" className="landing-card-title">Partner: Showcase</h2>
                        
                        <p className="landing-card-desc">
                            Upload your short-form meal videos directly to a targeted community.
                            Expand your reach, build your brand, and attract new local customers.
                        </p>
                        
                        <Link to="/food-partner/login" className="landing-card-button secondary">
                            Publish Meals (Partner Sign In)
                        </Link>
                    </div>

                </div>

                {/* Bottom CTA for Registration */}
                <div className="landing-alt-action">
                    First time here? <Link to="/register">Create a new account</Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;
