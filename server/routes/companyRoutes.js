import express from "express";
import {
  changeApllicationJobStatus,
  changeJobVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
} from "../controllers/companyController.js";
import upload from "../config/multer.js";
import { protectCompany } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register a company
router.post("/register", upload.single("image"), registerCompany);

//Company Login
router.post("/login", loginCompany);

//Post a job

router.post("/post-job", protectCompany, postJob);

//Company Data
router.get("/company", protectCompany, getCompanyData);

//Get applicants
router.get("/applicants", protectCompany, getCompanyJobApplicants);

//Get company post job list
router.get("/list-jobs", protectCompany, getCompanyPostedJobs);

//Change appliucation status
router.post("/change-status", protectCompany, changeApllicationJobStatus);

//change job visibility
router.post("/change-visibility", protectCompany, changeJobVisibility);

export default router;
