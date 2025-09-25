import React, { useContext, useEffect, useState } from "react";
import { assets, viewApplicationsPageData } from "../assets/assets";
import AppContext from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ViewApplication = () => {
  const { backendurl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState([]);
  // funtion to fetch company job application

  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/company/applicants`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        setApplicants(data.applicants.reverse());
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to upadte job application
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendurl}/api/company/change-status`,
        { id, status },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        fetchCompanyJobApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications();
    }
  }, [companyToken]);

  return applicants ? (
    applicants.length === 0 ? (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl sm:text-2xl">
          No Application Available or Posted
        </p>
      </div>
    ) : (
      <div className="container mx:auto p-4">
        <div>
          <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm ">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">User Name</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
                <th className="py-2 px-4 text-left">Resume</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants
                .filter((item) => item.jobId && item.userId)
                .map((applicants, index) => (
                  <tr key={index} className="text-gray-700">
                    <td className="py-2 px-4 border-b text-center">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border-b text-center flex">
                      <img
                        className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                        src={applicants.userId.image}
                        alt=""
                      />
                      <span>{applicants.userId.name}</span>
                    </td>
                    <td className="py-2 px-4 border-b max-sm:hidden">
                      {applicants.jobId.title}
                    </td>
                    <td className="py-2 px-4 border-b max-sm:hidden">
                      {applicants.jobId.location}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <a
                        className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 ites-center"
                        href={applicants.userId.resume}
                        target="blank"
                      >
                        Resume <img src={assets.resume_download_icon} alt="" />
                      </a>
                    </td>
                    <td className="py-2 px-4 border-b relative group">
                      {applicants.status === "pending" ? (
                        <div className="relative inline-block text-left">
                          <button className="text-gray-500 action-button">
                            ...
                          </button>
                          <div className="z-10 hidden absolute right-0 md:left-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg group-hover:block">
                            <button
                              onClick={() =>
                                changeJobApplicationStatus(
                                  applicants._id,
                                  "Accepted"
                                )
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-gray-100"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                changeJobApplicationStatus(
                                  applicants._id,
                                  "Rejected"
                                )
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>{applicants.status}</div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ViewApplication;
