import { React, useState, useEffect } from "react";
import ModalClose from "../assets/images/icons/Close.svg";
import "../lifeTime.css";
import logo from "./images/logo.png";
import bannerRight from "./images/banner-right.png";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import Icon1 from "./images/icon-1.png";
import Icon2 from "./images/icon-2.png";
import Icon3 from "./images/icon-3.png";
import Icon4 from "./images/icon-4.png";
import why1 from "./images/why-1.png";
import why2 from "./images/why-2.png";
import why3 from "./images/why-3.png";
import arrow from "./images/arrow.png";
import step1 from "./images/step-1.png";
import step2 from "./images/step-2.png";
import step3 from "./images/step-3.png";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { nameVal } from "../Validation";
import axios from "axios";
import { SERVICES } from "../common/constants";
import { ToastContainer, toast } from "react-toastify";
// import { AF_EventTriggered } from "../common/Event";
import { useNavigate } from "react-router-dom";
import Timer from "../components/Timer";
import $ from "jquery";
import {
  digitValidate,
  mobileVal,
  playAudio,
  oneDigit,
  ResetLocal,
  AESDecryption,
  nameValidation,
} from "../common/common.js";
import { Modal } from "react-bootstrap";
const LifeTimeAMCFree = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resumeClient, setResumeClient] = useState(false);
  const [signatureguidemodalShow, setsignatureguideModalShow] = useState(false);
  const [resumeCase, setResumeCase] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [userNumber, setUserNumber] = useState("");
  const [focusState, setFocusState] = useState({
    mobile1: false,
    mobile2: false,
  });
  let last4Str, last4Num;
  const schema = Yup.object().shape({
    name: nameVal,
    mobile: Yup.string()
      .required("Mobile Number is a required field.")
      .matches(
        /^[6-9]{1}[0-9]{9}$/,
        "Please enter valid number,Initial digit must range from 6 -9 "
      ),
    checkbox: Yup.bool().oneOf([true], "Please Agree Terms & Conditions"),
  });
  // const nameValidation = (e) => {
  //   if (window.event) {
  //     var charCode = window.event.keyCode;
  //   }
  //   if (
  //     (charCode > 46 && charCode < 65) ||
  //     (charCode < 96 && charCode > 123) ||
  //     (charCode > 183 && charCode <= 222)
  //   ) {
  //     e.preventDefault();
  //   }
  // };
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit: handleSubmit2,
    register: register2,
    reset: reset2,
    formState,
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (values) => {
    // start
    setModalShow(true);
    // end
    return;
    let a = getValues("dob");
    var todayYear = new Date();
    var enterYear = new Date(a);
    todayYear = todayYear.getFullYear();
    enterYear = enterYear.getFullYear();
    var currentAge = todayYear - enterYear;
    if (currentAge < 18) {
      $(".dob-error").css("display", "block");
      $(".dob-error").html("Below 18 year is not allowed");
    } else if (currentAge > 100) {
      $(".dob-error").css("display", "block");
      $(".dob-error").html("Enter Valid Year");
    } else {
      $(".dob-error").css("display", "none");
      $(".dob-error").html("");
      setLoading(true);
      trimMobile(values.mobile);
      setUserNumber(last4Num);
      localStorage.setItem("mobile", values.mobile);
      localStorage.setItem("Pan", values.pan.toUpperCase());
      localStorage.setItem("referralCode", values.referralCode);
      localStorage.setItem("Dob", values.dob);
      // localStorage.setItem("Dob", values.dob.split("-").reverse().join("-"));
      leadCapture(values);
      validateMobileCustomer(values);
    }
  };
  const onSubmit2 = (values) => {
    // start
    navigate("/pan-page");
    // end

    return;

    localStorage.setItem("telecaller", "no");
    // AF_EventTriggered("otp submitted", "otp", { onclick: "otp submit" });
    if (resumeClient === true) {
      validateResume(values);
    } else {
      validateSmsOtp(values);
    }
  };
  const tabChange = (e, num) => {
    let ele = document.querySelectorAll(".otp-form-control");
    if (num > 1 && ele[num - 1].value == "") {
      ele[num - 2].focus();
    }
    if (num < 4 && ele[num - 1].value != "") {
      ele[num].focus();
    }

    if (formState.isValid === true) {
      // setModalShow(false)
      // setLoading(true);
      handleSubmit2(onSubmit2)();
    } else if (formState.isValid === false) {
      setLoading(false);
    }
  };
  function trimMobile(value) {
    last4Str = String(value).slice(-4);
    last4Num = Number(last4Str);
  }

  useEffect(() => {
    var params = getSearchParameters();
    localStorage.setItem("campaign", params?.utm_campaign || "ekyc");
    localStorage.setItem("medium", params?.utm_medium || "ekyc");
    localStorage.setItem("source", "Freedom_Plus");

    getData();
    if (params?.referal_code) {
      setValue("referralCode", params?.referal_code);
      document.querySelector('input[name="referralCode"]').readOnly = true;
    }
  }, []);
  useEffect(() => {
    ResetLocal();
  }, []);
  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    localStorage.setItem("IpAddress", res.data.IPv4);
  };
  function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
  }
  function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
    }
    return params;
  }
  const leadCapture = async (values) => {
    try {
      const response = await axios.post(
        SERVICES.CLIENTSAVE,
        {
          leadCapture: {
            mobile: values.mobile,
            pan: values.pan,
            source: "EKYCWEBSITE",
            utmSource: localStorage.getItem("source"),
            utmCampaign: localStorage.getItem("campaign"),
            utmMedium: localStorage.getItem("medium"),
            ipaddress: localStorage.getItem("IpAddress"),
            utmTerm: "ekyc",
            Longitude: localStorage.getItem("Longitude") || "",
            Latitude: localStorage.getItem("Latitude") || "",
          },
          screenType: 1,
        },
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("leadCaptureId", response.data.Response.Id);
    } catch (err) {
      setLoading(false);
    }
  };
  const validateMobileCustomer = async (values) => {
    // required dob format DD-MM-YYYY

    try {
      const responeOtp = await axios.post(
        SERVICES.MOBILEOTP,
        {
          mobilePan: {
            mobile: localStorage.getItem("mobile"),
            pan: localStorage.getItem("Pan"),
            ip: localStorage.getItem("IpAddress"),
            fullname: values.name,
            dob: localStorage.getItem("Dob").reverseDob(),
          },
          screenType: 9,
        },
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );
      if (
        responeOtp.data.Response.Message === "Valid Pan But Aadhaar Not Seeded"
      ) {
        setsignatureguideModalShow(true);
      } else {
        setsignatureguideModalShow(false);
      }
      if (responeOtp.data.Response.otpLimit == "OTP LIMIT EXCEED") {
      } else if (
        responeOtp.data.Response.OtpCount == 1 ||
        responeOtp.data.Response.OtpCount == 2 ||
        responeOtp.data.Response.OtpCount == 3 ||
        responeOtp.data.Response.OtpCount == 4 ||
        responeOtp.data.Response.OtpCount == 5
      ) {
      }

      if (
        responeOtp.data.Response.Case == "" ||
        responeOtp.data.Response.Case == null ||
        responeOtp.data.Response.otpLimit == "OTP LIMIT EXCEED"
      ) {
        if (responeOtp.data.Response.otpLimit == "OTP LIMIT EXCEED") {
          toast.error("OTP Limit exceed");
        } else {
          if (
            responeOtp.data.Response.Message !==
            "Valid Pan But Aadhaar Not Seeded"
          ) {
            toast.error(responeOtp.data.Response.Message);
          }
        }
      } else {
        reset2();
        setModalShow(true);
        playAudio(3);
        if (responeOtp.data.Response.Case === "Exist") {

          setResumeClient(true);
          setResumeCase("Exist");
        } else if (responeOtp.data.Response.Case === "Resume") {

          setResumeClient(true);
          setResumeCase("Resume");
        }
      }
      localStorage.setItem("numberUq", responeOtp.data.Response.UqId);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  const validateSmsOtp = async (values) => {
    let otp1 = values.otp1,
      otp2 = values.otp2,
      otp3 = values.otp3,
      otp4 = values.otp4;

    let otp = [otp1, otp2, otp3, otp4].join("");
    try {
      const response = await axios.post(
        SERVICES.MOBILEOTPVERIFICATION,
        {
          accountOpening: {
            mobile: localStorage.getItem("mobile"),
            otpuqid: localStorage.getItem("numberUq"),
            mobpswd: otp,
            pan: localStorage.getItem("Pan").toUpperCase(),
            dob: localStorage.getItem("Dob"),
            referralCode: localStorage.getItem("referralCode"),
          },
          screenType: 0,
        },
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.Response.Token);

      if (response.data.Response.Status === "Otp Verified") {
        getPanDetails(values);
      } else {
        toast.error(response.data.Reason);
      }
    } catch (err) {
      toast.error(err.message);
      // setLoading(false);
    }
  };
  const validateResume = async (values) => {
    let otp1 = values.otp1,
      otp2 = values.otp2,
      otp3 = values.otp3,
      otp4 = values.otp4;
    let otp = [otp1, otp2, otp3, otp4].join("");
    try {
      const response = await axios.post(
        SERVICES.MOBILESMSVALIDATION,
        {
          sMSData: {
            Mobile: localStorage.getItem("mobile"),
            pan: localStorage.getItem("Pan"),
            otp: otp,
            referralCode: localStorage.getItem("referralCode"),
          },
          screenType: 15,
        },
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );
      if (response.data.Status === "Success") {
        localStorage.setItem("token", response.data.Response.Token);
        setTimeout(NavigatePage, 2000);
        function NavigatePage() {
          if (resumeCase == "Exist") {
            localStorage.setItem("ExistUqId", response.data.Response.Uqid);
            ResumeApplication();
          } else if (response.data.Status === "Success") {
            if (response.data.Response.Dob) {
              const DOB = response.data.Response.Dob.split(" ")[0];
              let Dob = DOB.split("/");
              let Fdob = `${Dob[2]}-${Dob[0]}-${Dob[1]}`;
              let Bdob = `${Dob[1]}-${Dob[0]}-${Dob[2]}`;
              localStorage.setItem("Dob", Bdob || "");
              // localStorage.setItem("Dob", Fdob || "");
            }
            const Fullname = response.data.Response.Cname;
            const Pan = response.data.Response.Pan;
            const Mobile = response.data.Response.Mobile;
            if (Fullname) {
              let name = Fullname.split(" ");

              if (name.length > 1) {
                localStorage.setItem(
                  "FirstName",
                  name[0].replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
                );
                localStorage.setItem(
                  "LastName",
                  name[name.length - 1].toUpperCase()
                );
              }
            }
            localStorage.setItem(
              "FullName",
              Fullname.replace(/[^a-zA-Z0-9]/g, "")
            );
            localStorage.setItem("panId", response.data.Response.Id);
            localStorage.setItem("Pan", Pan);
            localStorage.setItem("mobile", Mobile);
            localStorage.setItem(
              "FatherName",
              response.data.Response.FatherName ||
              localStorage.getItem("FatherName") ||
              ""
            );
            playAudio(4);
            // navigate("/pan-details");
            navigate("/pan-page");

          }
        }
      } else {
        toast.error(response.data.Reason);
        // setLoading(false);
      }
    } catch (err) {
      toast.error(err.message);
      // setLoading(false);
    }
  };

  const ResumeApplication = async (token) => {
    try {
      const response = await axios.post(
        SERVICES.CLIENTRESUME,
        {
          resumeClientDetails: {
            mobile: localStorage.getItem("mobile"),
            uqid: localStorage.getItem("ExistUqId"),
          },
          screenType: 6,
          hasEncrypted: true,
        },

        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let resumeReq = AESDecryption(response.data);
      let resumeResp = JSON.parse(JSON.parse(resumeReq));
      console.log(response.data.Response.FlagRes.IsKycChanged, "is data  ");
      if (resumeResp.Response.FlagRes.IsKycChanged === "true") {
        navigate("/personal-detail");
      }
      if (resumeResp.Response.PersonalDetailsRes.FirstName) {
        let userName =
          resumeResp.Response.PersonalDetailsRes.FirstName +
          " " +
          resumeResp.Response.PersonalDetailsRes.LastName;
        localStorage.setItem("FullName", userName.replace(/[^a-zA-Z0-9]/g, ""));
      }
      if (
        resumeResp.Response.FlagRes.UQID != "undefined" &&
        resumeResp.Response.FlagRes.UQID != ""
      ) {
        localStorage.setItem("UserUqID", resumeResp.Response.FlagRes.UQID);
        localStorage.setItem("UserRefID", resumeResp.Response.FlagRes.Id);
        let Data = resumeResp.Response;
        let firstName = Data.PersonalDetailsRes.FirstName.split(" ")
          .join("")
          .replace(/[^a-zA-Z0-9]/g, "");
        let Pan = Data.AccountOpeningRes.Pan;
        let Mobile = Data.AccountOpeningRes.Mobile;
        const PhraseName = `${firstName}_${Pan}_${Mobile}`;
        localStorage.setItem("PhraseName", PhraseName);
      }
      if (
        resumeResp.Response.BankDetailsRes.AccountNo != "" &&
        resumeResp.Response.BankDetailsRes.AccountNo != null
      ) {
        playAudio(8);
        navigate(`/returnee-resume`);
      }
      if (
        resumeResp.Response.PackInfo.PaymentStatus != "" &&
        resumeResp.Response.PackInfo.PaymentStatus != null
      ) {
        playAudio(8);
        navigate(`/returnee-resume`);
      } else {
        playAudio(8);
        navigate(`/returnee-resume`);
      }
      localStorage.setItem("refId", resumeResp.Response.FlagRes.Id);
      localStorage.setItem("UserRefID", resumeResp.Response.FlagRes.Id);
    } catch (err) {
      // console.log("Error", err.message);
    }
  };
  const getPanDetails = async () => {
    try {
      const response = await axios.post(
        SERVICES.CLIENTSAVE,
        {
          getPANDetails: {
            mobile: localStorage.getItem("mobile"),
            pan: localStorage.getItem("Pan"),
          },
          screenType: 11,
        },

        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );
      let Fullname = response.data.Response.fullName;
      if (Fullname) {
        let name = Fullname.split(" ");

        if (name.length > 1) {
          localStorage.setItem("FirstName", name[0].toUpperCase());
          localStorage.setItem("LastName", name[name.length - 1].toUpperCase());
        }
      }
      localStorage.setItem("panId", response.data.Response.id || "");
      localStorage.setItem("FullName", Fullname || "");
      localStorage.setItem(
        "FatherName",
        response.data.Response.dependentFName.toUpperCase() || ""
      );
      localStorage.setItem("Dob", response.data.Response.dob || "");
      localStorage.setItem(
        "Pan",
        response.data.Response.pan.toUpperCase() || ""
      );
      if (response) {
        playAudio(4);
     // navigate("/pan-details");
     navigate("/pan-page");      }
    } catch (err) {
      // console.log("Error", err.message);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className={`${loading ? "loader" : " "}`}>
        {loading && (
          <>
            <img src={bajaj_loaderimg} className="loader-img" />
          </>
        )}
        <div className="containor">
          <div className="headerlifetime">
            <div className="logo">
              <img src={logo} />
            </div>

            <div className="header_right">
              <ul>
                <li>
                  <div className="first">
                    <a href="">
                      Trade
                      <i
                        className="fi fi-rr-chat-arrow-grow"
                        style={{ position: "relative", top: "2px" }}
                      ></i>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="second">
                    <a href="">
                      Open Demat Account
                      <i
                        className="fi fi-br-sign-out-alt"
                        style={{ position: "relative", top: "2px" }}
                      ></i>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="clear"></div>

          <div className="banner_section">
            <div className="banner_section_left">
              <h1>
                <span>
                  Why Invest?
                  <br />
                </span>
                For a <b style={{ color: "#0072BC" }}>financially</b> stronger
                tomorrow
              </h1>
              <p>
                Get started by opening a Demat account! <br /> It’ll only take a
                few minutes
              </p>
              <div className="clear"></div>

              <div className="form_section">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="left form-group">
                    <input
                      type="text"
                      placeholder="Enter Your Name*"
                      {...register("name")}
                      // onKeyPress={(e) => nameValidation(e)}
                      onInput={(e) => nameValidation(e)}

                      maxLength={100}
                    />
                    <div className="error-show">{errors.name?.message}</div>
                  </div>

                  <div className="right form-group">
                    <input
                      type="text"
                      placeholder="Enter Your Contact No.*"
                      {...register("mobile")}
                      onKeyPress={(e) => mobileVal(e)}
                      maxLength={10}
                    />
                    <div className="error-show">{errors.mobile?.message}</div>
                  </div>

                  {/* <div className="left form-group">
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="Enter Your PAN*"
                      {...register("pan")}
                      onKeyPress={(e) => validatePan(e)}
                    />
                    <div className="error-show">{errors.pan?.message}</div>
                  </div>

                  <div className="right form-group">
                    <input
                      type="date"
                      placeholder="DOB*"
                      {...register("dob")}
                    />
                    <div className="error-show">{errors.dob?.message}</div>
                  </div> */}

                  <div className="left width100">
                    <input
                      type="text"
                      placeholder="Enter referral code"
                      nameattribute="referralCode1"
                      onFocus={() =>
                        setFocusState({
                          referralCode1: true,
                        })
                      }
                      onBlur={() => {
                        setFocusState({
                          referralCode1: false,
                        });
                      }}
                      maxLength={10}
                      className={`mt-2 form-control has-value ${errors?.referralCode ? "is-invalid" : ""
                        }`}
                      {...register("referralCode")}
                    />
                  </div>

                  <div className="left width100 frm_txt form-group flex-row">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      {...register("checkbox")}
                      className={`input-checkbox  ${errors.checkbox ? "is-invalid" : ""
                        }`}
                    />
                    &nbsp; By continuing, I confirm that I have read and agree
                    to the&nbsp;
                    <a
                      href="https://www.bajajfinservsecurities.in/terms-conditions.aspx"
                      target="_blank"
                    >
                      Terms & Conditions
                    </a>
                    &nbsp;and&nbsp;
                    <a
                      href="https://www.bajajfinservsecurities.in/privacy-policy.aspx"
                      target="_blank"
                    >
                      Privacy Policy
                    </a>
                    <div className="error-show">{errors.checkbox?.message}</div>
                  </div>

                  <div className="left width100">
                    <button type="submit">SUBMIT</button>
                  </div>
                </form>
              </div>
            </div>

            <div className="banner_section_right">
              <img src={bannerRight} />
            </div>
          </div>
          <div className="clear"></div>

          <div className="investment_section">
            <h1>Here are a few investment options for you</h1>
            <ul>
              <li>
                <div className="icon">
                  <img src={Icon1} />
                </div>
                <div className="text">Stocks</div>
              </li>

              <li>
                <div className="icon">
                  <img src={Icon2} />
                </div>
                <div className="text">Bonds</div>
              </li>

              <li>
                <div className="icon">
                  <img src={Icon3} />
                </div>
                <div className="text">IPOs</div>
              </li>

              <li>
                <div className="icon">
                  <img src={Icon4} />
                </div>
                <div className="text">F&O</div>
              </li>
            </ul>
          </div>
          <div className="clear"></div>

          <div className="benifits_section">
            <div className="benifits_in">
              <h1 style={{ fontSize: "27px" }}>
                Benefits of opening a Demat <br />
                with Bajaj Securities
              </h1>
              <ul>
                <li>
                  <h2>₹20 </h2>
                  <p>For deliver, F&0, stocks</p>
                </li>

                <li>
                  <h2>FREE </h2>
                  <p>Lifetime Free AMC</p>
                </li>

                <li>
                  <h2>
                    One of the Lowest
                    <br /> MTF Rates{" "}
                  </h2>
                  <p>Get leverage upto 4x</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="clear"></div>

          <div className="why_section">
            <h1>Why Choose Us</h1>
            <ul>
              <li>
                <div className="text">Easy</div>
                <div className="icon">
                  <img src={why1} />
                </div>
              </li>

              <li>
                <div className="text">Seamless</div>
                <div className="icon">
                  <img src={why2} />
                </div>
              </li>

              <li>
                <div className="text">Paperless</div>
                <div className="icon">
                  <img src={why3} />
                </div>
              </li>
            </ul>
          </div>
          <div className="clear"></div>

          <div className="step_section">
            <h1>Open your Demat account in three-easy steps</h1>
            <ul>
              <li>
                <span className="arrow">
                  <img src={arrow} />
                </span>
                <div className="icon">
                  <img src={step1} />
                </div>
                <div className="text">Submit your documents</div>
              </li>
              <li>
                <span className="arrow">
                  <img src={arrow} />
                </span>
                <div className="icon">
                  <img src={step2} />
                </div>
                <div className="text">Verify bank details</div>
              </li>
              <li>
                <div className="icon">
                  <img src={step3} />
                </div>
                <div className="text">Complete e-kyc</div>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="clear"></div> */}
        <div className="footer">
          <div className="containor">
            {/* <h1>BAJAJ FINANCIAL SECURITIES LIMITED</h1> */}
            <p>
              Disclaimer- Investments in the securities market are subject to
              market risk, read all related documents carefully before
              investing. Reg Office: Bajaj Auto Limited Complex, Mumbai –Pune
              Road Akurdi Pune 411035. Corp. Office: Bajaj Financial Securities
              Ltd., 1st Floor, Mantri IT Park, Tower B, Unit No 9, Viman Nagar,
              Pune, Maharashtra 411014. SEBI Registration No.: INZ000218931 |
              BSE Cash/F&O (Member ID: 6706) | NSE Cash/F&O (Member ID: 90177) |
              DP registration No: IN-DP-418-2019 | CDSL DP No.: 12088600 | NSDL
              DP No. IN304300 | AMFI Registration No.: ARN – 163403. Website:
              https://www.bajajfinservsecurities.in/. All leveraged intraday
              positions will be squared off on the same day. There is no
              restriction on the withdrawal of the unutilised margin amount.
              Brokerage will not exceed the SEBI prescribed limit. As subject to
              the provisions of SEBI Circular CIR/MRD/DP/54/2017 dated June 13,
              2017, and the terms and conditions mentioned in the lights and
              obligations statement issued by the TM (if applicable).
            </p>
          </div>
        </div>
      </div>
      <Modal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          reset2();
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="otpModal"
        centered
        backdrop="static"
        keyboard={false}
      >
        <div
          className="close"
          onClick={() => {
            setModalShow(false);
            reset2();
          }}
        >
          <img src={ModalClose} alt="" />
        </div>
        <Modal.Body>
          <div>
            <h3 className="modal-title">OTP Verification</h3>
            <p className="modal-para">
              Enter the OTP sent to your mobile number <br />
              <span>XXXXXX{userNumber}</span>
            </p>
          </div>
          <div>
            <form
              id="otp-form"
              className="flex-col"
              autoComplete="off"
              onSubmit={handleSubmit2(onSubmit2)}
            >
              <div className="form-group">
                <input
                  type="number"
                  minLength="1"
                  maxLength="1"
                  name="otp1"
                  autoFocus={true}
                  onInput={(e) => {
                    digitValidate(e);
                    oneDigit(e);
                  }}
                  onKeyUp={(e) => tabChange(e, 1)}
                  className="otp-form-control"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  {...register2("otp1", {
                    required: true,
                  })}
                />
                <input
                  type="number"
                  minLength="1"
                  maxLength="1"
                  onInput={(e) => {
                    digitValidate(e);
                    oneDigit(e);
                  }}
                  onKeyUp={(e) => tabChange(e, 2)}
                  name="otp2"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="otp-form-control"
                  {...register2("otp2", {
                    required: true,
                  })}
                />
                <input
                  type="number"
                  minLength="1"
                  maxLength="1"
                  name="otp3"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="otp-form-control"
                  onInput={(e) => {
                    digitValidate(e);
                    oneDigit(e);
                  }}
                  onKeyUp={(e) => tabChange(e, 3)}
                  {...register2("otp3", {
                    required: true,
                  })}
                />
                <input
                  type="number"
                  minLength="1"
                  maxLength="1"
                  name="otp4"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="otp-form-control"
                  onInput={(e) => {
                    digitValidate(e);
                    oneDigit(e);
                  }}
                  onKeyUp={(e) => tabChange(e, 4)}
                  {...register2("otp4", {
                    required: true,
                  })}
                />
              </div>
            </form>
            <Timer resendOtp={validateMobileCustomer} />
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={signatureguidemodalShow}
        onHide={() => setsignatureguideModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        // className="signatureModel upload-img-modal"
        centered
        backdrop="static"
        keyboard={false}
        className="popup"
      >
        <div
          className="close"
          onClick={() => setsignatureguideModalShow(false)}
        >
          <i className="fa-solid fa-xmark" />
        </div>
        <Modal.Body>
          <div className="landing-popup-txt">
            “We regret to inform you that you will not be able to proceed ahead
            as your PAN is not linked with your Aadhar. As per the new
            regulatory guidelines it is mandatory to have your PAN linked with
            Aadhar to carry out any financial transactions.{" "}
            <a
              target="_blank"
              className="link_tag"
              href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar"
            >
              Click here
            </a>{" "}
            to link your PAN with Aadhar now.”
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LifeTimeAMCFree;
