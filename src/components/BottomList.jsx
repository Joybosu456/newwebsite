import React from "react";
import money_bag from "../assets/images/money-bag.svg";
import secure_icon from "../assets/images/secure.svg";
import document_icon from "../assets/images/document.svg";
import box_icon from "../assets/images/box.png";
import Language from "../common/Languages/languageContent.json";

function BottomList() {
  return (
    <div className="bottom-list">
      <ul>
        <li>
          <img src={money_bag} alt="money bag icon" />
          <h4>{Language[localStorage.getItem("language") || "English"].LOW} </h4>
          <p>{Language[localStorage.getItem("language") || "English"].BROKERAGE} </p>
        </li>
        <li>
          <img src={secure_icon} alt="secure icon" />
          <h4>{Language[localStorage.getItem("language") || "English"].CLASS}</h4>
          <p>{Language[localStorage.getItem("language") || "English"].TECHNOLOGY}</p>
        </li>
        <li>
          <img src={document_icon} alt="document icon" />
          <h4>{Language[localStorage.getItem("language") || "English"].DECADES}</h4>
          <p>{Language[localStorage.getItem("language") || "English"].TRUST}</p>
        </li>
        <li>
          <img src={box_icon} alt="box icon" />
          <h4>{Language[localStorage.getItem("language") || "English"].SUBSCRIPTION}</h4>
          <p>{Language[localStorage.getItem("language") || "English"].PLANS}</p>
        </li>
      </ul>
    </div>
  );
}

export default BottomList;
