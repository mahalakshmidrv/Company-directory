const Company = require('../models/Company');
const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getDashboardStats
} = require('../utils/companyDataStore');

exports.addCompany = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      companyName: req.body.companyName?.trim(),
      location: req.body.location?.trim(),
      industry: req.body.industry?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      website: req.body.website?.trim(),
      contactNumber: req.body.contactNumber?.trim()
    };

    const savedCompany = await createCompany(payload, req.app);
    res.status(201).json({
      message: 'Company added successfully',
      company: savedCompany
    });
  } catch (error) {
    res.status(400).json({
      message: 'Unable to add company',
      error: error.message
    });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const { search, industry } = req.query;
    const filters = {};

    if (search) {
      filters.companyName = { $regex: search, $options: 'i' };
    }

    if (industry) {
      filters.industry = industry;
    }

    const companies = await getCompanies(filters, req.app);
    res.json(companies);
  } catch (error) {
    res.status(500).json({
      message: 'Unable to fetch companies',
      error: error.message
    });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await getCompanyById(req.params.id, req.app);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(400).json({
      message: 'Invalid company ID',
      error: error.message
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      companyName: req.body.companyName?.trim(),
      location: req.body.location?.trim(),
      industry: req.body.industry?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      website: req.body.website?.trim(),
      contactNumber: req.body.contactNumber?.trim()
    };

    const company = await updateCompany(req.params.id, payload, req.app);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({
      message: 'Company updated successfully',
      company
    });
  } catch (error) {
    res.status(400).json({
      message: 'Unable to update company',
      error: error.message
    });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await deleteCompany(req.params.id, req.app);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(400).json({
      message: 'Unable to delete company',
      error: error.message
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStats(req.app);

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: 'Unable to calculate dashboard statistics',
      error: error.message
    });
  }
};
