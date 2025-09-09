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

const router = express.Router();

// Register a company
router.post("/register", upload.single("image"), registerCompany);

//Company Login
router.get("/login", loginCompany);

//Company Data
router.get("/company", getCompanyData);

//Post a job
router.post("/post-job", postJob);

//Get applicants
router.get("/applicants", getCompanyJobApplicants);

//Get company post job list
router.get("/list-jobs", getCompanyPostedJobs);

//Change appliucation status
router.post("/change-status", changeApllicationJobStatus);

//change job visibility
router.post("/change-visibility", changeJobVisibility);

export default router;
