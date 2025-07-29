const express = require('express')
const router  = express.Router()
const {registerFarmer} = require('../controllers/farmerController')
const verifyAdmin = require('../middlewares/authMiddleware')


router.post('/register', verifyAdmin ,registerFarmer)

module.exports = router;