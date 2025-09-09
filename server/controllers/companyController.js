import Company from "../models/company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";

//regiter a company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;
  if (!name || !email || !imageFile || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const companyExist = await Company.findOne({ email });
    if (companyExist) {
      return res.json({
        success: false,
        message: "Company Already registered",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const uploadImage = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: uploadImage.secure_url,
    });
    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

//login a company
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.findOne({ email });
    if (bcrypt.compare(password, company.password)) {
      res.json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company._id),
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error });
  }
};

//Company Data
export const getCompanyData = async (req, res) => {
  res.send("Company data");
};

//Post a new job
export const postJob = async (req, res) => {};

//Get all jobs applicants
export const getCompanyJobApplicants = async (req, res) => {};

//Get company post date jobs
export const getCompanyPostedJobs = async (req, res) => {};

//change job application status
export const changeApllicationJobStatus = async (req, res) => {};

//change job visibility
export const changeJobVisibility = async (req, res) => {};
