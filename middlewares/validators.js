import { body } from "express-validator"
import { validateErrors, validateErrorsWithoutFiles } from "./validate.errors.js"
import { 
    existCategoryName, 
    existCategoryNameU, 
    existEmail, existProductName, 
    existUsername, 
    isValidCategoryId, 
    isValidPrice, 
    isValidStock,
    notRequiredField 
} from "../utils/db.validators.js"


export const registerValidator = [
    body('name', 'Name is required')
        .notEmpty(),
    body('surname', 'Surname is required')
        .notEmpty(),
    body('username', 'Username is required')
        .notEmpty()
        .toLowerCase(),
    body('email', 'Email is required')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('Password should be strong')
        .isLength({min: 8})
        .withMessage('Password needs at least 8 characters'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must include at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must include at least one uppercase letter')
        .matches(/\d/).withMessage('Password must include at least one digit'), 
    body('phone', 'Phone is required')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]

export const updateUserValidator = [
    body('username')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('email')
        .optional()
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('password')
        .optional()
        .notEmpty()
        .custom(notRequiredField),
    body('role')
        .optional()
        .notEmpty()
        .custom(notRequiredField),
    validateErrorsWithoutFiles 
]

export const updatePasswordValidator = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isStrongPassword()
        .withMessage('New password must be strong')
        .isLength({ min: 8 })
        .withMessage('New password requires at least 8 characters')
        .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
        .matches(/\d/).withMessage('New password must include at least one number'),
    validateErrors 
]

export const userUpdate = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('username')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('email')
        .optional()
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    validateErrorsWithoutFiles 
]

export const productValidator = [
    body('name', 'Product name is required')
        .notEmpty()
        .custom(existProductName), 
    body('description', 'Product description is required')
        .notEmpty()
        .isLength({ min: 8 }).withMessage('Description should be at least 8 characters long')
        .isLength({ max: 100 }).withMessage('Description should be no more than 100 characters'),
    body('price', 'Product price is required')
        .notEmpty()
        .isNumeric().withMessage('Price should be a numeric value')
        .custom(isValidPrice),
    body('stock', 'Product stock is required')
        .notEmpty()
        .isNumeric().withMessage('Stock must be a numeric value')
        .custom(isValidStock), 
    body('category', 'Category ID is required')
        .notEmpty()
        .custom(isValidCategoryId), 
    validateErrors 
]

export const updateProductValidator = [
    body('name')
        .optional() 
        .notEmpty().withMessage('Product name is required')
        .custom(existProductName),
    body('description')
        .optional() 
        .notEmpty().withMessage('Product description is required')
        .isLength({ min: 8 }).withMessage('Description should be at least 8 characters')
        .isLength({ max: 100 }).withMessage('Description should be no more than 100 characters'),
    body('price')
        .optional() 
        .isNumeric().withMessage('Price should be numeric')
        .custom(isValidPrice),
    body('stock')
        .optional() 
        .isNumeric().withMessage('Stock should be a number')
        .custom(isValidStock),
    body('category')
        .optional() 
        .custom(isValidCategoryId),
    validateErrors
]

export const categoryValidator = [
    body('name', 'Category name is required')
        .notEmpty()
        .custom(existCategoryName),
    body('description', 'Category description is required')
        .notEmpty()
        .isLength({ min: 5 }).withMessage('Description should be at least 5 characters long')
        .isLength({ max: 100 }).withMessage('Description should be no more than 100 characters'),
    validateErrors
]

export const updateCategoryValidator = [
    body('name')
        .optional()
        .notEmpty().withMessage('Category name is required')
        .custom(existCategoryNameU),
    body('description')
        .optional()
        .notEmpty().withMessage('Category description is required')
        .isLength({ min: 5 }).withMessage('Description should be at least 5 characters')
        .isLength({ max: 100 }).withMessage('Description should be no more than 100 characters'),
    validateErrors
]
