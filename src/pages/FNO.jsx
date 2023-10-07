import React, { useState, useEffect } from "react";
import ChatCard from "../components/ChatCard";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Bulb_icon from "../assets/images/gif/bulb-suggest.gif";
import Page_Progress from "../components/PageProgress";
import axios from "axios";
import UploadIcon from "../assets/images/upload-icon.svg";
import $ from "jquery";
import userBottomImg from "../assets/images/person-images/pancard.png";
import {
  AESDecryption,
  ME_EventTriggered,
  checkUrlValid,
  customSelect,
  downloadPDF,
  getUrlExtension,
  isImage,
  pauseAudio,
  previewReset,
  sendToCleverTap,
} from "../common/common";
// import pdficon from "../assets/images/pdficon.png";
import { SERVICES } from "../common/constants";
import { toast } from "react-toastify";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
// import { AF_EventTriggered } from "../common/Event";
import downloadImage from "../assets/images/fno/downloadImage.svg";
import monthStatement from "../assets/images/fno/bankStatement.svg";
import UploadImage from "../assets/images/fno/uploadFile.svg";
import demat from "../assets/images/fno/demat.svg";
import itr from "../assets/images/fno/itr.svg";
import netWorth from "../assets/images/fno/netWorth.svg";
import salarySlip from "../assets/images/fno/salarySlip.svg";
import Language from "../common/Languages/languageContent.json";
import SixMonthstatement from "../assets/images/fno/6-month-bank-statement.png";
import SixMonthsecond from "../assets/images/fno/step2.png";
import SixMonththrid from "../assets/images/fno/upload-your-file2step-2.png";
import ThreMonthstep from "../assets/images/fno/3-month-step.jpg";
import ThreMonthstepsecond from "../assets/images/fno/hrms-odisha-login.jpg";
import ThreMonthstepthird from "../assets/images/fno/standard.jpg";
import ImgItr from "../assets/images/fno/image-itr.png";
import ItrAccknowledgement from "../assets/images/fno/itr-acknowledgement.png";
import DematAccountStat from "../assets/images/fno/demat-account-statement.png";
import { playAudio } from "../common/common.js";
import dematStep from "../assets/images/fno/demat-step.png";
import networthicon from "../assets/images/Networth-Certificate.png";
import demataccounticon from "../assets/images/demat-account-statement-cdsl.png";
import itricon from "../assets/images/ITR-Acknowledgement.png";
import bankstatementicon from "../assets/images/BankStatement-Chequing.png";
import threemonthsalaryslipicon from "../assets/images/3-month-salary-slip.png";
import PDFViewer from "../common/pdfViewer";

