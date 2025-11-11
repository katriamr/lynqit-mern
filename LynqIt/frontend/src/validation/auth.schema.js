import * as yup from 'yup';

export const signupSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter'),
  
  role: yup
    .string()
    .oneOf(['user', 'owner', 'delivery'], 'Invalid role selected')
});

export const signinSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  
  password: yup
    .string()
    .required('Password is required')
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email')
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter'),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});