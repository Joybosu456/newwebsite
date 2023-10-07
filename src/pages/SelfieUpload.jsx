import { React, useRef, useEffect, useState } from "react";
import ChatCard from "../components/ChatCard";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Bulb_icon from "../assets/images/gif/bulb-suggest.gif";
import Camera_icon from "../assets/images/camera.svg";
import refresh from "../assets/images/refresh.png";
import PageProgress from "../components/PageProgress";
import $ from "jquery";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userBottomImg from "../assets/images/person-images/selfie-user.png";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import pdficon from "../assets/images/pdficon.png";
import { SERVICES } from "../common/constants";
import { useNavigate } from "react-router-dom";
import selfieicon from "../assets/images/Selfieicon.png";
import selfie_tip_img from "../assets/images/selfie/selfie-tip-img-new.png";
import selfie_tip_second from "../assets/images/selfie/selfie-tip-second.png";
import selfie_tip_third from "../assets/images/selfie/selfie-tip-third.png";
import selfie_tip_fourth from "../assets/images/selfie/selfie-tip-fourth.png";
import UploadIcon from "../assets/images/upload-icon.svg";
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
} from "../common/common";
import PDFViewer from "../common/pdfViewer";

const SelfieUpload = () => {
  const [selfiemodalShow, setselfieModalShow] = useState(false);
  const [selfie, setSelfie] = useState(false);
  const [clientData, setClientData] = useState();
  const photoRef = useRef(null);
  const stripRef = useRef(null);
  const [buttonText, setButtonText] = useState("Capture");
  const [loading, setLoading] = useState(false);
  const [resumeSelfie, setResumeSelfie] = useState(false);
  const [teleIPVBtn, setTeleIPVBtn] = useState(false);
  const [eSignBtn, setESignBtn] = useState(true);

  const [clientPreview, setClientPreview] = useState(false);
  const [clientUrl, setClientUrl] = useState("");
  const [telePreview, setTelePreview] = useState(false);
  const [teleUrl, setTeleUrl] = useState("");
  const [deletePhoto, setDeletePhoto] = useState("");
  const [downloadPhoto, setDownloadPhoto] = useState("");
  const [telePreviewIcon, setTelePreviewIcon] = useState(false);
  const [clientPreviewIcon, setClientPreviewIcon] = useState(false);


  const navigate = useNavigate();
  let phrase = "";
  useEffect(() => {
    let user = localStorage.getItem("ExistUqId");
    let digiokid = localStorage.getItem("KidID");
    let digiomobile = localStorage.getItem("identifier_mobile");
    let checkTelecaller = localStorage.getItem("telecaller");

    if (digiokid != null && digiomobile != null && checkTelecaller === "no") {
      DigioDocUpload();
      uploaddocument();
      getAllDocoment();
    }
  }, []);
  useEffect(() => {
    const DiglockerFlag = localStorage.getItem("DigiLockerActive");
    const PhotographFlag = localStorage.getItem("Photographuploaded");
    if (localStorage.getItem("DigiLockerActive") == "1") {
      localStorage.setItem("DigiActive", "1");
    }
    if (localStorage.getItem("DigiLockerActive") == "0") {
      localStorage.setItem("DigiActive", "0");
    }
    let checkTelecaller = localStorage.getItem("telecaller");
    if (
      DiglockerFlag == "1" &&
      PhotographFlag != "1" &&
      checkTelecaller === "no"
    ) {
      localStorage.removeItem("DigiLockerActive");
      docUploadwithDigiLocker();
      DigiLockerLogger();
    }
  }, []);

  useEffect(() => {
    let user = localStorage.getItem("ExistUqId");
    if (user === null || user === "" || user === "null") {
      window.location.replace(window.origin);
    }
  }, []);

  useEffect(() => {
    sendToCleverTap("BFSL_APPLICATION_VIEWED", {
      EP_PAGE_NAME: "SELFIE UPLOAD PAGE",
    });
    ResumeClient();
    getAllDocoment();
  }, []);

  const uploaddocument = async () => {
    let digiokid = localStorage.getItem("KidID");
    let digiomobile = localStorage.getItem("identifier_mobile");
    let checkTelecaller = localStorage.getItem("telecaller");
    if (digiokid != null && digiomobile != null && checkTelecaller === "no") {
      DigioDocUpload();
    }
  };

  const DigioDocUpload = async () => {
    setLoading(true);
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
      // const RefNo = localStorage.getItem("refId");
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
      if (
        response.data.Status == "SUCCESS" &&
        response.data.Response == "Selfie uploaded successfully"
      ) {
        localStorage.removeItem("DigiLockerActive");
        localStorage.removeItem("KidID");
        localStorage.removeItem("Digioupdate");
        getAllDocoment();
        window.location.refresh();
      }
    } catch (err) {

    } finally {
      setLoading(false);
    }
  };

  const getAllDocoment = async (valid = false) => {
    setLoading(true);
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
          if (docName === "PDF-PHOTO" && data[i].fileName!='') {
            let UrlStatus = await checkUrlValid(data[i].fileName);
            console.log(UrlStatus);
            if (!UrlStatus) {
              console.log("url error");
              continue
            }
            localStorage.setItem("Photographuploaded", "1");
            localStorage.setItem("PhotoGuid", data[i].docGuiId);
            setResumeSelfie(true);
            setDownloadPhoto(data[i].fileName);
            if (localStorage.getItem("telecaller") === "yes") {
              if (valid) {
                setDeletePhoto(data[i].docName);
                setTelePreviewIcon(true);
              } else {
                setDeletePhoto(data[i].docName);
                setTelePreviewIcon(true);

                let Front = $(".upload-img")[0];
                $(Front).find(".first-view").css("display", "none");
                let Imagetype = getUrlExtension(data[i].fileName);
                if (Imagetype === "pdf") {
                  // setPdf preview for frontPArt
                  setTelePreview(true);

                  setTeleUrl(data[i]["fileName"]);
                } else {
                  // setNormal Image Show
                  setTelePreview(false);
                  setTeleUrl("");
                  $(Front).find(".demo").attr("src", data[i]["fileName"]);
                }
                $(Front).find(".demo").css("width", "213px");
                $(Front).find(".demo").css("height", "116px");
                $(Front).find(".demo").css("object-fit", "content");
                $(Front).find(".second-view").css("display", "block");
                $(Front).find(".input-img ").removeAttr("required");
                $(Front).find(".img-status").css("display", "none");
              }
            } else {
              if (valid) {
                setDeletePhoto(data[i].docName);
                setClientPreviewIcon(true);
              } else {
                setDeletePhoto(data[i].docName);
                setClientPreviewIcon(true);

                let Front = $(".selfie-img")[0];
                $(Front).find(".first-view").css("display", "none");
                let Imagetype = getUrlExtension(data[i].fileName);
                if (Imagetype === "pdf") {
                  // setPdf preview for frontPArt
                  setClientPreview(true);
                  setClientUrl(data[i]["fileName"]);
                } else {
                  // setNormal Image Show
                  setClientPreview(false);
                  setClientUrl("");
                  $(Front).find(".demo").attr("src", data[i]["fileName"]);
                }
                $(Front).find(".demo").css("width", "213px");
                $(Front).find(".demo").css("height", "116px");
                $(Front).find(".demo").css("object-fit", "content");
                $(Front).find(".second-view").css("display", "block");
              }
            }
          }
        }
      }
    } catch (err) {
      throw new Error(err.message)

    } finally {
      setLoading(false);
    }
  };
  const selfieCapture = (e) => {
    e.preventDefault();
    setLoading(true);
    if (resumeSelfie == true) {
      getAllMergePDF();
    } else if (resumeSelfie == false) {
      if (selfie) {
        getAllMergePDF();
      } else {
        setLoading(false);
        toast.error("Please upload Photograph");
      }
    }
  };
  const getAllMergePDF = async () => {
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "SELFIE UPLOAD PAGE​",
      EP_UPLOAD_FRONT_SIDE: "YES",
      EP_CTA: "PROCEED TO E-SIGN",
    });

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
    const source = process.env.REACT_APP_DIGIO_SOURCE

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
        EsignLogger();
        window.location.replace(SERVICES.DIGIESIGNURL + "?unid=" + UQID + "&source=" + source);
      } else {
        toast.error(request.data.Response);
      }
    } catch (err) {
      throw new Error(err.message)

    } finally {
      setLoading(false);
    }
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
      throw new Error(err.message)

    }
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
      throw new Error(err.message)

    } finally {
      setLoading(false);
    }
  };

  const takePhoto = (e) => {
    e.preventDefault();
    console.log(localStorage.getItem("DigiActive"));
    localStorage.setItem("DigiActive", "1");
    if (localStorage.getItem("DigiActive") == "1") {
      docUploadwithDigiLocker();
      DigiLockerLogger();
    }
  };

  const docUploadwithDigiLocker = async () => {
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "SELFIE UPLOAD PAGE",
      EP_UPLOAD_FRONT_SIDE: "YES",
    });

    setLoading(true);
    console.log(process.env.REACT_APP_DIGIOLOCKER_URL);
    localStorage.setItem("DigiActive", "1");
    try {
      const response = await axios.post(
        SERVICES.DigioInitializer,
        // process.env.REACT_APP_DIGIOLOCKER_URL,
        {
          emailId: "",
          mobileNo:
            clientData?.AccountOpeningRes?.Mobile ||
            localStorage.getItem("mobile"),
          status: localStorage.getItem("DigiActive"),
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.removeItem("DigiLockerActive");
      localStorage.setItem("KidID", response.data.Response.id);
      localStorage.setItem(
        "identifier_mobile",
        response.data.Response.customer_identifier
      );

      setLoading(false);
      const kid = response.data.Response.id;
      const identifier = response.data.Response.customer_identifier;
      const source = process.env.REACT_APP_DIGIO_SOURCE;
      const sourceapp = process.env.REACT_APP_DIGIO_SOURCEAPP;
      const digioUrl = SERVICES.DIGIOKID;
      localStorage.removeItem("DigiLockerActive");
      window.location.replace(
        digioUrl +
        kid +
        "&customer_identifier=" +
        identifier +
        "&source=" +
        source +
        "&sourceapp=" +
        sourceapp
      );
    } catch (err) {
      setLoading(false);
      throw new Error(err.message)

    }
  };

  const downloadInput = (e) => {
    e.preventDefault();
    downloadPDF(downloadPhoto, "Selfie_Document");
    // try {
    //   let firstName = clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    //   let Pan = clientData?.AccountOpeningRes?.Pan;
    //   let Mobile = clientData?.AccountOpeningRes?.Mobile;
    //   const phrase = `${firstName}_${Pan}_${Mobile}` || localStorage.getItem("PhraseName");
    //   const RefNo = clientData?.FlagRes?.Id || localStorage.getItem("refId");
    //   const downloadPhoto = localStorage.getItem("PhotoGuid");
    //   window.open(SERVICES.PDFDOWNLOADNEW + "/" + downloadPhoto);
    // } catch (err) {
    // }
  };
  const deleteInput = async (e) => {
    let firstName =
      clientData?.PersonalDetailsRes?.FirstName.split(" ").join("");
    let Pan = clientData?.AccountOpeningRes?.Pan;
    let Mobile = clientData?.AccountOpeningRes?.Mobile;
    // const phrase = `${firstName}_${Pan}_${Mobile}` || localStorage.getItem("PhraseName");
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
          docName: deletePhoto,
        },

        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.Response == "Document deleted successfully") {
        setSelfie(false);
        setResumeSelfie(false);
        setClientPreview(false);
        setTelePreview(false);
        setClientUrl(false);
        setTeleUrl(false);
        setDeletePhoto("");
        setClientPreviewIcon(false);
        setTelePreviewIcon(false);
        if (localStorage.getItem("telecaller") === "yes") {
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
        } else {
          let Front = $(".selfie-img")[0];
          $(Front).find(".first-view").css("display", "block");
          $(Front).find(".demo").attr("src", "");
          $(Front).find(".second-view").css("display", "none");
        }
        setResumeSelfie(false);
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };
  const deleteDoc = (e) => {
    e.preventDefault();
    deleteInput(e);
  };

  const fileValidation = (e, selected, desc) => {
    // AF_EventTriggered("selfie-upload", "selfie-upload", {
    //   onclick: "selfie-upload",
    // });
    ME_EventTriggered("selfie", `${selected}`)
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
      // $(preview).attr("src", pdficon);
      // $(preview).css("width", "60px");
      // $(preview).css("height", "100px");
      // $(preview).css("object-fit", "content");
      // $(first).css("display", "none");
      // $(second).css("display", "flex");
      // uploadFile(e, selected, desc);
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
  const uploadFile = async (e, value, data) => {
    let parent = $($(e.target).parent().closest(".upload-front-side"));
    let second = $(parent).find(".second-view")[0];
    let progress = $(second).find(".current")[0];
    let dataShow = $(second).find(".byte")[0];
    let flag = $(second).find(".flag")[0];

    const formData = new FormData();
    const imagefile = e.target;
    const UQID =
      localStorage.getItem("ExistUqId") ?? localStorage.getItem("UserUqID");
    const REFID =
      localStorage.getItem("refId") ?? localStorage.getItem("UserRefID");
    formData.append("Image", imagefile.files[0]);
    formData.append("RefId", REFID);
    formData.append("DocDef", data);
    formData.append("DocDesc", value);
    formData.append("UqId", UQID);
    const Phrase = localStorage.getItem("PhraseName").replace(".", " ", "_");
    formData.append("pdfname", Phrase + "_" + "Photograph");
    var ajax = new XMLHttpRequest();
    const progressHandler = (event) => {
      $(dataShow).html(
        `<span className="upload-data">${event.loaded.formatBytes()}</span> of  <span className="total-data">${event.total.formatBytes()}</span>`
      );
      var percent = (event.loaded / event.total) * 100;

      $(progress).css("width", `${percent.toFixed(0)}%`);
      $(flag).html(`Uploading`);
    };
    const completeHandler = () => {
      $(flag).html(`Completed`);
      setSelfie(true);
      setResumeSelfie(true);
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
          setDownloadPhoto(request.Response.DocumentUrl);
          getAllDocoment(true);
          ResumeClient();
          localStorage.setItem("PhotoGuid", request.Response.docId);
        } else {
          toast.error("Couldn't upload file, please try again!");
        }
      }
    };
  };

  const navBack = () => {
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "SELFIE UPLOAD PAGE",
      EP_UPLOAD_FRONT_SIDE: "YES",
      EP_CTA: "BACK",
    });

    // pauseAudio();
    // navigate(`/fno`);
   //debugger
    let fno = clientData?.FlagRes?.Fno || localStorage.getItem("fno");
    let IMPS = clientData?.FlagRes?.Imps || localStorage.getItem("ifscflag");
    if (fno == "True" || fno == "true" || fno == true) {
      pauseAudio();
      navigate(`/fno`);
    }
    else if ((fno == "False" || fno == "false" || fno == "False") && (IMPS == "0")) {
      pauseAudio();
      navigate(`/check-upload`);
    } else {
      playAudio(17);
      navigate(`/signature-upload`);
    }
    // if (localStorage.getItem("telecaller") === "yes") {
    //   navigate(`/ipvrecord`);
    // } else {
    // navigate(`/fno`);
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
      console.log(resumeResp, "resumeResp")
      if (resumeResp.Response) {
        setClientData(resumeResp.Response);
        localStorage.setItem("Pan", resumeResp.Response.AccountOpeningRes.Pan)
      }

      if (localStorage.getItem("telecaller") == "yes") {
        if (resumeResp.Response.FlagRes.liveSelfie === true) {
          console.log("hello");
          // setTeleIPVBtn(true)
          setESignBtn(true);
          setTeleIPVBtn(false);
        } else {
          // setTeleIPVBtn(true)
          setESignBtn(false);
          setTeleIPVBtn(true);
        }
      } else {
        setESignBtn(true);
        setTeleIPVBtn(false);
      }
      // if (localStorage.getItem("telecaller") == "yes" && response.data.Response.FlagRes.liveSelfie === false) {
      //   setTeleIPVBtn(true)
      // } else {
      //   setTeleIPVBtn(false)
      // }
    } catch (err) {
      throw new Error(err.message)

    }
  };
  const IPVNavigate = (e) => {
    e.preventDefault();
    if (resumeSelfie) {
      navigate("/ipvrecord");
    } else {
      toast.error("Please upload Photograph");
    }
  };

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
          <section className="selfie-upload">
            <Container>
              <Row>
                <Col lg={8} col={12} className="position-relative">
                  <a className="back-button" onClick={navBack}>
                    <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                  </a>
                  <h2 className="page-title">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .AHA_LETS_SELFIE
                    }
                  </h2>
                  <p className="page-subtitle">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .STRESS_LESS
                    }
                  </p>
                  <div className="step-tip-wrapper">
                    <div className="form-tip form-tip-mobile">
                      <Link
                        className="form-tip-label"
                        onClick={() => {
                          setselfieModalShow(true);
                          sendToCleverTap("BFSL_APPLICATION_VIEWED", {
                            EP_PAGE_NAME: "SELFIE UPLOAD GUIDELINES​​",
                            EP_CTA: "HOW TO UPLOAD SELFIE MODAL",
                          });
                        }}
                        to
                        role="button"
                      >
                        <img src={Bulb_icon} alt="bulb-suggest" />

                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].HOW_CLICK_SELFIE
                        }
                      </Link>
                    </div>
                  </div>
                  <form>
                    <Row className="upload-points-section">
                      <Col className="col-12 col-lg-5">
                        {localStorage.getItem("telecaller") === "yes" ? (
                          <div className="upload-front-side upload-img">
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
                                      fileValidation(
                                        e,
                                        "Photograph",
                                        "Photograph"
                                      );
                                    }}
                                    className="input-img  w-100"
                                  />
                                </div>
                              </div>
                              <div className="text">
                                <p>Upload Front Side Photo</p>
                              </div>
                            </div>
                            <div className="second-view">
                              <div className="second-view-status">
                                <p className="upload-msg">
                                  Uploaded Successfully
                                </p>
                                {telePreviewIcon ? (
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
                                {telePreview ? (
                                  <div>
                                    <PDFViewer src={teleUrl} />
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
                                  <p className="byte">
                                    <span className="upload-data"></span> of
                                    <span className="total-data"></span>
                                  </p>
                                  <p className="flag"></p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="upload-front-side selfie-img">
                            <div className="first-view  p-0">
                              <canvas
                                className="video-feed img-fluid"
                                ref={photoRef}
                              />

                              <p className="selfi-text text-center">
                                Upload Selfie
                                <img className="p-1" src={refresh} alt="" />
                              </p>

                              <div className="photo-captured" ref={stripRef} />
                              <button
                                className="capture-btn"
                                onClick={takePhoto}
                              >
                                <img
                                  src={Camera_icon}
                                  alt="camera"
                                  className="camera-img mb-0"
                                />
                                <span
                                  className="d-none"
                                  style={{
                                    minwidth: "75px",
                                    color:
                                      buttonText == "capture"
                                        ? "white"
                                        : "#b1b1b1",
                                  }}
                                >
                                  {buttonText}
                                </span>
                              </button>
                            </div>
                            <div className="second-view w-100">
                              <div className="second-view-status">
                                <p className="upload-msg">
                                  Uploaded Successfully
                                </p>
                                {clientPreviewIcon ? (
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
                                {clientPreview ? (
                                  <div>
                                    <PDFViewer src={clientUrl} />
                                  </div>
                                ) : (
                                  <img src="" className="demo" alt="" />
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Col>
                      <Col col={12} md={8} xl={6} className="points-content">
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
                                ].DO_NOT_COVER_UR_FACE
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
                                ].CLICK_FORWARD_PICTURE
                              }
                            </p>
                          </li>
                        </ul>
                      </Col>
                      <Col col={10} sm={6} xl={5}>
                        <div className="scan-upload-photo">
                          <p>
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].CAN_NOT_SCAN
                            }
                          </p>
                          <p>
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].RIGHT_CLICK
                            }
                          </p>
                        </div>
                      </Col>
                    </Row>
                    {teleIPVBtn && (
                      <button onClick={IPVNavigate} className="common-btn" disabled={!resumeSelfie}>
                        Proceed to IPV Upload
                      </button>
                    )}
                    {eSignBtn && (
                      <button onClick={selfieCapture} className="common-btn"  disabled={!resumeSelfie}>
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].ESIGNSUBMIT
                        }
                      </button>
                    )}

                    <div className="form-tip selfie-top">
                      <Link
                        className="form-tip-label"
                        onClick={() => {
                          setselfieModalShow(true);
                          sendToCleverTap("BFSL_APPLICATION_VIEWED", {
                            EP_PAGE_NAME: "SELFIE UPLOAD GUIDELINES",
                            EP_CTA: "HOW TO UPLOAD SELFIE MODAL",
                          });
                        }}
                        to
                        role="button"
                      >
                        <img src={Bulb_icon} alt="bulb-suggest" />
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].HOW_CLICK_SELFIE
                        }
                      </Link>
                    </div>
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
                              ].FIRST_SELFIE_WAS_TAKEN
                            }
                          </p>
                        </>
                      }
                      link={
                        <span>
                          Source <span className="chat-link-divider">:</span>
                          <span>
                            <a
                              href=" https://www.smithsonianmag.com/smart-news/this-is-the-first-selfie-ever-180948114/#:~:text=In%201839%2C%20says%20the%20Public,the%20family%20store%20in%20Philadelphia.  "
                              target="_blank"
                            >
                              Smithsonian magazine
                            </a>
                          </span>
                        </span>
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
        show={selfiemodalShow}
        onHide={() => setselfieModalShow(false)}
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
            setselfieModalShow(false);
            sendToCleverTap("BFSL_APPLICATION_VIEWED", {
              EP_PAGE_NAME: "SELFIE UPLOAD GUIDELINES",
              EP_CTA: "CLOSE",
            });
          }}
        >
          <svg class="new-icon new-icon-close"><use href="#new-icon-close"></use></svg>
        </div>
        <Modal.Body>
          <div>
            <h3 className="modal-title">how to take the selfie</h3>
            <Row>
              <Col xs={6} sm={5} className="d-none d-sm-block">
                <div className="modal-left">
                  <img
                    src={selfie_tip_img}
                    alt="selfie-img"
                    className="modal-img"
                  />
                  <p className="img-note">
                    Use on-screen guid to frame your face in selfie photograph
                  </p>
                </div>
              </Col>
              <Col xs={12} sm={6} className="ml-auto">
                <Row className="correction-img">
                  <Col xs={6} className="d-block d-sm-none">
                    <img
                      src={selfie_tip_img}
                      alt="selfie-img"
                      className="modal-img"
                    />
                    <p className="img-note">
                      Use on-screen guid to frame your face in selfie photograph
                    </p>
                  </Col>
                  <div className="col-6">
                    <img
                      src={selfie_tip_second}
                      alt="selfie-img"
                      className="modal-img"
                    />
                    <p className="img-note">
                      make sure the selfie will not be blur
                    </p>
                  </div>
                  <div className="col-6">
                    <img
                      src={selfie_tip_third}
                      alt="selfie-img"
                      className="modal-img"
                    />
                    <p className="img-note">
                      make sure your whole face captured in camera
                    </p>
                  </div>
                  <div className="col-6 ml-auto">
                    <img
                      src={selfie_tip_fourth}
                      alt="selfie-img"
                      className="modal-img"
                    />
                    <p className="img-note">
                      please remove any eyewear and make sure your face is not
                      covered.
                    </p>
                  </div>
                </Row>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SelfieUpload;