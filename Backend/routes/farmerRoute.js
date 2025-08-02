const express = require('express')
const router  = express.Router()
const {registerFarmer , fetchAllFarmer , fetchFarmerById} = require('../controllers/farmerController')
const verifyAdmin = require('../middlewares/authMiddleware')




router.post('/register', verifyAdmin ,registerFarmer)

router.get('/all',fetchAllFarmer)
router.get('/:selectedFarmerId',fetchFarmerById)

module.exports = router;