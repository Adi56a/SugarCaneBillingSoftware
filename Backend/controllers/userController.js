const User = require('../models/userModel')

const userController = async (req,res) => {
    try {
        const {name , mobile} = req.body; 

        const newUser  = await User.create({name,mobile});
        res.status(201).json({message:"user Create",newUser})
    } catch (error) {
        res.status(500).json("Server Error",error)
    }
}

module.exports = {userController};