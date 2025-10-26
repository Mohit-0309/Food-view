import React, { useState, useEffect } from 'react'
import '../../styles/profile.css'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const { id } = useParams()
    const [ profile, setProfile ] = useState(null)
    const [ videos, setVideos ] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch food partner profile data and their associated videos
        axios.get(`http://localhost:3000/api/foodpartner/${id}`, { withCredentials: true })
            .then(response => {
                const fetchedPartner = response.data.foodPartner;
                // Ensure we handle case where foodItems might be missing or null
                const fetchedVideos = fetchedPartner.foodItems || []; 

                // --- DEBUG LOGS: CHECK THESE IN YOUR BROWSER CONSOLE ---
                console.log("Fetched Profile Data:", fetchedPartner);
                console.log("Fetched Videos (foodItems):", fetchedVideos);
                // ------------------------------------------------------

                setProfile(fetchedPartner)
                setVideos(fetchedVideos)
            })
            .catch((error) => {
                console.error("Profile fetch failed:", error.response?.data);
                // Redirect to landing page on authentication failure (401)
                if (error.response?.status === 401) {
                    navigate("/");
                }
            })
    }, [ id, navigate ])


    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">

                    <img className="profile-avatar" src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D" alt="" />

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile?.address}
                        </p>
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total meals</span>
                        <span className="profile-stat-value">{profile?.totalMeals || 0}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed || 0}</span>
                    </div>
                </div>
            </section>

            <hr className="profile-sep" />
            
            {/* The main grid section for the videos/reels */}
            <section className="profile-grid" aria-label="Videos">
                {videos.length > 0 ? (
                    videos.map((v) => (
                        <div key={v._id || v.id} className="profile-grid-item">
                            {/* Video element to show the reel/video content */}
                            <video
                                className="profile-grid-video"
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                src={v.video} 
                                muted 
                            ></video>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '24px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--color-text-secondary)' }}>
                        No videos posted by this partner yet.
                    </div>
                )}
            </section>
        </main>
    )
}

export default Profile