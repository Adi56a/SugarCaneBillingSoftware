const express = require('express')
const router  = express.Router()
const {createBill} = require('../controllers/billController')



router.post('/create', createBill)


module.exports = router;