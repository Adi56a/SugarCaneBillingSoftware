const Farmer = require('../models/farmerModel')

const registerFarmer = async (req,res) => {
    
    try{
        const {farmer_name , farmer_number} = req.body;

        if(!farmer_name || !farmer_number){
            return res.status(400).json({message:"Farmer name and number both are required"})
        }
          
        const existingFarmer = await Farmer.findOne({farmer_number});
        if(existingFarmer){
            return res.status(400).json({message:"Farmer with this number already exist"})
        }

        const newFarmer = new Farmer({
            farmer_name,
            farmer_number
        })

        const savedFarmer  = await newFarmer.save();

        res.status(201).json({
            message:"Farmer registered successfully",
            farmer : savedFarmer
        });

    }catch(error){
        console.error('Error registering Farmer',error);
        res.status(500).json({message:"Server Error , Could not register farmer"})
    }
};

module.exports = {registerFarmer}