import { Link } from "react-router-dom";

const NavBar = ({ Logout }) => {
  return (
    <div className="lg:flex flex-grow items-center" id="example-navbar-warning">
      <ul className="flex flex-col lg:flex-row list-none ml-auto">
        <li className="nav-item">
          <a
            className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
            href="/profile"
          >
            내 정보
          </a>
        </li>
        <li className="nav-item">
          <a
            className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
            href="/quizSearch"
          >
            퀴즈 목록
          </a>
        </li>
        <li className="nav-item">
          <a
            className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
            href="/quizTitle"
          >
            퀴즈 생성
          </a>
        </li>
      </ul>

      <button onClick={Logout}>logout</button>
    </div>
  );
};

export default NavBar;
