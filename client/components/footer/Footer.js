import { useState } from "react";
import {
  SearchOutlined,
  PlusCircleOutlined,
  HomeFilled,
} from "@ant-design/icons";

import { BsMoonFill, BsFillSunFill } from "react-icons/bs";

const Footer = ({ showDrawer }) => {
  const [bgColor, setBgColor] = useState(
    JSON.parse(window.localStorage.getItem("background_color"))
  );

  let bgcolor = bgColor === " black" ? "black" : "white";
  let txtcolor = bgColor === " black" ? "white" : "black";
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

  return (
    <>
      {console.log("Intially", bgColor, bgColor === " white")}
      <hr></hr>
      <div className="footer row bg">
        <div className="col-3 text-center">
          <div className="d-flex justify-content-center">
            <HomeFilled
              className="p-1"
              style={{
                fontSize: "1.5rem",
              }}
            />
          </div>
        </div>
        <div className="col-3 text-center">
          <div className="d-flex justify-content-center">
            <PlusCircleOutlined
              className="p-1"
              style={{
                fontSize: "1.5rem",
              }}
              onClick={showDrawer}
            />
          </div>
        </div>
        <div className="col-3 text-center">
          <div className="d-flex justify-content-center">
            <SearchOutlined
              className="p-1"
              style={{
                fontSize: "1.5rem",
              }}
            />
          </div>
        </div>
        <div className="col-3 text-center">
          <div className="d-flex justify-content-center">
            {bgColor === " white" ? (
              <BsMoonFill
                className="p-1"
                style={{
                  fontSize: "1.5rem",
                }}
                onClick={() => {
                  setBgColor(" black");
                  window &&
                    window.localStorage.setItem(
                      "background_color",
                      JSON.stringify(" black")
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
                }}
              />
            ) : (
              <BsFillSunFill
                className="p-1"
                style={{
                  fontSize: "1.5rem",
                  color: "white",
                }}
                onClick={() => {
                  setBgColor(" white");
                  window &&
                    window.localStorage.setItem(
                      "background_color",
                      JSON.stringify(" white")
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
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
