import * as yup from 'yup';

export const createShopSchema = yup.object({
  name: yup
    .string()
    .required('Shop name is required')
    .min(2, 'Shop name must be at least 2 characters')
    .max(50, 'Shop name must not exceed 50 characters'),
  
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  
  address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters'),
  
  city: yup
    .string()
    .required('City is required'),
  
  location: yup.object({
    latitude: yup
      .number()
      .required('Latitude is required')
      .min(-90, 'Invalid latitude')
      .max(90, 'Invalid latitude'),
    longitude: yup
      .number()
      .required('Longitude is required')
      .min(-180, 'Invalid longitude')
      .max(180, 'Invalid longitude')
  }),
  
  contact: yup
    .string()
    .required('Contact number is required')
    .matches(/^\+?[\d\s-]+$/, 'Please enter a valid contact number'),
  
  category: yup
    .string()
    .required('Category is required')
});

export const createItemSchema = yup.object({
  name: yup
    .string()
    .required('Item name is required')
    .min(2, 'Item name must be at least 2 characters')
    .max(50, 'Item name must not exceed 50 characters'),
  
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be greater than zero'),
  
  category: yup
    .string()
    .required('Category is required'),
  
  stock: yup
    .number()
    .min(0, 'Stock cannot be negative')
    .integer('Stock must be a whole number')
});

export const createOrderSchema = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        itemId: yup.string().required('Item ID is required'),
        quantity: yup
          .number()
          .required('Quantity is required')
          .positive('Quantity must be greater than zero')
          .integer('Quantity must be a whole number')
      })
    )
    .required('Order must contain at least one item')
    .min(1, 'Order must contain at least one item'),
  
  deliveryAddress: yup
    .string()
    .required('Delivery address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters'),
  
  deliveryLocation: yup.object({
    latitude: yup
      .number()
      .required('Latitude is required')
      .min(-90, 'Invalid latitude')
      .max(90, 'Invalid latitude'),
    longitude: yup
      .number()
      .required('Longitude is required')
      .min(-180, 'Invalid longitude')
      .max(180, 'Invalid longitude')
  }),
  
  contactNumber: yup
    .string()
    .required('Contact number is required')
    .matches(/^\+?[\d\s-]+$/, 'Please enter a valid contact number'),
  
  paymentMethod: yup
    .string()
    .required('Payment method is required')
    .oneOf(['cash', 'card', 'upi'], 'Invalid payment method')
});