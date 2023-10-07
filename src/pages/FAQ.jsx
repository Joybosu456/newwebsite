import React from "react";
import FaqAccordian from "./FaqAccordian";
import Language from "../common/Languages/languageContent.json";

function FAQ() {
  return (
    <div id="faq" className="faq">
      <h2 className="faq-title">
      {Language[localStorage.getItem("language") || "English"].FREQUENTLY_ASKED}
      </h2>
      <FaqAccordian />
     </div>
    
  );
}

export default FAQ;
