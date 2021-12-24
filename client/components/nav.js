import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/index";
import { useRouter } from "next/router";

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
    <nav className="nav bg-dark justify-content-center">
      <Link href="/">
        <a
          className={`nav-link text-light ${currentLink === "/" && "active"}`}
        >
          Home
        </a>
      </Link>

      {state === null ? (
        <>
          <Link href="/login">
            <a
              className={`nav-link text-light ${
                currentLink === "/login" && "active"
              }`}
            >
              Login
            </a>
          </Link>

          <Link href="/register">
            <a
              className={`nav-link text-light ${
                currentLink === "/register" && "active"
              }`}
            >
              Register
            </a>
          </Link>
        </>
      ) : (
        <>
          <Link href="/user/dashboard">
            <a
              className={`nav-link text-light ${
                currentLink === "/user/dashboard" && "active"
              }`}
            >
              {state && state.user && state.user.name}
            </a>
          </Link>

          <a onClick={logout} className="nav-link text-light">
            Logout
          </a>
        </>
      )}
    </nav>
  );
};

export default Nav;
