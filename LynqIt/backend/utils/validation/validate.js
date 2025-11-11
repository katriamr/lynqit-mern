import { validationResult } from 'express-validator'
import { ValidationError } from '../errors/AppError.js'

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    const validationError = new ValidationError('Validation Failed')
    errors.array().forEach(err => {
      validationError.addError(err.param, err.msg)
    })

    next(validationError)
  }
}

export default validate
