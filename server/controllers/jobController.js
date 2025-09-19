import Job from "../models/job.js";

// get all job
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true }).populate({
      path: "companyId",
      select: "-password",
    });
    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//get a single job by id
// get a single job by id
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobs = await Job.findById(id).populate({
      path: "companyId",
      select: "-password",
    });

    if (!jobs) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
