import React from "react";
import { Link } from "react-router-dom";
import msgIcon from "../assets/images/msg-icon.png";
import Language from "../common/Languages/languageContent.json";
import phoneCall from "../assets/images/phone-call.svg";
import mail from "../assets/images/email.svg";

function InfoCard() {
  return (
    <>
      <div className="chat-card thankyou-msg-card">
        <div className="dashed-border">
          <div className="chat-card-header">
            <div className="close">
              {/* <i className="icon-close" /> */}
              <svg class="new-icon new-icon-close">
                <use href="#new-icon-close"></use>
                </svg>
            </div>
            <h3 className="chat-title">
            {Language[localStorage.getItem("language") || "English"].DO_YOU_KNOW}
            </h3>
            <p className="chat-subtitle">
              {Language[localStorage.getItem("language") || "English"]._52_WARREN}
            </p>
          </div>
          <p className="chat-card-footer">
            <span className="d-block">
              {/* <i className="fa fa-phone" />  */}
              <img src={phoneCall} alt="" />
              <Link to="tel:">18008338888</Link>
            </span>
            <span className="block">
              {/* <i className="fa fa-envelope" /> */}
              <img src={mail} alt="" />
              <Link to="mailto:">connect@bajajfinservsecurities.in</Link>
            </span>
          </p>
        </div>
        <img src={msgIcon} alt="" className="user" />
      </div>
    </>
  );
}

export default InfoCard;
