import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import "../styles/HomePage.css";

function Homepage() {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="baat">Chat</h1>
        <h1 className="cheet">Sync</h1>
      </div>
      <div className="content">
        <div className="tabs-container">
          <div
            className={`tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => handleTabClick("login")}
          >
            <button>Login</button>
          </div>
          <div
            className={`tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => handleTabClick("signup")}
          >
            <button>Sign Up</button>
          </div>
        </div>
        <div className="tab-panels">
          <div className={`tab-panel ${activeTab === "login" ? "active" : ""}`}>
            <Login />
          </div>
          <div
            className={`tab-panel ${activeTab === "signup" ? "active" : ""}`}
          >
            <Signup />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
