import React, { useState, useEffect } from "react";
import ChatCard from "../components/ChatCard";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Bulb_icon from "../assets/images/gif/bulb-suggest.gif";
import Page_Progress from "../components/PageProgress";
import pan_card_modal_img from "../assets/images/pancard-img.jpg";
import pan_card_second from "../assets/images/pancard-second.png";
import pan_card_third from "../assets/images/pancard-third.png";
import pan_card_fourth from "../assets/images/pancard-fourth.png";
import axios from "axios";
import UploadIcon from "../assets/images/upload-icon.svg";
import $ from "jquery";
import userBottomImg from "../assets/images/person-images/pancard.png";
// import panCardIcon from "../assets/images/panCard.svg";
// import * as Yup from "yup";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
import { SERVICES } from "../common/constants";
import { toast } from "react-toastify";
// import { AF_EventTriggered } from "../common/Event";
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

const PanUpload = () => {
  const [showIcon, setShowIcon] = useState(false);
  const navigate = useNavigate();
  let Phrase = "";
  const [clientData, setClientData] = useState();
  useEffect(() => {
    let user = localStorage.getItem("ExistUqId");
    if (user === null || user === "" || user === "null") {
      window.location.replace(window.origin);
    }
  }, []);

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

  const [downloadPan, setDownloadPan] = useState("");
  const [uploadguidemodalShow, setuploadguideModalShow] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfURL, setPdfURL] = useState("");
  const [front, setFront] = useState(false);

  const [deletePanDoc, setDeletePanDoc] = useState("");

  const downloadInput = (e) => {
    e.preventDefault();
    downloadPDF(downloadPan, "Pan_Document");
    // let firstName = clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    // let Pan = clientData?.AccountOpeningRes?.Pan;
    // let Mobile = clientData?.AccountOpeningRes?.Mobile;
    // const Phrase = `${firstName}_${Pan}_${Mobile}` || localStorage.getItem("PhraseName");
    // const RefNo = clientData?.FlagRes?.Id || localStorage.getItem("refId");
    // const downloadPan = localStorage.getItem("PanGuid");
    // window.open(SERVICES.PDFDOWNLOADNEW + "/" + downloadPan);
  };

  useEffect(() => {
    sendToCleverTap("BFSL_APPLICATION_VIEWED", {
      EP_PAGE_NAME: "PAN UPLOAD PAGE",
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
          if ((docName === "Pan_Card"&& data[i].fileName!='') || (docName === "PAN" && data[i].fileName!='')) {
            let UrlStatus = await checkUrlValid(data[i].fileName);
            console.log(UrlStatus);
            if (!UrlStatus) {
              console.log("url error");
              continue
            }
            setFront(true);
            setShowIcon(true);
            if (valid) {
              setDeletePanDoc(data[i].docName);
            } else {
              setDeletePanDoc(data[i].docName);
              let Front = $(".upload-front-side")[0];
              $(Front).find(".first-view").css("display", "none");
              let Imagetype = getUrlExtension(data[i].fileName);
              setDownloadPan(data[i].fileName);
              if (Imagetype === "pdf") {
                // setPdf preview for frontPArt
                setPdfPreview(true);
                setPdfURL(data[i]["fileName"]);
              } else {
                // setNormal Image Show
                setPdfPreview(false);
                setPdfURL("");
                $(Front).find(".demo").attr("src", data[i]["fileName"]);
              }

              $(Front).find(".demo").css("width", "213px");
              $(Front).find(".demo").css("height", "116px");
              $(Front).find(".demo").css("object-fit", "content");
              $(Front).find(".second-view").css("display", "block");
              $(Front).find(".input-img ").removeAttr("required");
              $(Front).find(".img-status").css("display", "none");
              localStorage.setItem("PanGuid", data[i].docGuiId);
            }
          }
        }
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };

  const onSubmit = (e) => {
    console.log("hii");
    e.preventDefault();
    const IMPS = clientData?.FlagRes?.Imps || localStorage.getItem("ifscflag");
    // const KYCFlag = clientData?.FlagRes?.IsKyc || localStorage.getItem("KYC");
    ME_EventTriggered("SubmitPanDocument")
    // if (IMPS == "1" && IMPS != null && IMPS != undefined) {
    playAudio(17);
    navigate(`/signature-upload`);
    // } else {
    //   pauseAudio();
    //   navigate(`/check-upload`);
    // }
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
    // le Phrase = `${firstName}_${Pan}_${Mobile}`.replace(".", " ", "_") || localStorage.getItem("PhraseName");
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
    const completeHandler = () => {
      $(flag).html(`Completed`);
    };
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
              EP_PAGE_NAME: " PAN UPLOAD PAGE",
              EP_UPLOAD_FRONT_SIDE: "YES",
              EP_UPLOAD_FRONT_SIDE_STATUS: "INVALID",
              EP_CTA: "SUBMIT",
            });

            toast.error(request.Reason);
            deletePreview(e);
          } else {
            sendToCleverTap("BFSL_APPLICATION_CLICKED", {
              EP_PAGE_NAME: " PAN UPLOAD PAGE",
              EP_UPLOAD_FRONT_SIDE: "YES",
              EP_UPLOAD_FRONT_SIDE_STATUS: "VALID",
              EP_CTA: "SUBMIT",
            });

            getAllDocoment(true);
            setDownloadPan(request.Response.DocumentUrl);
          }
        } else {
          sendToCleverTap("BFSL_APPLICATION_CLICKED", {
            EP_PAGE_NAME: " PAN UPLOAD PAGE",
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
  const fileValidation = (e, selected, desc) => {
    // setFront(true);
    setPdfURL("");
    setPdfPreview(false);
    // AF_EventTriggered("PAN-upload", "PAN-upload", { onclick: "PAN-upload" });
    ME_EventTriggered(`${selected}`)

    let parent = $($(e.target).parent().closest(".upload-front-side"));
    let first = $(parent).find(".first-view")[0];
    let preview = $(parent).find(".demo")[0];
    let second = $(parent).find(".second-view")[0];
    $(second).find(".img-status").css("display", "block");

    let fileText = $(second).find(".img-text")[0];
    const fileMb = e.target.files[0].size / 1024 ** 2;
    let pdf = e.target.files[0].type;
    const fileType = e.target.files[0].name;

    // const isImage = (icon) => {
    //   var ext = [".jpg", ".jpeg", ".png"];
    //   return ext.some((el) => icon.endsWith(el));
    // };

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
  };

  const deleteDoc = async (e) => {
    console.log(deletePanDoc, "deletePanDoc");
    e.preventDefault();
    setPdfPreview(false);
    let firstName =
      clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    let Pan = clientData?.AccountOpeningRes?.Pan;
    let Mobile = clientData?.AccountOpeningRes?.Mobile;
    let phrase =
      `${firstName}_${Pan}_${Mobile}` || localStorage.getItem("PhraseName");
    console.log(phrase);
    ME_EventTriggered("DeletePan")
    if (firstName && Pan && Mobile) {
      phrase = `${firstName}_${Pan}_${Mobile}`;
    } else {
      phrase = localStorage.getItem("PhraseName");
    }
    const RefNo = clientData?.FlagRes?.Id || localStorage.getItem("refId");
    try {
      const response = await axios.post(
        SERVICES.DELETEDOCUMENT,
        {
          id: RefNo,
          docName: deletePanDoc,
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
        setDownloadPan("");
        deletePreview(e);
        setFront(false);
        setPdfURL("");
        setShowIcon(false);
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };
  const deletePreview = (e) => {
    e.preventDefault();
    $(e.target)
      .parent()
      .closest(".upload-front-side")
      .find(".left-input")
      .find("input")[0].value = "";

    let progress = $(e.target)
      .parent()
      .closest(".upload-front-side ")
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
  };

  return (
    <>
      <Page_Progress progress="document-upload" />
      <main className="main-content page-wrapper">
        <section className="pancard">
          <Container>
            <Row>
              <Col sm={12} lg={8}>
                <a
                  role="button"
                  onClick={() => {
                    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                      EP_PAGE_NAME: " PAN UPLOAD PAGE",
                      EP_UPLOAD_FRONT_SIDE: "YES",
                      EP_UPLOAD_FRONT_SIDE_STATUS: "",
                      EP_CTA: "BACK",
                    });
                    navigate("/address-detail");
                    pauseAudio();
                  }}
                  className="back-button"
                >
                  <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                </a>
                <h2 className="page-title">
                  <div className={"pb-3"}>
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .NICE_PAN_CARD
                    }
                  </div>
                  <div>
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .NO_MORE_HASSLE
                    }
                  </div>
                </h2>
                <h3 className="page-subtitle">
                  {
                    Language[localStorage.getItem("language") || "English"]
                      .PEOPLE_TRUST_US_FOR_DECADES
                  }
                </h3>
                <div className="step-tip-wrapper">
                  <div className="form-tip form-tip-mobile">
                    <Link
                      className="form-tip-label"
                      onClick={() => {
                        setuploadguideModalShow(true);
                        sendToCleverTap("BFSL_APPLICATION_VIEWED", {
                          EP_PAGE_NAME: "PAN UPLOAD GUIDELINES",
                          EP_CTA: "CLOSE",
                        });
                      }}
                      to
                      role="button"
                    >
                      <img src={Bulb_icon} alt="bulb-suggest" />

                      {
                        Language[localStorage.getItem("language") || "English"]
                          .HOW_TO_UPLOAD_PAN
                      }
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
                              <img className="upload" src={UploadIcon} alt="" />
                              <input
                                type="file"
                                required
                                accept="image/png,image/jpeg"
                                onChange={(e) => {
                                  fileValidation(e, "Pan", "Pan_Card");
                                }}
                                className="input-img  w-100"
                              />
                            </div>
                          </div>
                          <div className="text">
                            <p>
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].UPLOAD_FRONT_SIDE
                              }
                              {/* <span>
                                {
                                  Language[
                                    localStorage.getItem("language") ||
                                    "English"
                                  ].PHOTO
                                }
                              </span> */}
                            </p>
                          </div>
                          <div></div>
                        </div>
                        <div className="second-view">
                          <div className="second-view-status">
                            <p className="upload-msg">Uploaded Successfully</p>
                            {showIcon ? (
                              <div className="second-view-icons">
                                <button
                                  className="edit delete-input"
                                  onClick={(e) => {
                                    deleteDoc(e);
                                  }}
                                >
                                  <svg class="new-icon new-icon-delete"><use href="#new-icon-delete"></use></svg>
                                </button>
                                <button
                                  className="edit resize"
                                  onClick={downloadInput}
                                >
                                  <svg class="new-icon new-icon-download"><use href="#new-icon-download"></use></svg>
                                </button>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="preview-img">
                            {pdfPreview ? (
                              <div>
                                <PDFViewer src={pdfURL} />
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
                                <span className="total-data">1 MB</span>
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
                            sendToCleverTap("BFSL_APPLICATION_VIEWED", {
                              EP_PAGE_NAME: "PAN UPLOAD GUIDELINES"
                            });
                          }}
                          to
                          role="button"
                        >
                          <img src={Bulb_icon} alt="bulb-suggest" />
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].HOW_TO_UPLOAD_PAN
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
                          </div>                          <p className="remember-points">
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].CAPTURE_PAN_CARD
                            }
                          </p>
                        </li>
                        <li>
                          {/* <i className="icon-tick" /> */}
                          <div className="tick-box">
                            <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                          </div>

                          <p className="remember-points">
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].TURN_OFF_FLASH
                            }
                          </p>
                        </li>
                        <li>
                          {/* <i className="icon-tick" /> */}

                          <div className="tick-box">
                            <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                          </div>

                          <p className="remember-points">
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].MAKE_SURE_PAN_NUMBER
                            }
                          </p>
                        </li>
                      </ul>
                    </div>
                  </Row>
                  <button
                    type="submit"
                    className={front ? "common-btn" : "continue-btn"}
                    // onClick={onSubmit}
                    disabled={!showIcon}
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
                            ]._4CR_INDIAN
                          }
                        </p>
                      </>
                    }
                  />
                  <div className="user-bottom-img panUpload-img">
                    <img src={userBottomImg} alt="person icon" />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </main>

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
              EP_PAGE_NAME: "PAN UPLOAD GUIDELINES​​",
              EP_CTA: "CLOSE",
            });
          }}
        >
          {/* <i className="icon-close" /> */}
          <svg class="new-icon new-icon-close">
            <use href="#new-icon-close"></use>
          </svg>
        </div>
        <Modal.Body>
          <div>
            <h3 className="modal-title text-left">
              {
                Language[localStorage.getItem("language") || "English"]
                  .HOW_TO_UPLOAD_PAN
              }
            </h3>
            <Row>
              <Col xs={12} md={5} lg={5} className="p-xs-0">
                <div className="modal-left">
                  <img
                    src={pan_card_modal_img}
                    alt="pancard-img"
                    className="modal-img"
                  />
                  <div className="modal-left-content">
                    <p className="points-label">please note</p>
                    <ul className="points-remember-wrapper">
                      <li>
                        {/* <i className="icon-tick" /> */}

                        <div className="tick-box">
                          <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                        </div>

                        <p className="remember-points">
                          photo must be clear with readable details
                        </p>
                      </li>
                      <li>
                        {/* <i className="icon-tick" /> */}

                        <div className="tick-box">
                          <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                        </div>

                        <p className="remember-points">
                          pan must have your signature otherwise it is
                          considered invalid
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={6} lg={6} className="ml-auto p-xs-0">
                <Row className="correction-img">
                  <Col md={6} lg={6} sm={4} className="col-4">
                    <img
                      src={pan_card_second}
                      alt="pancard-img"
                      className="modal-img"
                    />
                    <p className="img-note">
                      make sure the PAN card is not cut
                    </p>
                  </Col>
                  <Col md={6} lg={6} sm={4} className="col-4">
                    <img
                      src={pan_card_third}
                      alt="pancard-img"
                      className="modal-img"
                    />
                    <p className="img-note">
                      make sure your PAN card is not blurry
                    </p>
                  </Col>
                  <Col md={6} lg={6} sm={4} className="ml-auto col-4">
                    <img
                      src={pan_card_fourth}
                      alt="pancard-img"
                      className="modal-img"
                    />
                    <p className="img-note">
                      make sure your Pan card is not reflective
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PanUpload;
