const express = require('express');
const { addReport, listReports, updateReportStatus, reportSchema } = require('../controllers/reports.controller');

const router = express.Router();

// Apply middlewares inside route definition instead of wrapping controller
router.post('/', addReport);
router.get('/admin',  listReports);
router.patch('/admin/:id',  updateReportStatus);

module.exports = router;
