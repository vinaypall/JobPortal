import React, { useState } from "react";
import { useParams } from "react-router";
import { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";
import Loading from "../components/Loading";
import NavBar from "../components/NavBar";
import { assets } from "../assets/assets";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
const ApplyJob = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const { jobs, backendurl } = useContext(AppContext);
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id, jobs]);

  return jobData ? (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="w-20 h-20 bg-white rounded-lg p-4 mr-4 max-md:mb-4 "
                src={jobData.companyId.image}
                alt=""
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl md:text-3xl font-med">
                  {jobData.title}
                </h1>
                <div className="flex flex-row max-md:justify-center flex-wrap gap-y-2 gap-6 items-center text-grey-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {jobData.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {jobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {jobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button className="bg-blue-600 p-2.5 px-10 text-white rounded">
                Apply Now
              </button>
              <p className="mt-1 text-grey-600">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-Bold mb-4">Job Description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              ></div>
              <button className="bg-blue-600 p-2.5 px-10 text-white rounded mt-10">
                Apply Now
              </button>
            </div>
            {/* Right section mor jobs */}
            <div className="w-full md:w-1/3 mt-8 md:mt-0 lg:mt-8 space-y-5">
              <h2>More Jobs from {jobData?.companyId?.name}</h2>
              {jobs
                ?.filter(
                  (job) =>
                    job._id !== jobData?._id &&
                    job.companyId?._id === jobData?.companyId?._id
                )
                .filter((job) => true)
                .slice(0, 4)
                .map((job, index) => (
                  <JobCard job={job} key={index} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