const FNO = () => {
  const navigate = useNavigate();

  const [downloadFnoDoc, setDownloadFnoDoc] = useState("");
  const [proof, setProof] = useState("6 months bank statements");
  const [loading, setLoading] = useState(false);
  const [fnoPreview, setFnoPreview] = useState(false);
  const [fnoPdfURL, setFnoPdfURL] = useState("");
  const [front, setFront] = useState(false);
  const [clientData, setClientData] = useState();
  const [deleteFnoDoc, setDeleteFnoDoc] = useState("");
  const [showIcon, setShowIcon] = useState(false);
  const [header, setHeader] = useState("Future and Options")



  let Phrase = "";
  useEffect(() => {
    let user = localStorage.getItem("ExistUqId");
    if (user === null || user === "" || user === "null") {
      window.location.replace(window.origin);
    } else {
      sendToCleverTap("BFSL_APPLICATION_VIEWED", {
        EP_PAGE_NAME: "FUTURES AND OPTIONS UPLOAD PAGE",
      });
      customSelect();
      getAllDocoment();
      ResumeClient();
    }
  }, []);

  const navBack = () => {
     sendToCleverTap("BFSL_APPLICATION_CLICKED", {
     EP_PAGE_NAME: "FUTURES AND OPTIONS UPLOAD PAGE",
     EP_UPLOAD_FRONT_SIDE: "",
     EP_UPLOAD_FRONT_STATUS: "",
     EP_CTA: "BACK",
     })


   let IMPS = clientData?.FlagRes?.Imps || localStorage.getItem("ifscflag");
   if (IMPS == "0") {
      pauseAudio();
      navigate(`/check-upload`);
    } else {
      playAudio(17);
      navigate(`/signature-upload`);
    }
  };

  const ResumeClient = async () => {
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
      console.log(resumeResp, "resumeResp")
      if (resumeResp.Response) {
        setClientData(resumeResp.Response);
        localStorage.setItem("ExistUqId", resumeResp.Response.FlagRes.UQID);
        if (resumeResp.Response.PersonalDetailsRes.SLB == true) {
          // alert("slb")
          setHeader("Future and Options")
        }
        if (resumeResp.Response.PersonalDetailsRes.CurrencyDerivative == true) {
          setHeader("F&O and Currency Derivative")
        }
        if (resumeResp.Response.PersonalDetailsRes.SLB == true && resumeResp.Response.PersonalDetailsRes.CurrencyDerivative == true) {
          setHeader("F&O and Currency Derivative")
        }
        //  if (resumeResp.Response.PersonalDetailsRes.fno == "True") {
        //   setHeader("F&O")
        // } if (resumeResp.Response.PersonalDetailsRes.CurrencyDerivative==true) {
        //   // alert("CurrencyDerivative")
        //   setCurrencyFlag("Currency Derivative")
        // }
      }
    } catch (err) { }
  };

  const getAllDocoment = async (valid = false) => {
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
          if (docName === "FNO" && data[i].fileName!='') {
            let UrlStatus = await checkUrlValid(data[i].fileName);
            console.log(UrlStatus);
            if (!UrlStatus) {
              console.log("url error");
              continue
            }
            setFront(true);
            setShowIcon(true);
            if (valid) {
              setDeleteFnoDoc(data[i].docName);
            } else {
              setDeleteFnoDoc(data[i].docName);
              // let PANNo = localStorage.getItem("Pan");
              // var index3 = data.findIndex((p) => p.docDef == "FNO");
              // let ImgIRL =
              //   process.env.REACT_APP_IMAGE_URL +
              //   "/" +
              //   PANNo +
              //   "/" +
              //   data[index3].fileName;
              // console.log(ImgIRL, "ImgIRL");
              // console.log(data[index3].fileName);
              // setFnoPdfURL(ImgIRL);
              // var parts = ImgIRL.split(".");
              setProof(data[i].docDescription);
              let Front = $(".upload-front-side")[0];
              $(Front).find(".first-view").css("display", "none");
              let Imagetype = getUrlExtension(data[i].fileName);
              setDownloadFnoDoc(data[i].fileName);
              if (Imagetype === "pdf") {
                // setPdf preview for frontPArt
                setFnoPreview(true);
                setFnoPdfURL(data[i]["fileName"]);
              } else {
                // setNormal Image Show
                setFnoPreview(false);
                setFnoPdfURL("");
                $(Front).find(".demo").attr("src", data[i]["fileName"]);
              }

              $(Front).find(".demo").css("width", "213px");
              $(Front).find(".demo").css("height", "116px");
              $(Front).find(".demo").css("object-fit", "content");
              $(Front).find(".second-view").css("display", "block");
              $(Front).find(".input-img ").removeAttr("required");
              $(Front).find(".img-status").css("display", "none");
              var index1 = data.findIndex((p) => p.docDef == "FNO");
              localStorage.setItem("FnOGuid", data[index1].docGuiId);
            }
          }
        }
      }
    } catch (err) { }
  };

  const [uploadguidemodalShow, setuploadguideModalShow] = useState(false);

  function downloadInput(e) {
    e.preventDefault();
    downloadPDF(downloadFnoDoc, "FNO_Document");

    // try {

    //   let firstName = clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    //   let Pan = clientData?.AccountOpeningRes?.Pan;
    //   let Mobile = clientData?.AccountOpeningRes?.Mobile;
    //   const Phrase = `${firstName}_${Pan}_${Mobile}` || localStorage.getItem("PhraseName");
    //   const RefNo = clientData?.FlagRes?.Id || localStorage.getItem("refId");
    //   const downloadFnO = localStorage.getItem("FnOGuid");
    //   window.open(SERVICES.PDFDOWNLOADNEW + "/" + downloadFnO);

    // } catch (err) {
    // }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const telFlag = localStorage.getItem("telecaller") === "yes";
    playAudio(18);
    navigate(`/selfie-upload`);
    // if (localStorage.getItem("telecaller") === "yes") {
    //   navigate(`/ipvrecord`);
    // } else {
    //   playAudio(18);
    //   navigate(`/selfie-upload`);
    // }
    ME_EventTriggered("Submit FnODocuments")
  };

  const FinancialProof = [
    {
      value: Language[localStorage.getItem("language") || "English"]._6_MONTHS,
      label: Language[localStorage.getItem("language") || "English"]._6_MONTHS,
    },
    {
      value: Language[localStorage.getItem("language") || "English"]._3_MONTHS,
      label: Language[localStorage.getItem("language") || "English"]._3_MONTHS,
    },
    {
      value:
        Language[localStorage.getItem("language") || "English"]
          .NET_WORTH_CERTIFICATE,
      label:
        Language[localStorage.getItem("language") || "English"]
          .NET_WORTH_CERTIFICATE,
    },
    {
      value:
        Language[localStorage.getItem("language") || "English"].DEMATE_HOLDING,
      label:
        Language[localStorage.getItem("language") || "English"].DEMATE_HOLDING,
    },
    {
      value: Language[localStorage.getItem("language") || "English"].ITR,
      label: Language[localStorage.getItem("language") || "English"].ITR,
    },
  ];
  const uploadFile = async (e, value, data) => {
    let parent = $($(e.target).parent().closest(".upload-front-side"));
    let second = $(parent).find(".second-view")[0];
    let progress = $(second).find(".current")[0];
    let dataShow = $(second).find(".byte")[0];
    let flag = $(second).find(".flag")[0];
    const formData = new FormData();
    const imagefile = e.target;
    const UQID = clientData?.FlagRes?.UQID || localStorage.getItem("UserUqID");
    const REFID = clientData?.FlagRes?.Id || localStorage.getItem("UserRefID");
    formData.append("Image", imagefile.files[0]);
    formData.append("RefId", REFID);
    formData.append("DocDef", data);
    formData.append("DocDesc", value);
    formData.append("UqId", UQID);
    let firstName =
      clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    let Pan = clientData?.AccountOpeningRes?.Pan;
    let Mobile = clientData?.AccountOpeningRes?.Mobile;
    // const Phrase = `${firstName}_${Pan}_${Mobile}`.replace(".", " ", "_") || localStorage.getItem("PhraseName");
    if (firstName && Pan && Mobile) {
      Phrase = `${firstName}_${Pan}_${Mobile}`;
    } else {
      Phrase = localStorage.getItem("PhraseName");
    }
    formData.append("pdfname", Phrase + "_" + data);
    var ajax = new XMLHttpRequest();
    function completeHandler() {
      $(flag).html(`Completed`);
    }
    const progressHandler = (event) => {
      $(dataShow).html(
        `<span className="upload-data">${event.loaded.formatBytes()}</span> of  <span className="total-data">${event.total.formatBytes()}</span>`
      );
      var percent = (event.loaded / event.total) * 100;
      if (percent == "100") {
        setFront(true);
      } else {
        setFront(false);
      }

      $(progress).css("width", `${percent.toFixed(0)}%`);
      $(flag).html(`Uploading`);
    };

    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.open("POST", SERVICES.UPLOADDOCUMENTFILE);
    ajax.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    ajax.send(formData);

    ajax.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          const request = JSON.parse(this.responseText);
          if (request.Status == "Success") {
            setShowIcon(true);
          } else {
            setShowIcon(false);
          }
          if (request.Status === "Failed") {
            sendToCleverTap("BFSL_APPLICATION_CLICKED", {
              EP_PAGE_NAME: "FUTURES AND OPTIONS UPLOAD PAGE",
              EP_UPLOAD_FRONT_SIDE: "YES",
              EP_UPLOAD_FRONT_STATUS: "INVALID",
              EP_CTA: "SUBMIT",
            });

            toast.error(request.Reason);
            deletePreview(e);
          } else {
            sendToCleverTap("BFSL_APPLICATION_CLICKED", {
              EP_PAGE_NAME: "FUTURES AND OPTIONS UPLOAD PAGE",
              EP_UPLOAD_FRONT_SIDE: "YES",
              EP_UPLOAD_FRONT_STATUS: "VALID",
              EP_CTA: "SUBMIT",
            });

            getAllDocoment(true);
            setDownloadFnoDoc(request.Response.DocumentUrl);
          }
        } else {
          sendToCleverTap("BFSL_APPLICATION_CLICKED", {
            EP_PAGE_NAME: "FUTURES AND OPTIONS UPLOAD PAGE",
            EP_UPLOAD_FRONT_SIDE: "YES",
            EP_UPLOAD_FRONT_STATUS: "INVALID",
            EP_CTA: "SUBMIT",
          });

          toast.error("Couldn't upload file, please try again!");
          deletePreview(e);
        }
      }
    };
  };

  function convertToBase64(e) {

    // let parent = $($(e.target).parent().closest(".upload-front-side"));
    // let preview = $(parent).find(".demo")[0];
    var selectedFile = document.getElementById("fno_pdf").files;
    if (selectedFile.length > 0) {
      let fileToLoad = selectedFile[0];
      let fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        let base64 = fileLoadedEvent.target.result;
        setFnoPdfURL(base64);
        // $(preview).attr("src", base64);
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  }

  function fileValidation(e, selected, desc) {
    setFnoPdfURL("");
    setFnoPreview(false);
    ME_EventTriggered(`${selected}`)
    // AF_EventTriggered("fno-upload", "fno-upload", { onclick: "fno-upload" });
    let parent = $($(e.target).parent().closest(".upload-front-side"));
    let first = $(parent).find(".first-view")[0];
    let preview = $(parent).find(".demo")[0];
    let second = $(parent).find(".second-view")[0];
    $(second).find(".img-status").css("display", "block");

    let fileText = $(second).find(".img-text")[0];
    let pdf = e.target.files[0].type;
    const fileMb = e.target.files[0].size / 1024 ** 2;
    const fileType = e.target.files[0].name;
    // function isImage(icon) {
    //   var ext = [".jpg", ".jpeg", ".png"];
    //   return ext.some((el) => icon.endsWith(el));
    // }

    if (pdf === "application/pdf" && fileMb < 5) {
      setFnoPreview(true);
      convertToBase64(e);
      // $(preview).attr("src", pdficon);
      $(preview).css("width", "60px");
      $(preview).css("height", "100px");
      $(preview).css("object-fit", "content");
      $(first).css("display", "none");
      $(second).css("display", "flex");
      uploadFile(e, selected, desc);
    } else if (isImage(fileType) && fileMb < 5) {
      if (e.target.files && e.target.files[0]) {
        let name = e.target.files[0].name;
        $(first).css("display", "none");
        $(second).css("display", "flex");
        uploadFile(e, selected, desc);
        $(fileText).text(name);
        var reader = new FileReader();

        reader.onload = function (e) {
          $(preview).attr("src", e.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    } else {
      e.target.value = "";
      // start
      if (fileMb > 5 && !isImage(fileType)) {
        toast.error(
          "Invalid file Format. Only " +
          [".jpg", ".jpeg", ".png"].join(", ") +
          " are allowed and Max file size limit is 5MB"
        );
      } else if (!isImage(fileType)) {
        toast.error(
          "Invalid file Format. Only " +
          [".jpg", ".jpeg", ".png", "pdf"].join(", ") +
          " are allowed."
        );
      } else if (fileMb > 5) {
        toast.error("Max file size limit is 5MB");
      }
      // end
      return false;
    }
  }

  const deleteDoc = async (e) => {
    let firstName =
      clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    let Pan = clientData?.AccountOpeningRes?.Pan;
    let Mobile = clientData?.AccountOpeningRes?.Mobile;
    // let Phrase = `${firstName}_${Pan}_${Mobile}` || localStorage.getItem("PhraseName");
    if (firstName && Pan && Mobile) {
      Phrase = `${firstName}_${Pan}_${Mobile}`;
    } else {
      Phrase = localStorage.getItem("PhraseName");
    }
    const RefNo = clientData?.FlagRes?.Id || localStorage.getItem("refId");
    try {
      const response = await axios.post(
        SERVICES.DELETEDOCUMENT,
        {
          id: RefNo,
          docName: deleteFnoDoc,
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.Status === "Failed") {
        toast.error(response.data.Reason);
      } else {
        setDownloadFnoDoc("");
        deletePreview(e);
        setFront(false);
        setFnoPdfURL("");
        setFnoPreview(false);
        setShowIcon(false);
      }
    } catch (err) { }
  };

  function deleteInput(e) {
    e.preventDefault();
    deleteDoc(e);
    ME_EventTriggered("DeleteDocument")
  }

  function deletePreview(e) {
    e.preventDefault();
    $(e.target)
      .parent()
      .closest(".upload-front-side")
      .find(".left-input")
      .find("input")[0].value = "";

    let progress = $(e.target)
      .parent()
      .closest(".upload-front-side")
      .find(".current")[0];

    $(progress).css("width", "0%");
    let parent = $(e.target).parent().closest(".upload-front-side");
    let imgPre = $(e.target)
      .parent()
      .closest(".upload-front-side")
      .find(".preview-img")[0].childNodes[0];
    $(imgPre).attr("src", "");
    $(parent).find(".second-view").css("display", "none");
    $(parent).find(".first-view").css("display", "block");
    $(parent).find(".input-img ").attr("required", "true");
  }
  function hello() {
    let getDocument = document.querySelector(".delete-input");
    if (getDocument) {
      getDocument.click();
    }
  }

  return (
    <>
      <Page_Progress progress="document-upload" />
      <div className={`${loading ? "loader" : " "}`}>
        {loading && (
          <>
            <img src={bajaj_loaderimg} className="loader-img" />
          </>
        )}

        <main className="main-content page-wrapper">
          <section className="bank-penny">
            <Container>
              <Row>
                <Col sm={12} lg={8}>
                  <a 
                    role="button"
                    onClick={navBack}
                    // onClick={() => {
                    //   sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                    //     EP_PAGE_NAME: "FUTURES AND OPTIONS UPLOAD PAGE",
                    //     EP_UPLOAD_FRONT_SIDE: "",
                    //     EP_UPLOAD_FRONT_STATUS: "",
                    //     EP_CTA: "BACK",
                    //   })
                    //   navigate("/signature-upload");
                    //   pauseAudio();
                    // }}
                    className="back-button"
                  >
                    <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                  </a>

                  <h2 className="page-title">

                    {
                      Language[localStorage.getItem("language") || "English"]
                        .ACTIVIATE_FUNTURES_ONE
                    }
                    &nbsp;
                    {header}
                    &nbsp;
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .ACTIVIATE_FUNTURES_TWO
                    }
                  </h2>
                  {/* <h3 className="page-subtitle">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .NON_NEGOTIABLE
                    }
                  </h3> */}
                  <form onSubmit={onSubmit}>
                    <div className="select">
                      <select
                        name="FinancialProof"
                        className={`form-control`}
                        onChange={(e) => {
                          setProof(e.target.value);
                          previewReset();
                        }}
                        value={proof}
                      >
                        {FinancialProof.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Row className="upload-points-section">
                      <Col sm={12} md={5}>
                        <div className="upload-front-side">
                          <div className="first-view h-100 w-100 ">
                            <div className="top">
                              <div className="left-input">
                                <img
                                  className="upload"
                                  src={UploadIcon}
                                  alt=""
                                />
                                <input
                                  type="file"
                                  id="fno_pdf"
                                  required
                                  accept="image/png,image/jpeg,application/pdf"
                                  onChange={(e) => {
                                    fileValidation(e, proof, "FNO");
                                  }}
                                  className="input-img  w-100"
                                />
                              </div>
                            </div>
                            <div className="text">
                              <p>
                                {
                                  Language[
                                    localStorage.getItem("language") ||
                                    "English"
                                  ].UPLOAD_FILE
                                }
                                <span>
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].PHOTO
                                  }
                                </span>
                              </p>
                            </div>
                            <div></div>
                          </div>
                          <div className="second-view">
                            <div className="second-view-status">
                              <p className="upload-msg">
                                Uploaded Successfully
                              </p>
                              {showIcon ? (
                                <div className="second-view-icons">
                                  <button
                                    className="edit delete-input"
                                    onClick={(e) => {
                                      deleteInput(e);
                                    }}
                                  >
                                    <svg class="new-icon new-icon-delete"><use href="#new-icon-delete"></use></svg>
                                  </button>
                                  <button
                                    className="edit resize"
                                    onClick={(e) => {
                                      downloadInput(e);
                                    }}
                                  >
                                    <svg class="new-icon new-icon-download"><use href="#new-icon-download"></use></svg>
                                  </button>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="preview-img">
                              {fnoPreview ? (
                                <div>
                                  <PDFViewer src={fnoPdfURL} />
                                </div>
                              ) : (
                                <img className="demo" src="" alt="" />
                              )}
                            </div>
                            <p className="img-text"></p>
                            <div className="img-status w-100">
                              <div className="bar">
                                <div className="current"></div>
                              </div>
                              <div className="status-btm">
                                <p className="byte">
                                  <span className="upload-data">5.7 KB</span> of
                                  <span className="total-data">5 MB</span>
                                </p>
                                <p className="flag">Completed</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-tip">
                          <Link
                            className="form-tip-label d-flex align-items-center"
                            onClick={() => {
                              setuploadguideModalShow(true);
                              sendToCleverTap("BFSL_APPLICATION_VIEWED", {
                                EP_PAGE_NAME: "FNO UPLOAD GUIDELINES",
                                EP_CTA: "HOW TO UPLOAD FNO MODAL",
                              });
                            }}
                            to
                            role="button"
                          >
                            <img src={Bulb_icon} alt="bulb-suggest" />
                            <div>
                              How to upload&nbsp;
                              {proof == "6 months bank statements"
                                ? `bank statement`
                                : proof == "3 month salary slip"
                                  ? `salary slip`
                                  : proof == "Net worth certificate"
                                    ? "net worth certificate"
                                    : proof == "Demat holding certificate"
                                      ? "demat holding statement"
                                      : proof == "ITR"
                                        ? "ITR"
                                        : "bank statements"}
                              ?
                            </div>
                          </Link>
                        </div>
                      </Col>
                      <div className="col-12 col-md-6 col-xl-6 points-content">
                        <p className="remember-points">
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].POINT_TO_BE_REMEMBER
                          }
                        </p>
                        <ul className="points-remember-wrapper">
                          <li>
                            <div className="tick-box">
                              <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                            </div>                            <p className="remember-points">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].BANK_DETAILS_DOWUNLOADING
                              }
                            </p>
                          </li>
                          <li>
                            <div className="tick-box">
                              <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                            </div>                            <p className="remember-points">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].ERASE_ANY_SECTION
                              }
                            </p>
                          </li>
                          <li>
                            <div className="tick-box">
                              <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                            </div>                            <p className="remember-points">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].UPLOADING_ANY_SCREENSHOTS
                              }
                            </p>
                          </li>
                        </ul>
                      </div>
                    </Row>
                    <button
                      type="submit"
                      disabled={!showIcon}
                      className={front ? "common-btn" : "continue-btn"}
                    >
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .SUBMIT
                      }
                    </button>
                  </form>
                </Col>
                <Col className="position-inherit" md={4}>
                  <div className="d-flex flex-column h-100">
                    <ChatCard
                      chatSubtitle={
                        <>
                          <p>
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].DEMONETIZATION_2016_RBI
                            }
                          </p>
                        </>
                      }
                    />
                    <div className="user-bottom-img fno-img">
                      <img src={userBottomImg} alt="person icon" />
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        </main>
      </div>

      <Modal
        show={uploadguidemodalShow}
        onHide={() => setuploadguideModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="fno-upload-modal"
        centered
        backdrop="static"
        keyboard={false}
      >
        <div
          className="close"
          onClick={() => {
            setuploadguideModalShow(false);
            sendToCleverTap("BFSL_APPLICATION_VIEWED", {
              EP_PAGE_NAME: "FNO UPLOAD GUIDELINES",
              EP_CTA: "CLOSE",
            });
          }}
        >
          <svg class="new-icon new-icon-close"><use href="#new-icon-close"></use></svg>
        </div>
        <Modal.Body>
          <div>
            <h3 className="modal-title text-center mb-3">
              How to upload my Documents
            </h3>
            <Row>
              <Col col={12} className="p-xs-0">
                <p className="upload-doc-para mb-4">
                  For each document, the help text will change automatically.
                  E.g., “How to upload my bank statement?”, “How to upload my
                  salary slip?”
                </p>
                <h5 className="upload-doc-red mb-4">{proof}</h5>
                <h6 className="upload-doc-step mb-4">
                  Steps to Upload {proof} :
                </h6>

                <div className="">
                  {proof == "6 months bank statements" && (
                    <>
                      <ul className="row bank-state-step-wrapper">
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={SixMonthstatement} alt="" />
                          </div>
                        </li>
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={SixMonthsecond} alt="" />
                          </div>
                        </li>
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={SixMonththrid} alt="" />
                          </div>
                        </li>
                      </ul>
                      <ul className="upload-doc-list row">
                        <li className="upload-doc-list-item col-md-4 col-12">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={monthStatement}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">
                            Go to your online banking site/app and download the
                            last 6-month bank statement
                          </p>
                        </li>
                        <li className="upload-doc-list-item col-md-4 col-12">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={downloadImage}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">
                            Select the file you just downloaded & upload it
                          </p>
                        </li>
                        <li className="upload-doc-list-item col-md-4 col-12">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={UploadImage}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">Click on Upload File. </p>
                        </li>
                      </ul>
                    </>
                  )}
                  {proof == "3 month salary slip" && (
                    <>
                      <ul className="row bank-state-step-wrapper">
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={ThreMonthstepsecond} alt="" />
                          </div>
                        </li>
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={ThreMonthstepthird} alt="" />
                          </div>
                        </li>
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={ThreMonthstep} alt="" />
                          </div>
                        </li>
                      </ul>
                      <ul className="upload-doc-list row">
                        <li className="upload-doc-list-item col-md-4 col-12">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={salarySlip}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">
                            Log in to your organization’s salary portal.
                          </p>
                        </li>
                        <li className="upload-doc-list-item col-md-4 col-12">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={downloadImage}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">
                            Download the last 3-month salary slip (e.g. If you
                            are uploading in January select the months December,
                            November, and October){" "}
                          </p>
                        </li>
                        <li className="upload-doc-list-item col-md-4 col-12">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={UploadImage}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">Upload the files</p>
                        </li>
                      </ul>
                    </>
                  )}
                  {proof == "Net worth certificate" && (
                    <>
                      <ul className="row bank-state-step-wrapper justify-content-around networth-step">
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={SixMonthstatement} alt="" />
                          </div>
                        </li>
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={ThreMonthstep} alt="" />
                          </div>
                        </li>
                      </ul>
                      <ul className="upload-doc-list row justify-content-around ">
                        <li className="upload-doc-list-item col-md-6">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={netWorth}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">
                            Obtain a net worth certificate from a CA or similar
                            online service provider
                          </p>
                        </li>
                        <li className="upload-doc-list-item col-md-6">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={UploadImage}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">Upload the files </p>
                        </li>
                      </ul>
                    </>
                  )}
                  {proof == "Demat holding certificate" && (
                    <>
                      <ul className="row bank-state-step-wrapper justify-content-around">
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={DematAccountStat} alt="" />
                          </div>
                        </li>
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={dematStep} alt="" />
                          </div>
                        </li>
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={ThreMonthstep} alt="" />
                          </div>
                        </li>
                      </ul>
                      <ul className="upload-doc-list row">
                        <li className="upload-doc-list-item col-md-4 col-12">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={demat}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">
                            Obtain the demat holding statement from your broker,
                            DP (Depository Participant) or the Central
                            Depository website
                          </p>
                        </li>
                        <li className="upload-doc-list-item col-md-4 col-12">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={downloadImage}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">Download the statement</p>
                        </li>
                        <li className="upload-doc-list-item col-md-4 col-12">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={UploadImage}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">Upload the file</p>
                        </li>
                      </ul>
                    </>
                  )}
                  {proof == "ITR" && (
                    <>
                      <ul className="row bank-state-step-wrapper ">
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={ItrAccknowledgement} alt="" />
                          </div>
                        </li>
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={ImgItr} alt="" />
                          </div>
                        </li>
                        <li className="col-md-4 col-sm-4 col-6">
                          <div className="bank-state-step">
                            <img src={ThreMonthstep} alt="" />
                          </div>
                        </li>
                      </ul>
                      <ul className="upload-doc-list row">
                        <li className="upload-doc-list-item col-md-4 col-12">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={itr}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">
                            Obtain the ITR Acknowledgement Page PDF from the
                            official ITR website
                          </p>
                        </li>
                        <li className="upload-doc-list-item col-md-4 col-12">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={downloadImage}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">Download the document</p>
                        </li>
                        <li className="upload-doc-list-item col-md-4 col-12">
                          <div className="upload-doc-list-img-wrapper">
                            <img
                              src={UploadImage}
                              alt="building"
                              className="upload-doc-list-img"
                            />
                          </div>{" "}
                          <p className="point">Upload the file</p>
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FNO;
