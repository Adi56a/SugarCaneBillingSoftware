const express = require('express')
const router  = express.Router()
const {registerFarmer , updateFarmerById, fetchAllFarmer , fetchFarmerById} = require('../controllers/farmerController')
const verifyAdmin = require('../middlewares/authMiddleware')




router.post('/register', verifyAdmin ,registerFarmer)

router.get('/all',fetchAllFarmer)
router.get('/:selectedFarmerId',fetchFarmerById)
router.put('/update/:farmerId', updateFarmerById)

module.exports = router;