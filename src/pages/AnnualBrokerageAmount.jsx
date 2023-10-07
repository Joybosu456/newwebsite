import React, { useEffect } from "react";
import $ from "jquery";
import Language from "../common/Languages/languageContent.json";
import { calLogic } from "../common/common";

function AnnualBrokerageAmount() {
  function calBrokerage(e) {
    let bsfl = document.querySelector('.bsfl')
    let tradingB = document.querySelector('.tradingB')
    let annual = document.querySelector('.annual')
    let month = parseInt(e.target.value) / 30;
    let monthToYear = month * 12
    let trade = document.querySelector('input[name="BrokerageOption"]:checked').value;
    const Brokerage = calLogic(trade, monthToYear)
    annual.innerText = Brokerage.cal_saving
    tradingB.innerText = Brokerage.cal_tradiitional
    bsfl.innerText = Brokerage.cal_bfsl
  }


  function radioChange(event) {
    let bsfl = document.querySelector('.bsfl')
    let tradingB = document.querySelector('.tradingB')
    let annual = document.querySelector('.annual')


    let Freq = $("#frequency").val();
    let month = parseInt(Freq) / 30;
    let monthToYear = month * 12
    const Brokerage = calLogic(event.target.value, monthToYear)
    // console.log(Brokerage, "hii");
    annual.innerText = Brokerage.cal_saving
    tradingB.innerText = Brokerage.cal_tradiitional
    bsfl.innerText = Brokerage.cal_bfsl
  }

  useEffect(() => {
    document.getElementById("Intraday").click()
    $(document).ready(function () { /* code here */

      document.querySelectorAll("input[name='BrokerageOption']").forEach((input) => {
        input.addEventListener('change', radioChange);
      });
    });

  }, [])



  return (
    <>
      <div id="brokerage" className="annual-brokerage row">
        <div className="col-lg-7 col-xl-8 annual-brokerage__left">
          <h2 className="title"> {Language[localStorage.getItem("language") || "English"].BORKERAGE_BOOK_MORE_PROFIT}</h2>
          <form className="delivery-options">
            <div className="radio-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BrokerageOption"
                  defaultValue="Intraday"
                  defaultChecked
                  id="Intraday"
                />
                {/* <label htmlFor="Intraday" className="form-check-label" >
                  {Language[localStorage.getItem("language") || "English"].INTRADAY}
                </label> */}
                 <p className="form-check-label" >
                  {Language[localStorage.getItem("language") || "English"].INTRADAY}
                </p>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BrokerageOption"
                  defaultValue="Cash"
                  id="Cash"
                />
                {/* <label htmlFor="Cash" className="form-check-label" >
                  {Language[localStorage.getItem("language") || "English"].DELIVERY}
                </label> */}
                <p  className="form-check-label" >
                  {Language[localStorage.getItem("language") || "English"].DELIVERY}
                </p>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BrokerageOption"
                  defaultValue="F&O"
                  id="FandO"
                />
                {/* <label htmlFor="FandO" className="form-check-label">
                  {Language[localStorage.getItem("language") || "English"].FUTURE_OPTION}
                </label> */}
                <p className="form-check-label">
                  {Language[localStorage.getItem("language") || "English"].FUTURE_OPTION}
                </p>
              </div>
            </div>
            <div className="form-group frequency">
              <label htmlFor="frequency" >
                {Language[localStorage.getItem("language") || "English"].FREQUENCY} 
              </label>
              <select name="frequency" id="frequency" onChange={(e) => { calBrokerage(e) }} >
                {/* <option value="1">

                  {Language[localStorage.getItem("language") || "English"].DAILY}
                </option> */}
                <option value="30">
                  {Language[localStorage.getItem("language") || "English"].MONTHLY}

                </option>
                <option value="90">
                  {Language[localStorage.getItem("language") || "English"].QUARTERLY}
                </option>
                <option value="180">{Language[localStorage.getItem("language") || "English"].HALF_YEAR}</option>
              </select>
            </div>
          </form>
          <p className="note">
            {Language[localStorage.getItem("language") || "English"].BROKERAGE_TEXT_CALCULATED}

          </p>
        </div>
        <div className="col-lg-5 col-xl-4 annual-brokerage__right">
          <p>

            {Language[localStorage.getItem("language") || "English"].YOUR_ANNUAL_BROKERAGE_CHANGES}

          </p>
          <div className="amount-wrapper">
            <div className="brokerage-wrapper">
              <div className="brokerage-amount">
                <p className="label"> {Language[localStorage.getItem("language") || "English"].BFSL}</p>
                <p>
                  ₹<span className="bsfl">60</span>
                </p>
              </div>
              <div className="brokerage-amount">
                <p className="label">

                  {Language[localStorage.getItem("language") || "English"].TRADITIONAL_BROKER}
                </p>
                <p>
                  ₹<span className="tradingB">600</span>
                </p>
              </div>
            </div>
            <div className="annual-savings">
              <p className="label">

                {Language[localStorage.getItem("language") || "English"].ANNUAL_SAVINGS}
              </p>
              <p>
                ₹<span className="annual">540</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnnualBrokerageAmount;
//how to get radiobtn checked value ?




