// const userModel = require('../models/user.model');
// const  foodPartnerModel = require('../models/foodpartner.model');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// async function registerUser(req, res) {

//     const { fullName, email, password} = req.body;

//     const isUserAlreadyExists = await userModel.findOne({ 
//         email 
//     });

//     if (isUserAlreadyExists) {
//         return res.status(400).json({ 
//             message: 'User already exists' 
//         });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     const user = await userModel.create({
//         fullName,
//         email,
//         password: hashedPassword,

//     });
    

//     const token = jwt.sign({
//         id:user._id, 
//     },process.env.JWT_SECRET);

//     res.cookie("token", token);

//     res.status(201).json({
//         message: 'User registered successfully',
//         user:{
//             _id: user._id,
//             fullName: user.fullName,
//             email: user.email,
//         }
//     });

// }

// async function loginUser(req, res) {
//     //login user
//     const { email, password } = req.body;

//     const user = await userModel.findOne({ email });

//     if(!user){
//         return res.status(400).json({ 
//             message: 'Invalid email or password' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if(!isPasswordValid){
//         return res.status(400).json({ 
//             message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({
//         id: user._id,
//     }, process.env.JWT_SECRET);

//     // res.cookie("token", token);
//     res.cookie("token", token, {
//         httpOnly: true,
//         secure: false, // Set to true in production with HTTPS
//         sameSite: "lax", // Use 'none' if using different domains and HTTPS
//         path: "/",
//         maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
//       });

//     res.status(200).json({
//         message: 'User logged in successfully',
//         user: {
//             _id: user._id,
//             fullName: user.fullName,
//             email: user.email,
//         }
//     });
// }

// // async function logoutUser(req, res) {
// //     res.clearCookie("token");
// //     res.status(200).json({
// //         message: 'User logged out successfully',
// //     });
// // }

// async function logoutUser(req, res) {
//     res.clearCookie("token", {
//         httpOnly: true,
//         secure: true,   // set to true in production with HTTPS
//         sameSite: "strict"
//     });
//     res.status(200).json({ message: "User logged out successfully" });
// }



// async function registerFoodPartner(req, res){

//     const { name, email, password, phone, address, contactName } = req.body;

//     const isAccountAlreadyExists = await foodPartnerModel.findOne({
//         email 
//     });

//     if (isAccountAlreadyExists) {
//         return res.status(400).json({ 
//             message: 'Food partner account already exists' 
//         });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const foodPartner = await foodPartnerModel.create({
//         name,
//         email,
//         password: hashedPassword,
//         phone,
//         address,
//         contactName,
//     });

//     const token = jwt.sign({
//         id: foodPartner._id, 
//     },process.env.JWT_SECRET);

//     res.cookie("token", token);

//     res.status(201).json({
//         message: 'Food partner registered successfully',
//         foodPartner:{
//             _id: foodPartner._id,
//             name: foodPartner.name,
//             email: foodPartner.email,
//             address: foodPartner.address,
//             phone: foodPartner.phone,
//             contactName: foodPartner.contactName,
//         }
//     });



// }

// async function loginFoodPartner(req, res) { 

//     const { email, password } = req.body;   

//     const foodPartner = await foodPartnerModel.findOne({ email });

//     if(!foodPartner){
//         return res.status(400).json({ 
//             message: 'Invalid email or password' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

//     if(!isPasswordValid){
//         return res.status(400).json({ 
//             message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({
//         id: foodPartner._id,
//     }, process.env.JWT_SECRET);

//     res.cookie("token", token);

//     res.status(200).json({
//         message: 'Food partner logged in successfully',
//         foodPartner: {
//             _id: foodPartner._id,
//             name: foodPartner.name,
//             email: foodPartner.email,
//         }
//     });
// }

// async function logoutFoodPartner(req, res) {
//     res.clearCookie("token");
//     res.status(200).json({
//         message: 'Food partner logged out successfully',
//     });
// }

// // Placeholder for Google Login
// function googleUserLogin(req, res) {
//     // In a real application, this would handle the Google OAuth callback.
//     res.status(501).json({
//         message: "Google User Login is not yet implemented."
//     });
// }

// // Placeholder for Google Food Partner Login
// function googleFoodPartnerLogin(req, res) {
//     // In a real application, this would handle the Google OAuth callback.
//     res.status(501).json({
//         message: "Google Food Partner Login is not yet implemented."
//     });
// }





// module.exports = {
//     registerUser,
//     loginUser,
//     logoutUser,
//     registerFoodPartner,
//     loginFoodPartner,
//     logoutFoodPartner,
//     googleFoodPartnerLogin,
//     googleUserLogin
// };  




