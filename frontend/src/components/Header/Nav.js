import React, { useContext } from "react";
import { UserStateContext } from "../../context/Context";
import NavBar from "./NavBar";
import Sidebar from "./SideBar";
import { useHistory } from "react-router";
export default function Nav() {
  const { setSuccessed, successed, users, resetUser } =
    useContext(UserStateContext);
  const history = useHistory();

  const handleLogout = () => {
    localStorage.clear();
    resetUser();
    setSuccessed(false);
    history.push("/");
  };

  let buttons;
  if (successed) {
    buttons = (
      <div>
        <NavBar Logout={handleLogout} />
      </div>
    );
  } else {
    buttons = (
      <div className="flex flex-grow items-center">
        <ul className="flex flex-col lg:flex-row list-none ml-auto">
          <li className="nav-item">
            <a
              className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
              href="/login"
            >
              Login
            </a>
          </li>
          <li className="nav-item">
            <a
              className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
              href="/register"
            >
              Regist
            </a>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <nav className="fixed w-full flex flex-wrap items-center justify-between px-2 py-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
            <a
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
              href="/"
            >
              Home
            </a>
          </div>
        </div>
        <div>{buttons}</div>
        <div className="w-full mt-2 border-b-2 border-white"></div>
      </nav>
    </div>
  );
}
