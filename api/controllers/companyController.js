
import {Company} from "../models/Company.js"


// Create Company

export const createCompany = async (req, res) => {
  try {
    const ownerUserId = req.user;
    const {
      name,
      logo,
      description,
      industry,
      website,
      companySize,
      foundedYear,
      headquarters,
      locations,
      contactEmail,
      contactPhone,
    } = req.body;

    // Check if company already exists
    if (!name?.trim()) return res.status(400).json({ success: false, message: "Company name is required." });
    const existingCompany = await Company.findOne({ name: name.trim() });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company already exists",
      });
    }

    const company = await Company.create({
      ownerUserId,
      name: name.trim(),
      logo,
      description,
      industry,
      website,
      companySize,
      foundedYear,
      headquarters,
      locations,
      contactEmail,
      contactPhone,
    });

   res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (err) {
    console.error("Error in createCompany:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


// Get Company by ID
export const getCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company fetched successfully",
      company,
    });
  } catch (err) {
    console.error("Error in getCompany:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


// Update Company
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      logo,
      description,
      industry,
      website,
      companySize,
      foundedYear,
      headquarters,
      locations,
      contactEmail,
      contactPhone,
    } = req.body;

    const company = await Company.findOneAndUpdate(
      { _id: id, ownerUserId: req.user },
      {
        name,
        logo,
        description,
        industry,
        website,
        companySize,
        foundedYear,
        headquarters,
        locations,
        contactEmail,
        contactPhone,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

 res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company,
    });
  } catch (err) {
    console.error("Error in updateCompany:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


// Delete Company
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findOneAndDelete({ _id: id, ownerUserId: req.user });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

     res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      company
    });
  } catch (err) {
    console.error("Error in deleteCompany:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};






