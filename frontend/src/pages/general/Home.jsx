import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [ videos, setVideos ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true); 
    const [ error, setError ] = useState(null); 
    const navigate = useNavigate();

    async function handleUserLogout() {
        try {
            await axios.get("http://localhost:3000/api/auth/user/logout", { withCredentials: true });
            navigate("/");
        } catch (logoutError) {
            console.error("Logout failed:", logoutError);
            navigate("/");
        }
    }

    useEffect(() => {
        setIsLoading(true); 
        setError(null);
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {
                console.log("Videos fetched successfully:", response.data);
                setVideos(response.data.foodItems)
            })
            .catch((fetchError) => { 
                const errorMessage = fetchError.response?.data?.message || fetchError.message;
                console.error("Video fetch or Auth check failed:", errorMessage);
                
                if (fetchError.response?.status === 401) {
                    navigate("/"); 
                } else {
                    setError("Failed to load content. Check network or server status.");
                }
            })
            .finally(() => {
                setIsLoading(false); 
            });
    }, [navigate])


    async function likeVideo(item) {
        try {
            const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, {withCredentials: true})
            if(response.data.like){
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: (v.likeCount || 0) + 1 } : v))
            }else{
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: (v.likeCount || 0) - 1 } : v))
            }
        } catch (e) {
             console.error("Like failed:", e);
        }
    }

    async function saveVideo(item) {
        try {
            const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
            if(response.data.save){
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: (v.savesCount || 0) + 1 } : v))
            }else{
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: (v.savesCount || 0) - 1 } : v))
            }
        } catch (e) {
            console.error("Save failed:", e);
        }
    }

    // New style ensures the loading/error message is visible and centered within the constrained area
    const statusStyle = {
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--color-text-secondary)',
        textAlign: 'center'
    };

    if (isLoading || error) {
        return (
            <div className="reels-page">
                {/* Rely entirely on .reels-page (flex-center) and .reels-feed (max-width) to center content */}
                <div className="reels-feed">
                    <div style={statusStyle}>
                        {isLoading && <p>Loading food reels...</p>}
                        {error && 
                            <>
                                <p style={{color: 'var(--color-danger)'}}>Error: {error}</p>
                                <button 
                                    onClick={() => window.location.reload()} 
                                    style={{
                                        marginTop: '20px', 
                                        padding: '10px 20px', 
                                        backgroundColor: 'var(--color-accent)', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer'
                                    }}>
                                    Try Reloading
                                </button>
                            </>
                        }
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="reels-page">
            <button 
                onClick={handleUserLogout} 
                className="btn-ghost danger"
                style={{
                    position: 'fixed', 
                    top: '10px',
                    right: '10px',
                    zIndex: 100,
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                Logout
            </button>

            <ReelFeed
                items={videos}
                onLike={likeVideo}
                onSave={saveVideo}
                emptyMessage={videos.length === 0 ? "No food videos posted yet. Time to explore!" : "No videos available."}
            />
        </div>
    )
}

export default Home
