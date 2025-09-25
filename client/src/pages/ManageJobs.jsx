import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router";
import AppContext from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
const ManageJobs = () => {
  const navigate = useNavigate();
  const { backendurl, companyToken } = useContext(AppContext);

  const [jobs, setJobs] = useState(false);
  // function to fetch company jobsApplications
  const fetchCompany = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/company/list-jobs`, {
        headers: { token: companyToken },
      });

      if (data.success) {
        setJobs(data.jobsData.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to change visibility
  const changeVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendurl}/api/company/change-visibility`,
        { id },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchCompany();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (companyToken) {
      fetchCompany();
    }
  }, [companyToken]);
  return jobs ? (
    jobs.length === 0 ? (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl sm:text-2xl">No Jobs Available or Posted</p>
      </div>
    ) : (
      <div className="container mx:auto p-4 max-w-5xl">
        <div className="overflow-x-auto">
          <table className="min-w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm ">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="py-2 px-4 text-left max-sm:hidden">#</th>
                <th className="py-2 px-4 text-left">Job Title</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Date</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
                <th className="py-2 px-4 text-center">Applicants</th>
                <th className="py-2 px-4 text-center">Visible</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={index} className="text-gray-700">
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b ">{job.title}</td>
                  <td className="py-2 px-4 border-b  max-sm:hidden">
                    {moment(job.date).format("ll")}
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {job.location}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {job.applicants}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <input
                      className="scale-125 ml-4"
                      type="checkbox"
                      checked={job.visible}
                      onChange={() => changeVisibility(job._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => navigate("/dashboard/add-job")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add New Job
          </button>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ManageJobs;
