import React, { useState, useEffect } from "react";
import document_gif from "../assets/images/document-gif.gif";
import document_gif_mob from "../assets/images/document-gif-mobile.gif";
import golden_star from "../assets/images/golden-stars.png";
import { useNavigate } from "react-router-dom";
import { SERVICES } from "../common/constants";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import axios from "axios";
import {
  AESDecryption,
  ME_EventTriggered,
  getSearchParameters,
  pauseAudio,
  playAudio,
} from "../common/common";
import { toast } from "react-toastify";

const ResumeJourney = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    var params = getSearchParameters();
    if (params.uid && params.uid2) {
      localStorage.clear();
      localStorage.setItem("audioPlayed", "played");
      localStorage.setItem("telecaller", "yes");
      localStorage.setItem("uid", params?.uid);
      localStorage.setItem("uid2", params?.uid2);
      localStorage.setItem("mobile", params?.uid);
      localStorage.setItem("ExistUqId", params?.uid2);
      localStorage.setItem("UserUqID", params?.uid2);
      localStorage.setItem("telecaller", "yes");
    } else {
      localStorage.setItem("telecaller", "no");
    }

    // Datta added for Landing Pages Redirection @16-08-2023
    if (params.uid && params.uqid) {
      localStorage.clear();
      localStorage.setItem("audioPlayed", "played");
      localStorage.setItem("uid", params?.uid);
      localStorage.setItem("uid2", params?.uqid);
      localStorage.setItem("mobile", params?.uid);
      localStorage.setItem("ExistUqId", params?.uqid);
      localStorage.setItem("UserUqID", params?.uqid);
      localStorage.setItem("telecaller", "no");
    }

    ResumeApplication();
  }, []);

  const ResumeApplication = async () => {
    setLoading(true)
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
      if (resumeResp.Response.FlagRes.Fno) {
        localStorage.setItem("fno", resumeResp.Response.FlagRes.Fno);
      }
      if (resumeResp.Response.FlagRes.IsKyc) {
        localStorage.setItem("KYC", resumeResp.Response.FlagRes.IsKyc);
      }
      console.log(
        resumeResp.Response.FlagRes.EsignDocId,
        "response.data.Response.FlagRes.EsignDocId"
      );
      if (resumeResp.Response.FlagRes.EsignDocId !== "") {
        console.log(" inside response.data.Response.FlagRes.EsignDocId");
        toast.error("Esign Already done with this Mobile and Pan");
        navigate("/");
        return;
      }
      console.log(" outside  response.data.Response.FlagRes.EsignDocId");

      if (process.env.REACT_APP_DOMAIN === "NAOM") {
        if (localStorage.getItem("source") === "Freedom_Plus" || (localStorage.getItem("referralCode") !== "" && localStorage.getItem("referralCode") !== null)) {
          if (resumeResp.Response.PackInfo.PackType == "Free Pack") {
            setText("CONTINUE WITH SUBSCRIPTION PACK");
            return
          }
        }
      }




      let fatherName = ""
      if (resumeResp.Response.PersonalDetailsRes.DependentFName !== "") {
        fatherName = resumeResp.Response.PersonalDetailsRes.DependentFName;
      }
      if (resumeResp.Response.PersonalDetailsRes.DependentMName !== "") {
        if (fatherName !== "") {
          fatherName =
            fatherName + " " + resumeResp.Response.PersonalDetailsRes.DependentMName;
        } else {
          fatherName = resumeResp.Response.PersonalDetailsRes.DependentMName;
        }
      }
      if (resumeResp.Response.PersonalDetailsRes.DependentLName !== "") {
        if (fatherName !== "") {
          fatherName =
            fatherName + " " + resumeResp.Response.PersonalDetailsRes.DependentLName;
        } else {
          fatherName = resumeResp.Response.PersonalDetailsRes.DependentLName;
        }
      }




      if (
        resumeResp.Response.PersonalDetailsRes.DdpiAction == "" ||
        resumeResp.Response.PersonalDetailsRes.NominateAction == "" || fatherName === "" || resumeResp.Response.PersonalDetailsRes.Gender === "" || resumeResp.Response.AddressRes.Zipcode === ""
      ) {
        setText("CONTINUE WITH PERSONAL DETAILS");
      } else {
        if (
          (resumeResp.Response.AddressRes.Zipcode == "" ||
            resumeResp.Response.AddressRes.Zipcode == null) &&
          resumeResp.Response.FlagRes.IsKyc == "0"
        ) {
          setText("CONTINUE WITH ADDRESS DETAILS");
        } else if (
          resumeResp.Response.BankDetailsRes.AccountNo == "" ||
          resumeResp.Response.BankDetailsRes.AccountNo == null
        ) {
          setText("CONTINUE WITH BANK DETAILS");
        } else if (
          resumeResp.Response.PackInfo.PaymentStatus == "" ||
          resumeResp.Response.PackInfo.PaymentStatus == null ||
          resumeResp.Response.PackInfo.PaymentStatus == "PENDING"
        ) {
          setText("CONTINUE WITH SUBSCRIPTION PACK");
        } else if (
          resumeResp.Response.PackInfo.PaymentStatus != "" ||
          resumeResp.Response.PackInfo.PaymentStatus != null ||
          resumeResp.Response.PackInfo.PaymentStatus != "PENDING"
        ) {
          if (resumeResp.Response.FlagRes.IsKyc != "0") {
            if (
              resumeResp.Response.DocumentStatus.signature !== "true" &&
              resumeResp.Response.FlagRes.Imps === "0" &&
              resumeResp.Response.DocumentStatus.cheque !== "true"
            ) {
              setText("CONTINUE WITH DOCUMENT UPLOAD");
            }
            else if (resumeResp.Response.DocumentStatus.signature != "true") {
              setText("CONTINUE WITH SIGNATURE UPLOAD");
            }
            else if (
              resumeResp.Response.DocumentStatus.cheque != "true" &&
              resumeResp.Response.FlagRes.Imps == "0"
            ) {
              setText("CONTINUE WITH CANCEL CHEQUE");
            }
            else if (
              resumeResp.Response.DocumentStatus.fno != "true" &&
              resumeResp.Response.FlagRes.Fno == "True"
            ) {
              setText("CONTINUE WITH Financial Proof");
            } else if (
              resumeResp.Response.DocumentStatus.photograph != "true"
            ) {
              setText("CONTINUE WITH PHOTOGRAPH UPLOAD");
            } else if (resumeResp.Response.FlagRes.EsignDocId == "") {
              setText("CONTINUE WITH ESIGN");
            } else if (
              resumeResp.Response.DocumentStatus.photograph === "true" &&
              resumeResp.Response.DocumentStatus.signature === "true" &&
              resumeResp.Response.DocumentStatus.fno === "true" &&
              resumeResp.Response.FlagRes.Fno == "True"
            ) {
              setText("CONTINUE WITH ESIGN");
            }
            else if (resumeResp.Response.DocumentStatus.photograph === "true" &&
              resumeResp.Response.DocumentStatus.signature === "true" &&
              resumeResp.Response.DocumentStatus.fno === "false" &&
              resumeResp.Response.FlagRes.Fno == "False") {
              setText("CONTINUE WITH ESIGN");

            }
            else {
              setText("CONTINUE WITH DOCUMENT UPLOADING");
            }
          } else if (resumeResp.Response.FlagRes.IsKyc == "0") {
            if (resumeResp.Response.DocumentStatus.addressproof != "true") {
              setText("CONTINUE WITH DOCUMENT UPLOADING");
            } else if (resumeResp.Response.DocumentStatus.pan != "true") {
              setText("CONTINUE WITH PAN UPLOADING");
            }
            else if (resumeResp.Response.DocumentStatus.signature != "true") {
              setText("CONTINUE WITH SIGNATURE UPLOAD");
            }
            else if (
              resumeResp.Response.DocumentStatus.cheque != "true" &&
              resumeResp.Response.FlagRes.Imps == "0"
            ) {
              setText("CONTINUE WITH CANCEL CHEQUE");
            }
            else if (
              resumeResp.Response.DocumentStatus.fno != "true" &&
              resumeResp.Response.FlagRes.Fno == "True"
            ) {
              setText("CONTINUE WITH Financial Proof");
            } else if (
              resumeResp.Response.DocumentStatus.photograph != "true"
            ) {
              setText("CONTINUE WITH PHOTOGRAPH UPLOAD");
            } else if (
              resumeResp.Response.DocumentStatus.photograph === "true" &&
              resumeResp.Response.DocumentStatus.signature === "true" &&
              resumeResp.Response.DocumentStatus.fno === "true" &&
              resumeResp.Response.FlagRes.Fno == "True"
            ) {
              setText("CONTINUE WITH ESIGN");
            } else if (resumeResp.Response.DocumentStatus.photograph === "true" &&
              resumeResp.Response.DocumentStatus.signature === "true" &&
              resumeResp.Response.DocumentStatus.fno === "false" &&
              resumeResp.Response.FlagRes.Fno == "False") {
              setText("CONTINUE WITH ESIGN");

            }
            else {
              setText("CONTINUE WITH DOCUMENT UPLOADING");
            }
          }
        } else {
          setText("CONTINUE WITH PERSONAL DETAILS");
        }
      }

      localStorage.setItem("refId", resumeResp.Response.FlagRes.Id);
      localStorage.setItem("UserRefID", resumeResp.Response.FlagRes.Id);
      let Data = resumeResp.Response;
      let firstName = Data.PersonalDetailsRes.FirstName.split(" ")
        .join("")
        .replace(/[^a-zA-Z0-9]/g, "");
      let Pan = Data.AccountOpeningRes.Pan;
      let Mobile = Data.AccountOpeningRes.Mobile;
      const PhraseName = `${firstName}_${Pan}_${Mobile}`;
      localStorage.setItem("PhraseName", PhraseName);
      localStorage.setItem("Pan", Pan)
      if (Data.FlagRes.Imps) {
        localStorage.setItem("ifscflag", Data.FlagRes.Imps);
      }
    } catch (err) { }
    finally {
      setLoading(false)
    }
  };

  const ResumeApplicationToContinue = async (token) => {
    setLoading(true)
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
      if (resumeResp.Response.FlagRes.EsignDocId !== "") {
        toast.error("Esign Already done with this Mobile and Pan");
        navigate("/");
        return;
      }

      if (process.env.REACT_APP_DOMAIN === "NAOM") {
        if (localStorage.getItem("source") === "Freedom_Plus" || (localStorage.getItem("referralCode") !== "" && localStorage.getItem("referralCode") !== null)) {
          if (resumeResp.Response.PackInfo.PackType == "Free Pack") {
            navigate("/subscription-pack");
            return
          }
        }
      }
      let fatherName = ""
      if (resumeResp.Response.PersonalDetailsRes.DependentFName !== "") {
        fatherName = resumeResp.Response.PersonalDetailsRes.DependentFName;
      }
      if (resumeResp.Response.PersonalDetailsRes.DependentMName !== "") {
        if (fatherName !== "") {
          fatherName =
            fatherName + " " + resumeResp.Response.PersonalDetailsRes.DependentMName;
        } else {
          fatherName = resumeResp.Response.PersonalDetailsRes.DependentMName;
        }
      }
      if (resumeResp.Response.PersonalDetailsRes.DependentLName !== "") {
        if (fatherName !== "") {
          fatherName =
            fatherName + " " + resumeResp.Response.PersonalDetailsRes.DependentLName;
        } else {
          fatherName = resumeResp.Response.PersonalDetailsRes.DependentLName;
        }
      }
      if (
        resumeResp.Response.PersonalDetailsRes.DdpiAction == "" ||
        resumeResp.Response.PersonalDetailsRes.NominateAction == "" || fatherName === "" || resumeResp.Response.PersonalDetailsRes.Gender === "" || resumeResp.Response.AddressRes.Zipcode === ""
      ) {
        playAudio(9);
        navigate("/personal-detail");

        if (
          resumeResp.Response.PersonalDetailsRes.DdpiAction == "" &&
          resumeResp.Response.PersonalDetailsRes.NominateAction == ""
        ) {
          toast.error(
            "Please provide your Nominee & DDPI declaration to continue"
          );
        } else if (resumeResp.Response.PersonalDetailsRes.DdpiAction == "") {
          toast.error("Please provide your DDPI declaration to continue");
        } else if (
          resumeResp.Response.PersonalDetailsRes.NominateAction == ""
        ) {
          toast.error("Please provide your Nominee declaration to continue");
        }
      } else {
        if (
          resumeResp.Response.AddressRes.Zipcode == "" &&
          resumeResp.Response.FlagRes.IsKyc == "0"
        ) {
          pauseAudio();
          navigate("/address-details-manually");
        } else if (
          resumeResp.Response.BankDetailsRes.AccountNo === "" ||
          resumeResp.Response.BankDetailsRes.AccountNo === null
        ) {
          playAudio(11);
          navigate("/bank-detail");
        } else if (
          resumeResp.Response.PackInfo.PaymentStatus == "" ||
          resumeResp.Response.PackInfo.PaymentStatus == null ||
          resumeResp.Response.PackInfo.PaymentStatus == "PENDING"
        ) {
          playAudio(13);
          navigate("/subscription-pack");
        } else if (
          resumeResp.Response.PackInfo.PaymentStatus != "" ||
          resumeResp.Response.PackInfo.PaymentStatus != null ||
          resumeResp.Response.PackInfo.PaymentStatus != "PENDING"
        ) {
          if (
            resumeResp.Response.FlagRes.IsKyc === "1" ||
            resumeResp.Response.FlagRes.IsKyc === "2"
          ) {
            if (
              resumeResp.Response.DocumentStatus.signature !== "true" &&
              resumeResp.Response.DocumentStatus.cheque !== "true" &&
              resumeResp.Response.FlagRes.Imps === "0" &&
              resumeResp.Response.DocumentStatus.cheque !== "true"
            ) {
              playAudio(14);
              navigate("/document-upload");
            }
            else if (
              resumeResp.Response.DocumentStatus.signature !== "true"
            ) {
              playAudio(17);
              navigate("/signature-upload");
            }
            else if (
              resumeResp.Response.DocumentStatus.cheque !== "true" &&
              resumeResp.Response.FlagRes.Imps === "0"
            ) {
              pauseAudio();
              navigate("/check-upload");
            }
            else if (
              resumeResp.Response.DocumentStatus.fno !== "true" &&
              resumeResp.Response.FlagRes.Fno == "True"
            ) {
              pauseAudio();
              navigate("/fno");
            } else if (
              resumeResp.Response.DocumentStatus.photograph !== "true"
            ) {
              playAudio(18);
              navigate("/selfie-upload");
            } else if (resumeResp.Response.DocumentStatus.photograph === "true" &&
              resumeResp.Response.DocumentStatus.signature === "true" &&
              resumeResp.Response.DocumentStatus.fno === "false" &&
              resumeResp.Response.FlagRes.Fno == "False") {
              playAudio(18);
              navigate("/selfie-upload");
            }
            else if (
              resumeResp.Response.DocumentStatus.photograph === "true" &&
              resumeResp.Response.DocumentStatus.signature === "true" &&
              resumeResp.Response.DocumentStatus.fno === "true" &&
              resumeResp.Response.FlagRes.Fno == "True"
            ) {
              playAudio(18);
              navigate("/selfie-upload");
            } else {
              playAudio(14);
              navigate("/document-upload");
            }
          } else if (resumeResp.Response.FlagRes.IsKyc === "0") {
            if (resumeResp.Response.DocumentStatus.addressproof !== "true") {
              playAudio(14);
              navigate("/document-upload");
            } else if (resumeResp.Response.DocumentStatus.pan !== "true") {
              playAudio(16);
              navigate("/pan-upload");
            }
            else if (
              resumeResp.Response.DocumentStatus.signature === "false"
            ) {
              playAudio(17);
              navigate("/signature-upload");
            }
            else if (
              resumeResp.Response.DocumentStatus.cheque === "false" &&
              resumeResp.Response.FlagRes.Imps === "0"
            ) {
              pauseAudio();
              navigate("/check-upload");
            } else if (
              resumeResp.Response.DocumentStatus.fno === "false" &&
              resumeResp.Response.FlagRes.Fno == "True"
            ) {
              pauseAudio();
              navigate("/fno");
            } else if (
              resumeResp.Response.DocumentStatus.photograph === "false"
            ) {
              playAudio(18);
              navigate("/selfie-upload");
            } else if (
              resumeResp.Response.DocumentStatus.photograph === "true" &&
              resumeResp.Response.DocumentStatus.signature === "true" &&
              resumeResp.Response.DocumentStatus.fno === "true" &&
              resumeResp.Response.FlagRes.Fno == "True"
            ) {
              playAudio(18);
              navigate("/selfie-upload");
            } else {
              playAudio(14);
              navigate("/document-upload");
            }
          }
        } else {
          playAudio(9);
          navigate("/personal-detail");
        }
      }

      localStorage.setItem("refId", resumeResp.Response.FlagRes.Id);
      localStorage.setItem("UserRefID", resumeResp.Response.FlagRes.Id);
    } catch (err) { }
    finally {
      setLoading(false)
    }
  };

  const navBack = () => {
    ResumeApplicationToContinue();
    ME_EventTriggered("Continue Subscription page")
  };

  return (
    <>
      <div className={`${loading ? "loader" : " "}`}>
        {loading && (
          <>
            <img src={bajaj_loaderimg} className="loader-img" />
          </>
        )}
        <main className="main-content returnee-page">
          <section className="returnee-user">
            <div className="container">
              <div className="returnee-user__card">
                <div className="card-left">
                  <h2 className="title">
                    Welcome Back {localStorage.getItem("FullName")}
                    ,<br />
                    <span>Let's start Where we left!</span>
                  </h2>
                  <p className="details">
                    BFSL has helped thousands of customers save time and build an
                    expert-backed SMART Portfolio with their PickRight feature
                  </p>
                  <p className="subtitle">
                    Investing Empowers You with Financial Independence
                  </p>
                  <p className="sub-details">
                    Complete a few steps and plan your freedom with BFSL
                  </p>
                  <a onClick={navBack} className="common-btn">
                    {text}
                  </a>
                </div>
                <div>
                  <a href>
                    <img
                      src={document_gif}
                      alt="document-img"
                      className="document-img"
                    />
                    <img
                      src={document_gif_mob}
                      alt="document-mobile-img"
                      className="document-mobile-img"
                    />
                  </a>
                </div>
                <img
                  src={golden_star}
                  alt="golden-star-img"
                  className="golden-star-img"
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ResumeJourney;
