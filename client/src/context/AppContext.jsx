import { createContext, use } from "react";
import { useState, useEffect } from "react";
import { jobsData } from "../assets/assets";
const AppContext = createContext();
export const AppContextProvider = (props) => {
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [jobs, setJobs] = useState([]);

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  // function to fetch job data
  const fetchJobs = async () => {
    setJobs(jobsData);
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  const [isSearched, setIsSearched] = useState(false);
  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContext;
