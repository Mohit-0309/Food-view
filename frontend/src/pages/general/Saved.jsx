import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'
import { useNavigate } from 'react-router-dom';

const Saved = () => {
    const [ videos, setVideos ] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/api/food/save", { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods.map((item) => ({
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount,
                    savesCount: item.food.savesCount,
                    commentsCount: item.food.commentsCount,
                    foodPartner: item.food.foodPartner,
                }))
                setVideos(savedFoods)
            })
            .catch((error) => { 
                console.error("Auth check failed:", error.response?.data);
                if (error.response?.status === 401) {
                    navigate("/"); // Redirect to landing page on authentication failure
                }
            })
    }, [navigate])

    const removeSaved = async (item) => {
        try {
            const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
            // Check the message to ensure it was unsaved before updating the UI
            if(response.data.message.includes("unsaved")){
                // Remove the item from the local state list to update the UI
                setVideos((prev) => prev.filter((v) => v._id !== item._id))
            }
        } catch {
            // noop
        }
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
        />
    )
}

export default Saved