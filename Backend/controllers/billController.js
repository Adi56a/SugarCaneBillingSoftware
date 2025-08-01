const Bill  = require('../models/billModel')
const Farmer  = require('../models/farmerModel')


const createBill  = async (req,res) => {
    try {
        
        const {
      farmer_number, // This is the farmer's mobile number, which will be used to find the farmer
      farmer_name,
      driver_name,
      sugarcane_quality,
      vehicle_type,
      cutter,
      filled_vehicle_weight,
      empty_vehicle_weight,
      binding_material,
      only_sugarcane_weight,
      sugarcane_rate,
      given_money,
      remaining_money,
      payment_type
    } = req.body;

    const farmer  = await Farmer.findOne({farmer_number});

    if(!farmer){
        return res.status(404).json({
            message:"Farmer Not found with This number"
        });
    }

        const newBill = new Bill({
      farmer_id: farmer._id,  // The farmer's _id from the Farmer model
      farmer_name:farmer.farmer_name,
      farmer_number:farmer.farmer_number,
      driver_name,
      sugarcane_quality,
      vehicle_type,
      cutter,
      filled_vehicle_weight,
      empty_vehicle_weight,
      binding_material,
      only_sugarcane_weight,
      sugarcane_rate,
      given_money,
      remaining_money,
      payment_type
    });

    const savedBill = await newBill.save();

    await farmer.farmer_billhistory.push(savedBill._id);
    await farmer.save();


    res.status(201).json({
        message:"Bill Created Successfully and Liked to the Farmer",
        bill:savedBill
    });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Server error Please try again later",
            error:error.message
        })
    }
};

module.exports = {
    createBill
}