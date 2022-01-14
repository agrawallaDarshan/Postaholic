import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/index";
import { useRouter } from "next/router";
import { Avatar } from "antd";

const Nav = () => {
  const [state, setState] = useContext(UserContext);
  const [currentLink, setCurrentLink] = useState("");
  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrentLink(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = () => {
    window.localStorage.removeItem("user_details");
    setState(null);
    router.push("/login");
  };

  return (
    <nav className="nav bg-dark justify-content-between">
      <Link href="/">
        <a className={`nav-link text-light my-1 ${currentLink === "/" && "active"}`} style={{
          "fontSize" : "1rem"
        }}>
          Home
        </a>
      </Link>

      {state === null ? (
        <>
          <Link href="/login">
            <a
              className={`nav-link text-light my-1 ${
                currentLink === "/login" && "active"
              }`}
              style={{
                "fontSize" : "1rem"
              }}
            >
              Login
            </a>
          </Link>

          <Link href="/register">
            <a
              className={`nav-link text-light my-1 ${
                currentLink === "/register" && "active"
              }`}
              style={{
                "fontSize" : "1rem"
              }}
            >
              Register
            </a>
          </Link>
        </>
      ) : (
        <div>
          <div className="btn btn-sm dropdown">
            <button
              className="btn btn-sm dropdown-toggle text-light"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Avatar src="https://joeschmoe.io/api/v1/random">
              </Avatar>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <Link href="/user/dashboard">
                  <a
                    className={`nav-link text-dark ${
                      currentLink === "/user/dashboard" &&
                      "text-white bg-primary"
                    }`}
                  >
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <a onClick={logout} className="nav-link text-dark">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
