import React from "react";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/user/logout`, {
        method: "GET",
        credentials: "include", // ensures cookies are cleared
      });
  
      // Remove JWT if stored locally
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
  
      // Hard redirect to login
      window.location.href = "/user/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>My Profile</h2>
      <button
        onClick={handleLogout}
        style={{
          background: "#FF4C4C",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default UserProfile;






// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function UserProfile() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   // Fetch user details when profile page loads
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch("http://localhost:3000/user/me", {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
//           },
//         });

//         if (res.ok) {
//           const data = await res.json();
//           setUser(data);
//         } else {
//           console.error("Failed to fetch user details");
//         }
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await fetch("http://localhost:3000/user/logout", {
//         method: "GET",
//         credentials: "include",
//       });

//       localStorage.removeItem("token");
//       sessionStorage.removeItem("token");

//       window.location.href = "/user/login";
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   if (!user) {
//     return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading profile...</p>;
//   }

//   return (
//     <div style={styles.container}>
//       {/* Profile Card */}
//       <div style={styles.card}>
//         {/* Avatar */}
//         <div style={styles.avatar}>
//           {user.name?.charAt(0).toUpperCase()}
//         </div>

//         {/* User Info */}
//         <h2 style={styles.name}>{user.name}</h2>
//         <p style={styles.email}>{user.email}</p>

//         {/* Divider */}
//         <hr style={styles.divider} />

//         {/* Logout Button */}
//         <button onClick={handleLogout} style={styles.logoutBtn}>
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     padding: "2rem",
//   },
//   card: {
//     background: "#fff",
//     padding: "2rem",
//     borderRadius: "16px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//     width: "100%",
//     maxWidth: "400px",
//     textAlign: "center",
//   },
//   avatar: {
//     width: "80px",
//     height: "80px",
//     borderRadius: "50%",
//     background: "#4CAF50",
//     color: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "28px",
//     fontWeight: "bold",
//     margin: "0 auto 1rem",
//   },
//   name: {
//     margin: "0.5rem 0",
//     fontSize: "22px",
//     fontWeight: "600",
//   },
//   email: {
//     margin: "0.2rem 0",
//     color: "#555",
//   },
//   divider: {
//     margin: "1.5rem 0",
//     border: "none",
//     borderTop: "1px solid #ddd",
//   },
//   logoutBtn: {
//     background: "#FF4C4C",
//     color: "white",
//     padding: "12px 20px",
//     border: "none",
//     borderRadius: "10px",
//     fontSize: "16px",
//     cursor: "pointer",
//     width: "100%",
//   },
// };

// export default UserProfile;
