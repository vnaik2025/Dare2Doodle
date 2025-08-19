const {
  createReport,
  getReports,
  updateReport
} = require('../services/appwrite.service');
const z = require('zod');

// Validation schema
const reportSchema = z.object({
  targetType: z.enum(['challenge', 'comment', 'user']),
  targetId: z.string(),
  reason: z.string().min(10)
});

// Create report (controller only handles business logic)
const addReport = async (req, res) => {
  try {
    const data = {
      ...req.body,
      // reporterId: req.user.id, 68a2ec5300050ad5dd84
      reporterId:"68a2ec5300050ad5dd84",

      status: 'open',
      createdAt: new Date().toISOString()
    };

    const newReport = await createReport(data);
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create report' });
  }
};

// List reports (admin only)
const listReports = async (req, res) => {
  try {
    const reports = await getReports();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

// Update report status (admin only)
const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await updateReport(id, { status });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update report' });
  }
};

module.exports = { addReport, listReports, updateReportStatus, reportSchema };
