const express = require('express')
const router = express.Router()
const item = require('../controllers/item')
const auth = require('../controllers/auth')
const {isLogin} = require('../middlewares/auth')

router.post('/login', auth.login)

router.get('/items', isLogin, item.getAllItems)
router.post('/items', isLogin, item.createItem)
router.put('/items/:id', isLogin, item.updateItem)
router.delete('/items/:id', isLogin, item.deleteItem)

module.exports = router