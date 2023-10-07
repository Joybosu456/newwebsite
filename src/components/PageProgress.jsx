import React from "react";
import Language from "../common/Languages/languageContent.json";
import { useNavigate } from "react-router-dom";
import { pauseAudio } from "../common/common";

function PageProgress(props) {
  const navigate = useNavigate()
  function ProgressNav(to) {
    pauseAudio()
    navigate(`/${to}`)

  }
  return (
    <>
      <ul className={`form-progress ${props.progress}`}>
        <li className="form-progress-item">
          <a role="button" onClick={() => ProgressNav("personal-detail")} >
            {Language[localStorage.getItem("language") || "English"].PERSONALDETAILS}
          </a>
        </li>
        <li className="form-progress-item">
          <a role="button" onClick={() => ProgressNav("bank-detail")} >
            {Language[localStorage.getItem("language") || "English"].BANKDETAILS}
          </a>
        </li>
        <li className="form-progress-item">
          <a role="button" onClick={() => ProgressNav("subscription-pack")} >
            {Language[localStorage.getItem("language") || "English"].PAYMENT}
          </a>
        </li>
        <li className="form-progress-item active">
        
          <a role="button" onClick={() => ProgressNav("document-upload")} >

            {Language[localStorage.getItem("language") || "English"].DOCUMENT_UPLOAD}
          </a>
        </li>
        <li className="form-progress-indicator" />
      </ul>
    </>
  );
}

export default PageProgress;
