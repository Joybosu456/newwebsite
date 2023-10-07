import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import UpHand from "../assets/images/up-hand.svg";
import Tick from "../assets/images/gif/tick.gif";
import ChatCard from "../components/ChatCard";
import Digilocker from "../assets/images/digilocker.svg";
import RocketGif from "../assets/images/gif/rocket-gif.gif";
import Document from "../assets/images/documents.svg";
import PageProgress from "../components/PageProgress";
import { useNavigate } from "react-router-dom";
import userBottomImg from "../assets/images/person-images/person-with-mobile.png";
import axios from "axios";
import { SERVICES } from "../common/constants";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
// import { AF_EventTriggered } from "../common/Event";
import Language from "../common/Languages/languageContent.json";
import {
  AESDecryption,
  ME_EventTriggered,
  getSearchParameters,
  pauseAudio,
  playAudio,
  sendToCleverTap,
} from "../common/common.js";

const DocumentUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState();

  useEffect(() => {
    DigiLockerVisible();
    let user = localStorage.getItem("ExistUqId");
    if (user === null || user === "" || user === "null") {
      window.location.replace(window.origin);
    } else {
      ResumeApplication();
      sendToCleverTap("BFSL_APPLICATION_VIEWED", {
        EP_PAGE_NAME: "KYC PAGE",
      });
    }
  }, []);

  function DigiLockerVisible() {
    // let KRA = data.FlagRes.IsKyc;
    // let impsFlag = data.FlagRes.Imps;

    // AF_EventTriggered("Digilocker", "Digilocker", { onclick: "Digilocker" });
    let KRA = localStorage.getItem("KYC");
    let checkTelecaller = localStorage.getItem("telecaller");
    let impsFlag = localStorage.getItem("ifscflag");

    console.log(KRA, checkTelecaller, impsFlag, "ankit");
    // if (KRA != "0" && checkTelecaller === "no" && impsFlag === "1") {
    //   const kycflag = document.querySelector(".upload-docs__card.uploadDG");
    //   kycflag.style.display = "none";
    //   const kycflag1 = document.querySelector(".OR");
    //   kycflag1.style.display = "none";
    //   const kycflag3 = document.querySelector(".upload-docs__card.uploadDGTelecaller");
    //   kycflag3.style.display = "none";
    // }   
    //  if (KRA != "0" && checkTelecaller == "no" && impsFlag == "0") {
    //   const kycflag = document.querySelector(".upload-docs__card.uploadDG");
    //   kycflag.style.display = "none";
    //   const kycflag1 = document.querySelector(".OR");
    //   kycflag1.style.display = "none";
    //   const kycflag2 = document.querySelector(
    //     ".upload-docs__card__title.Myself"
    //   );
    //   kycflag2.style.display = "block";
    //   const kycflag3 = document.querySelector(".upload-docs__card.uploadDGTelecaller");
    //   kycflag3.style.display = "none";
    // }

    // if (KRA != "0" && checkTelecaller === "yes") {
    //   const kycflag = document.querySelector(".upload-docs__card.uploadDG");
    //   kycflag.style.display = "none";
    //   const kycflag1 = document.querySelector(".OR");
    //   kycflag1.style.display = "none";
    //   const kycflag3 = document.querySelector(".upload-docs__card.uploadDGTelecaller");
    //   kycflag3.style.display = "none";
    // }
    // if (KRA === "0" && checkTelecaller === "yes") {
    //   const kycflag = document.querySelector(".upload-docs__card.uploadDG");
    //   kycflag.style.display = "none";
    //   const kycflag2 = document.querySelector(".upload-docs__card.uploadDGTelecaller");
    //   kycflag2.style.display = "block";
    //   const kycflag1 = document.querySelector(".OR");
    //   kycflag1.style.display = "block";
    // }
    // if (KRA === "0" && checkTelecaller === "no") {
    //   const kycflag = document.querySelector(".upload-docs__card.uploadDG");
    //   kycflag.style.display = "block";
    //   const kycflag2 = document.querySelector(".upload-docs__card.uploadDGTelecaller");
    //   kycflag2.style.display = "none";
    //   const kycflag1 = document.querySelector(".OR");
    //   kycflag1.style.display = "block";
    // }
    if (KRA != "0" && checkTelecaller === "no" && impsFlag === "1") {
      const kycflag = document.querySelector(".upload-docs__card.uploadDG");
      kycflag.style.display = "none";
      const kycflag1 = document.querySelector(".OR");
      kycflag1.style.display = "none";
    }
    if (KRA != "0" && checkTelecaller == "no" && impsFlag == "0") {
      const kycflag = document.querySelector(".upload-docs__card.uploadDG");
      kycflag.style.display = "none";
      const kycflag1 = document.querySelector(".OR");
      kycflag1.style.display = "none";
      const kycflag2 = document.querySelector(
        ".upload-docs__card__title.Myself"
      );
      kycflag2.style.display = "block";
    }

    if (KRA != "0" && checkTelecaller === "yes") {
      const kycflag = document.querySelector(".upload-docs__card.uploadDG");
      kycflag.style.display = "none";
      const kycflag1 = document.querySelector(".OR");
      kycflag1.style.display = "none";
    }
    if (KRA === "0" && checkTelecaller === "yes") {
      const kycflag = document.querySelector(".upload-docs__card.uploadDG");
      kycflag.style.display = "block";
      const kycflag1 = document.querySelector(".OR");
      kycflag1.style.display = "block";
    }
  }

  const GetPackwisePercentage = async (pack) => {
    try {
      const response = await axios.post(
        SERVICES.GETPACKWISEPERCENTAGE,

        {
          CityName:
            clientData?.AddressRes?.City || localStorage.getItem("cityName")
              ? localStorage.getItem("cityName").toLowerCase()
              : "Mumbai",
        },

        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      let dataSet = response.data.Response;

      if (pack === "Free Pack") {
        localStorage.setItem("packupper", "Professional Pack");
        localStorage.setItem("packcount", dataSet[3].packcount);
      } else if (pack === "Professional Pack") {
        localStorage.setItem("packupper", "Bajaj Privilege Club");
        localStorage.setItem("packcount", dataSet[1].packcount);
      } else if (pack === "BPC") {
        localStorage.setItem("packupper", "Bajaj Privilege Club");
        localStorage.setItem("packcount", dataSet[1].packcount);
      }
    } catch (err) { }
  };

  const docUpload = () => {
    localStorage.setItem("DigiLockerActive", "1");
    ME_EventTriggered("UploadDocumentMyself")
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "KYC PAGE",
      EP_UPLOAD_TYPE: "UPLOAD DOCUMENTS MYSELF",
      EP_CTA: "CONTINUE",
    });
    const KRAflag = clientData?.FlagRes?.IsKyc || localStorage.getItem("KYC");
    const IMPS = clientData?.FlagRes?.Imps || localStorage.getItem("ifscflag");

    if (KRAflag === "0") {
      playAudio(15);
      navigate("/address-detail");
    } else if (KRAflag === "1" || KRAflag === "2") {

      navigate("/signature-upload");
      // if (IMPS === "0") 
      //   navigate("/check-upload");
      // } else if (IMPS === "1") {
      //   navigate("/signature-upload");
      // }
    }
  };

  function selectDigio() {
  // debugger
    let checkTelecaller = localStorage.getItem("telecaller");
    if (checkTelecaller === "no") {
      docUploadwithDigiLocker();
    }
    if (checkTelecaller === "yes") {
      docUploadwithDigiLockerTelecaller();
    }
    
  }

  const docUploadwithDigiLocker = async () => {
    ME_EventTriggered("UploadWithDigilocker")
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "KYC PAGE",
      EP_UPLOAD_TYPE: "UPLOAD WITH DIGILOCKER",
      EP_CTA: "CONTINUE",
    });

    DigiLockerLogger();
    localStorage.setItem("DigiLockerActive", "0");

    try {
      const response = await axios.post(
        SERVICES.DigioInitializer,
        {
          emailId: "",
          mobileNo:
            clientData?.AccountOpeningRes?.Mobile ||
            localStorage.getItem("mobile"),
          status: localStorage.getItem("DigiLockerActive"),
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.setItem("KidID", response.data.Response.id);
      localStorage.setItem(
        "identifier_mobile",
        response.data.Response.customer_identifier
      );
      const kid = response.data.Response.id;
      const identifier = response.data.Response.customer_identifier;

      const source = process.env.REACT_APP_DIGIO_SOURCE;
      const digioUrl = SERVICES.DIGIOKID;
      window.location.replace(
        digioUrl +
        kid +
        "&customer_identifier=" +
        identifier +
        "&source=" +
        source
      );
    } catch (err) { }
  };

  const docUploadwithDigiLockerTelecaller = async () => {
    ME_EventTriggered("UploadWithDigilocker")
    DigiLockerLogger();
    localStorage.setItem("DigiLockerActive", "0");

    try {
      const response = await axios.post(
        SERVICES.DigioInitializerTelecaller,
        {
          emailId: "",
          mobileNo:
            clientData?.AccountOpeningRes?.Mobile ||
            localStorage.getItem("mobile"),
          status: localStorage.getItem("DigiLockerActive"),
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.setItem("KidID", response.data.Response.id);
      localStorage.setItem(
        "identifier_mobile",
        response.data.Response.customer_identifier
      );
      const kid = response.data.Response.id;
      const identifier = response.data.Response.customer_identifier;

      const source = process.env.REACT_APP_DIGIO_SOURCE;
      const digioUrl = SERVICES.DIGIOKID;
      window.location.replace(
        digioUrl +
        kid +
        "&customer_identifier=" +
        identifier +
        "&source=" +
        source
      );
    } catch (err) { }
  };


  const DigiLockerLogger = async () => {
    const mobileno =
      clientData?.AccountOpeningRes?.Mobile || localStorage.getItem("mobile");
    const refno = clientData?.FlagRes?.Id || localStorage.getItem("refId");
    const panno =
      clientData?.AccountOpeningRes?.Pan || localStorage.getItem("Pan");
    try {
      const response = await axios.post(
        SERVICES.DIGIOLOGGER,
        {
          mobile: mobileno,
          refId: refno,
          pan: panno,
          type: "Digi-locker",
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.Response == "Log inserted successfully") {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDocoment();
  }, []);

  const getAllDocoment = async () => {
    try {
      const response = await axios.post(
        SERVICES.GETALLDOCUMENT,
        {
          docRefId: Number(localStorage.getItem("refId")),
          uqId: localStorage.getItem("ExistUqId"),
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.Response.docList) {
        let data = response.data.Response.docList;
        for (let i = 0; i <= data.length - 1; i++) {
          let docName = data[i].docDef;

          if (docName === "PDF-PHOTO") {
            localStorage.setItem("Photographuploaded", "1");
            // ME_EventTriggered("UploadDocumentMyself")
          }
        }
      }
    } catch (err) { }
  };

  const [text, setText] = useState("");
  const [text1, setText1] = useState("");
  // function CCAvenuePaymentStatus(packType, Amt) {
  //   let [path, query = ""] = window.location.href.split("=");
  //   if (query != "" && query != "undefined" && query != "null") {
  //     try {
  //       (async () => {
  //         const response = await axios.post(SERVICES.UPDATEPAYMENTINFODESC, {
  //           packType: packType,
  //           packAmount: Amt,
  //           id: localStorage.getItem("refId"),
  //           paymentStatus: query,
  //           transactionRefNo: "string",
  //         });
  //         if (response.data.Response.outflag == "Y") {
  //           navigate("/document-upload");
  //         } else {
  //           navigate("/subscription-pack");
  //         }
  //       })();
  //     } catch (error) { }
  //   }
  // }

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
      if (resumeResp.Response.FlagRes.IsKycChanged === "true") {
        navigate("/personal-detail");
      }
      if (
        resumeResp.Response.PersonalDetailsRes.NominateAction === "" ||
        resumeResp.Response.PersonalDetailsRes.Gender === "" ||
        resumeResp.Response.PersonalDetailsRes.IncomeRange === "" ||
        resumeResp.Response.PersonalDetailsRes.MaritalStatus === ""
      ) {
        navigate("/personal-detail");
      } else if (
        resumeResp.Response.BankDetailsRes.AccountNo === "" ||
        resumeResp.Response.BankDetailsRes.AccountType === "" ||
        resumeResp.Response.BankDetailsRes.IfscCode === ""
      ) {
        navigate("/bank-detail");
      } else if (
        resumeResp.Response.PackInfo.PackType === "" ||
        resumeResp.Response.PackInfo.PackAmount === "" ||
        resumeResp.Response.PackInfo.PaymentStatus.toUpperCase() != "SUCCESS"
      ) {
        navigate("/subscription-pack");
      } else {
        if (resumeResp.Response.FlagRes.Imps != "") {
          localStorage.setItem("ifscflag", resumeResp.Response.FlagRes.Imps);
        }
        if (
          resumeResp.Response.FlagRes.Imps == "" ||
          resumeResp.Response.FlagRes.Imps == null ||
          resumeResp.Response.FlagRes.Imps == undefined
        ) {
          localStorage.setItem("ifscflag", "0");
        }
        if (resumeResp.Response.FlagRes.Fno != "") {
          localStorage.setItem("fno", resumeResp.Response.FlagRes.Fno);
        }
        if (resumeResp.Response.FlagRes.IsKyc != "") {
          localStorage.setItem("KYC", resumeResp.Response.FlagRes.IsKyc);
        }
        if (resumeResp.Response.PackInfo.PackType === "Free Pack") {
          setText(
            Language[localStorage.getItem("language") || "English"].SMART_CHOICE
          );

          setText1(
            Language[localStorage.getItem("language") || "English"]
              .COMPLETE_UR_KYC
          );
        } else if (
          resumeResp.Response.PackInfo.PackType === "Professional Pack"
        ) {
          setText(
            "You are indeed a PRO! Get ready to save 50% more brokerage than your peers!"
          );
          setText1(
            "Complete your KYC through Digilocker in a step and save all the hassle"
          );
        } else if (resumeResp.Response.PackInfo.PackType === "BPC") {
          setText(
            "You’re in a different league! We’re Privileged to Have You!"
          );
          setText1(
            "Complete your KYC through Digilocker in a step and save all the hassle"
          );
        }

        if (resumeResp.Response) {
          setClientData(resumeResp.Response);
          localStorage.setItem("ExistUqId", resumeResp.Response.FlagRes.UQID);
          // DigiLockerVisible(response.data.Response)
        }
        GetPackwisePercentage(resumeResp.Response.PackInfo.PackType);
      }
    } catch (err) { }
  };

  const [IsKYC, setisEKYC] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("KYC") == 0) {
      setisEKYC(true);
    } else {
      setisEKYC(false);
    }
    let params = getSearchParameters();
    if (params.encresp) {
      if (params.encresp == "cancel") {
        navigate("/subscription-pack");
      } else {
        try {
          (async () => {
            const response = await axios.post(SERVICES.UPDATEPAYMENTINFODESC, {
              packType: localStorage.getItem("packSelected"),
              packAmount: localStorage.getItem("amtSelected"),
              id: localStorage.getItem("refId"),
              paymentStatus: params.encresp,
              transactionRefNo: "string",
            });
            console.log(response, "response");
            if (response.data.Response)
              if (response.data.Response.outflag == "Y") {
                navigate("/document-upload");
              } else {
                navigate("/subscription-pack");
              }
          })();
        } catch (error) { }
      }
    }
    console.log(params);
  }, []);
  return (
    <>
      <PageProgress progress="document-upload" />
      <div className={`${loading ? "loader" : " "}`}>
        {loading && (
          <>
            <img src={bajaj_loaderimg} className="loader-img" />
          </>
        )}
        <main className="main-content">
          <Container>
            <Row>
              <Col lg="8">
                <div className="page-left">
                  {/* page header */}
                  <div className="page-header">
                    {/* back button */}
                    <a
                      role="button"
                      onClick={() => {
                        sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                          EP_PAGE_NAME: "KYC PAGE",
                          EP_UPLOAD_TYPE: "UPLOAD DOCUMENTS MYSELF",
                          EP_CTA: "BACK",
                        });
                        navigate("/subscription-pack");
                        pauseAudio();
                      }}
                      className="back-button"
                    >
                      <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                    </a>
                  </div>
                  <div className="document-upload-content">
                    <div>
                      <div>
                        <div className="payment-title d-flex align-items-end align-items-xs-start">
                          <img className="tick-gif" src={Tick} alt="" />
                          <h2 className="page-title">{text}</h2>
                        </div>
                        <p className="page-subtitle">{IsKYC ? text1 : null}</p>
                      </div> 
                      <div className="upload-docs">
                        <div
                          className="upload-docs__card uploadDG"
                          onClick={selectDigio}
                        >
                          <p className="suggestion-msg">
                            <img src={UpHand} alt="left hand icon" />
                            <span>
                              {" "}
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].RECOMMENDED
                              }
                            </span>
                          </p>
                          <img
                            className="upload-docs__card__img"
                            src={Digilocker}
                            alt="upload with digilocker"
                          />
                          <img
                            className="position-absolute rocket-gif"
                            src={RocketGif}
                            alt="Rocket Gif"
                          />
                          <div className="d-flex flex-column align-items-sm-center">
                            <h4 className="upload-docs__card__title">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].UPLOAD_DIGILOACKER
                              }
                            </h4>
                            <p className="upload-docs__card__details">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].OTP_YOUR_AADHAAR
                              }
                            </p>
                            <p className="upload-docs__card__time">
                              <svg class="new-icon new-icon-clock"><use href="#new-icon-clock"></use></svg>
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].FASTER
                              }
                            </p>
                          </div>
                        </div>

                        {/* <div
                          className="upload-docs__card uploadDGTelecaller"
                          onClick={docUploadwithDigiLockerTelecaller}
                        >
                          <p className="suggestion-msg">
                            <img src={UpHand} alt="left hand icon" />
                            <span>
                              {" "}
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].RECOMMENDED
                              }
                            </span>
                          </p>
                          <img
                            className="upload-docs__card__img"
                            src={Digilocker}
                            alt="upload with digilocker"
                          />
                          <img
                            className="position-absolute rocket-gif"
                            src={RocketGif}
                            alt="Rocket Gif"
                          />
                          <div className="d-flex flex-column align-items-sm-center">
                            <h4 className="upload-docs__card__title">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].UPLOAD_DIGILOACKER
                              }
                            </h4>
                            <p className="upload-docs__card__details">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].OTP_YOUR_AADHAAR
                              }
                            </p>
                            <p className="upload-docs__card__time">
                              <svg class="new-icon new-icon-clock"><use href="#new-icon-clock"></use></svg>
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].FASTER
                              }
                            </p>
                          </div>
                        </div> */}
                        <p className="OR">
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].OR
                          }
                        </p>
                        <form className="upload-docs__card-left">
                          <div
                            className="upload-docs__card"
                            onClick={docUpload}
                          >
                            <img
                              className="upload-docs__card__img"
                              src={Document}
                              alt="upload with digilocker"
                            />
                            <div className="d-flex flex-column align-items-sm-center">
                              <h4 className="upload-docs__card__title Myself">
                                {
                                  Language[
                                    localStorage.getItem("language") ||
                                    "English"
                                  ].UPLOAD_DOCUMENT_MYSELF
                                }
                              </h4>
                              <p className="upload-docs__card__details">
                                {
                                  Language[
                                    localStorage.getItem("language") ||
                                    "English"
                                  ].WE_WILL_ASSIST
                                }
                              </p>
                              <p className="upload-docs__card__time">
                                <svg class="new-icon new-icon-clock"><use href="#new-icon-clock"></use></svg>
                                {
                                  Language[
                                    localStorage.getItem("language") ||
                                    "English"
                                  ]._5min
                                }
                              </p>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col className="position-inherit" lg="4">
                <div className="d-flex flex-column justify-content-between h-100">
                  <ChatCard
                    chatSubtitle={`${localStorage.getItem("packcount")
                      ? localStorage.getItem("packcount").toString()
                      : ""
                      } people are saving twice than you by choosing the ${localStorage.getItem("packupper") || ""
                      } . You can switch any moment`}
                  />
                  <div className="user-bottom-img document-img">
                    <img src={userBottomImg} alt="person icon" />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </>
  );
};

export default DocumentUpload;
