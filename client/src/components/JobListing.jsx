import React from "react";
import AppContext from "../context/AppContext";
import { useContext, useState, useEffect } from "react";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } =
    useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]); // corrected variable name

  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const handledCategory = (category) => (e) => {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handledLocation = (location) => (e) => {
    setSelectedLocation((prev) =>
      prev.includes(location)
        ? prev.filter((item) => item !== location)
        : [...prev, location]
    );
  };
  useEffect(() => {
    const matchCategory = (job) =>
      selectedCategory.length === 0 || selectedCategory.includes(job.category);
    const matchLocation = (job) =>
      selectedLocation.length === 0 || selectedLocation.includes(job.location);
    const matchesTitle = (job) =>
      searchFilter.title === "" ||
      job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
    const matchesLocation = (job) =>
      searchFilter.location === "" ||
      job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const filtered = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchCategory(job) &&
          matchLocation(job) &&
          matchesTitle(job) &&
          matchesLocation(job)
      );
    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, selectedCategory, selectedLocation, searchFilter]);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Side Bar */}
      <div className="w-full lg:w-1/4 bg-white px-4">
        {(searchFilter.title !== "" || searchFilter.location !== "") && (
          <>
            <h3 className="font-medium text-lg mb-4">Current Search</h3>
            <div className="mb-4 text-grey-600">
              {searchFilter.title && (
                <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded">
                  {searchFilter.title}
                  <img
                    onClick={(e) => {
                      setSearchFilter((prev) => ({ ...prev, title: "" }));
                    }}
                    className="curson-pointer"
                    src={assets.cross_icon}
                    alt=""
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className="ml-4 inline-flex items-center gap-2.5 bg-red-50 border border-red-50 px-4 py-1.5 rounded">
                  {searchFilter.location}
                  <img
                    onClick={(e) => {
                      setSearchFilter((prev) => ({ ...prev, location: "" }));
                    }}
                    className="curson-pointer"
                    src={assets.cross_icon}
                    alt=""
                  />
                </span>
              )}
            </div>
          </>
        )}
        <button
          onClick={(e) => {
            setShowFilter((prev) => !prev);
          }}
          className="px-6 py-1.5 rounded border border-grey-400 lg:hidden"
        >
          {showFilter ? "Hide Filter" : "Show Filter"}
        </button>
        {/* Category filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search by Category</h4>
          <ul className="space-y-4 text-grey-600">
            {JobCategories.map((category, index) => (
              <li className="flex items-center gap-3" key={index}>
                <input
                  className="scale-125"
                  type="checkbox"
                  onChange={handledCategory(category)}
                  checked={selectedCategory.includes(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Job Location */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4 pt-14">Search by Location</h4>
          <ul className="space-y-4 text-grey-600">
            {JobLocations.map((location, index) => (
              <li className="flex items-center gap-3" key={index}>
                <input
                  className="scale-125"
                  type="checkbox"
                  onChange={handledLocation(location)}
                  checked={selectedLocation.includes(location)} // corrected variable name
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Job Listing */}
      <section className="w-full lg:w-3/4 text-grey-100 max-lg:px-4">
        <h3 className="font-medium text-3 py-2" id="job-list">
          Latest Job
        </h3>
        <p className="mb-8">Get your desired job from top companies</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs
            .slice((currentPage - 1) * 6, currentPage * 6)
            .map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
        </div>
        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="flex items-center gap-4 mt-10 space-x-2 justify-center">
            <a href="#job-list">
              {" "}
              <img
                onClick={(e) => setCurrentPage(Math.max(currentPage - 1, 1))}
                src={assets.left_arrow_icon}
                alt=""
              />
            </a>
            {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map(
              (_, index) => (
                <a key={index} className="text-grey-600 " href="#job-list">
                  {" "}
                  <button
                    onClick={(e) => setCurrentPage(index + 1)}
                    className={`w-10 h-10 flex items-center justify-center border border-grey-300 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "text-grey-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                </a>
              )
            )}
            <a href="#job-list">
              {" "}
              <img
                onClick={(e) =>
                  setCurrentPage(
                    Math.min(
                      currentPage + 1,
                      Math.ceil(filteredJobs.length / 6)
                    )
                  )
                }
                src={assets.right_arrow_icon}
                alt=""
              />
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
