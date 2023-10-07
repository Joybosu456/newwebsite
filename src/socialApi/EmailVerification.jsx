import React, { useState, useEffect, useRef } from "react";
import google_icon from "../assets/images/google.svg";
import facebook_icon from "../assets/images/fb.svg";
import fastforward_icon from "../assets/images/Fast_Forward.gif";
import FacebookLogin from "react-facebook-login";
import {
  AESDecryption,
  ME_EventTriggered,
  oneDigit,
  pauseAudio,
  playAudio,
  sendToCleverTap,
} from "../common/common.js";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatCard from "../components/ChatCard";
import userBottomImg from "../assets/images/person-images/personal-email.png";
import Timer from "../components/Timer";
import BottomList from "../components/BottomList";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import { SERVICES } from "../common/constants";
import { useSpeechRecognition } from "react-speech-kit";
import Language from "../common/Languages/languageContent.json";
import CryptoJS from "crypto-js";

const EmailVerification = () => {
  const [startListening, setStartListening] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [useOtp, setUseOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobligent, setMobligent] = useState(false);
  const [mobilegentUrl, setMobilegentUrl] = useState("");
  const [valueleaf, setValueLeaf] = useState("");
  const [focusState, setFocusState] = useState({
    email: false,
  });
  const [pageBtn, setPageBtn] = useState(false);
  const emailRef = useRef(null);
  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      let voiceValue = result;

      if (document.activeElement.getAttribute("nameattribute") === "email")
        setValue("emailId", voiceValue.split(" ").join(""));
    },
  });
  // const [fbState, setFbState] = useState(false)

  // useEffect(() => {
  //   if (process.env.REACT_APP_DOMAIN == "PWA") {
  //     setFbState(false)
  //   } else {
  //     setFbState(true)
  //   }
  // }, [])

  useEffect(() => {
    startListening ? listen() : stop();
  }, [startListening]);

  const leadCapture = async (values) => {
    try {
      const response = await axios.post(
        SERVICES.LAEDSAVE,
        {
          leadCapture: {
            mobile: localStorage.getItem("mobile"),
            pan: localStorage.getItem("Pan"),
            source: "EKYCWEBSITE",
            utmSource: localStorage.getItem("source"),
            utmCampaign: localStorage.getItem("campaign"),
            utmMedium: localStorage.getItem("medium"),
            ipaddress: localStorage.getItem("IpAddress"),
            utmTerm: "ekyc",
            Longitude: localStorage.getItem("Longitude") || "",
            Latitude: localStorage.getItem("Latitude") || "",
            termContent: localStorage.getItem("terms") || "",
            fatherName: localStorage.getItem("FatherName") || "",
            dob: localStorage.getItem("Dob") || "",
            fullname: localStorage.getItem("FullName") || "",
            email: localStorage.getItem("EmailId") || "",
            screen: 4,
            referal: localStorage.getItem("referralCode")
          },
          screenType: 1,
        },
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("leadCaptureEmailId", response.data.Response.Id);
    } catch (err) {
      setLoading(false);
    }
  };
  const digitValidate = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };
  const tabChange = (e, num) => {
    let ele = document.querySelectorAll(".otp-form-control");
    if (num > 1) {
      if (ele[num - 1].value == "") {
        ele[num - 2].focus();
      }
    }
    if (num < 4) {
      if (ele[num - 1].value != "") {
        ele[num].focus();
      }
    }

    console.log(formState2.isValid, "formState2.isValid");
    ME_EventTriggered("OTPEntered", getOtp());

    if (formState2.isValid === true) {
      handleSubmit2(onSubmit2)();
    } else if (formState.isValid === false) {
    }
  };
  const focusToFirst = () => {
    let ele = document.querySelectorAll(".otp-form-control");
    ele[0].focus();
  };
  const navigate = useNavigate();

  const clientId =
    "872111823069-51uidj9va66jufttguso1mf7frv96rdj.apps.googleusercontent.com";
  useEffect(() => {
    sendToCleverTap("BSFL_APPLICATION_VIEWED", {
      EP_PAGE_NAME: "EMAIL VERIFICATION PAGE",
    });

    const initClient = () => {
      gapi.auth2.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const onFailure = () => { };
  const onSuccess = (response) => {

    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "EMAIL VERIFICATION PAGE",
      EP_FULL_NAME: response.profileObj.email,
      EP_CTA: "GOOGLE"
    });
    localStorage.removeItem("emailUq");
    let googleGmail = response.profileObj.email;
    localStorage.setItem("GoogleEmail", googleGmail);
    setUserEmail(response.profileObj.email);
    setUseOtp("gmail");
    validateEmailOtp(response.profileObj.email, "gmail", "gmail");
    ME_EventTriggered(`${response.profileObj.email}`);
  };

  const responseFacebook = (response) => {
    if (response.email) {
      localStorage.removeItem("emailUq");
      setUseOtp("facebook");
      validateEmailOtp(response.email, "facebook", "facebook");
    }
  };

  const {
    register,
    formState: { errors },
    formState,
    reset,
    handleSubmit,
    setValue,
    watch, } = useForm();

  const formvalue = watch();
  const {
    register: register2,
    formState: { errors: errors2 },
    formState: formState2,
    getValues: getOtp,
    reset: reset2,
    setFocus: setFocus2,
    handleSubmit: handleSubmit2,
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    setUserEmail(data.emailId);
    localStorage.setItem("EmailId", data.emailId);
    // leadCapture(data);
    getEmailOtp(data.emailId);
    leadCapture(data);
    ME_EventTriggered("SubmitEmail", data);
  };
  const PixelTrigger = async () => {
    const utm_source_check = localStorage.getItem("source");

    if (
      utm_source_check == "MOBLIGENTMEDIA" ||
      utm_source_check == "VALUELEAF_AFF"
    ) {
      try {
        const response = await axios.post(
          SERVICES.PIXELTRIGGER,

          {
            ekycID: localStorage.getItem("leadCaptureId"),
            utmSrc: utm_source_check,
          },

          {
            headers: {
              "content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (response.data.Response) {
          if (response.data.Response.Flagval.toLowerCase() === "y") {
            setMobligent(true);
            let url;
            if (utm_source_check == "MOBLIGENTMEDIA") {
              url = `https://mobligent.g2afse.com/success.jpg?offer_id=1776&afstatus=1&custom_field1=${localStorage.getItem(
                "FirstName"
              )}&custom_field2=${localStorage.getItem(
                "mobile"
              )}&custom_field3=${localStorage.getItem("Pan")}`;
            }
            if (utm_source_check == "VALUELEAF_AFF") {
              url = `https://utils.follow.whistle.mobi/static_pixel.php?offerid=283&goal_name=default`;
            }
            setMobilegentUrl(url);
          }
        }
      } catch (err) { }
    }
  };

  const getEmailOtp = async (email) => {
    setPageBtn(true)
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "EMAIL VERIFICATION PAGE",
      EP_FULL_NAME: localStorage.getItem("EmailId"),
      EP_CTA: "GET OTP",
    });

    ME_EventTriggered("Get otp", localStorage.getItem("EmailId"));
    try {
      const request = await axios.post(
        SERVICES.CLIENTSAVE,
        {
          accountOpening: {
            mobile: localStorage.getItem("mobile"),
            emailId: localStorage.getItem("EmailId"),

          },
          screenType: 4,
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (request.data.Response.UqId) {
        setUseOtp("otp");
        localStorage.setItem("emailUq", request.data.Response.UqId);
        setModalShow(true);
        ME_EventTriggered("EmailEntered", { email });
      } else {
        toast.success(request.data.Response.Message);
      }
    } catch (err) { }
    finally {
      setPageBtn(false)
    }
  };
  const ResendotpCTA = async (values) => {
    console.log("resend")
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "EMAIL VERIFICATION PAGE",
      EP_FULL_NAME: localStorage.getItem("EmailId"),
      EP_CTA: "GET OTP",
    });

  };

  const onSubmit2 = (values) => {
    console.log(values);
    setModalShow(true);
    let gmailID = localStorage.getItem("EmailId");
    let otp1 = values.otp1,
      otp2 = values.otp2,
      otp3 = values.otp3,
      otp4 = values.otp4;
    let otp = [otp1, otp2, otp3, otp4].join("");
    PixelTrigger(values);
    validateEmailOtp(gmailID, otp, "otp");
  };
  const validateEmailOtp = async (mail, values, data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        SERVICES.ACCOUNTOPENING,
        {
          fullName: localStorage.getItem("FullName"),
          pan: localStorage.getItem("Pan"),
          mobile: localStorage.getItem("mobile"),
          emailId: mail || localStorage.getItem("EmailId"),
          dob: localStorage.getItem("Dob"),
          dobEkyc: localStorage.getItem("Dob"),
          utmSource: localStorage.getItem("source"),
          UtmCampaign: localStorage.getItem("campaign"),
          utmMedium: localStorage.getItem("medium"),
          otpUqid: localStorage.getItem("emailUq") || mail,
          validateBy: data,
          mobPswd: values,
          keyvalue: "",
          ip: localStorage.getItem("IpAddress"),
          source: "EKYCWEBSITE",
          termContent: localStorage.getItem("terms") || "",
          hasEncrypted: true,
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      let validatedSmsotp = AESDecryption(response.data);
      let decodeValidatedSmsOtp = JSON.parse(JSON.parse(validatedSmsotp));
      console.log(decodeValidatedSmsOtp, "decodeValidatedSmsOtp");
      if (decodeValidatedSmsOtp?.Status?.toLowerCase() == "success") {

        sendToCleverTap("BFSL_APPLICATION_CLICKED", {
          EP_PAGE_NAME: "EMAIL OTP VERIFICATION PAGE",
          EP_OTP_STATUS: "VALID",
          EP_OTP_CTA: "AUTO",
        });


        if (
          decodeValidatedSmsOtp.Response.UqId != "" &&
          decodeValidatedSmsOtp.Response.UqId != null) {

          localStorage.setItem("ExistUqId", decodeValidatedSmsOtp.Response.UqId);
          localStorage.setItem("refid", decodeValidatedSmsOtp.Response.RefId);
          localStorage.setItem("UserRefID", decodeValidatedSmsOtp.Response.RefId);
          playAudio(9);
          navigate("/personal-detail");
        } else {

          // toast.error(decodeValidatedSmsOtp.Response);
          // reset2();
          // focusToFirst();
          throw new Error("UqId unavailable")
        }
      } else {
        toast.error(decodeValidatedSmsOtp.Reason);
        reset2();
        focusToFirst();
        sendToCleverTap("BFSL_APPLICATION_CLICKED", {
          EP_PAGE_NAME: "EMAIL OTP VERIFICATION PAGE",
          EP_OTP_STATUS: "INVALID",
          EP_OTP_CTA: "CLOSE",
        });

      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("telecaller") === "yes") {
    } else {
      let user = localStorage.getItem("numberUq");
      if (user === null || user === "" || user === "null") {
        // window.location.replace(window.origin);
      }
    }
  }, []);

  return (
    <>
      <div className={`${loading ? "loader" : " "}`}>
        {loading && (
          <>
            <img src={bajaj_loaderimg} className="loader-img" />
          </>
        )}
        <main className="main-content email-page">
          {mobligent && <img src={mobilegentUrl} height="1" width="1" alt="" />}
          <Container>
            <Row>
              <Col md="8">
                <div className="page-left viewHeight">
                  <a
                    role="button"
                    to="/"
                    onClick={() => {
                      sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                        EP_PAGE_NAME: "EMAIL VERIFICATION PAGE",
                        EP_OTHER_EMAIL_ID: localStorage.getItem("EmailId") ? localStorage.getItem("EmailId")?.trim() : "",
                        EP_CTA: "BACK",
                      });
                      navigate("/pan-page");
                      pauseAudio();
                    }}
                    className="back-button"
                  >
                    <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                  </a>

                  <h2 className="page-title">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .STOCK_MARKET
                    }
                  </h2>
                  <h3 className="page-subtitle">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .SOCIAL_MEDIA_PROFILE
                    }
                  </h3>
                  <div className="verify-card-wrapper">
                    {process.env.REACT_APP_DOMAIN !== "PWA" && (<>
                      <div className="common-card verify-card">
                        <div className="faster-box">
                          <p className="faster-text">
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].AUTHENTICATION
                            }
                          </p>
                          <div className="faster-word-wrapper">
                            <img src={fastforward_icon} alt="" />
                            <p className="faster-word">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].FASTER
                              }
                            </p>
                          </div>
                        </div>
                        <div className="social-list">
                          <ul>
                            <li>
                              <a
                                className="google-login social-btn"
                                style={{
                                  cursor:
                                    localStorage.getItem("telecaller") === "yes"
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                <img src={google_icon} alt="" />
                                <p className="social-name">
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].GOOGLE
                                  }
                                </p>
                                {localStorage.getItem("telecaller") === "no" && (
                                  <GoogleLogin
                                    clientId={clientId}
                                    buttonText="Sign in with Google"
                                    onSuccess={onSuccess}
                                    onFailure={onFailure}
                                    cookiePolicy={"single_host_origin"}
                                  />
                                )}
                              </a>
                            </li>

                            <li>
                              <a
                                className="social-btn"
                                style={{
                                  cursor:
                                    localStorage.getItem("telecaller") ===
                                      "yes"
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                <img src={facebook_icon} alt="" />
                                <p className="social-name">
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].FACEBOOK
                                  }
                                </p>
                                {localStorage.getItem("telecaller") ===
                                  "no" && (
                                    <FacebookLogin
                                      appId="510438761126669"
                                      fields="name,email,picture"
                                      autoLoad={false}
                                      callback={responseFacebook}
                                    />
                                  )}
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="or-divider">
                        <p>
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].OR
                          }
                        </p>
                      </div>
                    </>
                    )}

                    <div className="email-forms common-card">
                      <form key={1} onSubmit={handleSubmit(onSubmit)}>
                        <div className="d-md-flex align-items-end">
                          <div className="form-group w-100" ref={emailRef}>
                            <input
                              type="text"
                              nameattribute="email"
                              defaultValue={localStorage.getItem("EmailId") ? localStorage.getItem("EmailId") : ""}
                              onFocus={() => setFocusState({ email: true })}
                              onBlur={() => {
                                setFocusState({ email: false });
                                setStartListening(false);
                              }}
                              {...register("emailId", {
                                required: "Please Enter Email ID",
                                pattern: {
                                  value:
                                    /^\w+([\.-]?\w+)*@[A-Za-z]{1}\w+([\.-]?\w+)*(\.[A-Za-z]{1}\w{1,5})+$/,
                                  message: "Enter Valid Email ID",
                                },
                                onBlur: (e) =>
                                  ME_EventTriggered("GoogleSignIn", { "Email": e.target.value })
                              })}
                              className={`form-control mb-0 has-value ${errors.emailId ? "is-invalid" : ""
                                }`}
                            />

                            <label className="form-label">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].EMAILID
                              }
                              <span className="label-required">*</span>
                            </label>
                            {focusState.email && (
                              <i className="listen-mic">
                                <svg
                                  className={
                                    startListening
                                      ? "new-icon new-icon-Unmute"
                                      : "new-icon new-icon-Mute"
                                  }
                                  onClick={() => {
                                    !startListening
                                      ? setStartListening(true)
                                      : setStartListening(false);
                                    emailRef.current.children[0].focus();
                                  }}
                                >
                                  {
                                    startListening
                                      ? <use href="#new-icon-Unmute"></use>
                                      : <use href="#new-icon-Mute"></use>
                                  }
                                </svg>
                              </i>
                            )}
                            <p className="invalid-feedback">
                              {errors.emailId?.message}
                            </p>
                          </div>
                          {formvalue.emailId ? (
                            <input
                              type="submit"
                              name="submit"
                              disabled={pageBtn}
                              className=" ekyc-comn-btn submit-btn2"
                              value={
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].GET_OTP
                              }
                            />
                          ) : (
                            <input
                              type="submit"
                              name="submit"
                              disabled={pageBtn}
                              className="submit-btn2"
                              value={
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].GET_OTP
                              }
                            />
                          )}
                        </div>
                      </form>
                    </div>
                  </div>

                  <BottomList />
                </div>
              </Col>
              <div className="col-md-4 position-inherit">
                <div className="d-flex flex-column justify-content-between h-100">
                  <ChatCard
                    chatSubtitle={
                      "All your trade & fund related details are sent on your registered email Id. So just in case you are eligible for dividends someday we don’t want you to miss the information. "
                    }
                  />
                  <div className="user-bottom-img img-hight">
                    <img src={userBottomImg} alt="person icon" />
                  </div>
                </div>
              </div>
            </Row>
          </Container>
        </main>
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
          <svg class="new-icon new-icon-close"><use href="#new-icon-close"></use></svg>
        </div>
        <Modal.Body>
          <div>
            <h3 className="modal-title">OTP Verification</h3>
            <p className="modal-para">
              Enter the OTP sent to your Email ID {userEmail}
              <br />
            </p>
          </div>
          <div>
            <form method="post" action="" id="otp-form" autoComplete="off">
              <div className="form-group">
                <input
                  type="text"
                  minLength="1"
                  maxLength="1"
                  autoFocus={true}
                  name="otp1"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  onInput={(e) => {
                    digitValidate(e);
                    oneDigit(e);
                  }}
                  onKeyUp={(e) => tabChange(e, 1)}
                  className="otp-form-control"
                  {...register2("otp1", {
                    required: true,
                  })}
                />

                <input
                  type="text"
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
            <Timer resendOtp={getEmailOtp} resendOtpCT={ResendotpCTA}/>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default EmailVerification;
