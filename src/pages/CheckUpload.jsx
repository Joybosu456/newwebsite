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
import cheque from "../assets/images/cancelled-cheque.png";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SERVICES } from "../common/constants";
import { toast } from "react-toastify";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
// import { AF_EventTriggered } from "../common/Event";
import ChequeImg from "../assets/images/cheque-img.png";
import ChequeIcon from "../assets/images/icons/cheque-icon.svg";
import ChequeIcon2 from "../assets/images/icons/cheque-icon2.svg";
import ChequeIcon3 from "../assets/images/icons/cheque-icon3.svg";
import Language from "../common/Languages/languageContent.json";
import {
  AESDecryption,
  ME_EventTriggered,
  checkUrlValid,
  downloadPDF,
  getUrlExtension,
  isImage,
  pauseAudio,
  playAudio,
  sendToCleverTap,
} from "../common/common.js";
import PDFViewer from "../common/pdfViewer";

function CheckUpload() {
  const [clientData, setClientData] = useState();
  const [downloadCheck, setDownloadCheck] = useState("");
  const [showIcon, setShowIcon] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    let user = localStorage.getItem("ExistUqId");
    if (user === null || user === "" || user === "null") {
      window.location.replace(window.origin);
    }
  }, []);
  let Phrase = "";

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
          hasEncrypted: true
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
        localStorage.setItem("ExistUqId", resumeResp.Response.FlagRes.UQID);
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };

  const [loading, setLoading] = useState(false);

  const [uploadguidemodalShow, setuploadguideModalShow] = useState(false);
  const [front, setFront] = useState(false);
  const [checkPdfShow, setCheckPdfShow] = useState(false);
  const [checkPdfURL, setCheckPdfURL] = useState("");
  const [deleteCheckDoc, setDeleteCheckDoc] = useState("");

  const schema = Yup.object().shape({
    file2: Yup.mixed().required("File is required"),
  });

  const {
    register,

    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  function downloadInput(e, url) {
    e.preventDefault();
    downloadPDF(downloadCheck, "Check_Document");
  }

  // const downloadInput = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let firstName = clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
  //     let Pan = clientData?.AccountOpeningRes?.Pan;
  //     let Mobile = clientData?.AccountOpeningRes?.Mobile;
  //     const Phrase = `${firstName}_${Pan}_${Mobile}` || localStorage.getItem("PhraseName");
  //     const RefNo = clientData?.FlagRes?.Id || localStorage.getItem("refId");
  //     const downloadCheque = localStorage.getItem("ChequeGuid");
  //     window.open(SERVICES.PDFDOWNLOADNEW + "/" + downloadCheque);
  //   } catch (err) {
  //   }
  // };

  const onSubmit = (e) => {
    e.preventDefault();
    let fno = clientData?.FlagRes?.Fno || localStorage.getItem("fno");
    if (fno == "True" || fno == "true" || fno == true) {
      pauseAudio();
      navigate(`/fno`);
    } else {
      playAudio(18);
      navigate(`/selfie-upload`);
    }
    // playAudio(17);
    // navigate("/signature-upload");
    ME_EventTriggered("Submit Cheque");
  };

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
    formData.append("Image", imagefile.files[0]);
    formData.append("RefId", REFID);
    formData.append("DocDef", data);
    formData.append("DocDesc", value);
    formData.append("UqId", UQID);
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
              EP_PAGE_NAME: " CHEQUE UPLOAD PAGE",
              EP_UPLOAD_FRONT_SIDE: "YES",
              EP_UPLOAD_FRONT_SIDE_STATUS: "INVALID",
              EP_CTA: "SUBMIT",
            });

            toast.error(request.Reason);
            deletePreview(e);
          } else {
            sendToCleverTap("BFSL_APPLICATION_CLICKED", {
              EP_PAGE_NAME: " CHEQUE UPLOAD PAGE",
              EP_UPLOAD_FRONT_SIDE: "YES",
              EP_UPLOAD_FRONT_SIDE_STATUS: "VALID",
              EP_CTA: "SUBMIT",
            });

            getAllDocoment(true);
            setDownloadCheck(request.Response.DocumentUrl);
          }
        } else {
          sendToCleverTap("BFSL_APPLICATION_CLICKED", {
            EP_PAGE_NAME: " CHEQUE UPLOAD PAGE",
            EP_UPLOAD_FRONT_SIDE: "YES",
            EP_UPLOAD_FRONT_SIDE_STATUS: "INVALID",
            EP_CTA: "SUBMIT",
          });

          toast.error("Couldn't upload file, please try again!");
          deletePreview(e);
        }
      }
    };
  };

  function fileValidation(e, selected, desc) {
    setCheckPdfURL("");
    setCheckPdfShow(false);
    // AF_EventTriggered("Cheque-upload", "Cheque-upload", {
    //   onclick: "Cheque-upload",
    // });
    ME_EventTriggered("uplodedcheque", { selected })

    let parent = $($(e.target).parent().closest(".upload-front-side"));
    let first = $(parent).find(".first-view")[0];
    let preview = $(parent).find(".demo")[0];
    let second = $(parent).find(".second-view")[0];
    $(second).find(".img-status").css("display", "block");

    let fileText = $(second).find(".img-text")[0];
    const fileMb = e.target.files[0].size / 1024 ** 2;
    let pdf = e.target.files[0].type;
    const fileType = e.target.files[0].name;
    // function isImage(icon) {
    //   var ext = [".jpg", ".jpeg", ".png"];
    //   return ext.some((el) => icon.endsWith(el));
    // }

    if (pdf === "application/pdf") {
      toast.error("PDF not allowed");
      e.target.value = "";
      return;
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
          [".jpg", ".jpeg", ".png"].join(", ") +
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
    console.log(deleteCheckDoc, "deleteCheckDoc");
    e.preventDefault();
    let firstName =
      clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    let Pan = clientData?.AccountOpeningRes?.Pan;
    let Mobile = clientData?.AccountOpeningRes?.Mobile;
    let phrase =
      `${firstName}_${Pan}_${Mobile}` || localStorage.getItem("PhraseName");
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
          docName: deleteCheckDoc,
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
        setDownloadCheck("");
        setFront(false);
        setCheckPdfURL("");
        setCheckPdfShow(false);
        deletePreview(e);
        setShowIcon(false);
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };

  function deleteInput(e) {
    e.preventDefault();
    deleteDoc(e);
    ME_EventTriggered("DeleteCheque")
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

  useEffect(() => {
    sendToCleverTap("BFSL_APPLICATION_VIEWED", {
      EP_PAGE_NAME: "CHEQUE UPLOAD PAGE",
    });

    ResumeClient();
    getAllDocoment();
  }, []);
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
          if (docName === "Cheque" && data[i].fileName!='') {
            let UrlStatus = await checkUrlValid(data[i].fileName);
            console.log(UrlStatus);
            if (!UrlStatus) {
              console.log("url error"); 
              continue
            }
            setFront(true);
            setShowIcon(true);
            if (valid) {
              setDeleteCheckDoc(data[i].docName);
            } else {
              setDeleteCheckDoc(data[i].docName);
              let Front = $(".upload-front-side")[0];
              let Imagetype = getUrlExtension(data[i].fileName);
              setDownloadCheck(data[i].fileName);
              if (Imagetype === "pdf") {
                // setPdf preview for frontPArt
                setCheckPdfShow(true);
                setCheckPdfURL(data[i]["fileName"]);
              } else {
                // setNormal Image Show
                setCheckPdfShow(false);
                setCheckPdfURL("");
                $(Front).find(".demo").attr("src", data[i]["fileName"]);
              }
              $(Front).find(".first-view").css("display", "none");

              $(Front).find(".demo").css("width", "213px");
              $(Front).find(".demo").css("height", "116px");
              $(Front).find(".demo").css("object-fit", "content");
              $(Front).find(".second-view").css("display", "block");
              $(Front).find(".input-img ").removeAttr("required");
              $(Front).find(".img-status").css("display", "none");

              localStorage.setItem("ChequeGuid", data[i].docGuiId);
            }
          }
        }
      }
    } catch (err) {
      throw new Error(err.message)
    }
  };


  // const navback = () => {
  //   let KRA = clientData?.FlagRes?.IsKyc || localStorage.getItem("KYC");
  //   if (KRA == 0) {
  //     pauseAudio();
  //     navigate("/document-upload");
  //   } else {
  //     pauseAudio();
  //     navigate("/pan-upload");
  //   }

  // }
  const navback = () => {
    let KRA = clientData?.FlagRes?.IsKyc || localStorage.getItem("KYC");
    if (KRA == 0) {
      playAudio(17);
      navigate(`/signature-upload`);
    } else {
      playAudio(17);
      navigate(`/signature-upload`);
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
          <section className="pancard">
            <Container>
              <Row>
                <Col sm={12} lg={8}>
                  <a
                    role="button"
                    onClick={() => {
                      navback()

                    }}
                    className="back-button"
                  >
                    <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                  </a>

                  <h2 className="page-title">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .BANK_DEATILS_SECURELY
                    }
                  </h2>
                  <h3 className="page-subtitle">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .UPLOADING_CHEQUE_ELIMINATES_ANY_ERROR
                    }
                  </h3>
                  <div className="step-tip-wrapper">
                    <div className="form-tip form-tip-mobile">
                      <Link
                        className="form-tip-label"
                        onClick={() => {
                          setuploadguideModalShow(true);
                          sendToCleverTap("BFSL_APPLICATION_VIEWED", {
                            EP_PAGE_NAME: "CHEQUE UPLOAD GUIDELINES",
                            EP_CTA: "HOW TO UPLOAD CHEQUE MODAL",
                          });
                        }}
                        to
                        role="button"
                      >
                        <img src={Bulb_icon} alt="bulb-suggest" />
                        How should I upload my Cheque?
                      </Link>
                    </div>
                  </div>
                  <form onSubmit={onSubmit}>
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
                                  required
                                  accept="image/png,image/jpeg"
                                  onChange={(e) => {
                                    fileValidation(e, "Cheque", "Cheque");
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
                                  ].UPLOAD_FRONT_SIDE
                                }
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
                              {checkPdfShow ? (
                                <div>
                                  <PDFViewer src={checkPdfURL} />
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
                                  <span className="upload-data">5.7 KB</span> of{" "}
                                  <span className="total-data">5 MB</span>
                                </p>
                                <p className="flag">Completed</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-tip">
                          <Link
                            className="form-tip-label"
                            onClick={() => {
                              setuploadguideModalShow(true);
                              sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                                EP_PAGE_NAME: "CHEQUE UPLOAD GUIDELINES",
                                EP_CTA: "OPEN",
                              });
                            }}
                            to
                            role="button"
                          >
                            <img src={Bulb_icon} alt="bulb-suggest" />
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].CHEQUE_UPLOAD
                            }
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
                                ].PICK_CONTENT
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
                                ].UPPER_CASE
                              }
                            </p>
                          </li>
                          <li>
                            <div className="tick-box">
                              <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                            </div>
                            <p className="remember-points">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].IMPORTANT_DETAILS
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
                    {/* <input type="submit" value="Submit" class="common-btn"> */}
                    {/* <Link to="/signature-upload" className="common-btn">
                    SUBMIT
                  </Link> */}
                  </form>
                </Col>
                {/* right section */}
                <Col className="position-inherit" md={4}>
                  <div className="d-flex flex-column justify-content-between h-100">
                    <ChatCard
                      chatSubtitle={
                        <>
                          <p>
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].EARLIEST_CONTENT
                            }
                          </p>
                          {/* <p>{`${localStorage.getItem("countUpper")} people are saving twice than you by choosing the ${localStorage.getItem("packupper")} . You can switch any moment`}</p> */}
                        </>
                      }
                    />
                    <div className="user-bottom-img checkUpload-img">
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
        className="pan-upload-modal"
        centered
        backdrop="static"
        keyboard={false}
      >
        <div
          className="close"
          onClick={() => {
            setuploadguideModalShow(false);
            sendToCleverTap("BFSL_APPLICATION_VIEWED", {
              EP_PAGE_NAME: "CHEQUE UPLOAD GUIDELINES",
              EP_CTA: "CLOSE",
            });
          }}
        >
          <svg class="new-icon new-icon-close"><use href="#new-icon-close"></use></svg>
        </div>
        <Modal.Body>
          <div>
            <h3 className="modal-title text-center mb-3">
              How to upload my Documents?
            </h3>
            <Row className="check-upload">
              <Col col={12} className="p-xs-0">
                <p className="upload-doc-para mb-4">
                  {
                    Language[localStorage.getItem("language") || "English"]
                      .PICK_CONTENT
                  }
                </p>
                <div className="cheque-img-wrapper">
                  <div className="img-wrapper">
                    <img
                      src={ChequeImg}
                      alt="Cancel Cheque Img"
                      className="cheque-img"
                    />
                  </div>
                </div>
                <ul className="upload-doc-list">
                  <li className="upload-doc-list-item">
                    <div className="upload-doc-list-img-wrapper">
                      <img
                        src={ChequeIcon}
                        alt="building"
                        className="upload-doc-list-img"
                      />
                    </div>{" "}
                    <p className="point">
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .PICK_CONTENT
                      }
                    </p>
                  </li>
                  <li className="upload-doc-list-item">
                    <div className="upload-doc-list-img-wrapper">
                      <img
                        src={ChequeIcon2}
                        alt="building"
                        className="upload-doc-list-img"
                      />
                    </div>{" "}
                    <p className="point">
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .UPPER_CASE
                      }
                    </p>
                  </li>
                  <li className="upload-doc-list-item">
                    <div className="upload-doc-list-img-wrapper">
                      <img
                        src={ChequeIcon3}
                        alt="building"
                        className="upload-doc-list-img"
                      />
                    </div>{" "}
                    <p className="point">
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .IMPORTANT_DETAILS
                      }
                    </p>
                  </li>
                </ul>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default CheckUpload;
