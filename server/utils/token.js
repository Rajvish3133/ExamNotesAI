import jwt from "jsonwebtoken";

export const getToken = async (userId) => {
    try {  
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
        console.log(token); 
        return token;
    
    } catch (error) {
        console.log("Error generating token:", error);
        
    }
}