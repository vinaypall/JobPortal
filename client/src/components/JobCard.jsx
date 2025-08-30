import React from "react";
import { assets } from "../assets/assets";

import { useNavigate } from "react-router";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div className=" p-6 shadow rounded">
      <div className="flex justify-between  items-center">
        <img src={assets.company_icon} alt="" />
      </div>
      <h4 className="font-medium text-xl mt-2">{job.title}</h4>
      <div className="flex items-center gap-3 mt-3 text-xs">
        <span className="bg-blue-50 border-blue-200 px-4 py-1.5 rounded">
          {job.location}
        </span>
        <span className="bg-red-50 border-red-200 px-4 py-1.5 rounded">
          {job.level}
        </span>
      </div>
      <p
        className="text-grey-500 text-sm mt-4"
        dangerouslySetInnerHTML={{
          __html: job?.description ? job.description.slice(0, 150) : "",
        }}
      ></p>
      <div className="flex items-center gap-3 mt-3 text-xs">
        <button
          onClick={() => navigate(`/apply-job/${job._id}`)}
          className="bg-blue-600 text-white px-4 sm:px-9 py-2 rounded mt-4 cursor-pointer"
        >
          Apply Now
        </button>
        <button
          onClick={() => navigate(`/apply-job/${job._id}`, scrollTo(0, 0))}
          className="text-grey-500 border mt-4 border-grey-500 px-4 sm:px-9 py-2 rounded cursor-pointer"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;
