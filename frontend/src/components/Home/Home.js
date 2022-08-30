import React, { useContext, useState } from "react";
import { UserStateContext } from "../../context/Context";
import { useHistory } from "react-router";
import Login from "../user/Login";
import Profile from "../user/Profile";
import About from "./About";
import Dev from "./Dev";
import Issue from "./Issue";
import Services from "./Services";

const Home = () => {
  const {
    resetUser,
    setSuccessed,
    homeAcount,
    setHomeAcount,
    successed,
    homeStatus,
    setHomeStatus,
  } = useContext(UserStateContext);
  const history = useHistory();

  const acountMenuToggle = () => {
    setHomeAcount(!homeAcount);
  };

  const handleLogout = () => {
    localStorage.clear();
    resetUser();
    setSuccessed(false);
    history.push("/");
  };

  const enterPin = () => {
    history.push("/enterPin");
  };

  console.log("homeStatus : ", homeStatus);

  return (
    <div className="w-full h-full justify-center flex items-center flex-col">
      <div className="w-full h-10per flex justify-around border-b-2 border-gray-200  ">
        <nav class="relative top-3 w-1/3 h-2/3 bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900 flex justify-center items-center">
          <div class="container flex flex-wrap justify-around items-center mx-auto">
            <a href="./" class="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                class="mr-3 h-6 sm:h-9"
                alt="Flowbite Logo"
              />
              <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Battle-Q
              </span>
            </a>

            <div class="hidden w-full md:block md:w-auto" id="navbar-default">
              <ul class="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <a
                    onClick={() =>
                      setHomeStatus({
                        ...homeStatus,
                        main: false,
                        about: true,
                        Services: false,
                        Dev: false,
                        Issue: false,
                      })
                    }
                    class="block text-lg py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent cursor-pointer font-bold"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    onClick={() =>
                      setHomeStatus({
                        ...homeStatus,
                        main: false,
                        about: false,
                        Services: true,
                        Dev: false,
                        Issue: false,
                      })
                    }
                    class="block py-2 text-lg pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent cursor-pointer font-bold"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    onClick={() =>
                      setHomeStatus({
                        ...homeStatus,
                        main: false,
                        about: false,
                        Services: false,
                        Dev: true,
                        Issue: false,
                      })
                    }
                    class="block py-2 text-lg pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent cursor-pointer font-bold"
                  >
                    Dev
                  </a>
                </li>
                <li>
                  <a
                    onClick={() =>
                      setHomeStatus({
                        ...homeStatus,
                        main: false,
                        about: false,
                        Services: false,
                        Dev: false,
                        Issue: true,
                      })
                    }
                    class="block py-2 text-lg pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent cursor-pointer font-bold"
                  >
                    Issue
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="relative top-3 w-72 h-2/3 flex justify-between">
          <button
            className="w-1/2 h-full text-xl bg-salmon rounded-lg"
            onClick={enterPin}
          >
            GAME PIN
          </button>
          {successed ? (
            <button className="w-1/2 h-full" onClick={handleLogout}>
              {" "}
              Logout
            </button>
          ) : (
            <button className="w-1/2 h-full" onClick={acountMenuToggle}>
              {" "}
              Login
            </button>
          )}
        </div>
      </div>

      {/* 홈 가운데  */}
      <div className="w-full h-90per">
        {homeStatus.main === true && (
          <img className="w-full h-90per object-cover" src="homeWall.jpg" />
        )}
        {homeStatus.about === true && <About />}
        {homeStatus.Services === true && <Services />}
        {homeStatus.Dev === true && <Dev />}
        {homeStatus.Issue === true && <Issue />}
      </div>

      {/* 홈 아래 공백 */}
      <div className="w-full h-10per"></div>
      {homeAcount && <Login />}
    </div>
  );
};

export default Home;
