const express = require('express');
const authorize = require('../middlewares/authorize');
const cartController = require('../controllers/cart.controller');

const router = express.Router();

router.use(authorize);

router.delete('/delete-item/:productId', cartController.deleteItem)


router.patch('/increase-one/:productId', cartController.increaseOne);

router.patch('/decrease-one/:productId', cartController.decreaseOne);

router.delete('/', cartController.deleteCart)
router.post('/', cartController.addItemToCart);

router.get('/', cartController.getCart);

module.exports = router; 