import { React, useEffect, useState } from "react";
import ChatCard from "../components/ChatCard";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Bulb_icon from "../assets/images/gif/bulb-suggest.gif";
import Page_Progress from "../components/PageProgress";
import correct_signature_img from "../assets/images/signature/correct-signature.png";
import correct_signature_second_img from "../assets/images/signature/correct-signature-second.png";
import incorrect_signature_img from "../assets/images/signature/incorrect-signature.png";
import incorrect_signature_second_img from "../assets/images/signature/incorrect-signature-second.png";
import $ from "jquery";
import axios from "axios";
import UploadIcon from "../assets/images/upload-icon.svg";
import userBottomImg from "../assets/images/person-images/person-sitting.png";
import pdficon from "../assets/images/pdficon.png";
import ipvicon from "../assets/images/ipvPreview.png";
import { SERVICES } from "../common/constants";
import { toast } from "react-toastify";
// import { AF_EventTriggered } from "../common/Event";
import Language from "../common/Languages/languageContent.json";
import {
  AESDecryption,
  ME_EventTriggered,
  checkUrlValid,
  getUrlExtension,
  isVideo,
  pauseAudio,
  playAudio,
} from "../common/common";
import PDFViewer from "../common/pdfViewer";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";

function IPV() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [ipvPreview, setIpvPreview] = useState(false);
  const [ipvUrl, setIpvUrl] = useState("");
  const [deletePhoto, setDeletePhoto] = useState("");
  const [downloadImg, setDownloadImg] = useState("");

  const [clientData, setClientData] = useState({});
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    getAllDocoment();
    ResumeClient();
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
          if (docName === "IPV") {
            let UrlStatus = await checkUrlValid(data[i].fileName);
            console.log(UrlStatus);
            if (!UrlStatus) {
              console.log("url error");
              continue
            }
            setDownloadImg(data[i]["fileName"]);

            if (valid) {
              setDeletePhoto(data[i].docName);
              setShowIcon(true);
            } else {
              setDeletePhoto(data[i].docName);
              setShowIcon(true);
              localStorage.setItem("docid", data[i].docGuiId);
              let Front = $(".upload-front-side")[0];
              $(Front).find(".first-view").css("display", "none");
              let Imagetype = getUrlExtension(data[i].fileName);
              if (Imagetype === "pdf") {
                // setPdf preview for frontPArt
                setIpvPreview(true);
                setIpvUrl(data[i]["fileName"]);
              } else {
                // setNormal Image Show
                setIpvPreview(false);
                setIpvUrl("");
                $(Front).find(".demo").attr("src", data[i]["fileName"]);
              }
              $(Front).find(".demo").css("width", "213px");
              $(Front).find(".demo").css("height", "116px");
              $(Front).find(".demo").css("object-fit", "content");
              $(Front).find(".second-view").css("display", "block");
              $(Front).find(".input-img ").removeAttr("required");
              $(Front).find(".img-status").css("display", "none");
            }
          }
          if (docName === "PDF-PHOTO") {
            localStorage.setItem("Photographuploaded", "1");
          }
        }
      }
    } catch (err) { }
  };
  const [signatureguidemodalShow, setsignatureguideModalShow] = useState(false);
  const Submit = (e) => {
    e.preventDefault();
    // let fno = localStorage.getItem("fno");
    // navigate(`/selfie-upload`);
    setLoading(true);
    getAllMergePDF();
    ME_EventTriggered("IPVPage")
  };

  function uploadFile(e, value, data) {
    let parent = $($(e.target).parent().closest(".upload-front-side"));
    let second = $(parent).find(".second-view")[0];
    let progress = $(second).find(".current")[0];
    let dataShow = $(second).find(".byte")[0];
    let flag = $(second).find(".flag")[0];

    const formData = new FormData();
    const imagefile = e.target;
    const UQID =
      localStorage.getItem("uid2") ?? localStorage.getItem("ExistUqId");
    const REFID = localStorage.getItem("UserRefID");
    formData.append("ipvdata", imagefile.files[0]);
    formData.append("refId", REFID);
    formData.append("uqId", UQID);

    var ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);

    ajax.open("POST", SERVICES.UPLOADIPV);
    ajax.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    ajax.send(formData);
    ajax.onreadystatechange = function () {
      console.log(this);
      if (this.readyState == 4) {
        if (this.status == 200) {
          const request = JSON.parse(this.responseText);
          // console.log(request);
          console.log(request.Response.DocumentUrl);
          if (request.Status.toUpperCase() === "SUCCESS") {
            getAllDocoment(true);
            setShowIcon(true);
            // setDownloadImg(request.Response.DocumentUrl)
          } else {
            setShowIcon(false);
            toast.error(request.Reason);
            deletePreview(e);
          }
          // getAllDocoment();
          // localStorage.setItem("PhotoGuid", request.Response.docId);
        } else {
          toast.error("Couldn't upload file, please try again!");
          deletePreview(e);
        }
      }
      // getAllDocoment();
    };
    function progressHandler(event) {
      $(dataShow).html(
        `<span className="upload-data">${event.loaded.formatBytes()}</span> of  <span className="total-data">${event.total.formatBytes()}</span>`
      );
      var percent = (event.loaded / event.total) * 100;

      $(progress).css("width", `${percent.toFixed(0)}%`);
      $(flag).html(`Uploading`);
    }
    function completeHandler() {
      $(flag).html(`Completed`);
    }
  }

  function fileValidation(e, selected, desc) {
    // AF_EventTriggered("Signature-upload", "Signature-upload", {
    //   onclick: "Signature-upload",
    // });
    ME_EventTriggered(`${selected}`)
    let parent = $($(e.target).parent().closest(".upload-front-side"));
    let first = $(parent).find(".first-view")[0];
    let preview = $(parent).find(".demo")[0];
    let second = $(parent).find(".second-view")[0];
    $(second).find(".img-status").css("display", "block");

    let fileText = $(second).find(".img-text")[0];
    let pdf = e.target.files[0].type;
    const fileMb = e.target.files[0].size / 1024 ** 2;
    const fileType = e.target.files[0].name;

    // if (pdf === "application/pdf" && fileMb <= 20) {
    //   $(preview).attr("src", pdficon);
    //   $(first).css("display", "none");
    //   $(second).css("display", "flex");
    //   uploadFile(e, selected, desc);

    // } else
    if (isVideo(fileType) && fileMb <= 20) {
      if (e.target.files && e.target.files[0]) {
        let name = e.target.files[0].name;

        $(first).css("display", "none");
        $(second).css("display", "flex");
        uploadFile(e, selected, desc);
        $(fileText).text(name);
        var reader = new FileReader();
        reader.onload = function (e) {
          $(preview).attr("src", ipvicon);
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    } else {
      e.target.value = "";
      if (fileMb > 20 && !isVideo(fileType)) {
        toast.error(
          "Invalid file Format. Only " +
          [".mp4", ".webm"].join(", ") +
          " are allowed and Max file size limit is 20MB"
        );
      } else if (!isVideo(fileType)) {
        toast.error(
          "Invalid file Format. Only " +
          [".mp4", ".jpeg", ".png"].join(", ") +
          " are allowed."
        );
      } else if (fileMb > 20) {
        toast.error("Max file size limit is 20MB");
      }
      // end
      return false;
    }
  }

  const downloadInput = async (e) => {
    e.preventDefault();
    try {
      const DOCID = localStorage.getItem("docid");

      window.open(SERVICES.IPVDOWNLOAD + "/" + DOCID);
    } catch (err) { }
  };
  const deleteDoc = async (e) => {
    const Phrase = localStorage.getItem("PhraseName");
    const RefNo = localStorage.getItem("refId");
    try {
      const response = await axios.post(
        SERVICES.DELETEDOCUMENT,
        {
          id: RefNo,
          docName: deletePhoto,
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response, "1");

      if (response.data.Status === "Failed") {
        toast.error(response.data.Reason);
      } else {
        deletePreview(e);
        setShowIcon(false);
      }
    } catch (err) {
      console.log("Error", err.message);
    }
  };

  function deleteInput(e) {
    deleteDoc(e);
    e.preventDefault();
  }

  function deletePreview(e) {
    $(e.target)
      .parent()
      .closest(".upload-front-side")
      .find(".left-input")
      .find("input")[0].value = "";

    let progress = $(e.target)
      .parent()
      .closest(".upload-front-side")
      .find(".current")[0];
    console.log(progress);
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

  const getAllMergePDF = async () => {
    const UQID =
      clientData?.FlagRes?.UQID ||
      localStorage.getItem("UserUqID") ||
      localStorage.getItem("ExistUqId");
    const REFID =
      clientData?.FlagRes?.Id ||
      localStorage.getItem("UserRefID") ||
      localStorage.getItem("refId");
    const formData = new FormData();
    formData.append("DocRefId", REFID);
    formData.append("UqId", UQID);
    formData.append("Html", "");

    try {
      const request = await axios.post(SERVICES.GETALLMERGEPDF, formData, {
        headers: {
          "content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (request.data.Response == "ESIGN ALREADY DONE") {
        navigate("/");
      }
      if (request.data.Response == "Pdf Saved Successfully") {
        // DigiLockerLogger();
        EsignLogger();
        window.location.replace(SERVICES.DIGIESIGNURL + "?unid=" + UQID);
      } else {
        toast.error(request.data.Response);
      }
    } catch (err) {
    } finally {
      setLoading(false);
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
    } catch (err) { }
  };

  const EsignLogger = async () => {
    setLoading(true);
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
          type: "Digi-Esign",
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
    } finally {
      setLoading(false);
    }
  };

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
          <section className="signature">
            <Container>
              <Row>
                <Col lg={8} sm={12} className="position-relative">
                  <a
                    role="button"
                    onClick={() => {
                      navigate("/selfie-upload");
                      playAudio(18);
                    }}
                    className="back-button"
                  >
                    <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                  </a>
                  <h2 className="page-title">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .IPV_TITLE
                    }
                  </h2>
                  <p className="page-subtitle">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .PATIENCE_COMMENDABLE
                    }
                  </p>
                  <div className="step-tip-wrapper">
                    <div className="form-tip form-tip-mobile">
                      <Link
                        className="form-tip-label"
                        onClick={() => setsignatureguideModalShow(true)}
                        to
                        role="button"
                      >
                        <img src={Bulb_icon} alt="bulb-suggest" />
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].HOW_UPLOAD_SIGNATURE
                        }
                      </Link>
                    </div>
                  </div>
                  <form onSubmit={(e) => Submit(e)}>
                    <Row className="upload-points-section">
                      <Col sm={12} md={5} xl={5}>
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
                                  accept="video/webm,video/mp4"
                                  onChange={(e) => {
                                    fileValidation(e, "Sign", "Signature");
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
                                  ].IPV_UPLOAD
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
                              {ipvPreview ? (
                                <PDFViewer src={ipvUrl} />
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
                                  <span className="upload-data"></span> of
                                  <span className="total-data"></span>
                                </p>
                                <p className="flag">Completed</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col sm={12} md={7} xl={7} className="points-content">
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
                                ].SIGNATURE_SHOULD_MATCH
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
                                ].CAPITAL_LETTERS
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
                                ].GLARE_BLUR
                              }
                            </p>
                          </li>
                        </ul>
                      </Col>
                    </Row>
                    <button
                      type="submit"
                      disabled={!showIcon}
                      className="common-btn"
                    >
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .SUBMIT
                      }
                    </button>
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
                              ].IPV_SECURITY
                            }
                          </p>
                        </>
                      }
                    />
                    <div className="user-bottom-img signatureUpload-img">
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
        show={signatureguidemodalShow}
        onHide={() => setsignatureguideModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="signatureModel upload-img-modal"
        centered
        backdrop="static"
        keyboard={false}
      >
        <div
          className="close"
          onClick={() => setsignatureguideModalShow(false)}
        >
          <svg class="new-icon new-icon-close"><use href="#new-icon-close"></use></svg>
        </div>
        <Modal.Body>
          <div>
            <h3 className="modal-title">Sample Signature for your reference</h3>
            <Row>
              <Col xs={6} sm={3}>
                <img
                  src={correct_signature_img}
                  alt="signature-img"
                  className="modal-img"
                />
                <p className="signature-note">
                  Use of <span>blue pen</span> for The signature
                </p>
              </Col>
              <Col xs={6} sm={3}>
                <img
                  src={correct_signature_second_img}
                  alt="signature-img"
                  className="modal-img"
                />
                <p className="signature-note">
                  Use of <span> black pen</span> for The signature
                </p>
              </Col>
              <Col xs={6} sm={3}>
                <img
                  src={incorrect_signature_img}
                  alt="signature-img"
                  className="modal-img"
                />
                <p className="signature-note">
                  Signature in other than <span>blue or black ink</span>
                </p>
              </Col>
              <Col xs={6} sm={3}>
                <img
                  src={incorrect_signature_second_img}
                  alt="signature-img"
                  className="modal-img"
                />
                <p className="signature-note">
                  Signature in <span>smaller size</span>
                </p>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default IPV;
