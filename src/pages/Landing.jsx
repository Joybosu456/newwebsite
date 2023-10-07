import { React, useState, useEffect, useRef } from "react";
import screen_img from "../assets/images/screen.gif";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import ModalClose from "../assets/images/icons/Close.svg";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Timer from "../components/Timer";
import SubscriptionPackTable from "./SubscriptionPackTable";
import AnnualBrokerageAmount from "./AnnualBrokerageAmount";
import FAQ from "./FAQ";
import BottomList from "../components/BottomList";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import { SERVICES } from "../common/constants";
import $ from "jquery";
import { useSpeechRecognition } from "react-speech-kit";
import bird3 from "../assets/images/bird3.png";
import independence from "../assets/images/independence-right-Two.svg";
import independenceResponsive from "../assets/images/inde-right-res.svg";



// import CryptoJS from "crypto-js";
import {
  digitValidate,
  mobileVal,
  playAudio,
  oneDigit,
  ResetLocal,
  getSearchParameters,
  dateInput,
  AESDecryption,
  sendToCleverTap,
  clevertapIdentity,
  EkcyDate,
  shareError,
  decryptUserData,
  nameValidation,
  ME_EventTriggered,
} from "../common/common.js";
import Language from "../common/Languages/languageContent.json";
import {
  getReferralCodeFromURL,
  getUserToken,
  startTracking,
} from "../components/FlyySDK";
import { OptValidationApi, mobileotpApi } from "../ApiMethod/LandingApi";
import FlyySDK from "flyy-web-sdk";
import indiaflag from "../assets/images/indiaflag.svg";
function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [otpModal, setOtpModal] = useState(false);
  const [signatureguidemodal, setSignatureguidemodal] = useState(false);
  const [userNumber, setUserNumber] = useState("");
  const [resumeClient, setResumeClient] = useState(false);
  const [resumeCase, setResumeCase] = useState(false);
  const [startListening, setStartListening] = useState();
  const [emailModalShow, setEmailModalShow] = useState(false);
  const [mobligent, setMobligent] = useState(false);
  const [mobilegentUrl, setMobilegentUrl] = useState("");
  const mobile1Ref = useRef(null);
  const mobile2Ref = useRef(null);
  const fullname1Ref = useRef(null);
  const stickyFullnameRef = useRef(null);
  const referralCode1Ref = useRef(null);
  const [tncModal, setTncModal] = useState(false);
  const [clientData, setClientData] = useState();
  const [focusState, setFocusState] = useState({
    mobile1: false,
    fullname1: false,
    mobile2: false,
    fullname2: false,
  });
  const [pageBtn, setPageBtn] = useState(false);
  let last4Str, last4Num;
  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      if (document.activeElement.getAttribute("nameattribute") === "mobile1")
        setValue("mobile", result.split(" ").join(""));
      else if (
        document.activeElement.getAttribute("nameattribute") === "fullname1"
      )
        setValue("fullname", result);
      if (document.activeElement.getAttribute("nameattribute") === "mobile3")
        stickyValue("mobile", result.split(" ").join(""));
      else if (
        document.activeElement.getAttribute("nameattribute") === "fullname3"
      )
        stickyValue("fullname", result);
    },
  });

  useEffect(() => {
    // const d = new Date();
    // let time = d.getTime();
    // console.log(time)
    ResetLocal();
    window.addEventListener("scroll", scrollFunction);
    return () => {
      window.removeEventListener("scroll", scrollFunction);
    };
  }, []);
  useEffect(() => {
    startListening ? listen() : stop();
  }, [startListening]);

  useEffect(() => {
    console.log("hi this landing page for ci/cd test");
    sendToCleverTap("BSFL_APPLICATION_VIEWED", {
      EP_PAGE_NAME: "HOME PAGE",
    });
    let params = getSearchParameters();
    if (params.req) {
      let userData = JSON.parse(decryptUserData(params.req));
      console.log(userData, "userData");
      let DOB = userData.dob.split("/").reverse().join("-")
      if (DOB) {
        localStorage.setItem("Dob", DOB);
      } else {
        localStorage.setItem("Dob", "");
      }
      localStorage.setItem("Pan", userData.panNo || "");
      localStorage.setItem("FirstName", userData.firstName || "");
      localStorage.setItem("LastName", userData.lastName || "");
      localStorage.setItem("FullName", localStorage.getItem("FirstName") + " " + localStorage.getItem("LastName") || "");
      localStorage.setItem("emailId", userData.emailId || "");
      setValue("mobile", userData.mobileNo || "");

      // // setValue("pan", userData.panNo || "");
      // // setValue("dob", userData.dob.split("/").reverse().join("-") || "");


      setValue("fullname", localStorage.getItem("FullName") || "");
      // setValue("mobile", userData.mobileNo || "");

      // setValue("pan", userData.panNo || "");

      // setValue("dob", userData.dob.split("/").reverse().join("-") || "");

      // localStorage.setItem("emailId", userData.emailId || "");
      sendToCleverTap("BFSL_APPLICATION_VIEWED", {
        EP_PAGE_NAME: "HOME PAGE",
        EP_MOBILE_NO: userData.mobileNo,
      });

    } else {
      // setValue("dob", EkcyDate.minorDate);
      // stickyValue("dob", EkcyDate.minorDate);
      return;
    }
  }, []);

  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    localStorage.setItem("IpAddress", res.data.IPv4);
  };
  useEffect(() => {
    const flyySDK = new FlyySDK();
    flyySDK.startReferralTracking();
    console.log("referral tracking start");
  }, []);

  useEffect(() => {
    getData();
    let params = getSearchParameters();
    localStorage.setItem("campaign", params?.utm_campaign || "ekyc");
    localStorage.setItem("medium", params?.utm_medium || "ekyc");
    localStorage.setItem("terms", params?.utm_content || "");
    localStorage.setItem("source", params?.utm_source || "ekyc");
    // if (params?.referal_code) {
    //   setValue("referralCode", params?.referal_code);
    //   document.querySelector('input[name="referralCode"]').readOnly = true;
    // }
  }, []);

  useEffect(() => {
    let referralParams = getSearchParameters();
    let refCode = getReferralCodeFromURL(referralParams);
    if (refCode) {
      localStorage.setItem("referralCode", refCode);
      setValue("referralCode", refCode);
      document.querySelector('input[name="referralCode"]').readOnly = true;
    }
    console.log(localStorage.getItem("referralCode", refCode), "refCode");
  }, []);

  const focusToFirst = () => {
    let ele = document.querySelectorAll(".otp-form-control");
    ele[0].focus();
  };
  const tabChange = (e, num) => {
    console.log(e.target.value, num);
    setMobileOtp(`otp${num}`, e.target.value);
    // mobileOtpRegister
    let ele = document.querySelectorAll(".otp-form-control");
    if (num > 1 && ele[num - 1].value == "") {
      ele[num - 2].focus();
    }
    if (num < 4 && ele[num - 1].value != "") {
      ele[num].focus();
    }
    let otp = getMobileOtpValue();
    ME_EventTriggered("OTPEntered", otp);

    const { otp1, otp2, otp3, otp4 } = otp;

    if (otp1 && otp2 && otp3 && otp4) {
      console.log("all 4 correct");
      handleMobileOtp(onSubmit2)();
    } else {
      console.log("not 4 correct");
    }
  };

  const tabChangeEMail = (e, num) => {
    let ele = document.querySelectorAll(".otp-form-control");
    if (num > 1 && ele[num - 1].value == "") {
      ele[num - 2].focus();
    }
    if (num < 4 && ele[num - 1].value != "") {
      ele[num].focus();
    }

    if (emailOtpState.isValid === true) {
      handleSubmitMailOtp(onSubmitEmailOTP)();
    }
  };

  function trimMobile(value) {
    last4Str = String(value).slice(-4);
    last4Num = Number(last4Str);
  }
  const schema = Yup.object().shape({
    fullname: Yup.string()
      .required("Enter First Name and Last Name"),
    mobile: Yup.string()
      .required("Mobile Number is a required field.")
      .matches(
        /^[6-9]{1}[0-9]{9}$/,
        "Please enter valid number,Initial digit must range from 6 -9 "
      ),
    checkbox: Yup.bool().oneOf([true], "Please Agree Terms & Conditions"),
  });
  const schema3 = Yup.object().shape({
    fullname: Yup.string()
      .required("Enter First Name and Last Name"),
    // .matches(
    //   /^[a-zA-Z.][a-zA-Z.]*$/,
    //   "Please fill Firstname and Lastname respectively"
    // ),
    mobile: Yup.string()
      .required("Mobile Number is a required field.")
      .matches(
        /^[6-9]{1}[0-9]{9}$/,
        "Please enter valid number,Initial digit must range from 6 -9 "
      ),
    checkbox: Yup.bool().oneOf([true], "Please Agree Terms & Conditions"),
  });
  const emailSchema = Yup.object().shape({
    emailId: Yup.string()
      .required("Email Id is a required field.")
      .matches(
        /^\w+([\.-]?\w+)*@[A-Za-z]{1}\w+([\.-]?\w+)*(\.[A-Za-z]{1}\w{1,5})+$/,
        "Please enter valid email"
      ),
  });

  const OtpSchema = Yup.object().shape({
    otp1: Yup.string().required(),
    otp2: Yup.string().required(),
    otp3: Yup.string().required(),
    otp4: Yup.string().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    formState: openAccountState,
    getValues: getOpenAccountValues,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit: handleMobileOtp,
    register: mobileOtpRegister,
    setValue: setMobileOtp,
    reset: mobileOtpReset,
    getValues: getMobileOtpValue,
    formState: mobileOtpState,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(OtpSchema),
  });

  const {
    handleSubmit: handleSubmitMailOtp,
    register: registerEmailOTP,
    formState: emailOtpState,
    reset: resetEmailOtp,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(OtpSchema),
  });

  const {
    register: stickyRegister,
    handleSubmit: handleSticky,
    formState: { errors: stickyError },
    formState: stickyState,

    getValues: getStickyValue,
    setValue: stickyValue,
  } = useForm({
    resolver: yupResolver(schema3),
    mode: "onChange",
  });
  const {
    register: registerEmail,
    handleSubmit: handleEmail,
    formState: { errors: emailerrors },
    formState: emailModalState,
    getValues: getEmailValue,
    setValue: setEmailValue,
  } = useForm({
    resolver: yupResolver(emailSchema),
    mode: "onChange",
  });
  const submitEmail = () => {
    SendOtp(clientData);
  };
  const SendOtp = async (value) => {
    let clientvalue;
    if (value) {
      clientvalue = value;
    } else {
      clientvalue = clientData;
    }
    let customerName;
    if (clientvalue.PersonalDetailsRes.FirstName !== "") {
      customerName = clientvalue.PersonalDetailsRes.FirstName;
    }
    if (clientvalue.PersonalDetailsRes.MiddleName !== "") {
      customerName =
        customerName + " " + clientvalue.PersonalDetailsRes.MiddleName;
    }
    if (clientvalue.PersonalDetailsRes.LastName !== "") {
      customerName =
        customerName + " " + clientvalue.PersonalDetailsRes.LastName;
    }
    try {
      const response = await axios.post(
        SERVICES.SENDEMAILOTP,
        {
          emailID: getEmailValue("emailId"),
          customerName: customerName,
          url: "",
          option: "",
          refid: clientvalue?.FlagRes?.Id,
          mobileNo: clientvalue?.AccountOpeningRes?.Mobile,
        },
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );

      if (
        response.data.Response.Message === "OTP sccessfully sent on email id"
      ) {
        let emailOne = document.getElementById("emailOtp1");
        emailOne.focus();
        focusToFirst();
      }
      if (response.data.Response.Message === "Otp limit exceed") {
        toast.error(response.data.Response.Message);
      }
      // localStorage.setItem("leadCaptureId", response.data.Response.Id);
    } catch (err) {
      setLoading(false);
      throw new Error(err.message);
    } finally {
      resetEmailOtp();
    }
  };
  const otpApiCall = async (values) => {
    console.log(values, "resend")
    // sendToCleverTap("BFSL_APPLICATION_CLICKED", {
    //   EP_PAGE_NAME: "HOME PAGE",
    //   EP_MOBILE_NO: values?.mobile || localStorage.getItem("mobile"),
    //   EP_NAME: values?.fullname || localStorage.getItem("FullName"),
    //   EP_REFERRAL_CODE: values?.referralCode || localStorage.getItem("referralCode"),
    //   EP_CTA: "GET OTP",
    // });

    setPageBtn(true)
    const { mobileotpResponse, mobileotpError } = await mobileotpApi(values);
    setPageBtn(false)
    if (mobileotpError) {
      toast.error(mobileotpError.message);
      throw new Error(mobileotpError.message);
    } else if (mobileotpResponse) {
      if (mobileotpResponse.Response.OtpCount < 5) {
        setErrorMessage(
          "Please note: that you can regenerate the OTP only 5 times in a day. Check your internet or wait for some time before regenerating OTP."
        );
        setResumeCase(mobileotpResponse.Response.Case);
        // setOtpModal(true);
        // playAudio(3);
        if (
          mobileotpResponse.Response.Case === "Exist" ||
          mobileotpResponse.Response.Case === "Resume"
        ) {
          sendToCleverTap("BFSL_APPLICATION_VIEWED", {
            EP_PAGE_NAME: "MOBILE OTP VERIFICATION POPUP",
          });
          setOtpModal(true);
          playAudio(3);
          setResumeClient(true);
        }
        if (
          mobileotpResponse.Response.Case === "New"
        ) {
          sendToCleverTap("BFSL_APPLICATION_VIEWED", {
            EP_PAGE_NAME: "MOBILE OTP VERIFICATION POPUP",
          });
          setOtpModal(true);
          playAudio(3);
          setResumeClient(false);
        }
        if (mobileotpResponse.Response.Case === "") {
          toast.error(mobileotpResponse.Response.Message);
        }
      } else {
        setErrorMessage(
          "Oops your limit to regenerate the OTP 5 times in a day is exceeded. You can try again after 24 hours or use a different mobile number to proceed"
        );
        toast.error(mobileotpResponse.Response.OtpLimit);
      }
    }
  };

  const ResendotpCTA = async (values) => {
    console.log("resend")
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "HOME PAGE",
      EP_MOBILE_NO: values?.mobile || localStorage.getItem("mobile"),
      EP_NAME: values?.fullname || localStorage.getItem("FullName"),
      EP_REFERRAL_CODE: values?.referralCode || localStorage.getItem("referralCode"),
      EP_CTA: "RESEND OTP",
    });
  };



  const onSubmit = (values,type) => {
    console.log(values);
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "HOME PAGE",
      EP_MOBILE_NO: values?.mobile || localStorage.getItem("mobile"),
      EP_NAME: values?.fullname || localStorage.getItem("FullName"),
      EP_REFERRAL_CODE: values?.referralCode || localStorage.getItem("referralCode"),
      EP_CTA: "GET OTP",
    });
   
     // my ode start
    // open account form set
    localStorage.setItem("telecaller", "no");
    localStorage.setItem("mobile", values.mobile);
    localStorage.setItem("FullName", values.fullname);
    localStorage.setItem("referralCode", values.referralCode);

    // let DobStatus = shareError(getOpenAccountValues("dob"), "dob-error");
    // if (DobStatus) {
    clevertapIdentity(values.mobile);
    setLoading(true);
    trimMobile(values.mobile);
    setUserNumber(last4Num);

    // open account close set
    otpApiCall(values);
    leadCapture(values);
    setLoading(false);
    ME_EventTriggered("Get OTP", values);    // }


    // setOtpModal(true);

    //my ocde s
    return;

    // let DobStatus = shareError(getOpenAccountValues("dob"), "dob-error");
    // console.log(DobStatus, "DobStatus");
    // if (DobStatus) {
    //   clevertapIdentity(values.mobile);
    //   setLoading(true);
    //   trimMobile(values.mobile);
    //   setUserNumber(last4Num);
    //   localStorage.setItem("mobile", values.mobile);
    //   localStorage.setItem("referralCode", values.referralCode);
    //   localStorage.setItem("Dob", values.dob);
    //   // CookieSet("mobile", values.mobile);
    //   // CookieSet("pan", values.pan.toUpperCase());
    //   leadCapture(values);
    //   validateMobileCustomer(values);
    // }
  };
  const onSubmitEmailOTP = (values) => {
    let otp1 = values.otp1,
      otp2 = values.otp2,
      otp3 = values.otp3,
      otp4 = values.otp4;
    let otp = [otp1, otp2, otp3, otp4].join("");
    submitMailOtp(otp);
  };
  const submitMailOtp = async (otp) => {
    let clientvalue = clientData;
    let customerName;
    if (clientvalue.PersonalDetailsRes.FirstName !== "") {
      customerName = clientvalue.PersonalDetailsRes.FirstName;
    }
    if (clientvalue.PersonalDetailsRes.MiddleName !== "") {
      customerName =
        customerName + " " + clientvalue.PersonalDetailsRes.MiddleName;
    }
    if (clientvalue.PersonalDetailsRes.LastName !== "") {
      customerName =
        customerName + " " + clientvalue.PersonalDetailsRes.LastName;
    }
    try {
      const response = await axios.post(
        SERVICES.VALIDATEDEMAILOTP,
        {
          mobileNo: clientvalue?.AccountOpeningRes?.Mobile,
          customerName: customerName,
          url: "",
          option: "",
          refId: clientvalue?.FlagRes?.Id,
          emailID: getEmailValue("emailId"),
          otp: otp,
          hasEncrypted: true,
        },
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );

      let validatedEmailotp = AESDecryption(response.data);
      let decodeValidatedEmailOtp = JSON.parse(JSON.parse(validatedEmailotp));
      if (
        decodeValidatedEmailOtp.Response === "OTP entered is incorrect. Please try again!" ||
        decodeValidatedEmailOtp.Response === "OTP Expired, Please try again"
      ) {
        toast.error(decodeValidatedEmailOtp.Response);
        resetEmailOtp();
        focusToFirst();
      }
      if (decodeValidatedEmailOtp.Response == "Y") {
        playAudio(8);
        navigate(`/returnee-resume`);
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };
  const onSubmit2 = async (values) => {

    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "HOME PAGE",
      EP_MOBILE_NO: values.mobile,
      EP_REFERRAL_CODE: values.referralCode,
      EP_CTA: "GET OTP",
    });

    localStorage.setItem("telecaller", "no");
    if (resumeClient === true) {
      validateResume(values);
    } else {
      const { otp1, otp2, otp3, otp4 } = values;
      let data = {
        mobile: localStorage.getItem("mobile"),
        otp: `${otp1}${otp2}${otp3}${otp4}`,
        fullname: localStorage.getItem("FullName"),
      };
      const { OptValidationResponse, OptValidationError } =
        await OptValidationApi(data);
      console.log(OptValidationResponse, OptValidationError, "OptValidationResponse");
      if (OptValidationResponse) {
        console.log(OptValidationResponse, "OptValidationResponse");
        if (OptValidationResponse.Status.toLowerCase() == "failed") {
          toast.error(OptValidationResponse.Reason);
          mobileOtpReset();
          focusToFirst();
        } else {
          if (
            OptValidationResponse.Response.Status.toLowerCase() ==
            "otp verified"
          ) {
            sendToCleverTap("BFSL_APPLICATION_CLICKED", {
              EP_PAGE_NAME: "MOBILE OTP VERIFICATION",
              EP_OTP_STATUS: "VALID",
              EP_OTP_CTA: "AUTO",
            });
            // console.log("verifdued");
            localStorage.setItem("panId", OptValidationResponse.Response.Id);
            localStorage.setItem(
              "mobile",
              OptValidationResponse.Response.MobileNo
            );
            localStorage.setItem(
              "referralCode",
              OptValidationResponse.Response.ReferralCode
            );
            if (localStorage.getItem("source")?.toLowerCase() === "trade") {
              getUserToken(
                localStorage.getItem("mobile"),
                localStorage.getItem("referralCode")
              );
            }
            navigate("/pan-page");
          }
        }
      } else if (OptValidationError) {
        console.log(OptValidationError.message, "OptValidationError");
        throw new Error(OptValidationError.message);
      }
      // validateSmsOtp(values);
      PixelTrigger();
    }
  };
  const onSubmit3 = (values) => {
    let ref = getOpenAccountValues("referralCode");
    localStorage.setItem("telecaller", "no");
    localStorage.setItem("mobile", values.mobile);
    localStorage.setItem("FullName", values.fullname);
    localStorage.setItem("referralCode", ref);

    // localStorage.setItem("mobile", values.mobile);
    // localStorage.setItem("referralCode", ref);
    // localStorage.setItem("Dob", values.dob);

    // let DobStatus = shareError(getStickyValue("dob"), "dob-error");
    // if (DobStatus) {
    clevertapIdentity(values.mobile);
    setLoading(true);
    trimMobile(values.mobile);
    setUserNumber(last4Num);

    // open account close set
    otpApiCall(values);
    ME_EventTriggered("StickyForm GetOtp", { values });
    leadCapture(values);
    setLoading(false);
    // }

    //my code start

    // setOtpModal(true);
    //my code end

    return;
    // let ref = getOpenAccountValues("referralCode");
    // let dobStatus = shareError(getStickyValue("dob"), "dob-error3");
    // if (dobStatus) {
    //   // validateMobileCustomer(values);

    //   // setLoading(true);
    //   trimMobile(values.mobile);
    //   setUserNumber(last4Num);
    //   localStorage.setItem("mobile", values.mobile);
    //   localStorage.setItem("Pan", values.pan());
    //   localStorage.setItem("referralCode", ref);
    //   localStorage.setItem("Dob", values.dob);
    //   leadCapture(values);
    //   validateMobileCustomer(values);
    // }
  };
  const formvalue = watch();
  const leadCapture = async (values) => {
    try {
      const response = await axios.post(
        SERVICES.LAEDSAVE,
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
            termContent: localStorage.getItem("terms") || "",
            fatherName: "",
            fullname: localStorage.getItem("FullName") || "",
            dob: "",
            email: values.emailId,
            screen: 1,
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
      localStorage.setItem("leadCaptureId", response.data.Response.Id);
    } catch (err) {
      setLoading(false);
      throw new Error(err.message);
    }
  };
  const validateMobileCustomer = async () => {
    // required dob format DD-MM-YYYY
    try {
      const responeOtp = await axios.post(
        SERVICES.MOBILEOTP,
        {
          mobilePan: {
            mobile: localStorage.getItem("mobile"),
            pan: localStorage.getItem("Pan"),
            ip: localStorage.getItem("IpAddress"),
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
      // if (
      //   responeOtp.data.Response.Message === "Valid Pan But Aadhaar Not Seeded"
      // ) {
      //   setSignatureguidemodal(true);
      // } else {
      //   setSignatureguidemodal(false);
      // }
      if (responeOtp.data.Response.otpLimit == "OTP LIMIT EXCEED") {
        setErrorMessage(
          "Oops your limit to regenerate the OTP 5 times in a day is exceeded. You can try again after 24 hours or use a different mobile number to proceed"
        );
      } else if (
        responeOtp.data.Response.OtpCount == 1 ||
        responeOtp.data.Response.OtpCount == 2 ||
        responeOtp.data.Response.OtpCount == 3 ||
        responeOtp.data.Response.OtpCount == 4 ||
        responeOtp.data.Response.OtpCount == 5
      ) {
        setErrorMessage(
          "Please note: that you can regenerate the OTP only 5 times in a day. Check your internet or wait for some time before regenerating OTP."
        );
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
        sendToCleverTap("BFSL_APPLICATION_VIEWED", {
          EP_PAGE_NAME: "MOBILE OTP VERIFICATION POPUP",
        });

        setOtpModal(true);
        playAudio(3);
        if (
          responeOtp.data.Response.Case === "Exist" ||
          responeOtp.data.Response.Case === "Resume"
        ) {
          setResumeClient(true);
          setResumeCase(responeOtp.data.Response.Case);
        } else {
          setResumeClient(false);
        }
      }
      localStorage.setItem("numberUq", responeOtp.data.Response.UqId);
    } catch (err) {
      toast.error(err.message);
      throw new Error(err.message);
    } finally {
      setLoading(false);
      mobileOtpReset();
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
            pan: localStorage.getItem("Pan")(),
            dob: localStorage.getItem("Dob"),
            referralCode: localStorage.getItem("referralCode"),
            termContent: localStorage.getItem("terms") || "",
          },
          screenType: 0,
          hasEncrypted: true,
        },
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );

      let validatedSmsotp = AESDecryption(response.data);
      let decodeValidatedSmsOtp = JSON.parse(JSON.parse(validatedSmsotp));
      localStorage.setItem("token", decodeValidatedSmsOtp.Response.Token);
      if (decodeValidatedSmsOtp.Response.Status === "Otp Verified") {
        console.log(values, "number");

        getUserToken(
          localStorage.getItem("mobile"),
          localStorage.getItem("referralCode")
        );
        getPanDetails(values);
      } else {

        toast.error(decodeValidatedSmsOtp.Reason);
        focusToFirst();
        mobileOtpReset();
      }
    } catch (err) {
      toast.error(err.message);
      throw new Error(err.message);
    } finally {
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
            // pan: localStorage.getItem("Pan"),
            otp: otp,
            referralCode: localStorage.getItem("referralCode"),
            termContent: localStorage.getItem("terms") || "",
            // utmSource: localStorage.getItem("source") || ""
          },
          screenType: 15,
          hasEncrypted: true,
        },
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );
      console.log(response, "response")
      let MobileSMSValidation = AESDecryption(response.data);
      let DecodedMobileSmsValidation = JSON.parse(
        JSON.parse(MobileSMSValidation)
      );
      console.log(DecodedMobileSmsValidation, "DecodedMobileSmsValidation");
      if (DecodedMobileSmsValidation.Response.IsAadharPanSeeded === false) {
        // console.log(DecodedMobileSmsValidation.Response.IsAadharPanSeeded)
        setOtpModal(false)
        setSignatureguidemodal(true)
        return
      } else {
        setSignatureguidemodal(false)
      }

      if (DecodedMobileSmsValidation.Status === "Success") {
        localStorage.setItem(
          "token",
          DecodedMobileSmsValidation.Response.Token
        );

        // setTimeout(NavigatePage, 2000);
        // function NavigatePage() {
        if (resumeCase == "Exist") {
          sendToCleverTap("BFSL_APPLICATION_CLICKED", {
            EP_PAGE_NAME: "MOBILE OTP VERIFICATION",
            EP_OTP_STATUS: "VALID",
            EP_OTP_CTA: "AUTO",
          });
          localStorage.setItem(
            "ExistUqId",
            DecodedMobileSmsValidation.Response.Uqid
          );
          ResumeApplication();
        } else {
          if (DecodedMobileSmsValidation.Response.Dob) {
            console.log(
              "DecodedMobileSmsValidation.Response.Dob Example 12/31/2004 00:00:00"
            );
            const DOB = DecodedMobileSmsValidation.Response.Dob.split(" ")[0];
            let Dob = DOB.split("/");
            console.log(Dob, "MM/DD/YYYY");
            let Bdob = `${Dob[2]}-${Dob[0]}-${Dob[1]}`;
            console.log(Bdob, "sfuvgui", "YYYY-MM-DD");
            localStorage.setItem("Dob", Bdob || "");
          }
          const Fullname = DecodedMobileSmsValidation.Response.Cname;
          const Pan = DecodedMobileSmsValidation.Response.Pan;
          const Mobile = DecodedMobileSmsValidation.Response.Mobile;
          if (Fullname) {
            let name = Fullname.split(" ");
            if (name.length > 1) {
              localStorage.setItem("FirstName", name[0]);
              localStorage.setItem(
                "LastName",
                name[name.length - 1].toUpperCase()
              );
            }
          }
          localStorage.setItem("FullName", Fullname || "");
          localStorage.setItem("panId", DecodedMobileSmsValidation.Response.Id);
          localStorage.setItem("Pan", Pan);
          localStorage.setItem("mobile", Mobile);
          localStorage.setItem(
            "FatherName",
            DecodedMobileSmsValidation.Response.FatherName ||
            localStorage.getItem("FatherName") ||
            ""
          );
          if (DecodedMobileSmsValidation.Response.ISPANUpdate === true) {
            playAudio(7);
            navigate("/email-verification");
          } else {
            sendToCleverTap("BFSL_APPLICATION_CLICKED", {
              EP_PAGE_NAME: "MOBILE OTP VERIFICATION",
              EP_OTP_STATUS: "VALID",
              EP_OTP_CTA: "AUTO",
            });
            if (Pan != "") {
              navigate("/pan-page"); // Datta changes due to Backdated Cases Issue @16-08-2023
              // playAudio(4);
              // navigate("/pan-details");
            } else {
              navigate("/pan-page");
            }
          }
        }
        // }
      } else {
        sendToCleverTap("BFSL_APPLICATION_CLICKED", {
          EP_PAGE_NAME: "MOBILE OTP VERIFICATION",
          EP_OTP_STATUS: "INVALID",
          EP_OTP_CTA: "CLOSE",
        });

        toast.error(DecodedMobileSmsValidation.Reason);
        mobileOtpReset();
        focusToFirst();
      }
    } catch (err) {
      sendToCleverTap("BFSL_APPLICATION_CLICKED", {
        EP_PAGE_NAME: "MOBILE OTP VERIFICATION",
        EP_OTP_STATUS: "INVALID",
        EP_OTP_CTA: "CLOSE",
      });

      toast.error(err.message);
      throw new Error(err.message);
    } finally {
    }
  };

  const ResumeApplication = async () => {
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
      if (resumeResp.Response) {
        setClientData(resumeResp.Response);
      }
      if (resumeResp.Response.FlagRes.IsEmailValidated === true) {
        playAudio(8);
        navigate(`/returnee-resume`);
      } else {
        setOtpModal(false);
        setEmailModalShow(true);
        setEmailValue(
          "emailId",
          resumeResp.Response.AccountOpeningRes.EmailId.toLowerCase()
        );
        SendOtp(resumeResp.Response);
      }

      let userName =
        resumeResp.Response.PersonalDetailsRes.FirstName.replace(
          /[^a-zA-Z0-9]/g,
          ""
        ) +
        " " +
        resumeResp.Response.PersonalDetailsRes.LastName.replace(
          /[^a-zA-Z0-9]/g,
          ""
        );
      localStorage.setItem("FullName", userName);
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
      localStorage.setItem("refId", resumeResp.Response.FlagRes.Id);
      localStorage.setItem("UserRefID", resumeResp.Response.FlagRes.Id);
    } catch (err) {
      throw new Error(err.message)
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
      console.log(response.data.Response.dob, "rest data");
      if (Fullname) {
        let name = Fullname.split(" ");
        if (name.length > 1) {
          localStorage.setItem(
            "FirstName",
            name[0].replace(/[^a-zA-Z0-9]/g, " ")()
          );
          localStorage.setItem(
            "LastName",
            name[name.length - 1].replace(/[^a-zA-Z0-9]/g, " ")()
          );
        }
      }
      let fatherName = "";
      if (response.data.Response.dependentFName !== "") {
        fatherName = response.data.Response.dependentFName();
      }
      if (response.data.Response.dependentMName !== "") {
        if (fatherName !== "") {
          fatherName =
            fatherName + " " + response.data.Response.dependentMName();
        } else {
          fatherName = response.data.Response.dependentMName();
        }
      }
      if (response.data.Response.dependentLName !== "") {
        if (fatherName !== "") {
          fatherName =
            fatherName + " " + response.data.Response.dependentLName();
        } else {
          fatherName = response.data.Response.dependentLName();
        }
      }
      console.log(response.data.Response.dob, "response.data.Response.dob ");
      // text.replace("Microsoft", "W3Schools");
      localStorage.setItem("panId", response.data.Response.id || "");
      localStorage.setItem("FullName", Fullname || "");
      localStorage.setItem("FatherName", fatherName || "");

      localStorage.setItem(
        "Dob",
        response.data.Response.dob.replaceAll("/", "-").reverseDob() || ""
      );

      // localStorage.setItem("Dob", response.data.Response.dob.replaceAll("/", "-") || "");
      localStorage.setItem(
        "Dob",
        response.data.Response.dob.replaceAll("/", "-") || ""
      );
      localStorage.setItem("Pan", response.data.Response.pan() || "");
      if (response) {
        playAudio(4);
        navigate("/pan-page");

        // navigate("/pan-details");
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };
  const PixelTrigger = async () => {
    const utm_source_check = localStorage.getItem("source");
    if (
      // utm_source_check == "KARRIX" ||
      // utm_source_check == "NETCORE" ||
      utm_source_check == "PARABOLIC" ||

      utm_source_check == "INTELLECTADS_AFF"
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
        if (response.data.Response) {
          if (response?.data?.Response?.Flagval?.toLowerCase() === "y") {
            setMobligent(true);
            if (utm_source_check == "PARABOLIC") {
              let ID = localStorage.getItem("campaign").split("_");
              let url = ` https://parabolicpteltd10329696.o18.link/p?m=16949&tid=${ID[0]}&adv_sub1=${ID[1]}`;
              console.log(url, "url");
              setMobilegentUrl(url);
            }
            if (utm_source_check == "INTELLECTADS_AFF") {
              let url = `https://www.intellectadz.com/track/conversion.asp?cid=2886&conversionType=1&key=${localStorage.getItem("leadCaptureId")}&opt1=&opt2=&opt3=`;
              setMobilegentUrl(url);
            }

          }
        }
      } catch (err) {
        throw new Error(err.message)
      }
    }
  };
  function scrollFunction() {
    if (
      document.body.scrollTop > 350 ||
      document.documentElement.scrollTop > 350
    ) {
      document.getElementById("sticky").style.bottom = "0";
    } else {
      document.getElementById("sticky").style.bottom = "-100%";
    }
  }

  const MobileOtpInput = (e) => {
    digitValidate(e);
    oneDigit(e);
  };
  return (
    <>
      <div className={`${loading ? "loader" : " "}`}>
        {loading && (
          <>
            <img src={bajaj_loaderimg} className="loader-img" />
          </>
        )}
        <main className="main-content landing-content">
          {mobligent && <img src={mobilegentUrl} height="1" width="1" alt="" />}
          <Container className="h-md-100 ">
            <Row className="h-md-100 ">
              <Col lg={7}>
                <div className="page-left landing-page viewheight">
                  <div>
                    <h2 className="page-title text-capitalize">
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .OPEN_YOUR
                      }
                      <span>
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].Free_Demat_Acc
                        }
                      </span>
                    </h2>
                    <h3 className="page-subtitle">
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .Investment_Journey
                      }
                    </h3>
                  </div>
                  <form
                    className="page-form landing-form"
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="row">
                      <div className="col-md-6 mb-1">
                        <div
                          className="form-group pan-input custom-suggest"
                          ref={fullname1Ref}
                        >
                          <span className="tooltiptext">
                            Enter First Name & Last Name
                          </span>
                          <input
                            type="text"
                            nameattribute="fullname1"
                            name="pan-input"
                            id="pan-landing"
                            maxLength={100}
                            onFocus={() => setFocusState({ fullname1: true })}
                            onBlur={() => {
                              setFocusState({ fullname1: false });
                              setStartListening(false);
                            }}
                            onInput={(e) => nameValidation(e)}
                            // onKeyPress={(e) => nameValidation(e)}
                            {...register("fullname", {
                              onBlur: (e) =>
                                ME_EventTriggered("NameEntered", { "NameEntered": e.target.value })
                            })}
                            className={`mt-2 form-control has-value text-uppercase ${errors?.fullname ? "is-invalid" : ""
                              }`}
                          />
                          <label
                            htmlFor="pan-landing"
                            className="form-label text-uppercase"
                          >
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].Enter_Name
                            }
                            <span className="label-required">*</span>
                          </label>
                          {focusState.fullname1 && (
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
                                  fullname1Ref.current.children[1].focus();
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
                          <div className="invalid-feedback">
                            {errors.fullname?.message}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-1 ">
                        <div
                          className="form-group custom-suggest"
                          ref={mobile1Ref}
                        >
                          <span className="tooltiptext">
                            OTP will be sent on this number
                          </span>
                          <input
                            id="number-input"
                            type="text"
                            nameattribute="mobile1"
                            name="number-input"
                            onFocus={() => setFocusState({ mobile1: true })}
                            onBlur={() => {
                              setFocusState({ mobile1: false });
                              setStartListening(false);

                            }}
                            placeholder=""
                            maxLength={10}
                            className={`mt-2 form-control has-value ${errors?.mobile ? "is-invalid" : ""
                              }`}
                            {...register("mobile", {
                              onBlur: (e) =>
                                ME_EventTriggered("MobileEntered", { "MobileEntered": e.target.value })
                            })}
                            onKeyPress={(e) => mobileVal(e)}
                          />
                          <label
                            htmlFor="number-input"
                            className="form-label  text-uppercase"
                          >
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].Enter_Mob
                            }
                            <span className="label-required">*</span>
                          </label>
                          {focusState.mobile1 && (
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
                                  mobile1Ref.current.children[1].focus();
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
                          <div className="invalid-feedback">
                            {errors.mobile?.message}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div
                          className="form-group custom-suggest enter-ref-code"
                          ref={referralCode1Ref}
                        >
                          <input
                            type="text"
                            nameattribute="referralCode1"
                            name="refferal-input"
                            id="refferal-landing"
                            onFocus={() =>
                              setFocusState({
                                referralCode1: true,
                              })
                            }
                            onBlur={() => {
                              setFocusState({
                                referralCode1: false,
                              });
                              setStartListening(false);
                            }}
                            maxLength={10}
                            className={`mt-2 form-control has-value ${errors?.referralCode ? "is-invalid" : ""
                              }`}
                            {...register("referralCode", {
                              onBlur: (e) =>
                                ME_EventTriggered("ReferralCodeEntered", { "ReferralCodeEntered": e.target.value })
                            })}
                          />
                          <label
                            htmlFor="refferal-landing"
                            className="form-label text-uppercase"
                          >
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].Referral_code
                            }
                          </label>
                        </div>
                      </div>
                      {errorMessage && <div className="col-md-12">
                        <p className="otperrormsg form-group my-0">
                          {errorMessage}
                        </p>
                      </div>}

                      <div className="col-md-12">
                        <div className="form-group term-checkbox-wrapper">
                          <input
                            type="checkbox"
                            defaultChecked={true}
                            name="label-checkbox"
                            id="landing-check"
                            {...register("checkbox")}
                            className={`input-checkbox  ${errors.checkbox ? "is-invalid" : ""
                              }`}
                          />
                          <label
                            htmlFor="landing-check"
                            className="checkbox-label"
                          >
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].Terms_condition
                            }
                            <a
                              href="https://www.bajajfinservsecurities.in/terms-conditions.aspx"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Terms & Conditions
                            </a>
                            and
                            <a
                              href="https://www.bajajfinservsecurities.in/privacy-policy.aspx"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Privacy Policy.
                            </a>
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].Ter_condition
                            }
                          </label>
                          <div className="invalid-feedback">
                            {errors.checkbox?.message}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <button type="submit" className="otp-btn" disabled={pageBtn}>
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].GET_OTP
                          }
                        </button>
                      </div>
                    </div>
                  </form>
                  {/* <div
                    className="tnc"
                    onClick={() => {
                      setTncModal(true);
                    }}
                  >
                    <p>*T&C Applied</p>
                  </div> */}
                  {/* <BottomList /> */}
                  {/* <button className="tc-btn" onClick={() => {
                    setTncModal(true);
                  }}>{
                      Language[localStorage.getItem("language") || "English"]
                        .T_AND_C
                    }</button> */}
                  <BottomList />
                </div>

              </Col>

              <Col lg={5}>
                <div className="screen-img">
                  <img src={screen_img} alt="" width="534" height="379" />
                </div>
              </Col>

            </Row>
          </Container>
        </main >
        <section className="landing-bottom-section">
          <div id="sticky" className="sticky-form">
            <Container fluid>
              <form onSubmit={handleSticky(onSubmit3)}>
                <Row className="sticky-form-content">
                  <Col className=" col-12 col-md-5" lg={4}>
                    <div className="sticky-form-left">
                      <h2 className="page-title">
                        <span className="span-custom-color1">
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].OPEN__YOUR
                          }
                        </span>
                        <span className="span-custom-color2">
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].DEMAT_ACCOUNT_INSTANTLY
                          }
                        </span>
                      </h2>
                      <h3 className="page-subtitle">
                        <span className="span-custom-color3">
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].BRING_YOUR_TRADING
                          }
                        </span>

                        <span className="span-custom-color4">
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].START_NOW
                          }
                        </span>
                      </h3>
                      <div className="form-group sticky-terms">
                        <input
                          type="checkbox"
                          name="checkbox"
                          id="sticky-checkbox"
                          defaultChecked={true}
                          {...stickyRegister("checkbox")}
                          className={`input-checkbox  ${stickyError.checkbox ? "is-invalid" : ""
                            }`}
                        />

                        <p
                          // htmlFor="sticky-checkbox"
                          className="sticky-checkbox"
                        >
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].I_AGREE
                          }
                          <a
                            href="https://www.bajajfinservsecurities.in/terms-conditions.aspx"
                            target="_blank"
                            className="p-custom-color"
                            rel="noreferrer"
                          >
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].TERMS_AND_CONDITION
                            }
                          </a>

                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].AND
                          }

                          <a
                            href="https://www.bajajfinservsecurities.in/privacy-policy.aspx"
                            target="_blank"
                            className="p-custom-color"
                            rel="noreferrer"
                          >
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].PRIVACY_POLICY
                            }
                          </a>
                        </p>
                        <div className="invalid-feedback">
                          {stickyError.checkbox?.message}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col className="col-12 col-md-7" lg={8}>
                    <div className="sticky-form-right">
                      <div className="page-form">
                        <div className="form-group-wrapper">
                          {/* <div className="col-md-6 mb-1"> */}
                          <div className="form-group" ref={stickyFullnameRef}>
                            <input
                              type="text"
                              nameattribute="fullname3"
                              placeholder={
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].Enter_Name
                              }
                              onFocus={() => setFocusState({ fullname2: true })}
                              onBlur={() => {
                                setFocusState({ fullname2: false });
                                setStartListening(false);
                              }}
                              className={`form-control has-value ${stickyError?.fullname ? "is-invalid" : ""
                                }`}
                              {...stickyRegister("fullname", {
                                onBlur: (e) =>
                                  ME_EventTriggered("NameEntered", { "fullname": e.target.value })
                              })}
                              onInput={(e) => nameValidation(e)}
                            // onKeyPress={(e) => nameValidation(e)}
                            />
                            {focusState.fullname2 && (
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
                                    stickyFullnameRef.current.children[0].focus();
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
                            <div className="invalid-feedback">
                              {stickyError.fullname?.message}
                            </div>
                          </div>

                          <div className="form-group" ref={mobile2Ref}>
                            <input
                              type="text"
                              nameattribute="mobile3"
                              placeholder={
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].Enter_Mob
                              }
                              onFocus={() => setFocusState({ mobile2: true })}
                              onBlur={() => {
                                setFocusState({ mobile2: false });
                                setStartListening(false);
                              }}
                              maxLength={10}
                              className={`form-control has-value ${stickyError?.mobile ? "is-invalid" : ""
                                }`}
                              {...stickyRegister("mobile", {
                                onBlur: (e) =>
                                  ME_EventTriggered("MobileEntered", { "mobile": e.target.value })
                              })}
                              onKeyPress={(e) => mobileVal(e)}
                            />
                            {focusState.mobile2 && (
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
                                    mobile2Ref.current.children[0].focus();
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
                            <div className="invalid-feedback">
                              {stickyError.mobile?.message}
                            </div>
                          </div>
                          {/* <div className="form-group">
                            <input
                              placeholder={
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].DOB
                              }
                              type="date"
                              max={EkcyDate.minorDate}
                              {...stickyRegister("dob", {
                                onChange: (e) =>
                                  shareError(e.target.value, "dob-error3"),
                                  onBlur: (e) =>
                                ME_EventTriggered("DOB", { "DOB":e.target.value })
                              })}
                              className={`form-control has-value  ${
                                stickyError?.dob ? "is-invalid" : ""
                              }`}
                              autoComplete="off"
                            />

                            <div className="invalid-feedback">
                              {stickyError.dob?.message}
                            </div>
                            <div className="invalid-feedback dob-error3"></div>
                          </div> */}
                        </div>
                        <Button
                          variant="primary"
                          className="submit-btn"
                          type="submit"
                          disabled={pageBtn}
                        >
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].GET_OTP
                          }
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </form>
            </Container>
          </div>
          <div className="landing-bottom-html pt-5">
            <div className="landing-bottom-content-wrapper">
              <div className="landing-bottom-content">
                <ul className="landing-menu-wrapper">
                  <li className="menu-item">
                    <a href="#subscription"
                      onClick={() => {
                        sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                          EP_PAGE_NAME: "HOME PAGE",
                          EP_CTA: "SUBSCRIPTION PLANS"
                        });
                      }}>
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .Subscriptions_Plans
                      }
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="#brokerage"
                      onClick={() => {
                        sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                          EP_PAGE_NAME: "HOME PAGE",
                          EP_CTA: "BROKERAGE CALCULATOR"
                        });
                      }}>
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .Brokerage_Calculator
                      }
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="#faq"
                      onClick={() => {
                        sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                          EP_PAGE_NAME: "HOME PAGE",
                          EP_CTA: "FAQ"
                        });
                      }}>
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .FAQs
                      }
                    </a>
                  </li>
                </ul>
                <SubscriptionPackTable />
                <AnnualBrokerageAmount />
                <FAQ />
              </div>
            </div>
          </div>
        </section>
      </div >
      <Modal
        show={otpModal}
        onHide={() => {
          setOtpModal(false);
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
            sendToCleverTap("BFSL_APPLICATION_CLICKED", {
              EP_PAGE_NAME: "MOBILE OTP VERIFICATION",
              EP_OTP_STATUS: "INVALID",
              EP_OTP_CTA: "CLOSE",
            });
            setOtpModal(false);
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
            <form id="otp-form" className="flex-col" autoComplete="off">
              <div className="form-group">
                <input
                  type="text"
                  minLength="1"
                  maxLength="1"
                  name="otp1"
                  autoFocus={true}
                  onInput={(e) => {
                    MobileOtpInput(e);
                  }}
                  onKeyUp={(e) => tabChange(e, 1)}
                  className="otp-form-control"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  {...mobileOtpRegister("otp1")}
                />
                <input
                  type="text"
                  minLength="1"
                  maxLength="1"
                  id="firstOtp"
                  onInput={(e) => {
                    MobileOtpInput(e);
                  }}
                  onKeyUp={(e) => tabChange(e, 2)}
                  name="otp2"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="otp-form-control"
                  {...mobileOtpRegister("otp2")}
                />
                <input
                  type="text"
                  minLength="1"
                  maxLength="1"
                  name="otp3"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="otp-form-control"
                  onInput={(e) => {
                    MobileOtpInput(e);
                  }}
                  onKeyUp={(e) => tabChange(e, 3)}
                  {...mobileOtpRegister("otp3")}
                />
                <input
                  type="text"
                  minLength="1"
                  maxLength="1"
                  name="otp4"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="otp-form-control"
                  onInput={(e) => {
                    MobileOtpInput(e);
                  }}
                  onKeyUp={(e) => tabChange(e, 4)}
                  {...mobileOtpRegister("otp4")}
                />
              </div>
            </form>
            <Timer resendOtp={otpApiCall} resendOtpCT={ResendotpCTA}/>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={signatureguidemodal}
        onHide={() => setSignatureguidemodal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        className="popup"
      >
        <div className="close" onClick={() => setSignatureguidemodal(false)}>
          <svg class="new-icon new-icon-close"><use href="#new-icon-close"></use></svg>
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
              rel="noreferrer"
            >
              Click here
            </a>{" "}
            to link your PAN with Aadhar now.”
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={emailModalShow}
        onHide={() => {
          setEmailModalShow(false);
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="popup email-model"
        centered
        backdrop="static"
        keyboard={false}
      >
        <div
          className="close"
          onClick={() => {
            setEmailModalShow(false);
          }}
        >
          <svg class="new-icon new-icon-close"><use href="#new-icon-close"></use></svg>
        </div>
        <Modal.Body>
          <div>
            <h3 className="modal-title">Verify Email Address</h3>
            <p className="modal-para">
              Please enter your registered email id for verification
            </p>
            <form onSubmit={handleEmail(submitEmail)}>
              <div className="form-group">
                <label htmlFor="" className="form-label">
                  Email Id <span className="label-required">*</span>
                </label>
                <input
                  type="text"
                  nameattribute="email"
                  {...registerEmail("emailId")}
                  className={`form-control ${emailerrors.emailId ? "is-invalid" : ""
                    }`}
                />
                <p className="invalid-feedback">
                  {emailerrors.emailId?.message}
                </p>
              </div>
              <button className="otp-btn">GET OTP</button>
            </form>
            <form
              id="otp-form"
              className="flex-col otpModal"
              autoComplete="off"
            >
              <div className="form-group">
                <input
                  type="number"
                  minLength="1"
                  maxLength="1"
                  name="otp1"
                  id="emailOtp1"
                  autoFocus={true}
                  onInput={(e) => {
                    digitValidate(e);
                    oneDigit(e);
                  }}
                  onKeyUp={(e) => tabChangeEMail(e, 1)}
                  className="otp-form-control"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  {...registerEmailOTP("otp1")}
                />
                <input
                  type="number"
                  minLength="1"
                  maxLength="1"
                  id="firstOtp"
                  onInput={(e) => {
                    digitValidate(e);
                    oneDigit(e);
                  }}
                  onKeyUp={(e) => tabChangeEMail(e, 2)}
                  name="otp2"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="otp-form-control"
                  {...registerEmailOTP("otp2")}
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
                  onKeyUp={(e) => tabChangeEMail(e, 3)}
                  {...registerEmailOTP("otp3")}
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
                  onKeyUp={(e) => tabChangeEMail(e, 4)}
                  {...registerEmailOTP("otp4")}
                />
              </div>
            </form>
            <Timer emailModalState={emailModalState} resendOtp={SendOtp} />
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={tncModal}
        onHide={() => {
          setTncModal(false);
        }}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        className="tncmodal"
      >
        {/* <div
          className="close"
          onClick={() => {
            setTncModal(false);
          }}
        >
          <i className="icon-close" />
        </div> */}

        <div className="close" onClick={() => setTncModal(false)}>
          <svg class="new-icon new-icon-close"><use href="#new-icon-close"></use></svg>
        </div>
        <Modal.Body>
          <Row>
            <Col
              xs={2}
              md={1}
              className="d-flex align-items-center justify-content-center p-0"
            >
              <div>
                <div className="india-flag-bg">
                  <img src={indiaflag} alt="" className="india-flag" />
                </div>
              </div>
            </Col>
            <Col xs={10} md={11} className="p-0">
              <div className="tncmodalheader">
                <p>Independence Day Campaign Offer Terms & Conditions</p>
              </div>
              <div className="tncmodalsubheader">
                <p>For new accounts opened:</p>
              </div>
            </Col>
          </Row>
          <Row className="tncmodalcontent">
            <Col xs={12}>
              <ul className="tnclistcontent">
                <li>
                  This offer is valid for new customers who open a demat account
                  with our stock broking company between 1st August 2023 and
                  31st August 2023 (both dates inclusive).
                </li>
                <li>
                  The zero brokerage fees offer applies to all orders placed by
                  new customers within the first 30 days from the day of their
                  demat account opening.
                </li>
                <li>
                  The offer is applicable to all types of orders, including
                  intraday, delivery, and futures and options (F&O)
                  transactions.
                </li>
                <li>
                  The zero brokerage fees are applicable only to brokerage
                  charges and do not include other charges such as government
                  taxes, statutory levies, exchange transaction charges,
                  Securities Transaction Tax (STT), Goods and Services Tax
                  (GST), etc., which will be borne by the customer.
                </li>
                <li>
                  After the 30-day zero brokerage period, regular brokerage
                  charges, as per our standard fee structure, will apply to all
                  orders placed by the customer.
                </li>
                <li>
                  The offer cannot be combined with any other ongoing
                  promotions, discounts, or offers unless explicitly stated.
                </li>
                <li>
                  Existing customers of our stock broking company are not
                  eligible for this offer. It is exclusively available to new
                  customers who open a demat account during the campaign period.
                </li>
                <li>
                  The decision of our stock broking company regarding the
                  eligibility of customers and the applicability of the offer
                  shall be final & binding.
                </li>
                <li>
                  Our stock broking company reserves the right to modify,
                  extend, or withdraw the offer at any time without prior notice
                  or assigning any reason.
                </li>
              </ul>
              <div className="d-flex mb-1">
                <p className="tncfootertext">
                  <strong className="tncfootertextheader">
                    Brokerage Disclaimer:
                  </strong>{" "}
                  All leveraged intraday positions will be squared off on the
                  same day. There is no restriction on the withdrawal of the
                  unutilised margin amount. Brokerage will not exceed the SEBI
                  prescribed limit.
                </p>
              </div>
              <div className="d-flex">
                <p className="tncfootertext">
                  <strong className="tncfootertextheader">MTF:</strong> As
                  subject to the provisions of SEBI Circular CIR/MRD/DP/54/2017
                  dated June 13, 2017, and the terms and conditions mentioned in
                  the lights and obligations statement issued by the TM (if
                  applicable).
                </p>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="tricolor"></Modal.Footer>
      </Modal>
    </>
  );
}
export default Landing;
