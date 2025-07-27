const jwt  = require('jsonwebtoken')

const verifyAdmin  = (req,res,next) => {
    const token  = req.header('Authorization');

    if(!token){
        return res.status(401).json({message : "No token , Auth Denided by middle ware"})
    }

    try {
        const decoded  = jwt.verify(token , process.env.JWT_SECRET);

        req.user = decoded; 

        next();
    } catch (error) {
        res.status(400).json({message: "Invalid Token , middleware "})
    }
}

module.exports = verifyAdmin;