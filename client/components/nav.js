import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/index";
import { useRouter } from "next/router";
import { Avatar } from "antd";

const Nav = () => {
  const [state, setState] = useContext(UserContext);
  const [currentLink, setCurrentLink] = useState("");
  const [color, setColor] = useState("");
  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrentLink(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = () => {
    window.localStorage.removeItem("user_details");
    setState(null);
    router.push("/login");
  };

  useEffect(() => {
    const color = JSON.parse(window.localStorage.getItem("background_color"))
      ? JSON.parse(window.localStorage.getItem("background_color"))
      : "white";

    if (state && state.user) {
      if (color === "white") {
        window &&
          window.document.documentElement.style.setProperty(
            "--nav-bar-color",
            "#f0f0f2"
          );
        window &&
          window.document.documentElement.style.setProperty(
            "--nav-text-color",
            "black"
          );
      } else {
        window &&
          window.document.documentElement.style.setProperty(
            "--nav-bar-color",
            "#121212"
          );
        window &&
          window.document.documentElement.style.setProperty(
            "--nav-text-color",
            "white"
          );
      }
    } else {
      window.document.documentElement.style.setProperty(
        "--nav-bar-color",
        "#f0f0f2"
      );
      window &&
        window.document.documentElement.style.setProperty(
          "--nav-text-color",
          "black"
        );
    }
  });

  return (
    <>
      <nav className="nav justify-content-between">
        <Link href="/">
          <a
            className={`nav-link my-1 nav_a ${
              currentLink === "/" && "active_a"
            }`}
            style={{
              fontSize: "1rem",
              margin: "0",
            }}
          >
            Home
          </a>
        </Link>

        {state === null ? (
          <>
            <Link href="/login">
              <a
                className={`nav-link my-1 nav_a ${
                  currentLink === "/login" && "active_a"
                }`}
                style={{
                  fontSize: "1rem",
                }}
              >
                Login
              </a>
            </Link>

            <Link href="/register">
              <a
                className={`nav-link nav_a my-1 ${
                  currentLink === "/register" && "active_a"
                }`}
                style={{
                  fontSize: "1rem",
                }}
              >
                Register
              </a>
            </Link>
          </>
        ) : (
          <div className="d-flex justify-space-between">
            <div
              className="my-2 mx-1 p-1"
              style={{
                fontSize: "1rem",
              }}
            >
              <Link href="/user/dashboard" className="nav_a">
                <a
                  className={`my-1 ${
                    currentLink === "/user/dashboard" && "active_a"
                  }`}
                  style={{
                    fontSize: "1rem",
                  }}
                >
                  {state && state.user && state.user.username}
                </a>
              </Link>
            </div>
            <div className="btn btn-sm dropdown">
              <button
                className="btn btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Avatar
                  src={
                    state && state.user && state.user.image
                      ? `${state.user.image.url}`
                      : `https://joeschmoe.io/api/v1/random`
                  }
                ></Avatar>
              </button>
              <ul
                className="dropdown-menu bg"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <Link href="/user/dashboard">
                    <a
                      className={`nav-link ${
                        currentLink === "/user/dashboard" &&
                        "text-white bg-primary"
                      }`}
                    >
                      Dashboard
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/user/profile/profile_update">
                    <a
                      className={`nav-link ${
                        currentLink === "/user/profile/profile_update" &&
                        "bg-primary text-light"
                      }`}
                    >
                      Profile
                    </a>
                  </Link>
                </li>
                <li>
                  <a onClick={logout} className="nav-link">
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Nav;
