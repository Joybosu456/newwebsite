import React from "react";
import $ from "jquery";
import Accordion from "react-bootstrap/Accordion";
import plusIcon from "../assets/images/plus.svg";

import Language from "../common/Languages/languageContent.json";

function FaqAccordian() {
  function openAccordion(e) {
    let aBody = e.target.nextSibling;

    $(aBody).css("height", "0");
  }
  return (
    <>


      <div className="faq-accordian">
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h3>
                {Language[localStorage.getItem("language") || "English"].WHY_SHOULD_YOU_BFSL}
              </h3>
              <img src={plusIcon} alt="PlusIcon" height="16" width="16" />
            </Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>
                  {
                    Language[localStorage.getItem("language") || "English"]
                      .COMPLETELY_DIGITAL_PROCESS
                  }
                </li>
                <li>
                  {
                    Language[localStorage.getItem("language") || "English"]
                      .DELIVER_LOW_BROKERAGE
                  }
                </li>
                <li>
                  {Language[localStorage.getItem("language") || "English"].FREE_TRADING_CALL}
                </li>
                <li>
                  {
                    Language[localStorage.getItem("language") || "English"]
                      .STOCK_RECOMMENDATION
                  }
                </li>
                <li>
                  {
                    Language[localStorage.getItem("language") || "English"]
                      .BAJAJ_DECADES_OF_TRUST
                  }
                </li>
                {/* <li>
                  {
                    Language[localStorage.getItem("language") || "English"]
                      .WHAT_DOCUMENT_REQUIRED
                  }
                </li> */}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h3>
                {
                  Language[localStorage.getItem("language") || "English"]
                    .WHAT_DOCUMENT_REQUIRED
                }
              </h3>
              <img src={plusIcon} alt="PlusIcon" height="16" width="16" />
            </Accordion.Header>
            <Accordion.Body>
              {/* <p className="accordion-body-title">
                {
                  Language[localStorage.getItem("language") || "English"]
                    .DEMAT_TRADING_ACCOUNT_BFSL
                }
              </p> */}
              <ul>
                <li>
                  {
                    Language[localStorage.getItem("language") || "English"]
                      .DEMAT_TRADING_ACCOUNT_BFSL
                  }
                </li>
                <li>
                  {Language[localStorage.getItem("language") || "English"].IDENTITY_PROOF}
                </li>
                <li>
                  {Language[localStorage.getItem("language") || "English"].ADDRESS_PROOF}
                </li>
                {/* <li> {Language[localStorage.getItem("language") || "English"].PHOTO}</li> */}
                <li>
                  {Language[localStorage.getItem("language") || "English"].SIGNATURE_PAPER}
                </li>
                <li>
                  {Language[localStorage.getItem("language") || "English"].BANK_DETAILS}
                </li>
                <li>
                  {Language[localStorage.getItem("language") || "English"].INCOME_PROOF}
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <h3>
                {Language[localStorage.getItem("language") || "English"].HOW_MUCH_TIME_DOES}
              </h3>
              <img src={plusIcon} alt="PlusIcon" height="16" width="16" />
            </Accordion.Header>
            <Accordion.Body>
              {/* {
                Language[localStorage.getItem("language") || "English"]
                  .ACCOUNT_OPENING_PROCESS
              } */}
              <ul>
                <li>
                  {
                    Language[localStorage.getItem("language") || "English"]
                      .QUES_ONE
                  }
                </li>
                <li>
                  {
                    Language[localStorage.getItem("language") || "English"]
                      .QUES_TWO
                  }
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <h3>
                {Language[localStorage.getItem("language") || "English"].HOW_I_CAN_TRADE}
              </h3>
              <img src={plusIcon} alt="PlusIcon" height="16" width="16" />
            </Accordion.Header>
            <Accordion.Body>
              <p className="trade-desc">
                {Language[localStorage.getItem("language") || "English"].LOG_IN}
              </p>

              <p className="trade-desc">
                {Language[localStorage.getItem("language") || "English"].ADD_FUNDS}
              </p>

              <p className="trade-desc">
                {Language[localStorage.getItem("language") || "English"].TRADE}
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <h3>
                {Language[localStorage.getItem("language") || "English"].WHAT_ELIGIBILTY}
              </h3>
              <img src={plusIcon} alt="PlusIcon" height="16" width="16" />
            </Accordion.Header>
            <Accordion.Body>
              {Language[localStorage.getItem("language") || "English"].ANY_INDIAN_INDIVIUAL}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5">
            <Accordion.Header>
              <h3>
                {
                  Language[localStorage.getItem("language") || "English"]
                    .STEP_TO_OPEN_ACCOUNT
                }
              </h3>
              <img src={plusIcon} alt="PlusIcon" height="16" width="16" />
            </Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>
                  {Language[localStorage.getItem("language") || "English"].PERSONAL_DETAILS}
                </li>
                <li>
                  {Language[localStorage.getItem("language") || "English"].CHOOSE_PLAN}
                </li>
                <li>
                  {Language[localStorage.getItem("language") || "English"].UPLOAD_SELFIE}
                </li>
                <li>
                  {Language[localStorage.getItem("language") || "English"].UPLOAD_DOCUMENT}
                </li>
                <li>{Language[localStorage.getItem("language") || "English"].E_SIGN}</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
}

export default FaqAccordian;
