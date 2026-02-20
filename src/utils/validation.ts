import * as yup from 'yup';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const referralCodeRegex = /^[a-zA-Z0-9_-]+$/;

export const locationSchema = yup.object().shape({
  business_name: yup
    .string()
    .required('Business name is required')
    .min(2, 'Business name must be at least 2 characters')
    .default(''),
  contact_number: yup
    .string()
    .required('Contact number is required')
    .matches(phoneRegex, 'Invalid phone number format')
    .default(''),
  address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .default(''),
  city: yup
    .string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters')
    .default(''),
  country: yup
    .string()
    .required('Country is required')
    .default(''),
  referral_code: yup
    .string()
    .optional()
    .matches(referralCodeRegex, 'Referral code must be alphanumeric and up to 20 characters')
    .max(20, 'Referral code must not exceed 20 characters')
    .default(undefined),
  latitude: yup
    .string()
    .required('Latitude is required')
    .default(''),
  longitude: yup
    .string()
    .required('Longitude is required')
    .default(''),
});

export const productSchema = yup.object().shape({
  name: yup
    .string()
    .required('Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .default(''),
  barcode: yup
    .string()
    .required('Barcode is required')
    .min(3, 'Barcode must be at least 3 characters')
    .default(''),
  size: yup
    .string()
    .required('Size is required')
    .default(''),
  image: yup
    .mixed()
    .nullable()
    .default(null),
});

// This is the correct way to get the type directly from the schema
export type ILocationPayload = yup.InferType<typeof locationSchema>;
export type IProductPayload = yup.InferType<typeof productSchema>;