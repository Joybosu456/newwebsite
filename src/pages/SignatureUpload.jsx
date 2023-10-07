import React, { useEffect, useRef } from "react";
import ChatCard from "../components/ChatCard";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Bulb_icon from "../assets/images/gif/bulb-suggest.gif";
import Page_Progress from "../components/PageProgress";
import correct_signature_img from "../assets/images/signature/correct-signature.png";
import correct_signature_second_img from "../assets/images/signature/correct-signature-second.png";
import incorrect_signature_img from "../assets/images/signature/incorrect-signature.png";
import incorrect_signature_second_img from "../assets/images/signature/incorrect-signature-second.png";
import $ from "jquery";
import SignatureCanvas from 'react-signature-canvas';
import { useState } from "react";
import axios from "axios";
import UploadIcon from "../assets/images/upload-icon.svg";
import userBottomImg from "../assets/images/person-images/person-sitting.png";
// import Signature from "../assets/images/Signature.svg";
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
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import ModalClose from "../assets/images/black-close.svg";

const SignatureUpload = () => {
  const navigate = useNavigate();
  let Phrase = "";

  const [signatureModeDraw, setSignatureModeDraw] = useState(true);
  const [downloadSignature, setDownloadSignature] = useState("");
  const [signatureguidemodalShow, setsignatureguideModalShow] = useState(false);
  // const [userPercentages, setUserPercentages] = useState();
  const [signaturePreview, setSignaturePreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTelecaller, setIsTelecaller] = useState(false);
  const [signatureURL, setSignatureURL] = useState("");
  const [front, setFront] = useState(false);
  const [clientData, setClientData] = useState();
  const [deleteSignatureDoc, setDeleteSiginatureDoc] = useState("");
  const [showIcon, setShowIcon] = useState(false);
  const sigCanvas = useRef({});
  const [userHasDrawn, setUserHasDrawn] = useState(false);
  const [showUploadDrawnSignatureConfirmation, setShowUploadDrawnSignatureConfirmation] = useState(false);

  useEffect(() => {
    let user = localStorage.getItem("ExistUqId");
    let digiokid = localStorage.getItem("KidID");
    let digiomobile = localStorage.getItem("identifier_mobile");
    let checkTelecaller = localStorage.getItem("telecaller");

    if (digiokid != null && digiomobile != null && checkTelecaller === "no") {
      DigioDocUpload();
    }

    if (digiokid != null && digiomobile != null && checkTelecaller === "yes") {
      DigioDocUploadTelecaller();
    }

    if (checkTelecaller === 'yes') {
      setIsTelecaller(true)
      setSignatureModeDraw(false)
    }
  }, []);
  useEffect(() => {
    sendToCleverTap("BFSL_APPLICATION_VIEWED", {
      EP_PAGE_NAME: "SIGNATURE UPLOAD PAGE",
    });

    ResumeClient();
    getAllDocoment();
  }, []);

  const clearSignatureCanvas = () => {
    setUserHasDrawn(false)
    sigCanvas.current?.clear();
  };
  const saveSignatureCanvas = (e) => {
    if (!userHasDrawn) {
      toast.error("Please draw your signature");
      return;
    }
    const image = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    // Now 'image' contains the signature as a data URL.
    // You can send it to the server or save it locally.


      const dataURLtoFile = (dataurl, filename) => {
        // convert base64/URLEncoded data component to raw binary data held in a string

        const byteString = atob(dataurl.split(',')[1]);
        // separate out the mime component
        const mimeString = dataurl.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        const ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        const ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        const blob = new File([ab], "signature.png", { type: mimeString });
        return blob;
      }

      // add the base64 image to file input
      let file = dataURLtoFile(image, 'signature.png');

      const fileInput = document.querySelector('#signature-upload');
      let list = new DataTransfer();
      list.items.add(file);

      let myFileList = list.files;
      fileInput.files = myFileList

      fileInput.dispatchEvent(new Event('change', { 'bubbles': true }));

    }


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
          if (docName === "PDF-SIGN" && data[i].fileName!='') {
            let UrlStatus = await checkUrlValid(data[i].fileName);
            console.log(UrlStatus);
            if (!UrlStatus) {
              console.log("url error");
              continue
            }
            setFront(true);
            setShowIcon(true)
            // setSignatureURL(ImgURL);
            if (valid) {
              setDeleteSiginatureDoc(data[i].docName);
            } else {
              setDeleteSiginatureDoc(data[i].docName);
              let Front = $(".upload-front-side")[0];
              $(Front).find(".first-view").css("display", "none");
              let Imagetype = getUrlExtension(data[i].fileName);
              setDownloadSignature(data[i].fileName);
              if (Imagetype === "pdf") {
                // setPdf preview for frontPArt
                setSignaturePreview(true);
                setSignatureURL(data[i]["fileName"]);
              } else {
                // setNormal Image Show
                setSignaturePreview(false);
                setSignatureURL("");
                $(Front).find(".demo").attr("src", data[i]["fileName"]);
              }
              $(Front).find(".demo").css("width", "213px");
              $(Front).find(".demo").css("height", "116px");
              $(Front).find(".demo").css("object-fit", "content");
              $(Front).find(".second-view").css("display", "block");
              $(Front).find(".input-img ").removeAttr("required");
              $(Front).find(".img-status").css("display", "none");
              localStorage.setItem("SignatureGuid", data[i].docGuiId);
            }
            if (docName === "PDF-PHOTO") {
              localStorage.setItem("Photographuploaded", "1");
            }
          }
        }
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };

  const DigioDocUpload = async () => {
    const panno = localStorage.getItem("Pan");
    try {
      const DigiFlag = localStorage.getItem("DigiActive");

      if (
        localStorage.getItem("DigiActive") == "0" ||
        localStorage.getItem("DigiLockerActive") == "0"
      ) {
        localStorage.setItem("Digioupdate", "0");
      }
      if (
        localStorage.getItem("DigiActive") == "1" ||
        localStorage.getItem("DigiLockerActive") == "1"
      ) {
        localStorage.setItem("Digioupdate", "1");
      }

      const Phrase = localStorage.getItem("PhraseName");
      const response = await axios.post(
        SERVICES.DIGIO_DOC_UPLOAD,

        {
          kId: localStorage.getItem("KidID"),
          refId: Number(localStorage.getItem("refId")),
          mobile: localStorage.getItem("identifier_mobile"),
          pan: panno,
          filename: Phrase,
          uqId: clientData?.FlagRes?.UQID || localStorage.getItem("UserUqID"),
          status: localStorage.getItem("Digioupdate"),
        },

        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      localStorage.removeItem("DigiLockerActive");
    } catch (err) {

    }
  };

  const DigioDocUploadTelecaller = async () => {
    const panno = localStorage.getItem("Pan");
    try {


      const Phrase = localStorage.getItem("PhraseName");
      const response = await axios.post(
        SERVICES.DIGIO_DOC_UPLOAD_TELECALLER,

        {
          kId: localStorage.getItem("KidID"),
          refId: Number(localStorage.getItem("refId")),
          mobile: localStorage.getItem("identifier_mobile"),
          pan: panno,
          filename: Phrase,
          uqId: clientData?.FlagRes?.UQID || localStorage.getItem("UserUqID"),
          status: "3"
        },

        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      localStorage.removeItem("DigiLockerActive");
    } catch (err) {

    }
  };



  // useEffect(() => {
  //   const GetPackwisePercentage = async () => {
  //     try {
  //       const response = await axios.post(
  //         SERVICES.GETPACKWISEPERCENTAGE,

  //         {
  //           CityName: "pune",
  //         },

  //         {
  //           headers: {
  //             "content-Type": "application/json",
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );

  //       if (response.data.Response[1].packname === "BPC") {
  //         setUserPercentages(response.data.Response[1].packpercentage);
  //       } else if (response.data.Response[3].packname === "Professional Pack") {
  //         setUserPercentages(response.data.Response[1].packpercentage);
  //       } else if (response.data.Response[2].packname === "Free Pack") {
  //         setUserPercentages(response.data.Response[3].packpercentage);
  //       } else {
  //       }
  //     } catch (err) { }
  //   };
  //   GetPackwisePercentage();
  // }, []);



  const Submit = (e) => {
    e?.preventDefault();
    if (userHasDrawn && signatureModeDraw && !showIcon) {
      setShowUploadDrawnSignatureConfirmation(true);
      return
    }
    let digiokid = localStorage.getItem("KidID");
    let digiomobile = localStorage.getItem("identifier_mobile");
    let checkTelecaller = localStorage.getItem("telecaller");
    ME_EventTriggered("Submit Signature")
    if (digiokid != null && digiomobile != null && checkTelecaller === "no") {
      DigioDocUpload();
    }
    let fno = clientData?.FlagRes?.Fno || localStorage.getItem("fno");
    // if (fno == "True" || fno == "true" || fno == true) {
    //   pauseAudio();
    //   navigate(`/fno`);
    // } else {
    //   playAudio(18);
    //   navigate(`/selfie-upload`);
    // }
    const IMPS = clientData?.FlagRes?.Imps || localStorage.getItem("ifscflag");
    if (IMPS == "1" && IMPS != null && IMPS != undefined) {
      if (fno == "True" || fno == "true" || fno == true) {
        pauseAudio();
        navigate(`/fno`);
      } else {
        playAudio(18);
        navigate(`/selfie-upload`);
      }
      // playAudio(17);
      // navigate(`/signature-upload`);
    } else {
      pauseAudio();
      navigate(`/check-upload`);
    }
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
    formData.append("Image", imagefile.files[0]);
    formData.append("RefId", REFID);
    formData.append("DocDef", data);
    formData.append("DocDesc", value);
    formData.append("UqId", UQID);
    let firstName =
      clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    let Pan = clientData?.AccountOpeningRes?.Pan;
    let Mobile = clientData?.AccountOpeningRes?.Mobile;
    // const Phrase =
    //   `${firstName}_${Pan}_${Mobile}`.replace("."," ", "_") || localStorage.getItem("PhraseName");
    if (firstName && Pan && Mobile) {
      Phrase = `${firstName}_${Pan}_${Mobile}`;
    } else {
      Phrase = localStorage.getItem("PhraseName");
    }
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
              EP_PAGE_NAME: "SIGNATURE UPLOAD PAGE",
              EP_UPLOAD_FRONT_SIDE: "YES",
              EP_CTA: "SUBMIT",
            });

            toast.error(request.Reason);
            deletePreview(e);
          } else {
            sendToCleverTap("BFSL_APPLICATION_CLICKED", {
              EP_PAGE_NAME: "SIGNATURE UPLOAD PAGE​",
              EP_UPLOAD_FRONT_SIDE: "YES",
              EP_CTA: "SUBMIT",
            });

            getAllDocoment(true);
            setDownloadSignature(request.Response.DocumentUrl);
            // localStorage.setItem("SignatureGuid", request.Response.docId);
          }
        } else {
          sendToCleverTap("BFSL_APPLICATION_CLICKED", {
            EP_PAGE_NAME: "SIGNATURE UPLOAD PAGE",
            EP_UPLOAD_FRONT_SIDE: "YES",
            EP_CTA: "SUBMIT",
          });

          toast.error("Couldn't upload file, please try again!");
          deletePreview(e)
        }
      }
    };
  };

  const fileValidation = (e, selected, desc) => {
    setFront(true);
    setSignatureURL("");
    setSignaturePreview(false);
    // AF_EventTriggered("Signature-upload", "Signature-upload", {
    //   onclick: "Signature-upload",
    // });
    ME_EventTriggered("UploadSignature", { selected });

    let parent = $($(e.target).parent().closest(".upload-front-side"));
    let first = $(parent).find(".first-view")[0];
    let preview = $(parent).find(".demo")[0];
    let second = $(parent).find(".second-view")[0];
    $(second).find(".img-status").css("display", "block");
    let fileText = $(second).find(".img-text")[0];
    let pdf = e.target.files[0].type;
    const fileMb = e.target.files[0].size / 1024 ** 2;
    const fileType = e.target.files[0].name;
    // const isImage = (icon) => {
    //   var ext = [".jpg", ".jpeg", ".png", ".pdf"];
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

  function downloadInput(e, url) {
    e.preventDefault();
    downloadPDF(downloadSignature, "Signature_Document");

    // try {
    //   let firstName =
    //     clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    //   let Pan = clientData?.AccountOpeningRes?.Pan;
    //   let Mobile = clientData?.AccountOpeningRes?.Mobile;
    //   const Phrase =
    //     `${firstName}_${Pan}_${Mobile}` || localStorage.getItem("PhraseName");
    //   const RefNo = clientData?.FlagRes?.Id || localStorage.getItem("refId");
    //   const downloadSignature =
    //     clientData?.docId || localStorage.getItem("SignatureGuid");
    //   window.open(SERVICES.PDFDOWNLOADNEW + "/" + downloadSignature);

    // } catch (err) {
    // }
  }
  const deleteDoc = async (e) => {
    e.preventDefault();
    // console.log(deleteSignatureDoc,"deleteSignatureDoc")
    let firstName =
      clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    let Pan = clientData?.AccountOpeningRes?.Pan;
    let Mobile = clientData?.AccountOpeningRes?.Mobile;
    let Phrase =
      `${firstName}_${Pan}_${Mobile}` || localStorage.getItem("PhraseName");
    if (firstName && Pan && Mobile) {
      Phrase = `${firstName}_${Pan}_${Mobile}`;
    } else {
      Phrase = localStorage.getItem("PhraseName");
    }
    const RefNo = clientData?.FlagRes?.Id || localStorage.getItem("refId");

    // try {
    const response = await axios.post(
      SERVICES.DELETEDOCUMENT,
      {
        id: RefNo,
        docName: deleteSignatureDoc,
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
      setDownloadSignature("");
      setFront(false);
      setSignatureURL("");
      setSignaturePreview(false);
      deletePreview(e);
      setShowIcon(false)
    }
    // } catch (err) {
    //   throw new Error(err.message)

    // }
  };

  const deleteInput = (e) => {
    e.preventDefault();
    deleteDoc(e);
    ME_EventTriggered("Delete SignatureDoc")
  };

  const deletePreview = (e) => {
    clearSignatureCanvas();
    e?.preventDefault?.();
    console.log("deletePreview", $(e.target).parent());
    $(".upload-front-side")
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
    // $(parent).find(".input-img ").attr("required", "true");
  };
  const navBack = () => {
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "SIGNATURE UPLOAD PAGE",
      EP_UPLOAD_FRONT_SIDE: "",
      EP_CTA: "BACK",
    });

    let IMPS = clientData?.FlagRes?.Imps || localStorage.getItem("ifscflag");
    let KRA = clientData?.FlagRes?.IsKyc || localStorage.getItem("KYC");
    let DigiLockerActivate = localStorage.getItem("DigiLockerActive");

    // if (IMPS == "0") {
    //   navigate("/check-upload");
    // }
    // else {
      if (KRA == 1 || KRA == 2 ) {
        pauseAudio();
        navigate("/document-upload");
      } else {
        pauseAudio();
        navigate("/pan-upload");
      }
    // }

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
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };

  useEffect(() => {
    if (showIcon && showUploadDrawnSignatureConfirmation && signatureModeDraw && userHasDrawn) {
      Submit()
    }
  }, [showIcon, signatureModeDraw, userHasDrawn, showUploadDrawnSignatureConfirmation, Submit])

  return (
    <>
      <Modal
        show={showUploadDrawnSignatureConfirmation}
        onHide={() => setShowUploadDrawnSignatureConfirmation(false)}
        aria-labelledby="contained-modal-title-vcenter"
        className="ifscModal"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className={'p-4 font-weight-bolder'}>
          <h3>Confirm</h3>
          <div className="close" onClick={() => setShowUploadDrawnSignatureConfirmation(false)}>
            <img src={ModalClose} alt="" />
          </div>
        </Modal.Header>
        <Modal.Body >
          <p className={'modal-subtitle'} style={{fontSize: 15}}>
            Please confirm that you want to upload the signature you have drawn.
          </p>
          <div className={'d-flex justify-content-end'}>
            <button
              className={'continue-btn mr-2'}
              onClick={() => {
                setShowUploadDrawnSignatureConfirmation(false)
              }}
            >
                CANCEL
            </button>

            <button
              className={'common-btn mr-2'}
              style={{fontSize: 16}}
              onClick={() => {
                saveSignatureCanvas()
              }}
            >
              Confirm
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Page_Progress progress="document-upload" />
      <div className={`${loading ? "loader" : " "}`}>
        {" "}
        {loading && (
          <>
            <img src={bajaj_loaderimg} className="loader-img" />{" "}
          </>
        )}
        <main className="main-content page-wrapper">
          <section className="signature">
            <Container>
              <Row>
                <Col lg={8} sm={12} className="position-relative">
                  <a className="back-button" onClick={navBack}>
                    <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                  </a>
                  <h2 className="page-title">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .ACCOUNT_SAFER
                    }
                  </h2>
                  {/* <p className="page-subtitle">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .PATIENCE_COMMENDABLE
                    }
                  </p> */}
                  <div className="step-tip-wrapper">
                    <div className="form-tip form-tip-mobile">
                      <Link
                        className="form-tip-label"
                        onClick={() => {
                          setsignatureguideModalShow(true);
                          sendToCleverTap("BFSL_APPLICATION_VIEWED", {
                            EP_PAGE_NAME: "SIGNATURE UPLOAD GUIDELINES",
                            EP_CTA: "HOW TO UPLOAD SIGNATURE MODAL",
                          });
                        }}
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
                        <div className="upload-front-side overflow-hidden">
                          <div style={{display: !showIcon ? 'block': 'none', position: signatureModeDraw ? 'relative' : 'absolute', opacity: signatureModeDraw ? 100 : 0 }}>
                            <SignatureCanvas
                                ref={sigCanvas}
                                penColor="black"
                                clearOnResize={false}
                                canvasProps={{
                                  style: {
                                    width: '100%',
                                    height: '100pt'
                                  },
                                }}
                                onEnd={(e) => {
                                  setUserHasDrawn(true)
                                }}
                            />
                            <div className={'position-absolute d-flex align-items-center p-2'} style={{ top: 0, right: 0, gap: 4 }}>
                              <div onClick={() => {
                                clearSignatureCanvas()
                              }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                </svg>
                              </div>

                              {/*<div onClick={() => {*/}
                              {/*  saveSignatureCanvas()*/}
                              {/*}}>*/}
                              {/*  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0072bc" className="bi bi-cloud-arrow-up" viewBox="0 0 16 16">*/}
                              {/*    <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z" />*/}
                              {/*    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />*/}
                              {/*  </svg>*/}
                              {/*</div>*/}
                            </div>
                            <input
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={(e) => {
                                  fileValidation(e, "Sign", "Signature");
                                }}
                                name={'signature-upload'}
                                id={'signature-upload'}
                                style={{
                                  visibility: "hidden",
                                }}
                                className="upload-front-side input-img position-absolute w-100"
                                required={false}
                            />
                          </div>
                          {signatureModeDraw
                              ? null
                            : <div className="first-view h-100 w-100 ">
                              <div className="top">
                                <div className="left-input">
                                  <img
                                    className="upload"
                                    src={UploadIcon}
                                    alt=""
                                  />
                                  <input
                                    type="file"
                                    accept="image/png,image/jpeg"
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
                                    ].SIGNATURE_UPLOAD
                                  }
                                </p>
                              </div>
                              <div></div>
                            </div>}
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
                              {signaturePreview ? (
                                <div>
                                  <PDFViewer src={signatureURL} />
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
                        {!isTelecaller && <div className={'mb-5 text-center'}>
                          <button
                            type={'button'}
                            className={`btn btn-block text-white ${!signatureModeDraw ? 'continue-btn' : 'common-btn'}`}
                            onClick={(e) => {
                              if (!signatureModeDraw) {
                                setSignatureModeDraw(true);
                                $('.delete-input').trigger('click');
                              }
                            }}
                          >
                            Draw Signature
                          </button>

                          <div className={'my-2'}>
                            OR
                          </div>

                          <button
                            type={'button'}
                            className={`btn btn-block text-white ${signatureModeDraw ? 'continue-btn' : 'common-btn'}`}
                            onClick={(e) => {
                              setSignatureModeDraw(false);
                              $('.delete-input').trigger('click');
                            }}
                          >
                            UPLOAD SIGNATURE
                          </button>
                        </div>}
                        <div className="form-tip">
                          <Link
                            className="form-tip-label"
                            onClick={() => {
                              setsignatureguideModalShow(true);
                              sendToCleverTap("BFSL_APPLICATION_VIEWED", {
                                EP_PAGE_NAME: "SIGNATURE UPLOAD GUIDELINES",
                                EP_CTA: "HOW TO UPLOAD SIGNATURE MODAL",
                              });
                            }}
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
                            </div>
                            <p className="remember-points">
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
                            </div>
                            <p className="remember-points">
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
                            </div>
                            <p className="remember-points">
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
                      disabled={!showIcon && !(userHasDrawn && signatureModeDraw)}
                      className={(userHasDrawn && signatureModeDraw) || front ? "common-btn" : "continue-btn"}
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
                              ].ACCOUNT_SECURITY
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
          onClick={() => {
            setsignatureguideModalShow(false);
            sendToCleverTap("BFSL_APPLICATION_VIEWED", {
              EP_PAGE_NAME: "SIGNATURE UPLOAD GUIDELINES",
              EP_CTA: "CLOSE",
            });
          }}
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
  )
}
export default SignatureUpload;