const userModel = require("../models/user.model")
const foodPartnerModel = require("../models/foodpartner.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// 1. Import Google Auth Library
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* --- Standard Auth Functions (Kept for completeness) --- */

async function registerUser(req, res) {
    const { fullName, email, password } = req.body;
    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ fullName, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token,
        {
            httpOnly: true,
            secure: true,      // Required for SameSite: 'none'
            sameSite: 'none',  // Required for cross-domain (Vercel to Render)
            partitioned: true, // Helps with modern Chrome privacy rules
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        }
    );
    res.status(201).json({ message: "User registered successfully", user: { _id: user._id, email: user.email, fullName: user.fullName } });
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token,
        {
            httpOnly: true,
            secure: true,      // Required for SameSite: 'none'
            sameSite: 'none',  // Required for cross-domain (Vercel to Render)
            partitioned: true, // Helps with modern Chrome privacy rules
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        }
    );
    res.status(200).json({ message: "User logged in successfully", user: { _id: user._id, email: user.email, fullName: user.fullName } });
}

function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
}

async function registerFoodPartner(req, res) {
    const { name, email, password, phone, address, contactName } = req.body;
    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });
    if (isAccountAlreadyExists) {
        return res.status(400).json({ message: "Food partner account already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const foodPartner = await foodPartnerModel.create({ name, email, password: hashedPassword, phone, address, contactName });
    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);
    res.cookie("token", token,
        {
            httpOnly: true,
            secure: true,      // Required for SameSite: 'none'
            sameSite: 'none',  // Required for cross-domain (Vercel to Render)
            partitioned: true, // Helps with modern Chrome privacy rules
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        }
    );
    res.status(201).json({ message: "Food partner registered successfully", foodPartner: { _id: foodPartner._id, email: foodPartner.email, name: foodPartner.name, address: foodPartner.address, contactName: foodPartner.contactName, phone: foodPartner.phone } });
}

async function loginFoodPartner(req, res) {
    const { email, password } = req.body;
    const foodPartner = await foodPartnerModel.findOne({ email });
    if (!foodPartner) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);
    res.cookie("token", token,
        {
            httpOnly: true,
            secure: true,      // Required for SameSite: 'none'
            sameSite: 'none',  // Required for cross-domain (Vercel to Render)
            partitioned: true, // Helps with modern Chrome privacy rules
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        }
    );
    res.status(200).json({ message: "Food partner logged in successfully", foodPartner: { _id: foodPartner._id, email: foodPartner.email, name: foodPartner.name } });
}

function logoutFoodPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Food partner logged out successfully" });
}

/* --- Google Auth Implementation --- */

async function verifyGoogleTokenAndLogin(idToken, model, isPartner = false) {
    if (!idToken) throw new Error("Google ID Token is missing.");

    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const fullName = payload.name;

    let user = await model.findOne({ email });

    if (!user) {
        // New user/partner: register them with basic info
        if (isPartner) {
             // For partners, we require more fields in the model. 
             // Since Google only gives name/email, we set placeholders and 
             // they might need to update this after first login.
            user = await model.create({
                name: fullName,
                email: email,
                contactName: fullName,
                phone: 'N/A',
                address: 'N/A',
                password: 'SOCIAL_LOGIN_PLACEHOLDER' // Must satisfy 'required' in model
            });
        } else {
            user = await model.create({
                fullName: fullName,
                email: email,
                password: 'SOCIAL_LOGIN_PLACEHOLDER' 
            });
        }
        
    }
    
    // Issue application's JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return token;
}

async function googleUserLogin(req, res) {
    try {
        const token = await verifyGoogleTokenAndLogin(req.body.idToken, userModel, false);
        res.cookie("token", token,
            {
                httpOnly: true,
                secure: true,      // Required for SameSite: 'none'
                sameSite: 'none',  // Required for cross-domain (Vercel to Render)
                partitioned: true, // Helps with modern Chrome privacy rules
                maxAge: 24 * 60 * 60 * 1000,
                path: '/'
            }
        );
        res.status(200).json({ message: "User logged in successfully with Google." });
    } catch (error) {
        console.error("Google User login failed:", error);
        return res.status(401).json({ message: "Google Sign-In failed." });
    }
}

async function googleFoodPartnerLogin(req, res) {
    try {
        const token = await verifyGoogleTokenAndLogin(req.body.idToken, foodPartnerModel, true);
        res.cookie("token", token,
            {
                httpOnly: true,
                secure: true,      // Required for SameSite: 'none'
                sameSite: 'none',  // Required for cross-domain (Vercel to Render)
                partitioned: true, // Helps with modern Chrome privacy rules
                maxAge: 24 * 60 * 60 * 1000,
                path: '/'
            }
        );
        res.status(200).json({ message: "Food Partner logged in successfully with Google." });
    } catch (error) {
        console.error("Google Partner login failed:", error);
        return res.status(401).json({ message: "Google Sign-In failed." });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
    googleUserLogin,
    googleFoodPartnerLogin 
}