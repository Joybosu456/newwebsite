import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ChatCard from "../components/ChatCard";
import MaleImg from "../assets/images/personal-detail/male-img.svg";
import FemaleImg from "../assets/images/personal-detail/female-img.svg";
import SingleImg from "../assets/images/personal-detail/single-img.svg";
import RingImg from "../assets/images/personal-detail/ring-img.svg";
import DotImg from "../assets/images/personal-detail/dots-img.svg";
import IncomeImg from "../assets/images/income-img.svg";
import PageProgress from "../components/PageProgress";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import userBottomImg from "../assets/images/person-images/personal-details.png";
import "react-toastify/dist/ReactToastify.css";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import { SERVICES } from "../common/constants";
import {
  AESDecryption,
  ME_EventTriggered,
  nameValidation,
  pauseAudio,
  playAudio,
  sendToCleverTap, getSearchParameters,
} from "../common/common.js";
import { Modal } from "react-bootstrap";
import Language from "../common/Languages/languageContent.json";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RiskDisclosureIcon from "../../src/assets/images/risk-disclosure-icon.svg";

const PersonalDetail = () => {
  let navigate = useNavigate();
  const [knowMoreModal, setknowMoreModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personalDetails, setPersonalDetails] = useState(null);
  const [clientData, setClientData] = useState();
  // const [isCurrencyChecked, setIsCurrencyChecked] = useState(false);
  const [openDisclouser, setOpenDisclouser] = useState(false);
  const [pageBtn, setPageBtn] = useState(false);
  const [fatherDisable, setFatherDisable] = useState(false);


  const PersonalDetalSchema = Yup.object().shape({
    gender: Yup.string().required("Please select gender").nullable(),
    maritalstatus: Yup.string()
      .required("Please select Marital Status")
      .nullable(),
    incomerange: Yup.string().required("Please select Income Range").nullable(),
    isnomineedreq: Yup.bool().notRequired().nullable(),
    isddpireq: Yup.bool().notRequired().nullable(),
    isfnoreq: Yup.bool().notRequired().nullable(),
    isslb: Yup.bool().notRequired().nullable(),
    isCurrency: Yup.bool().notRequired().nullable(),
    fathername: Yup.string().required("Please enter Father Name").matches(
      /^((\b[A-Za-z]{1,100}\b)\s*){1,6}$/,
      "This is not valid Father Name"
    ).transform((value) => value.toUpperCase()),
    // isNSE: Yup.bool().notRequired().nullable(),
    // isBSE: Yup.bool().notRequired().nullable(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(PersonalDetalSchema),
  });


  useEffect(() => {
    var params = getSearchParameters();
    if (params.uid && params.uid2) {
      localStorage.clear();
      localStorage.setItem("audioPlayed", "played");
      localStorage.setItem("uid", params?.uid);
      localStorage.setItem("uid2", params?.uid2);
      localStorage.setItem("mobile", params?.uid);
      localStorage.setItem("ExistUqId", params?.uid2);
      localStorage.setItem("UserUqID", params?.uid2);
    } 

    ResumeApplication();
  }, []);

  const formvalues = watch();
  useEffect(() => {
    let user = localStorage.getItem("ExistUqId");
    if (user === null || user === "" || user === "null" || !user) {
      window.location.replace(window.origin);
    } else if (personalDetails === null) {
      sendToCleverTap("BFSL_APPLICATION_VIEWED", {
        EP_PAGE_NAME: "PERSONAL DETAIL PAGE",
      });

      ResumeApplication();
    }
  }, []);
  let fatherName = "";
  useEffect(() => {
    if (personalDetails) {
      let PGender, PMarried, PIncome, PNominee, PDdpi, PFnO;

      if (personalDetails?.Gender === "M") {
        PGender = "Male";
      } else if (personalDetails?.Gender === "F") {
        PGender = "Female";
      }
      PMarried = personalDetails?.MaritalStatus || "";
      PIncome = personalDetails?.IncomeRange || "";
      PNominee = Boolean(Number(personalDetails?.NominateAction)) || false;
      if (
        personalDetails?.DdpiAction === "True" ||
        personalDetails?.DdpiAction === "true" ||
        personalDetails?.DdpiAction === true
      ) {
        PDdpi = true;
      } else if (
        personalDetails?.DdpiAction === "False" ||
        personalDetails?.DdpiAction === "false" ||
        personalDetails?.DdpiAction === false
      ) {
        PDdpi = false;
      } else {
        PDdpi = true;
      }

      if (
        personalDetails?.fno === "True" ||
        personalDetails?.fno === "true" ||
        personalDetails?.fno === true
      ) {
        PFnO = true;
        setOpenDisclouser(false);
      } else if (
        personalDetails?.fno === "False" ||
        personalDetails?.fno === "false" ||
        personalDetails?.fno === false
      ) {
        PFnO = false;
        setOpenDisclouser(false);
      } else {
        PFnO = true;
        setOpenDisclouser(true);
        sendToCleverTap("BFSL_APPLICATION_VIEWED", {
          EP_PAGE_NAME: "RISK DISCLOSURE ON DERIVATIVES PAGE"
        });
      }
      // if (personalDetails.CurrencyDerivative === true) {
      //   setIsCurrencyChecked(true);
      // } else {
      //   setIsCurrencyChecked(false);
      // }

      // console.log(" personalDetails.CurrencyNSE", personalDetails.CurrencyNSE);
      // console.log(" personalDetails.CurrencyBSE", personalDetails.CurrencyBSE);

      if (personalDetails.DependentFName !== "") {
        fatherName = personalDetails.DependentFName;
      }
      if (personalDetails.DependentMName !== "") {
        if (fatherName !== "") {
          fatherName =
            fatherName + " " + personalDetails.DependentMName;
        } else {
          fatherName = personalDetails.DependentMName;
        }
      }
      if (personalDetails.DependentLName !== "") {
        if (fatherName !== "") {
          fatherName =
            fatherName + " " + personalDetails.DependentLName;
        } else {
          fatherName = personalDetails.DependentLName;
        }
      }

      console.log(fatherName, "father");

      console.log(clientData?.FlagRes.IsKyc, "father");

      console.log(clientData?.FlagRes.IsKyc == "1" && fatherName !== "");

      if (clientData?.FlagRes.IsKyc == "1" && fatherName !== "") {
        setFatherDisable(true)
      } else {
        setFatherDisable(false)
      }

      reset({
        gender: PGender || "",
        maritalstatus: PMarried,
        incomerange: PIncome || "",
        isnomineedreq: PNominee,
        isddpireq: PDdpi,
        isfnoreq: PFnO,
        isslb: personalDetails.SLB || false,
        isCurrency: personalDetails.CurrencyDerivative || false,
        fathername: fatherName
        // isNSE: personalDetails.CurrencyNSE,
        // isBSE: personalDetails.CurrencyBSE,
      });
    }
  }, [personalDetails]);
  // const TradingRefernce = async (data) => {
  //   let Tpref;
  //   if (data.isfnoreq === true) {
  //     Tpref = "NSE Cash,BSE Cash,NSE Derivatives,BSE Derivatives";
  //   } else if (data.isfnoreq === false) {
  //     Tpref = "NSE Cash,BSE Cash";
  //   }
  //   let rid =
  //     clientData?.FlagRes?.Id || localStorage.getItem("refId") || localStorage.getItem("UserRefID");
  //   try {
  //     const response = await axios.post(
  //       SERVICES.TradingNSEBSEDerivtive,
  //       {
  //         refid: rid.toString(),
  //         tradinPreference: Tpref,
  //       },
  //       {
  //         headers: {
  //           "content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     if (response.data.Response === "RECORD UPDATED") {
  //       savePersonalDetails(data);
  //     }
  //   } catch (err) {

  //   }
  // };

  // const onPersonalSubmit = (data) => {
  //   setLoading(true);
  //   TradingRefernce(data);
  //   // AF_EventTriggered("Personal details", "Personal details", {
  //   //   onclick: "Personal details",
  //   // });
  //   sendToCleverTap("BFSL_APPLICATION_CLICKED", {
  //     EP_PAGE_NAME: "PERSONAL DETAIL PAGE",
  //     EP_GENDER: data.gender,
  //     EP_MARITAL_STATUS: data.maritalstatus,
  //     EP_INCOME_RANGE: data.incomerange,
  //     EP_ADD_NOMINEE: data.isnomineedreq,
  //     EP_CTA: "CONTINUE"
  //   });

  // };

  const savePersonalDetails = async (data) => {
    console.log(data);
    let fullName = data.fathername;
    let nameArray = fullName.replace(/\s+/g, ' ').trim().split(" ");
    let firstName = nameArray[0];
    let middleName = "";
    let lastName = "";

    if (nameArray.length > 2) {
      firstName = nameArray[0];
      middleName = nameArray[1];
      lastName = nameArray.slice(2).join(" ");
    } else if (nameArray.length === 2) {
      firstName = nameArray[0];
      lastName = nameArray[1];
    }

    console.log("First Name: " + firstName);
    console.log("Middle Name: " + middleName);
    console.log("Last Name: " + lastName);
    localStorage.setItem("dependentFirstName",firstName);
    localStorage.setItem("dependentMiddleName",middleName);
    localStorage.setItem("dependentLastName",lastName);

    setPageBtn(true)
    try {
      const response = await axios.post(
        SERVICES.CLIENTSAVE,
        {
          addUptPrimaryDtls: {
            authorityGround: "",
            authorityName: "",
            currencyBSE: data.isCurrency ? true : false,
            currencyDerivative: data.isCurrency,
            currencyNSE: data.isCurrency ? true : false,
            ddpiAction: data.isddpireq,
            dependentFName: firstName,
            dependentLName: lastName,
            dependentMName: middleName,
            dependentStatus: "Father",
            eq: true,
            firstName: "",
            flag: "primary-details",
            fno: data.isfnoreq,
            gender: data.gender,
            incomeRange: data.incomerange,
            isPolitical: "Not Applicable",
            lastName: "",
            maritalStatus: data.maritalstatus,
            middleName: "",
            mobile:
              clientData?.AccountOpeningRes?.Mobile ||
              localStorage.getItem("mobile"),
            nationality: "INDIAN",
            nominateAction: data.isnomineedreq,
            occupation: "Private Sector Service",
            otherAuthorityName: "",
            poaAction: true,
            regulatoryAction: "No",
            slb: data.isslb,
            tradingPreference: "",
            uqId:
              clientData?.FlagRes?.UQID || localStorage.getItem("ExistUqId"),
          },
          screenType: 8,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLoading(false);
      console.log(response.data, "response.data");
      // return;
      if (response.data.Response === "Updated Successfully") {
        setLoading(false);
        const kycstatus =
          clientData?.FlagRes?.IsKyc || localStorage.getItem("IsKyc");
        if (kycstatus == 0) {
          if (data.isnomineedreq === true) {
            navigate("/nominee-detail");
            playAudio(10);
          } else {
            pauseAudio();
            navigate("/address-details-manually");
          }
        } else {
          if (data.isnomineedreq === true) {
            navigate("/nominee-detail");
            playAudio(10);
          } else {
            playAudio(11);
            navigate("/bank-detail");
          }
        }
      }
    } catch (err) {
      setLoading(false);
      throw new Error(err.message)
    } finally {
      setPageBtn(false)
    }
  };
  const TradingRefernce = async (data) => {
    let Tpref;
    if (data.isfnoreq === true) {
      Tpref = "NSE Cash,BSE Cash,NSE Derivatives,BSE Derivatives";
    } else if (data.isfnoreq === false) {
      Tpref = "NSE Cash,BSE Cash";
    }
    let rid =
      clientData?.FlagRes?.Id ||
      localStorage.getItem("refId") ||
      localStorage.getItem("UserRefID");
    try {
      const response = await axios.post(
        SERVICES.TradingNSEBSEDerivtive,
        {
          refid: rid.toString(),
          tradinPreference: Tpref,
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.Response === "RECORD UPDATED") {
        savePersonalDetails(data, Tpref);
      }
    } catch (err) { }
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
      console.log(response, "response");
      let resumeReq = AESDecryption(response.data);
      let resumeResp = JSON.parse(JSON.parse(resumeReq));
      console.log(resumeResp, "resumeResp");
      if (resumeResp.Response.FlagRes.IsKycChanged === "true") {
        navigate("/personal-detail");
      }

      if (resumeResp.Response.AccountOpeningRes.Pan) {
        localStorage.setItem(
          "pannumber",

          resumeResp.Response.AccountOpeningRes.Pan
        );
      }

      if (resumeResp.Response.AccountOpeningRes.EmailId) {
        localStorage.setItem(
          "emailid",
          resumeResp.Response.AccountOpeningRes.EmailId
        );
      }
      if (resumeResp.Response.FlagRes.IsKyc) {
        localStorage.setItem("IsKyc", resumeResp.Response.FlagRes.IsKyc);
      }

      if (resumeResp.Response.PersonalDetailsRes.FirstName) {
        let userName =
          resumeResp.Response.PersonalDetailsRes.FirstName.replace(
            /[^a-zA-Z0-9]/g,
            ""
          ) +
          resumeResp.Response.PersonalDetailsRes.FirstName.replace(
            /[^a-zA-Z0-9]/g,
            ""
          ) +
          " " +
          resumeResp.Response.PersonalDetailsRes.LastName.replace(
            /[^a-zA-Z0-9]/g,
            ""
          );
        resumeResp.Response.PersonalDetailsRes.LastName.replace(
          /[^a-zA-Z0-9]/g,
          ""
        );
        localStorage.setItem("FullName", userName);
      }
      if (
        resumeResp.Response.FlagRes.UQID !== "undefined" &&
        resumeResp.Response.FlagRes.UQID !== ""
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
      setPersonalDetails(resumeResp.Response.PersonalDetailsRes);
      if (resumeResp.Response) {
        setClientData(resumeResp.Response);
        localStorage.setItem("ExistUqId", resumeResp.Response.FlagRes.UQID);
        setClientData(resumeResp.Response);
        localStorage.setItem("ExistUqId", resumeResp.Response.FlagRes.UQID);
      }

      localStorage.setItem("refId", resumeResp.Response.FlagRes.Id);
      localStorage.setItem("UserRefID", resumeResp.Response.FlagRes.Id);
    } catch (err) { }
  };
  const onPersonalSubmit = (data) => {
    // if (isCurrencyChecked) {
    //   let nse = getValues("isNSE");
    //   let bse = getValues("isBSE");
    //   let ErrorNseBse = document.getElementById("currency-error");
    //   if (nse || bse) {
    //     ErrorNseBse.style.display = "none";
    //     sendToCleverTap("BFSL_APPLICATION_CLICKED", {
    //       EP_PAGE_NAME: "PERSONAL DETAIL PAGE",
    //       EP_GENDER: data.gender,
    //       EP_MARITAL_STATUS: data.maritalstatus,
    //       EP_INCOME_RANGE: data.incomerange,
    //       EP_ADD_NOMINEE: data.isnomineedreq,
    //       EP_CTA: "CONTINUE",
    //     });
    //     TradingRefernce(data);
    //   } else {
    //     ErrorNseBse.style.display = "block";
    //   }
    // } else {
    console.log(data);
    let MStatus;
    if (data.maritalstatus == 'Unmarried') {
      MStatus = "single"
    } else {
      MStatus = "married"
    }

    let NomineeStatus;
    if (data.isnomineedreq) {
      NomineeStatus = "YES"
    } else {
      NomineeStatus = "NO"
    }

    let DDPIStatus;
    if (data.isddpireq) {
      DDPIStatus = "YES"
    } else {
      DDPIStatus = "NO"
    }

    let FNOStatus;
    if (data.isfnoreq) {
      FNOStatus = "YES"
    } else {
      FNOStatus = "NO"
    }

    let CurrentRange = data.incomerange;
    let Incomerange;
    console.log(data.incomerange);
    if (CurrentRange == 'BELOW 1 Lakhs') {
      Incomerange = 'BELOW 1 LAKH'
    }

    if (CurrentRange == '1-5 Lakhs') {
      Incomerange = '1LAKH-5LAKH'
    }

    if (CurrentRange == '5-10 Lakhs') {
      Incomerange = '5LAKH-10LAKH'
    }

    if (CurrentRange == '10-25 Lakhs') {
      Incomerange = '10LAKH-25LAKH'
    }

    if (CurrentRange == 'More than 25 Lakhs') {
      Incomerange = 'ABOVE 25LAKH'
    }

    console.log(Incomerange);

    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "PERSONAL DETAIL PAGE",
      EP_GENDER: data.gender,
      EP_MARITAL_STATUS: MStatus,
      EP_INCOME_RANGE: Incomerange,
      EP_ADD_NOMINEE: NomineeStatus,
      EP_OPT_DDPI: DDPIStatus,
      EP_FUTURES_AND_OPTIONS: FNOStatus,
      EP_CTA: "CONTINUE",
    });
    TradingRefernce(data);
    // }
    ME_EventTriggered("ContinueClicked", data);
  };

  const NseBseChange = () => {
    let nse = getValues("isNSE");
    let bse = getValues("isBSE");
    let ErrorNseBse = document.getElementById("currency-error");
    if (nse || bse) {
      ErrorNseBse.style.display = "none";
    } else {
      ErrorNseBse.style.display = "block";
    }
  };

  const checkFnoState = (e) => {
    console.log(e.target.checked);
    ME_EventTriggered("checkfno", e.target.checkeds)
    if (e.target.checked) {
      setOpenDisclouser(true);
      setValue("isfnoreq", true)
    } else {
      setOpenDisclouser(false);
      setValue("isfnoreq", false)

    }
  };
  return (
    <>
      <PageProgress progress="personal-details" />

      <div className={`${loading ? "loader" : " "}`}>
        {loading && (
          <>
            <img src={bajaj_loaderimg} className="loader-img" />
          </>
        )}

        <main className="main-content personal-detail-page">
          <Container>
            <Row>
              <Col lg="7" className="personal-detail">
                <div className="page-header">
                  <h2 className="page-title">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .WAY_TO_WANT_IT
                    }
                  </h2>
                  <h3 className="page-subtitle">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .FEW_DETAILS_TO_KNOW_YOU_BETTER
                    }
                  </h3>
                </div>
                <form
                  className="personal-detail-info common-card"
                  onSubmit={handleSubmit(onPersonalSubmit)}
                >
                  <div className="dual-block">
                    <div className="gender-block">
                      <p className="personal-detail-info-text">
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].ARE_YOU
                        }
                      </p>
                      <div className="gender-info  ">
                        <label htmlFor="male">
                          <input
                            type="radio"
                            name="gender"
                            id="male"
                            value="Male"
                            className="personal-input"
                            {...register("gender")}
                            onClick={() => {
                              setValue("gender", "Male");
                              ME_EventTriggered("GenderSelect", {
                                gender: "Male",
                              });
                            }}
                          />
                          <div className="dual-block-card form-card">
                            <div className="card-img-wrapper">
                              <img src={MaleImg} className="card-img" alt="" />
                            </div>
                            <p className="card-title">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].MALE
                              }
                            </p>
                          </div>
                        </label>
                        <label htmlFor="female">
                          <input
                            type="radio"
                            name="gender"
                            id="female"
                            value="Female"
                            className="personal-input"
                            {...register("gender")}
                            onClick={() => {
                              setValue("gender", "Female");
                              ME_EventTriggered("GenderSelect", {
                                gender: "female",
                              });
                            }}
                          />
                          <div className="dual-block-card form-card">
                            <div className="card-img-wrapper">
                              <img
                                src={FemaleImg}
                                className="card-img"
                                alt=""
                              />
                            </div>
                            <p className="card-title">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].FEMALE
                              }
                            </p>
                          </div>
                        </label>

                        <div className="text-danger gender-error">
                          {errors.gender?.message}
                        </div>
                      </div>
                    </div>
                    <div className="gender-block">
                      <p className="personal-detail-info-text">
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].MARITAL_STATUS
                        }
                      </p>
                      <div className="gender-info">
                        <label htmlFor="Unmarried">
                          <input
                            type="radio"
                            name="mariage-status"
                            id="Unmarried"
                            value="Unmarried"
                            className="personal-input"
                            {...register("maritalstatus")}
                            onClick={() => {
                              setValue("maritalstatus", "Unmarried");
                              ME_EventTriggered("maritalstatusSelect", {
                                maritalstatus: "Unmarried",
                              });
                            }
                            }
                          />
                          <div className="dual-block-card form-card">
                            <div className="card-img-wrapper">
                              <img
                                src={SingleImg}
                                className="card-img"
                                alt=""
                              />
                            </div>
                            <p className="card-title">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].SINGAL
                              }
                            </p>
                          </div>
                        </label>
                        <label htmlFor="Married">
                          <input
                            type="radio"
                            name="mariage-status"
                            id="Married"
                            value="married"
                            className="personal-input"
                            {...register("maritalstatus")}
                            onClick={() => {
                              setValue("maritalstatus", "married");
                              ME_EventTriggered("maritalstatusSelect", {
                                maritalstatus: "married",
                              });
                            }}
                          />
                          <div className="dual-block-card form-card">
                            <div className="card-img-wrapper">
                              <img src={RingImg} className="card-img" alt="" />
                            </div>
                            <p className="card-title">
                              {" "}
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].MARRIED
                              }
                            </p>
                          </div>
                        </label>
                        <label htmlFor="Other">
                          <input
                            type="radio"
                            name="mariage-status"
                            value="other"
                            id="Other"
                            className="personal-input"
                            {...register("maritalstatus")}
                            onClick={() => {
                              setValue("maritalstatus", "other");
                              ME_EventTriggered("maritalstatusSelect", {
                                maritalstatus: "other",
                              });
                            }}
                          />
                          <div className="dual-block-card form-card">
                            <div className="card-img-wrapper">
                              <img src={DotImg} className="card-img" alt="" />
                            </div>
                            <p className="card-title">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].OTHER
                              }
                            </p>
                          </div>
                        </label>
                        {errors.maritalstatus?.type === "required" && (
                          <div className="text-danger maritalstatus-error">
                            Please select marital status
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="income">
                    <p className="personal-detail-info-text">
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .Enter_FName
                      }
                    </p>
                    <div className="row position-relative">
                      <div className="col-lg-8 col-md-6 col-sm-4">
                        <label htmlFor="0to1Lakhs">
                          <div className="income-card form-card">
                            <img src={MaleImg} className="card-img fatherImg" alt="" />
                            <input className="income-card-text fatherPersonal text-uppercase"
                              maxLength={100}
                              placeholder={
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].Enter_F_Full_Name
                              }
                              disabled={fatherDisable}
                              onInput={(e) => nameValidation(e)}
                              {...register("fathername")}
                            />
                          </div>
                        </label>
                      </div>
                      <div className="text-danger incomerange-error">
                        {errors.fathername?.message}
                      </div>

                      <div className="text-danger incomerange-error">
                        {errors.fathername?.message}
                      </div>

                      {/* {errors.fathername?.type === "required" && (
                        <div className="text-danger incomerange-error">
                          {errors.fathername?.message}
                        </div>
                      )} */}
                    </div>
                  </div>

                  <div className="income">
                    <p className="personal-detail-info-text">
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .TELL_OTHER
                      }
                    </p>
                    <div className="row position-relative">
                      <div className="col-6 col-sm-4">
                        <label htmlFor="0to1Lakhs">
                          <input
                            id="0to1Lakhs"
                            type="radio"
                            name="income"
                            value="BELOW 1 Lakhs"
                            className="personal-input"
                            {...register("incomerange")}
                            onClick={() => {
                              setValue("incomerange", "BELOW 1 Lakhs");
                              ME_EventTriggered("incomerangeSelect", {
                                incomerange: "BELOW 1 Lakhs",
                              });
                            }}
                          />
                          <div className="income-card form-card">
                            <img src={IncomeImg} alt="" />
                            <p className="income-card-text">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].Below1Lakh
                              }
                            </p>
                          </div>
                        </label>
                      </div>
                      <div className="col-6 col-sm-4">
                        <label htmlFor="1to5Lakhs">
                          <input
                            type="radio"
                            name="income"
                            id="1to5Lakhs"
                            value="1-5 Lakhs"
                            className="personal-input"
                            {...register("incomerange")}
                            onClick={() => {
                              setValue("incomerange", "1-5 Lakhs");
                              ME_EventTriggered("incomerangeSelect", {
                                incomerange: "1-5 Lakhs",
                              });
                            }}
                          />
                          <div className="income-card form-card">
                            <img src={IncomeImg} alt="" />
                            <p className="income-card-text">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].ONELAKH_FIVELAKH
                              }
                            </p>
                          </div>
                        </label>
                      </div>
                      <div className="col-6 col-sm-4">
                        <label htmlFor="5to10Lakhs">
                          <input
                            id="5to10Lakhs"
                            type="radio"
                            name="income"
                            value="5-10 Lakhs"
                            className="personal-input"
                            {...register("incomerange")}
                            onClick={() => {
                              setValue("incomerange", "5-10 Lakhs");
                              ME_EventTriggered("incomerangeSelect", {
                                incomerange: "5-10 Lakhs",
                              });
                            }}
                          />
                          <div className="income-card form-card">
                            <img src={IncomeImg} alt="" />
                            <p className="income-card-text">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].FIVELAKH_TENLAKH
                              }
                            </p>
                          </div>
                        </label>
                      </div>
                      <div className="col-6 col-sm-4">
                        <label htmlFor="10to25Lakhs">
                          <input
                            id="10to25Lakhs"
                            type="radio"
                            name="income"
                            value="10-25 Lakhs"
                            className="personal-input"
                            {...register("incomerange")}
                            onClick={() => {
                              setValue("incomerange", "10-25 Lakhs")
                              ME_EventTriggered("incomerangeSelect", {
                                incomerange: "10-25 Lakhs",
                              });
                            }}
                          />
                          <div className="income-card form-card">
                            <img src={IncomeImg} alt="" />
                            <p className="income-card-text">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].TENLakh_25Lakh
                              }
                            </p>
                          </div>
                        </label>
                      </div>
                      <div className="col-6 col-sm-4">
                        <label htmlFor="more_than_25">
                          <input
                            id="more_than_25"
                            type="radio"
                            name="income"
                            value="More than 25 Lakhs"
                            className="personal-input"
                            {...register("incomerange")}
                            onClick={() => {
                              setValue("incomerange", "More than 25 Lakhs");
                              ME_EventTriggered("incomerangeSelect", {
                                incomerange: "More than 25 Lakhs",
                              });
                            }}
                          />
                          <div className="income-card form-card">
                            <img src={IncomeImg} alt="" />
                            <p className="income-card-text">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].ABOVE_25LAKH
                              }
                            </p>
                          </div>
                        </label>
                      </div>
                      {errors.incomerange?.type === "required" && (
                        <div className="text-danger incomerange-error">
                          Please select Income Range
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="nominee">
                    <div className="nominee-left">
                      <p className="personal-detail-info-text">
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].WOULD_LIKE
                        }
                      </p>
                      <div className="nominee-input">
                        <label className="switch">
                          <input
                            type="checkbox"
                            className="input-check"
                            {...register("isnomineedreq", {
                              onBlur: (e) =>
                                ME_EventTriggered("AddNominee", { "AddNominee": e.target.value })
                            })}
                          />
                          <span className="slider round" />
                        </label>
                        <p>
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].No
                          }
                        </p>
                      </div>
                      <p className="personal-detail-info-text mt-2">
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].WOULD_DDIP
                        }
                      </p>

                      <div className="nominee-input">
                        <label className="switch">
                          <input
                            type="checkbox"
                            className="input-check"
                            {...register("isddpireq", {
                              onBlur: (e) =>
                                ME_EventTriggered("DDPIEntered", { "DDPIEntered": e.target.value })
                            })}

                          />
                          <span className="slider round" />
                        </label>

                        <p>
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].No
                          }
                        </p>
                        <a
                          className="knowMore-pointer"
                          onClick={() => {
                            setknowMoreModal(true);
                          }}
                        >
                          Know More
                        </a>
                      </div>

                      {/* new satrt */}

                      {/* <p className="personal-detail-info-text">
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].FUTURE_OPTIONS
                        }
                      </p>
                      <div className="nominee-input">
                        <label className="switch">
                          <input
                            type="checkbox"
                            className="input-check"
                            {...register("isfnoreq", {
                              // onChange: (e) => checkFnoState(e),
                              // onBlur: (e) =>
                              //   ME_EventTriggered("FnOSelected", { "FnOSelected": e.target.value })
                            })}
                            onChange={(e) => checkFnoState(e)}

                          />
                          <span className="slider round" />
                        </label>
                        <p>
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].No
                          }
                        </p>
                      </div> */}
                      {/* new end */}
                      <div className="dual-block additional-segment">
                        <div className="gender-block">
                          <div className="gender-info">
                            <label htmlFor="fo">
                              <input
                                type="checkbox"
                                id="fo"
                                className="personal-input"
                                {...register("isfnoreq", {
                                  onChange: (e) => checkFnoState(e),
                                  onBlur: (e) =>
                                    ME_EventTriggered("FnOSelected", { "FnOSelected": e.target.value })
                                })}
                              />
                              <div className="dual-block-card form-card">
                                <div className="card-title">F&O</div>
                              </div>
                            </label>
                            <label htmlFor="slb">
                              <input
                                type="checkbox"
                                id="slb"
                                className="personal-input"
                                {...register("isslb")}
                                onBlur={() => {
                                  ME_EventTriggered("SLB select")
                                }}
                              />
                              <div className="dual-block-card form-card">
                                <div className="card-title">SLB</div>
                              </div>
                            </label>
                            <label htmlFor="currency">
                              <input
                                type="checkbox"
                                id="currency"
                                className="personal-input"
                                {...register("isCurrency")}
                                onClick={(e) => {
                                  if (e.target.checked) {
                                    // setValue("isNSE", true);
                                    // setValue("isBSE", true);
                                    // setIsCurrencyChecked(true);
                                    setOpenDisclouser(true);
                                  } else {
                                    // setIsCurrencyChecked(false);
                                    setOpenDisclouser(false);
                                  }
                                  ME_EventTriggered("IsCurrency", e.target.checked)
                                }}
                              />
                              <div className="dual-block-card form-card">
                                <div className="card-title">
                                  Currency Derivative
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                      {/* {isCurrencyChecked && (
                        <>
                          <div className="checkbox-wrapper">
                            <div className="check-content">
                              <input
                                type="checkbox"
                                className="has-value"
                                {...register("isNSE", {
                                  onChange: () => NseBseChange(),
                                })}
                              />
                              <label htmlFor="scales">NSE</label>
                            </div>
                            <div className="check-content">
                              <input
                                type="checkbox"
                                className="has-value"
                                {...register("isBSE", {
                                  onChange: () => NseBseChange(),
                                })}
                              />
                              <label htmlFor="scales">BSE</label>
                            </div>
                          </div>
                          <div
                            className="text-danger currency-error"
                            id="currency-error"
                          >
                            Please select Any one currency Derivative
                          </div>
                        </>
                      )} */}
                    </div>

                    {formvalues.gender &&
                      formvalues.maritalstatus &&
                      formvalues.incomerange ? (
                      <div className="nominee-right mt-auto">
                        <button
                          type="submit"
                          disabled={pageBtn}
                          className="continue-btn ekyc-comn-btn"
                        >
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].CONTINUE
                          }
                        </button>
                      </div>
                    ) : (
                      <div className="nominee-right mt-auto">
                        <button className="continue-btn" type="submit" disabled={pageBtn}>
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].CONTINUE
                          }
                        </button>
                      </div>
                    )}
                    <Modal
                      show={knowMoreModal}
                      onHide={() => setknowMoreModal(false)}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      className="KnowMore"
                      centered
                    >
                      <div
                        className="close"
                        onClick={() => setknowMoreModal(false)}
                      >
                        {/* <i className="icon-close" /> */}
                        <svg class="new-icon new-icon-close">
                          <use href="#new-icon-close"></use>
                        </svg>
                      </div>
                      <Modal.Body>
                        <h3 className="modal-title">DDPI PURPOSES</h3>
                        <div className="knowMore-main">
                          <ul className="points-remember-wrapper knowmore">
                            <li>
                              {/* <i className="icon-tick" /> */}
                              <div className="tick-box">
                                <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                              </div>
                              <p className="remember-points">
                                Transfer of securities held in the beneficial
                                owner accounts of the client towards Stock
                                Exchange related deliveries/ settlement
                                obligations arising out of trades executed by
                                clients on the Stock Exchange through the same
                                stock broker.
                              </p>
                            </li>
                            <li>
                              {/* <i className="icon-tick" /> */}

                              <div className="tick-box">
                                <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                              </div>
                              <p className="remember-points">
                                Pledging/re-pledging of securities in favor of
                                trading member (TM) / clearing member (CM) for
                                the purpose of meeting margin requirements of
                                the clients in connection with the trades
                                executed by the clients on the Stock Exchange.
                              </p>
                            </li>
                            <li>
                              {/* <i className="icon-tick" /> */}
                              <div className="tick-box">
                                <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                              </div>
                              <p className="remember-points">
                                Mutual Fund transactions being executed on Stock
                                Exchange order entry platforms.
                              </p>
                            </li>
                            <li>
                              {/* <i className="icon-tick" /> */}
                              <div className="tick-box">
                                <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                              </div>
                              <p className="remember-points">
                                Tendering shares in open offers through Stock
                                Exchange platforms.
                              </p>
                            </li>
                          </ul>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                </form>
              </Col>
              <Col className="position-inherit" md="4" lg="5">
                <div className="d-flex flex-column h-100">
                  <ChatCard
                    chatSubtitle={
                      "KYC protects your account from any fraud or money laundering activities"
                      // "All your trade & fund related details are sent on your registered email Id. So just in case you are eligible for dividends someday we don’t want you to miss the information. "
                    }
                    link={
                      <span>
                        Source <span className="chat-link-divider">:</span>
                        <span>
                          <a
                            href="https://www.amfiindia.com/investor-corner/investor-center/kyc.html#accordion4%22"
                            target="_blank"
                          >
                            Amfi india
                          </a>
                        </span>
                      </span>
                    }
                  />

                  <div className="user-bottom-img persnol-details">
                    <img src={userBottomImg} alt="person icon" />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
      <Modal
        show={openDisclouser}
        onHide={() => setOpenDisclouser(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="riskdisclosuser"
        centered
        backdrop="static"
        keyboard={false}
      >
        <div className="modal-header">
          <img src={RiskDisclosureIcon} alt="Riskdisclosure-icon" />
          <h2 className="disclosure-title">Risk Disclosure On Derivatives</h2>
        </div>
        <Modal.Body>
          <div className="riskdisclosuser-content">
            <ul className="disclosure-list-wrapper">
              <li>
                9 out of 10 individual traders in equity Futures and Options
                Segment, incurred net losses.
              </li>
              <li>
                On an average, loss makers registered net trading loss close to
                50,000.
              </li>
              <li>
                Over and above the net trading losses incurred, loss makers
                expended an additional 28% of net trading losses as transaction
                costs.
              </li>
              <li>
                Those making net trading profits, incurred between 15% to 50% of
                such profits as transaction cost.
              </li>
            </ul>
            <div className="disclosure-footer">
              <p className="disclosure-footer-desc">
                SEBI study dated January 25, 2023 on "Analysis of Profit and
                Loss of Individual Traders dealing in equity Futures and Options
                (F&O) Segment", wherein Aggregate Level findings are based on
                annual Profit/Loss incurred by individual traders in equity F&O
                during FY 2021-22.
              </p>
            </div>

            <button
              className="close-btn"
              onClick={() => {
                setOpenDisclouser(false);
                sendToCleverTap("BFSL_APPLICATION_VIEWED", {
                  EP_PAGE_NAME: "RISK DISCLOSURE ON DERIVATIVES PAGE",
                  EP_CTA: "OK",
                });
              }}
            >
              OK
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PersonalDetail;
