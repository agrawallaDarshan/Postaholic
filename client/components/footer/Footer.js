import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import Link from "next/link";
import {
  SearchOutlined,
  PlusCircleOutlined,
  HomeFilled,
} from "@ant-design/icons";

import { BsMoonFill, BsFillSunFill } from "react-icons/bs";

const Footer = ({ showDrawer }) => {
  const [bgColor, setBgColor] = useState();

  useEffect(() => {
    setBgColor(JSON.parse(window.localStorage.getItem("background_color")));
    let bgcolor = bgColor === "black" ? "black" : "white";
    let txtcolor = bgColor === "black" ? "white" : "black";
    window &&
      window.document.documentElement.style.setProperty(
        "--dark-background-color",
        bgcolor
      );
    window &&
      window.document.documentElement.style.setProperty(
        "--light-text-color",
        txtcolor
      );
  });

  return (
    <>
      {/* {console.log("Intially", bgColor, bgColor === " white")} */}
      <hr></hr>
      <div className="footer row bg">
        <div className="col-4 text-center">
          <div className="d-flex justify-content-center">
            <Link href="/">
              <a className="bg">
                <Tooltip placement="top" title="Home">
                  <HomeFilled
                    className="p-1"
                    style={{
                      fontSize: "1.5rem",
                    }}
                  />
                </Tooltip>
              </a>
            </Link>
          </div>
        </div>
        <div className="col-4 text-center">
          <div className="d-flex justify-content-center">
            <Tooltip placement="top" title="Add post" color="black">
              <PlusCircleOutlined
                className="p-1"
                style={{
                  fontSize: "1.5rem",
                }}
                onClick={showDrawer}
              />
            </Tooltip>
          </div>
        </div>
        {/* <div className="col-3 text-center">
          <div className="d-flex justify-content-center">
            <Tooltip placement="top" title="Search">
              <SearchOutlined
                className="p-1"
                style={{
                  fontSize: "1.5rem",
                }}
              />
            </Tooltip>
          </div>
        </div> */}
        <div className="col-4 text-center">
          <div className="d-flex justify-content-center">
            {bgColor === "white" ? (
              <Tooltip placement="top" title="Dark mode">
                <BsMoonFill
                  className="p-1"
                  style={{
                    fontSize: "1.5rem",
                  }}
                  onClick={() => {
                    setBgColor("black");
                    window &&
                      window.localStorage.setItem(
                        "background_color",
                        JSON.stringify("black")
                      );
                    window &&
                      window.document.documentElement.style.setProperty(
                        "--dark-background-color",
                        "black"
                      );

                    window &&
                      window.document.documentElement.style.setProperty(
                        "--light-text-color",
                        "white"
                      );

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
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip placement="top" title="Light mode">
                <BsFillSunFill
                  className="p-1"
                  style={{
                    fontSize: "1.5rem",
                    color: "white",
                  }}
                  onClick={() => {
                    setBgColor("white");
                    window &&
                      window.localStorage.setItem(
                        "background_color",
                        JSON.stringify("white")
                      );
                    window &&
                      window.document.documentElement.style.setProperty(
                        "--dark-background-color",
                        "white"
                      );

                    window &&
                      window.document.documentElement.style.setProperty(
                        "--light-text-color",
                        "black"
                      );

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
                  }}
                />
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
