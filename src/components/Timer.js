import React from "react";
import { useEffect, useState } from "react";
import $ from "jquery";
import { ME_EventTriggered,sendToCleverTap } from "../common/common";

function Timer(props) {
  const [resendBtn, setResendBtn] = useState(true);
  useEffect(() => {
    if (props.emailModalState) {
      if (props.emailModalState.isValid) {
        setResendBtn(false)
      } else {
        setResendBtn(true)
      }
    }
  }, [props.emailModalState])
  function progress(timeleft, timetotal, $element) {
    var progressBarWidth = (timeleft * $element.width()) / timetotal;
    $element.find(".bar").animate({ width: progressBarWidth }, 0);
    $element.find(".bar span").html((timeleft % 60) + " sec remaining");
    if (timeleft > 0) {
      setResendBtn(true);
      setTimeout(function () {
        progress(timeleft - 1, timetotal, $element);
      }, 1000);
    } else {
      setResendBtn(false);
    }
  }

  function resendOtpApi() {
      // sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      //           EP_PAGE_NAME: "HOME PAGE",
      //           EP_MOBILE_NO: localStorage.getItem("mobile"),
      //           EP_NAME: localStorage.getItem("FullName"),
      //           EP_REFERRAL_CODE: localStorage.getItem("referralCode"),
      //           EP_CTA: "RESEND OTP",
      //         })
    progress(30, 30, $("#time_progress-bar"));
    setResendBtn(true);
    props?.resendOtp();
    props?.resendOtpCT();
    ME_EventTriggered("OTPResent")

  }

  useEffect(() => {
    progress(30, 30, $("#time_progress-bar"));
  }, []);
  return (
    <>
      <div id="time_progress-bar">
        <div className="bar">
          <span />
        </div>
      </div>
      <p className="modal-para">
        Haven’t received OTP?
        <button
          className="resend-otp"
          disabled={resendBtn}
          onClick={resendOtpApi}
          
        >
          Resend OTP
        </button>
      </p>
    </>
  );
}

export default Timer;
