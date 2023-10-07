import React, { useState, useEffect } from "react";
import { Col, Container, Row, Modal } from "react-bootstrap";
import ChatCard from "../components/ChatCard";
import BulbSuggest from "../assets/images/gif/bulb-suggest.gif";
import UploadIcon from "../assets/images/upload-icon.svg";
import PageProgress from "../components/PageProgress";
import { Link, useNavigate } from "react-router-dom";
import DrivingLicence from "../assets/images/address-detail-2/driving-licence-image.png";
import DrivingLicence2 from "../assets/images/address-detail-2/driving-licence-second.png";
import DrivingLicence3 from "../assets/images/address-detail-2/driving-licence-third.png";
import DrivingLicence4 from "../assets/images/address-detail-2/driving-licence-fourth.png";
import userBottomImg from "../assets/images/person-images/person-sitting.png";
import adharicon from "../assets/images/adhaarcardicon.png";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import axios from "axios";
import $ from "jquery";
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
import Language from "../common/Languages/languageContent.json";
import { playAudio } from "../common/common.js";
import voteridicon from "../assets/images/Voting-Card-document.png";
import rationidicon from "../assets/images/Ration-Card-document.png";
import adharbackicon from "../assets/images/aadhar-card-back.png";
import rationbackicon from "../assets/images/ration-card-back-first.png";
import voterbackicon from "../assets/images/Voting-Card-back-first.png";
import PDFViewer from "../common/pdfViewer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SERVICES } from "../common/constants";
// import { AF_EventTriggered } from "../common/Event";

