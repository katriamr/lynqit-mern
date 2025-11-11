const { body } = require('express-validator');

const createShopValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Shop name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Shop name must be between 2 and 50 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('location')
    .isObject()
    .withMessage('Location must be an object')
    .custom((value) => {
      if (!value.latitude || !value.longitude) {
        throw new Error('Location must include latitude and longitude');
      }
      if (typeof value.latitude !== 'number' || typeof value.longitude !== 'number') {
        throw new Error('Latitude and longitude must be numbers');
      }
      return true;
    }),
  
  body('contact')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required')
    .matches(/^\+?[\d\s-]+$/)
    .withMessage('Please provide a valid contact number'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
];

const updateShopValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Shop name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  
  body('city')
    .optional()
    .trim(),
  
  body('location')
    .optional()
    .isObject()
    .withMessage('Location must be an object')
    .custom((value) => {
      if (!value.latitude || !value.longitude) {
        throw new Error('Location must include latitude and longitude');
      }
      if (typeof value.latitude !== 'number' || typeof value.longitude !== 'number') {
        throw new Error('Latitude and longitude must be numbers');
      }
      return true;
    }),
  
  body('contact')
    .optional()
    .trim()
    .matches(/^\+?[\d\s-]+$/)
    .withMessage('Please provide a valid contact number')
];

module.exports = {
  createShopValidation,
  updateShopValidation
};