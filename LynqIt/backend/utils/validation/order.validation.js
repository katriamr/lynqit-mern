const { body } = require('express-validator');

const createOrderValidation = [
  body('items')
    .isArray()
    .withMessage('Items must be an array')
    .notEmpty()
    .withMessage('Order must contain at least one item'),
  
  body('items.*.itemId')
    .trim()
    .notEmpty()
    .withMessage('Item ID is required')
    .isMongoId()
    .withMessage('Invalid Item ID'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('shopId')
    .trim()
    .notEmpty()
    .withMessage('Shop ID is required')
    .isMongoId()
    .withMessage('Invalid Shop ID'),
  
  body('deliveryAddress')
    .trim()
    .notEmpty()
    .withMessage('Delivery address is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Delivery address must be between 5 and 200 characters'),
  
  body('deliveryLocation')
    .isObject()
    .withMessage('Delivery location must be an object')
    .custom((value) => {
      if (!value.latitude || !value.longitude) {
        throw new Error('Location must include latitude and longitude');
      }
      if (typeof value.latitude !== 'number' || typeof value.longitude !== 'number') {
        throw new Error('Latitude and longitude must be numbers');
      }
      return true;
    }),
  
  body('contactNumber')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required')
    .matches(/^\+?[\d\s-]+$/)
    .withMessage('Please provide a valid contact number'),
  
  body('paymentMethod')
    .trim()
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['cash', 'card', 'upi'])
    .withMessage('Invalid payment method')
];

const updateOrderStatusValidation = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'accepted', 'preparing', 'ready', 'picked', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

const assignDeliveryValidation = [
  body('deliveryBoyId')
    .trim()
    .notEmpty()
    .withMessage('Delivery boy ID is required')
    .isMongoId()
    .withMessage('Invalid delivery boy ID')
];

module.exports = {
  createOrderValidation,
  updateOrderStatusValidation,
  assignDeliveryValidation
};