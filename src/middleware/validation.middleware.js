const z = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Validation error', fieldErrors: error.errors });
  }
};

module.exports = validate;