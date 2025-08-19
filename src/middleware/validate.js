// src/middleware/validate.js
const validate = (schema) => {
  return (req, res, next) => {
    try {
      // parse request body with schema
      const parsed = schema.parse(req.body);
      req.body = parsed; // replace with validated + sanitized data
      next();
    } catch (err) {
      if (err.errors) {
        return res.status(400).json({
          error: 'Validation failed',
          details: err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      next(err);
    }
  };
};

module.exports = validate;
