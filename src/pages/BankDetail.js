import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Modal } from "react-bootstrap";
import ChatCard from "../components/ChatCard";
import bulb from "../assets/images/gif/bulb-suggest.gif";
import sheild from "../assets/images/sheild.svg";
import cheque from "../assets/images/cheque.svg";
import PageProgress from "../components/PageProgress";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import ModalClose from "../assets/images/black-close.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import userBottomImg from "../assets/images/person-images/bank-details.png";
import * as CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import { SERVICES } from "../common/constants";
import { useSpeechRecognition } from "react-speech-kit";
import {
  AESDecryption, ME_EventTriggered,
  pauseAudio,
  playAudio,
  sendToCleverTap,
} from "../common/common.js";
// import { AF_EventTriggered } from "../common/Event";
import Language from "../common/Languages/languageContent.json";

const BankDetail = () => {
  const schema = Yup.object().shape({
    acNumber: Yup.string()
      .required("This is required")

      .max(20, "max 20")
      .matches(/^[0-9]{8,20}$/, "This is not valid Account Number"),
    reAcNumber: Yup.string().required("This is required"),
    ifscCode: Yup.string()
      .required("This is required")
      .matches(/^[a-zA-Z0-9]{11}$/, "This is not valid IFSC Number"),
    accountType: Yup.string().required("This is required"),
  });
  const {
    register,

    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const navigate = useNavigate();
  const formvalue = watch();

  const [ifscModal, setIfscModal] = useState(false);
  const [ifscCode, setIfscCode] = useState(false);

  const [bankDetails, setBankDetails] = useState(null);
  const [bankname, setBankname] = useState([{ value: "", text: "Select One" }]);

  const [bbranch, setBBranch] = useState([]);
  const [clientData, setClientData] = useState();

  const [bankError, setBankError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [disable, setDisable] = useState(false);

  const [focusState, setFocusState] = useState({
    acNumber: false,
    reAcNumber: false,
    ifscCode: false,
  });
  const [pageBtn, setPageBtn] = useState(false);

  const [startListening, setStartListening] = useState(false);

  const acNumberRef = useRef(null);
  const reAcNumberRef = useRef(null);
  const ifscCodeRef = useRef(null);

  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      let voiceValue = result;

      if (document.activeElement.getAttribute("nameattribute") === "acNumber")
        setValue("acNumber", voiceValue.split(" ").join(""));
      else if (
        document.activeElement.getAttribute("nameattribute") === "reAcNumber"
      )
        setValue("reAcNumber", voiceValue.split(" ").join(""));
      else if (
        document.activeElement.getAttribute("nameattribute") === "ifscCode"
      )
        setValue("ifscCode", voiceValue.split(" ").join(""));
    },
  });

  useEffect(() => {
    startListening ? listen() : stop();
  }, [startListening]);

  useEffect(() => {
    let user = localStorage.getItem("ExistUqId");
    if (user === null || user === "" || user === "null") {
      window.location.replace(window.origin);
    } else if (bankDetails === null) {
      sendToCleverTap("BFSL_APPLICATION_VIEWED", {
        EP_PAGE_NAME: "BANK DETAILS FILLED ",
      });
    
      ResumeBankpage();
    }
  }, []);
  useEffect(() => {
    getBankName();
  }, []);
  const ResumeNominee = async () => {
    try {
      const response = await axios.post(
        SERVICES.CLIENTSAVE,
        {
          nomineeDetails: {
            nomineeType: "ResumeNominee",
          },
          resumeNomineeDetails: {
            mobile: localStorage.getItem("mobile"),
            uqId: localStorage.getItem("ExistUqId"),
          },
          screenType: 7,
        },

        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("cuhk");
      let nomineeData = response.data.Response.Data;
      if (nomineeData.length === 0) {
        navigate("/nominee-detail");
      } else {
        ResumeApplication();
      }
    } catch (err) {
      console.log("Error", err.message);
      throw new Error(err.message)

    }
  };
  const ResumeBankpage = async () => {
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
      if (
        resumeResp.Response.PersonalDetailsRes.NominateAction === "" ||
        resumeResp.Response.PersonalDetailsRes.Gender === "" ||
        resumeResp.Response.PersonalDetailsRes.IncomeRange === "" ||
        resumeResp.Response.PersonalDetailsRes.MaritalStatus === ""
      ) {
        navigate("/personal-detail");
      } else if (resumeResp.Response.PersonalDetailsRes.NominateAction == "1") {
        ResumeNominee();
      } else {
        localStorage.setItem(
          "Fname",
          resumeResp.Response.PersonalDetailsRes.FirstName.replace(
            /[^a-zA-Z0-9]/g,
            ""
          )
        );
        setBankDetails(resumeResp.Response.BankDetailsRes);
        // if(resumeResp.Response.FlagRes.ImpsCount > 5){
        //   setDisable(true);
        // }
        if (resumeResp.Response.FlagRes.Imps == "1" && resumeResp.Response.FlagRes.ImpsCount > 5) {
          setDisable(true);
        } else {
          setDisable(false);
        }
        if (resumeResp.Response) {
          setClientData(resumeResp.Response);
          localStorage.setItem("ExistUqId", resumeResp.Response.FlagRes.UQID);
        }
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };

  const getBranch = async (value) => {
    setBBranch([])
    try {
      const apiBranch = await axios.post(
        SERVICES.GETBRANCHNAME,
        {
          bankName: value,
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(apiBranch.data, "brObject");
      let brObject = apiBranch.data;
      if (brObject.Status == "Failed") {
        toast.error(brObject.Reason)
        setValue2("bankBranch", "");
        // reset2({
        //   bankBranch:"",
        // });
        
      } else {
        setBBranch(brObject.Response.BranchName)
      }

    } catch (err) {
      throw new Error(err.message)

    }
  };
  console.log(bbranch.map);
  const getBankName = async () => {
    try {
      const apiBankName = await axios.get(SERVICES.GETBANKNAME, {
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log(apiBankName.data,"apiBankName.data.Response")

      setBankname(apiBankName.data.Response);
    } catch (err) {
      throw new Error(err.message)

    }
  };

  // useEffect(()=>{
  //   ResumeApplication()
  // },[])

  useEffect(() => {
    if (bankDetails) {
      if (bankDetails.AccountType == "") {
        bankDetails.AccountType = "Savings";
      }
      reset({
        acNumber: bankDetails.AccountNo || "",
        reAcNumber: bankDetails.AccountNo || "",
        accountType: bankDetails.AccountType,
        ifscCode: bankDetails.IfscCode || "",
      });
    }
  }, [bankDetails]);

  const onSubmit = (values) => {
    // AF_EventTriggered("Bank details", "Bank details", {
    //   onclick: "Bank details",
    // });
    let error = document.querySelector(".reError");

    if (values.acNumber === values.reAcNumber) {
      setLoading(true);

      error.innerHTML = "";
      error.style.display = "none";
      InsertBankDetails(values);
      ME_EventTriggered("BankAccountDetailsContinue", values)
    } else {
      error.innerHTML = "Account Number does not match";
      error.style.display = "block";
    }
  };
  const onSubmit2 = (values) => {
    FetchIFSCDetails(values);
    ME_EventTriggered()
  };
  const bankIMPS = async (values) => {
    let userName =
      clientData?.PersonalDetailsRes?.FirstName +
      " " +
      clientData?.PersonalDetailsRes?.LastName;
    console.log(userName, clientData);
    let firstName =
      userName ||
      localStorage.getItem("FullName") ||
      localStorage.getItem("Fname");
    let mobileNumber =
      clientData?.AccountOpeningRes?.Mobile || localStorage.getItem("mobile");
    let BankDet = {
      uqid: clientData?.FlagRes?.UQID || localStorage.getItem("ExistUqId"),
      imps_req_json: {
        requestId: Date.now().toString(),
        beneIFSCCode: values.ifscCode,
        beneAccNumber: values.acNumber,
        source: "P",
        amount: 1,
        remitterName: firstName,
        remitterMobile: mobileNumber,
        account_type: values.accountType,
      },
    };

    try {
      let BankObj = JSON.stringify(BankDet);
      const iv = "SLF3AMUkbk4QZuIC";
      const key = "OBmzjguunYPBtGy9";
      const fkey = CryptoJS.enc.Utf8.parse(key);
      const fiv = CryptoJS.enc.Utf8.parse(iv);

      const encBank = CryptoJS.AES.encrypt(BankObj, fkey, {
        iv: fiv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();
      const request = await axios.post(
        SERVICES.IMPSAPI,
        {
          uqId: clientData?.FlagRes?.UQID || localStorage.getItem("ExistUqId"),
          imps_req_json: {
            requestId: Date.now().toString(),
            beneIfscCode: values.ifscCode,
            beneAccNumber: values.acNumber,
            source: "p",
            amount: 1,
            remitterName: firstName,
            remitterMobile: mobileNumber,
            accountType: values.accountType,
          },
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      let responseData = request;
      console.log(responseData.data)
      console.log(responseData.data.Response)
      console.log(responseData.data.Status)

      if (
        responseData.data.Response.respDesc === "Successful Transaction" ||
        responseData.data.Response.respDesc ===
        "Bank Account details verified successfully"
      ) {
        setBankError(false);
        toast.success(responseData.data.Response.respDesc + " Beneficiary Name: " + responseData.data.Response.beneName)
        // toast.success(
        //   `${`${responseData.data.Response.respDesc} + Name: ${responseData.data.Response.beneName}`}`
        // );
        setTimeout(() => {
          playAudio(13);
          navigate(`/subscription-pack`);
        }, 3000);
      } else if (responseData.data.Response.respDesc === "SUCCESS") {
        setBankError(false);
        toast.success("Bank Account Validated");
        setTimeout(() => {
          playAudio(13);
          navigate(`/subscription-pack`);
        }, 3000);
      } else if (responseData.data.Response === "SUCCESS") {
        setBankError(false);
        toast.success("Bank Account Validated");

        setTimeout(() => {
          playAudio(13);
          navigate(`/subscription-pack`);
        }, 3000);
      }
      else if (responseData.data.Status == "Success") {
        // debugger
        // setLoading(false);
        if (responseData.data.Response == "PERSONAL DETAILS") {
          toast.error("Please fill Personal Details");
          navigate(`/personal-detail`);
        }
        else if (responseData.data.Response == "ADDRESS DETAILS") {
          toast.error(responseData.data.Response);
          navigate(`/address-details-manually`);
        } else {
          toast.error("Please fill Address Details");
          setBankError(true);

        }
      }

      else {
        // setLoading(false);
        toast.error(`Bank validation falied, please try again`);
        setBankError(true);
      }
    } catch (err) {
      // setLoading(false);
      toast.error("Error", err.message);
      throw new Error(err.message)


    } finally {
      setLoading(false);

    }
  };

  const schema2 = Yup.object().shape({
    bankName: Yup.string().required("This is required"),

    bankBranch: Yup.string().required("This is required"),
  });

  const {
    handleSubmit: handleSubmit2,
    register: register2,
    formState: { errors: errors2 },
    setValue: setValue2,
    reset: reset2,
    formState,
  } = useForm({
    resolver: yupResolver(schema2),
    mode: "onChange",
  });
  const InsertBankDetails = async (values) => {
    setPageBtn(true)
    try {
      const request = await axios.post(
         SERVICES.INSERTBANKDETAILS,

        {
          accountNo: values.acNumber,
          accountType: values.accountType,
          ifscCode: values.ifscCode,
          uqId: clientData?.FlagRes?.UQID || localStorage.getItem("ExistUqId"),
          flag: "bank-details",
        },
        {
          headers: {
            "content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
            // "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (request.data.Status == "Failed") {
        toast.error(request.data.Reason);
        setLoading(false);
      } else {
        sendToCleverTap("BFSL_APPLICATION_CLICKED", {
          EP_PAGE_NAME: "BANK DETAILS FILLED",
          EP_BANK_ACCOUNT_NO: values.acNumber,
          EP_RE_ENTER_BANK_ACCOUNT_NO: values.reAcNumber,
          EP_ACCOUNT_TYPE: values.accountType,
          EP_IFSC_CODE: values.ifscCode,
          EP_CTA: "CONTINUE",
        });

        bankIMPS(values);
      }
    } catch (err) {
      setLoading(false);
      throw new Error(err.message)
    } finally {
      setPageBtn(false)
    }
  };

  const FetchIFSCDetails = async (value) => {
    try {
      const ifsc = await axios.post(
        SERVICES.GETIFSCCODE,
        {
          bankName: value.bankName,
          branchName: value.bankBranch,
        },

        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (ifsc.data.Response.ifscCode) {
        localStorage.setItem("ifsc", ifsc.data.Response.ifscCode);
        setValue2("bankName", "");
        setValue2("bankBranch", "");
        setIfscModal(false);
        setValue("ifscCode", ifsc.data.Response.ifscCode, {
          shouldValidate: true,
        });
      }
    } catch (err) {
      throw new Error(err.message)
    }
  };
  console.log(clientData);
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
      console.log(resumeResp.Response, "resumeResp.Response")
      if (resumeResp.Response.FlagRes.IsKycChanged == "true") {
        navigate("/personal-detail");
      }

      if (resumeResp.Response) {
        localStorage.setItem(
          "Fname",
          resumeResp.Response.PersonalDetailsRes.FirstName.replace(
            /[^a-zA-Z0-9]/g,
            ""
          )
        );
        setBankDetails(resumeResp.Response.BankDetailsRes);
        if (resumeResp.Response.FlagRes.Imps == "1" && resumeResp.Response.FlagRes.ImpsCount > 5) {
          setDisable(true);
        } else {
          setDisable(false);
        }
      }
    } catch (err) {
      throw new Error(err.message)
    }
  };
  const digitValidate = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };
  const bankChange = (e) => {
    getBranch(e.value);
  };

  const colourStyles = {
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      background: isFocused ? "#fff" : isSelected ? "#fff" : "#fff",
      color: isSelected ? "#495057" : isFocused ? "#495057" : "#495057",
    }),
  };

  const Bank_Name = bankname.map((item) => ({ value: item, label: item }));

  const Bank_Branch = bbranch.map((item) => ({ value: item, label: item }));
  console.log(Bank_Branch,"Bank_Branch");
  const account_type = [
    { value: "Savings", label: "Savings" },
    { value: "Current", label: "Current" },
  ];

  const branchSetValue=(e)=>{
    setValue2("bankBranch", e.value, { shouldValidate: true })
  }

  const CheckNav = () => {
    playAudio(13);
    navigate(`/subscription-pack`);
  };

  function reEnterError(e) {
    let accNode = document.querySelector(".accountMain");
    let error = document.querySelector(".reError");
    let mainAccNum = accNode.value;
    if (e.target.value.length > 3) {
      let firstAcc = mainAccNum.substring(0, e.target.value.length);
      if (firstAcc === e.target.value) {
        error.innerHTML = "";
        error.style.display = "none";
      } else {
        error.innerHTML = "Account Number does not match";
        error.style.display = "block";
      }
    } else {
      error.innerHTML = "";
      error.style.display = "none";
    }
  }
 
  function navBack() {
    pauseAudio();
    const kycstatus =
      clientData?.FlagRes?.IsKyc || localStorage.getItem("IsKyc");

    if (kycstatus == 0) {
      navigate("/address-details-manually");
    } else {
      navigate("/personal-detail");
    }
  }

  return (
    <>
      <PageProgress progress="bank-details" navlink={bankname} />
      <div className={`${loading ? "loader" : " "}`}>
        {loading && (
          <>
            <img src={bajaj_loaderimg} className="loader-img" />
          </>
        )}
        <main className="main-content">
          <Container>
            <Row>
              <Col lg="7" className="bank-detail">
                <div className="page-header">
                  <a className="back-button" onClick={navBack}>
                    <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                  </a>
                  <h2 className="page-title">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .ALMOST_DONE
                    }
                  </h2>
                  <h3 className="page-subtitle">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .INVEST
                    }
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .EARN
                    }
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .WITHDRAW
                    }
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .REPEAT
                    }
                  </h3>
                </div>
                <div className="bank-detail-info common-card">
                  <form
                    className="bank-detail-form"
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                  >
                    <div className="row bank-detail-content">
                      <div className="col-md-6">
                        <div className="form-group" ref={acNumberRef}>
                          <input
                            type="text"
                            name="acNumber"
                            nameattribute="acNumber"
                            onFocus={() => setFocusState({ acNumber: true })}
                            onBlur={() => {
                              setFocusState({ acNumber: false });
                              setStartListening(false);
                            }}
                            autoComplete="none"
                            disabled={disable}
                            minLength={8}
                            maxLength={20}
                            pattern="[0-9]*"
                            className={`form-control accountMain has-value ${bankDetails ? "has-value" : ""
                              }  ${errors.acNumber ? "is-invalid" : ""}`}
                            {...register("acNumber", {
                              onBlur: (e) =>
                                ME_EventTriggered("BankAccountNumberEntered", { "acNumber": e.target.value })
                            })}
                            onInput={(e) => digitValidate(e)}
                          />

                          <label className="form-label">
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].ACCOUNT_NUMBER
                            }
                            <span className="label-required">*</span>
                          </label>
                          {focusState.acNumber && (

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
                                  acNumberRef.current.children[0].focus();
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
                            {errors.acNumber?.message}
                          </div>
                        </div>
                        <div className="form-group" ref={reAcNumberRef}>
                          <input
                            minLength={8}
                            maxLength={20}
                            autoComplete="none"
                            disabled={disable}
                            type="password"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            name="reAcNumber"
                            nameattribute="reAcNumber"
                            onFocus={() => setFocusState({ reAcNumber: true })}
                            onBlur={() => {
                              setFocusState({ reAcNumber: false });
                              setStartListening(false);
                            }}
                            onChange={(e) => reEnterError(e)}
                            onInput={(e) => digitValidate(e)}
                            onPaste={(e) => e.preventDefault()}
                            className={`form-control has-value ${bankDetails ? "has-value" : ""
                              }  ${errors.reAcNumber ? "is-invalid" : ""}`}
                            {...register("reAcNumber", {
                              onChange: (e) => reEnterError(e),
                              onBlur: (e) =>
                                ME_EventTriggered("BankAccountNumberReentered", { "reAcNumber": e.target.value })
                            })}
                          />

                          <label className="form-label">
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].RE_ACCOUNT_NUMBER
                            }
                            <span className="label-required">*</span>
                          </label>
                          {focusState.reAcNumber && (
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
                                  reAcNumberRef.current.children[0].focus();
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
                            {errors.reAcNumber?.message}
                          </div>
                          <div className="invalid-feedback reError"></div>
                        </div>
                        <div className="form-group account-type col">
                          <select
                            {...register(`accountType`, {
                              onBlur: (e) =>
                                ME_EventTriggered("AccountTypeSelected", { "accountType": e.target.value })
                            })}
                            disabled={disable}
                            defaultValue="Savings"
                            className={`form-control has-value  ${errors?.accountType ? "is-invalid" : ""
                              }`}
                          >
                            {account_type.map((option, i) => (
                              <option key={i} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <label className="form-label">
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].ACCOUNT_TYPE
                            }
                            <span className="label-required">*</span>
                          </label>
                          <div className="invalid-feedback">
                            {errors?.accountType?.message}
                          </div>
                        </div>
                        <div className="form-group mb-3" ref={ifscCodeRef}>
                          <input
                            type="text"
                            name="ifscCode"
                            disabled={disable}
                            maxLength={11}
                            nameattribute="ifscCode"
                            onFocus={() => setFocusState({ ifscCode: true })}
                            onBlur={() => {
                              setFocusState({ ifscCode: false });
                              setStartListening(false);
                            }}
                            {...register(`ifscCode`, {
                              onBlur: (e) =>
                                ME_EventTriggered("IFSCCodeEntered", { "ifscCode": e.target.value })
                            })}
                            className={`form-control text-uppercase has-value ${ifscCode ? "has-value" : ""
                              } ${bankDetails ? "has-value" : ""}  ${errors.ifscCode ? "is-invalid" : ""
                              }`}
                          />
                          <label className="form-label">
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].IFSC_CODE
                            }
                            <span className="label-required">*</span>
                          </label>
                          {focusState.ifscCode && (

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
                                  ifscCodeRef.current.children[0].focus();
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
                            {errors.ifscCode?.message}
                          </div>
                        </div>
                        <Link
                          to
                          role="button"
                          className="ifsc-modal-link"
                          onClick={() => {
                            if (!disable) {
                              playAudio(12);
                              setIfscModal(true);
                              ME_EventTriggered("IFSCCodeSearch")
                            }
                          }}
                        >
                          <svg class="new-icon new-icon-search"><use href="#new-icon-search"></use></svg>                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].SEARCH_IFSC_CODE
                          }
                        </Link>
                      </div>

                      <div className="col-md-6">
                        <div className="bank-detail-cheque">
                          <div className="form-tip">
                            <img src={bulb} alt="" />
                            <p className="form-tip-label">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].FIND_BANK_DETAILS
                              }
                            </p>
                          </div>
                          <img src={cheque} alt="" className="cheque-img" />
                          <ul className="bank-detail-cheque-list">
                            <li className="bank-detail-cheque-point">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].ACC_IFSC_PASSBOOK
                              }
                            </li>
                            <li className="bank-detail-cheque-point">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].ACC_YOUR_NAME
                              }
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bank-bottom">
                      {formvalue.acNumber &&
                        formvalue.reAcNumber &&
                        formvalue.ifscCode &&
                        formvalue.accountType ? (
                        <button
                          className="ekyc-comn-btn continue-btn"
                          type="submit"
                          disabled={pageBtn}
                        >
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].CONTINUE
                          }
                        </button>
                      ) : (
                        <button className="continue-btn" type="submit" disabled={pageBtn}>
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].CONTINUE
                          }
                        </button>
                      )}
                      {bankError ? (
                        <div
                          className="bank-bottom-txt"
                          onClick={() => CheckNav()}
                        >
                          <a>
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].UPLOAD_CHEQUE_MANUALLY
                            }
                            <svg class="new-icon new-icon-right-arrow"><use href="#new-icon-right-arrow"></use></svg>                          </a>
                        </div>
                      ) : null}
                    </div>
                  </form>
                </div>
                <div className="bank-detail-secure">
                  <img src={sheild} alt="" className="bank-detail-secure-img" />
                  <p className="bank-detail-secure-txt">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .UR_DETAILS_SAFE
                    }
                  </p>
                </div>
              </Col>
              <Col className="position-inherit" md={5}>
                <div className="d-flex  h-100 flex-column ">
                  <ChatCard
                    chatSubtitle={
                      "Brokers cannot access or auto-debit from your bank account. You can link multiple banks in your BFSL Demat & Trading A/c."
                    }
                    link={
                      <span>
                        Source <span className="chat-link-divider">:</span>
                        <span>
                          <a
                            href="https://www.consumerfinance.gov/about-us/blog/you-have-protections-when-it-comes-to-automatic-debit-payments-from-your-account/  "
                            target="_blank"
                          >
                            Consumer finance
                          </a>
                        </span>
                      </span>
                    }
                  />
                  <div className="user-bottom-img bank-btm-img">
                    <img src={userBottomImg} alt="person icon" />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
      <Modal
        show={ifscModal}
        onHide={() => setIfscModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="ifscModal"
        centered
        backdrop="static"
        keyboard={false}
      >
        <div className="close" onClick={() => setIfscModal(false)}>
          <img src={ModalClose} alt="" />
        </div>
        <Modal.Body>
          <h3 className="modal-title">
            {
              Language[localStorage.getItem("language") || "English"]
                .FIND_YOUR_IFSC_CODE
            }
          </h3>
          <br />
          <form className="ifsc-form" onSubmit={handleSubmit2(onSubmit2)}>
            <div className="form-group">
              <label htmlFor="bank">
                {
                  Language[localStorage.getItem("language") || "English"]
                    .SELECT_BANK
                }
              </label>

              <div className="select-new">
                <Select
                  options={Bank_Name}
                  classNamePrefix="react-select"
                  styles={colourStyles}
                  isSearchable={true}
                  {...register2(`bankName`)}
                  placeholder="Select.."
                  onChange={(e) => {
                    setValue2("bankName", e.value, { shouldValidate: true });
                    bankChange(e);
                  }}
                  defaultValue={""}
                  // name='accountType'
                  className={`react-select-dropdown form-control has-value   ${errors2?.bankName ? "is-invalid" : ""
                    }`}
                />

                <div className="invalid-feedback">
                  {errors2.bankName?.message}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="branch">
                {
                  Language[localStorage.getItem("language") || "English"]
                    .SELECT_BRANCH
                }
              </label>

              <Select
                options={Bank_Branch}
                classNamePrefix="react-select"
                styles={colourStyles}
                isSearchable={true}
                {...register2(`bankBranch`)}
                placeholder="Select.."
                // placeholder={bbranch}

                defaultValue={""}
                onChange={(e) => {
                  branchSetValue(e)
                  // setValue2("bankBranch", e.value, { shouldValidate: true });

                }}
                name="bankBranch"
                className={`react-select-dropdown form-control has-value  ${errors2?.bankBranch ? "is-invalid" : ""
                  }`}
              />

              <div className="invalid-feedback">
                {errors2.bankBranch?.message}
              </div>
            </div>
            <div className="text-center mx-auto">
              <button className="common-btn" type="submit">
                {
                  Language[localStorage.getItem("language") || "English"]
                    .GET_DEATAILS
                }
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BankDetail;
