const express = require('express')
const router  = express.Router()
const {createBill , deleteBill} = require('../controllers/billController')



router.post('/create', createBill)
router.delete('/delete/:billId', deleteBill);



module.exports = router;