const AddressDetail = () => {
  const [showIconFront, setShowIconFront] = useState(false);
  const [showIconBack, setShowIconBack] = useState(false);
  useEffect(() => {
    let user = localStorage.getItem("ExistUqId");
    if (user === null || user === "" || user === "null") {
      window.location.replace(window.origin);
    }
  }, []);
  const [loading, setLoading] = useState(false);

  // const [pdfShow, setpdfshow] = useState(false);
  // const [pdfURL, setpdfURL] = useState("");

  const navigate = useNavigate();

  const [downloadFrontSide, setDownloadFrontSide] = useState("");
  const [downloadFrontBack, setDownloadFrontBack] = useState("");

  const [previewPDFFront, setPreviewPDFFront] = useState(false);
  const [previewPDFBack, setPreviewPDFBack] = useState(false);
  const [frontURL, setFrontURL] = useState("");
  const [backURL, setBackURL] = useState("");

  const [deleteFront, setDeleteFront] = useState("");
  const [deleteBack, setDeleteBack] = useState("");

  const [addressModal, setAddressModal] = useState(false);
  const [selected, setSelected] = useState("Aadhar");
  const [backUploadBtn, setBackUploadBtn] = useState(false);
  const [frontUploadBtn, setFrontUploadBtn] = useState(false);
  const [clientData, setClientData] = useState({});

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

  const deleteDocFront = async (e) => {
    e.preventDefault();
    // setpdfURL('');
    // setpdfshow(false);
    let firstName =
      clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    let Pan = clientData?.AccountOpeningRes?.Pan;
    let Mobile = clientData?.AccountOpeningRes?.Mobile;
    let Phrase;
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
          docName: deleteFront,
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
        setDownloadFrontSide("");
        setPreviewPDFFront(false);
        setFrontURL("");
        deletePreview(e);
        setShowIconFront(false);
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };
  function deleteInputFront(e) {
    e.preventDefault();
    setFrontUploadBtn(false);
    deleteDocFront(e);
    ME_EventTriggered("DeleteFrontDocument")
  }

  function deletePreview(e) {
    e.preventDefault();
    $(e.target)
      .parent()
      .closest(".upload-front-side")
      .find(".left-input")
      .find("input")[0].value = "";
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

  const deleteDoc = async (e) => {
    let firstName =
      clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    let Pan = clientData?.AccountOpeningRes?.Pan;
    let Mobile = clientData?.AccountOpeningRes?.Mobile;
    let Phrase;
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
          docName: deleteBack,
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
        setDownloadFrontBack("");
        deletePreview(e);
        setPreviewPDFBack(false);
        setShowIconBack(false);
        setBackURL("");
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };
  function deleteInput(e) {
    e.preventDefault();
    setBackUploadBtn(false);
    deleteDoc(e);
    ME_EventTriggered("DeleteBackDocument")
  }
  const fileValidationfront = (e, selected, desc) => {
    // setpdfURL('');
    // setpdfshow(false);
    // AF_EventTriggered("Address", "Address", { onclick: "Address" });
    ME_EventTriggered(`UploadDocfront`, { selected })
    let parent = $($(e.target).parent().closest(".upload-front-side"))[0];
    let first = $(parent).find(".first-view")[0];
    let preview = $(parent).find(".demo")[0];
    let second = $(parent).find(".second-view")[0];
    $(second).find(".img-status").css("display", "block");
    let fileText = $(second).find(".img-text")[0];
    const fileMb = e.target.files[0].size / 1024 ** 2;
    let pdf = e.target.files[0].type;
    const fileType = e.target.files[0].name;
    // function isImage(icon) {
    //   let ext = [".jpg", ".jpeg", ".png", ".pdf"];
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
        uploadFilefront(e, selected, desc);
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
  const fileValidationback = (e, selected, desc) => {
    // AF_EventTriggered("Address", "Address", { onclick: "Address" });
    ME_EventTriggered(`UploadDocBack`, { selected })
    setBackUploadBtn(true);
    let parent = $($(e.target).parent().closest(".upload-front-side"))[0];
    let first = $(parent).find(".first-view")[0];
    let preview = $(parent).find(".demo")[0];
    let second = $(parent).find(".second-view")[0];
    $(second).find(".img-status").css("display", "block");
    let fileText = $(second).find(".img-text")[0];

    const fileMb = e.target.files[0].size / 1024 ** 2;
    let pdf = e.target.files[0].type;
    const fileType = e.target.files[0].name;
    // function isImage(icon) {
    //   let ext = [".jpg", ".jpeg", ".png"];
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
        uploadFileback(e, selected, desc);
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

  const uploadFilefront = async (e, value, data) => {
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
    let Phrase;
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
      console.log(percent, "percent");
      if (percent == "100") {
        setFrontUploadBtn(true);
      } else {
        setFrontUploadBtn(false);
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
            setShowIconFront(true);
          } else {
            setShowIconFront(false);
          }
          if (request.Status === "Failed") {
            sendToCleverTap("BFSL_APPLICATION_CLICKED", {
              EP_PAGE_NAME: "ADHAR UPLOAD PAGE",
              EP_UPLOAD_BACK_SIDE: "YES",
              EP_UPLOAD_BACK_SIDE_STATUS: "INVALID",
              EP_CTA: "SUBMIT",
            });

            toast.error(request.Reason);
            deletePreview(e);
          } else {
            getAllDocoment(true);
            sendToCleverTap("BFSL_APPLICATION_CLICKED", {
              EP_PAGE_NAME: "ADHAR UPLOAD PAGE",
              EP_UPLOAD_BACK_SIDE: "YES",
              EP_UPLOAD_BACK_SIDE_STATUS: "VALID",
              EP_CTA: "SUBMIT",
            });

            setDownloadFrontSide(request.Response.DocumentUrl);
            // localStorage.setItem("AddressProofDocId", request.Response.docId);
          }
        } else {
          sendToCleverTap("BFSL_APPLICATION_CLICKED", {
            EP_PAGE_NAME: "ADHAR UPLOAD PAGE",
            EP_UPLOAD_BACK_SIDE: "YES",
            EP_UPLOAD_BACK_SIDE_STATUS: "INVALID",
            EP_CTA: "SUBMIT",
          });

          toast.error("Couldn't upload file, please try again!");
          deletePreview(e);
        }
      }
    };
  };
  const uploadFileback = async (e, value, data) => {
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
    let Phrase;
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
        setBackUploadBtn(true);
      } else {
        setBackUploadBtn(false);
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
            setShowIconBack(true);
          } else {
            setShowIconBack(false);
          }
          if (request.Status === "Failed") {
            sendToCleverTap("BFSL_APPLICATION_CLICKED", {
              EP_PAGE_NAME: "ADHAR UPLOAD PAGE",
              EP_UPLOAD_FRONT_SIDE: "YES",
              EP_UPLOAD_FRONT_SIDE_STATUS: "INVALID",
              EP_CTA: "SUBMIT",
            });

            toast.error(request.Reason);
            deletePreview(e);
          } else {
            sendToCleverTap("BFSL_APPLICATION_CLICKED", {
              EP_PAGE_NAME: "ADHAR UPLOAD PAGE",
              EP_UPLOAD_FRONT_SIDE: "YES",
              EP_UPLOAD_FRONT_SIDE_STATUS: "VALID",
              EP_CTA: "SUBMIT",
            });

            getAllDocoment(true);
            setDownloadFrontBack(request.Response.DocumentUrl);
            // localStorage.setItem("AddressProofDocId_2", request.Response.docId);
          }
        } else {
          sendToCleverTap("BFSL_APPLICATION_CLICKED", {
            EP_PAGE_NAME: "ADHAR UPLOAD PAGE",
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

  useEffect(() => {
    sendToCleverTap("BFSL_APPLICATION_VIEWED", {
      EP_PAGE_NAME: "ADHAR UPLOAD PAGE",
    });

    ResumeClient();
    getAllDocoment();
    customSelect();
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
          if (docName === "AddressProof_2" && data[i].fileName!='') {
            console.log(data[i].fileName);
            let UrlStatus = await checkUrlValid(data[i].fileName);
            console.log(UrlStatus);
            if (!UrlStatus) {
              continue
            }
            console.log(UrlStatus, "UrlStatus");
            setBackUploadBtn(true);
            setShowIconBack(true);
            setSelected(data[i].docDescription);
            if (valid) {
              setDeleteBack(data[i].docName);
            } else {
              setDeleteBack(data[i].docName);
              let Front = $(".address_1")[0];
              $(Front).find(".first-view").css("display", "none");
              let Imagetype = getUrlExtension(data[i].fileName);
              setDownloadFrontSide(data[i].fileName);
              if (Imagetype === "pdf") {
                // setPdf preview for frontPArt
                setPreviewPDFBack(true);
                setBackURL(data[i]["fileName"]);
              } else {
                // setNormal Image Show
                setPreviewPDFBack(false);
                setBackURL("");
                $(Front).find(".demo").attr("src", data[i]["fileName"]);
              }
              localStorage.setItem("AddressProofDocId_2", data[i].docGuiId);
              $(Front).find(".demo").css("width", "213px");
              $(Front).find(".demo").css("height", "116px");
              $(Front).find(".demo").css("object-fit", "content");
              $(Front).find(".second-view").css("display", "block");
              $(Front).find(".input-img ").removeAttr("required");
              $(Front).find(".img-status").css("display", "none");
              document.querySelector(".proof").value = data[i].docDescription;
            }
          }
          if (docName === "AddressProof" && data[i].fileName!='') {
            // set Btn Orange to true
            console.log(data[i].fileName);
            let UrlStatus = await checkUrlValid(data[i].fileName);
            console.log(UrlStatus);
            if (!UrlStatus) {
              console.log("url error");
              continue
            }
            setFrontUploadBtn(true);
            setSelected(data[i].docDescription);
            setShowIconFront(true);
            // setDefault select Dropdown
            if (valid) {
              setDeleteFront(data[i].docName);
            } else {
              setDeleteFront(data[i].docName);
              // select front side of doc
              let Front = $(".address")[0];
              // upload documnet part display none
              $(Front).find(".first-view").css("display", "none");
              // get Type of url from api
              let Imagetype = getUrlExtension(data[i].fileName);
              setDownloadFrontBack(data[i].fileName);
              if (Imagetype === "pdf") {
                // setPdf preview for frontPArt
                setPreviewPDFFront(true);
                setFrontURL(data[i]["fileName"]);
              } else {
                // setNormal Image Show
                setPreviewPDFFront(false);
                setFrontURL("");
                $(Front).find(".demo").attr("src", data[i]["fileName"]);
              }
              localStorage.setItem("AddressProofDocId", data[i].docGuiId);
              $(Front).find(".demo").css("width", "213px");
              $(Front).find(".demo").css("height", "116px");
              $(Front).find(".demo").css("object-fit", "content");
              $(Front).find(".second-view").css("display", "block");
              $(Front).find(".input-img ").removeAttr("required");
              $(Front).find(".img-status").css("display", "none");
              document.querySelector(".proof").value = data[i].docDescription;
            }
          }
        }
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };

  const submit = (e) => {
    e.preventDefault();
    playAudio(16);
    navigate("/pan-upload");
    ME_EventTriggered("SubmitDocuments")
  };

  function downloadInputfront(e) {
    e.preventDefault();
    console.log("Front_Address_Document");
    downloadPDF(downloadFrontSide, "Front_Address_Document");
  }

  function downloadInputBack(e) {
    e.preventDefault();
    console.log("Back_Address_Document");

    downloadPDF(downloadFrontBack, "Back_Address_Document");
  }

  // const downloadInputfront = async (e) => {
  //   e.preventDefault();
  //   try {

  //     const downloadAddressproof = localStorage.getItem("AddressProofDocId");
  //     const response = await axios.get(

  //       SERVICES.PDFDOWNLOADNEW + "/" + downloadAddressproof,

  //       {
  //         headers: {
  //           "content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     window.open(SERVICES.PDFDOWNLOADNEW + "/" + downloadAddressproof);
  //   } catch (err) {

  //   }
  // };

  // const downloadInputBack = async (e) => {
  //   e.preventDefault();
  //   const downloadAddressproof2 = localStorage.getItem("AddressProofDocId_2");
  //   window.open(SERVICES.PDFDOWNLOADNEW + "/" + downloadAddressproof2);
  // };

  return (
    <>
      <PageProgress progress="document-upload" />
      <div className={`${loading ? "loader" : " "}`}>
        {loading && (
          <>
            <img src={bajaj_loaderimg} className="loader-img" />
          </>
        )}
        <main className="main-content page-wrapper">
          <section className="address-details-second">
            <Container>
              <Row>
                <Col lg="8">
                  <a
                    role="button"
                    onClick={() => {
                      sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                        EP_PAGE_NAME: "ADHAR UPLOAD PAGE",
                        EP_UPLOAD_FRONT_SIDE: "",
                        EP_UPLOAD_FRONT_SIDE_STATUS: "",
                        EP_CTA: "BACK",
                      });
                      navigate("/document-upload");
                      pauseAudio();
                    }}
                    className="back-button"
                  >
                    <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                  </a>
                  <h2 className="page-title">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .DIGILOACKER_HAPPENS_IN_STEP
                    }
                  </h2>
                  {/* <h3 className="page-subtitle">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .DONT_WORRY_WE_WILL
                    }
                  </h3> */}
                  <div className="step-tip-wrapper">
                    <div className="form-tip form-tip-mobile">
                      <Link
                        to
                        role="button"
                        onClick={() => {
                          setAddressModal(true);
                          sendToCleverTap("BFSL_APPLICATION_VIEWED", {
                            EP_PAGE_NAME: "ADHAR UPLOAD PAGE"
                          });
                        }}
                        className="form-tip-label"
                      >
                        <img src={BulbSuggest} alt="bulb-suggest" />{" "}
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].HOW_SHOULD_I_UPLOAD_DOCUMENT
                        }
                      </Link>
                    </div>
                  </div>
                  <div className="upload-points-section">
                    <form onSubmit={submit}>
                      <select
                        onChange={(e) => {
                          setSelected(e.target.value);
                          previewReset();
                        }}
                        defaultValue={selected}
                        className="form-control proof address-detail-select"
                      >
                        <option value="Aadhar">
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].ADHAAAR_CARD
                          }
                        </option>
                        <option value="Voter">
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].VOTER_ID
                          }
                        </option>
                        <option value="Ration">
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].RATION_CARD
                          }
                        </option>
                      </select>
                      <p className="file-format-popup">
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].File_FORMAT_JPEG_TIFF_PDF
                        }
                      </p>
                      <div className="row address-proof-box-wrapper">
                        <div className="col-12 col-md-5">
                          <div className="upload-front-side address">
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
                                    name=""
                                    id="file"
                                    accept="image/png,image/jpeg"
                                    required
                                    onChange={(e) => {
                                      fileValidationfront(
                                        e,
                                        selected,
                                        "AddressProof"
                                      );
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
                                <p className="upload-msg">
                                  Uploaded Successfully
                                </p>
                                {showIconFront ? (
                                  <div className="second-view-icons">
                                    <button
                                      className="edit delete-input"
                                      onClick={(e) => {
                                        deleteInputFront(e);
                                      }}
                                    >
                                      <svg class="new-icon new-icon-delete"><use href="#new-icon-delete"></use></svg>
                                    </button>
                                    <button
                                      className="edit resize"
                                      onClick={(e) => {
                                        downloadInputfront(e);
                                      }}
                                    >
                                      <svg class="new-icon new-icon-download"><use href="#new-icon-download"></use></svg>
                                      {/* <i className="icon-download" /> */}
                                    </button>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div className="preview-img">
                                {previewPDFFront ? (
                                  <div>
                                    <PDFViewer src={frontURL} />
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
                                  <p className="byte"></p>
                                  <p className="flag"></p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-5">
                          <div className="upload-front-side address_1">
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
                                    name=""
                                    id="file"
                                    accept="image/png,image/jpeg"
                                    required
                                    onChange={(e) => {
                                      fileValidationback(
                                        e,
                                        selected,
                                        "AddressProof_2"
                                      );
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
                                    ].UPLOAD_BACK_SIDE
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
                                <p className="upload-msg">
                                  Uploaded Successfully
                                </p>
                                {showIconBack ? (
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
                                        downloadInputBack(e);
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
                                {previewPDFBack ? (
                                  <div>
                                    <PDFViewer src={backURL} />
                                  </div>
                                ) : (
                                  <img src="" className="demo" alt="" />
                                )}
                              </div>
                              <p className="img-text"></p>
                              <div className="img-status w-100">
                                <div className="bar">
                                  <div className="current"></div>
                                </div>
                                <div className="status-btm">
                                  <p className="byte"></p>
                                  <p className="flag"></p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="form-tip"
                        onClick={() => {
                          setAddressModal(true);
                          sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                            EP_PAGE_NAME: "ADHAR UPLOAD PAGE",
                            EP_CTA: "HOW TO UPLOAD AADHAR MODAL",
                          });
                        }}
                      >
                        <h3 className="form-tip-label">
                          <img src={BulbSuggest} alt="bulb-suggest" />
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].HOW_SHOULD_I_UPLOAD_DOCUMENT
                          }
                        </h3>
                      </div>
                      <p className="file-format-popup mobile-file">
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].File_FORMAT_JPEG_TIFF_PDF
                        }
                      </p>
                      <input
                        type="submit"
                        disabled={!showIconFront || !showIconBack}
                        value={
                          Language[
                            localStorage.getItem("language") || "English"
                          ].SUBMIT
                        }
                        className={
                          backUploadBtn && frontUploadBtn
                            ? "common-btn"
                            : "continue-btn"
                        }
                      />
                    </form>
                  </div>
                </Col>
                <Col className="position-inherit" lg="4">
                  <div className="d-flex flex-column h-100">
                    <ChatCard
                      chatSubtitle={
                        "You’re not alone in the stock market, more than 25 lakh people have opened a Demat account only in the last month.     "
                      }
                    />
                    <div className="user-bottom-img">
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
        show={addressModal}
        onHide={() => setAddressModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="upload-img-modal"
        centered
        backdrop="static"
        keyboard={false}
      >
        <div
          className="close"
          onClick={() => {
            setAddressModal(false);
            sendToCleverTap("BFSL_APPLICATION_VIEWED", {
              EP_PAGE_NAME: "ADHAR UPLOAD PAGE",
              EP_CTA: "CLOSE",
            });
          }}
        >
          <svg class="new-icon new-icon-close"><use href="#new-icon-close"></use></svg>
        </div>
        <Modal.Body>
          <h3 className="modal-title">
            {" "}
            {
              Language[localStorage.getItem("language") || "English"]
                .HOW_SHOULD_I_UPLOAD_DOCUMENT
            }
          </h3>
          <Row>
            <Col md="5" className="p-xs-0">
              <div className="modal-left">
                <img
                  src={DrivingLicence}
                  alt="pancard-img"
                  className="modal-img "
                />
                <div className="modal-left-content">
                  <p className="points-label">please note</p>
                  <ul className="points-remember-wrapper">
                    <li>
                      <div className="tick-box">
                        <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                      </div>
                      <p className="remember-points">
                        photo must be clear with readable details
                      </p>
                    </li>
                    <li>
                      <div className="tick-box">
                        <svg class="new-icon new-icon-tick"><use href="#new-icon-tick"></use></svg>
                      </div>                      <p className="remember-points">
                        address proof must have your signature otherwise it is
                        considered invalid
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col md="6" className="ml-auto p-xs-0">
              <Row className="correction-img">
                <Col md="6" className="col-4">
                  <img
                    src={DrivingLicence2}
                    alt="pancard-img"
                    className="modal-img  w-100"
                  />
                  <p className="img-note">
                    make sure the address proof is not cut
                  </p>
                </Col>
                <Col md="6" className="col-4">
                  <img
                    src={DrivingLicence3}
                    alt="pancard-img"
                    className="modal-img  w-100"
                  />
                  <p className="img-note">
                    make sure your address proof is not blurry
                  </p>
                </Col>
                <Col md="6" className="ml-auto col-4">
                  <img
                    src={DrivingLicence4}
                    alt="pancard-img"
                    className="modal-img"
                  />
                  <p className="img-note">
                    make sure your address proof is not reflective
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default AddressDetail;
