import React, { useEffect, useRef } from "react";
import pancard_demo from "../assets/images/pan-card-image.png";
import { Container, Row, Col, Modal } from "react-bootstrap";
import ChatCard from "../components/ChatCard";
import bulb_icon from "../assets/images/gif/bulb-suggest.gif";
import pan_card_modal_img from "../assets/images/pancard-img.jpg";
import pan_card_second from "../assets/images/pancard-second.png";
import pan_card_third from "../assets/images/pancard-third.png";
import pan_card_fourth from "../assets/images/pancard-fourth.png";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import userBottomImg from "../assets/images/person-images/pancard.png";
import BottomList from "../components/BottomList";
import UploadIcon from "../assets/images/upload-icon.svg";
import $ from "jquery";
// import pdficon from "../assets/images/pdficon.png";
import { useState } from "react";
import { dobVal } from "../Validation.js";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import { SERVICES } from "../common/constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSpeechRecognition } from "react-speech-kit";
import {
  playAudio,
  validatePan,
  pauseAudio,
  getSearchParameters,
  getUrlExtension,
  dateInput,
  sendToCleverTap, shareError,
  isImage,
  downloadPDF,
  nameValidation,
  ME_EventTriggered,
} from "../common/common.js";
import Language from "../common/Languages/languageContent.json";
import PDFViewer from "../common/pdfViewer";

const PanDetails = () => {
  const navigate = useNavigate();
  const [disable, setDisable] = useState(false);
  const [inValidPan, setInValidPan] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [panmanualmodalShow, setpanmanualModalShow] = useState(false);
  const [uploadguidemodalShow, setuploadguideModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [startListening, setStartListening] = useState(false);
  const [fatherNamePerPanCard, setFatherNamePerPanCard] = useState(false);
  const [focusState, setFocusState] = useState({
    fullName: false,
    fatherName: false,
  });
  const [panPreview, setPanPreview] = useState(false);
  const [panPreviewURL, setPanPreviewURL] = useState("");
  const [deletePan, setDeletePan] = useState("");
  const [downloadPan, setDownloadPan] = useState("");
  const [pageBtn, setPageBtn] = useState(false);

  const fullNameRef = useRef(null);
  const fatherNameRef = useRef(null);
  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      if (document.activeElement.getAttribute("nameattribute") === "fullName2")
        setValue("fullname", result);
      else if (
        document.activeElement.getAttribute("nameattribute") === "fatherName2"
      )
        setValue("fathername", result);
    },
  });

  useEffect(() => {
    startListening ? listen() : stop();
  }, [startListening]);

  const schema2 = yup.object().shape({
    fullname: yup.string().required("This is required"),
    fathername: yup
      .string()
      .required("This is required")
      .matches(
        /^((\b[A-Za-z]{1,40}\b)\s*){2,}$/,
        "This is not valid Father Name"
      ),
    pan: yup.string().required("This is required"),
    dob: yup.string().required("This is required"),
  });
  const getPanTele = async (number) => {
    try {
      const response = await axios.get(
        `${SERVICES.resumebymobile}?mobile=${number}`,
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.Response) {
        let DOB = response.data.Response.Dob.split(" ")[0].split("/");
        console.log(DOB, "DOB");
        const [year, month, day] = [DOB[2], DOB[0], DOB[1]]
        reset2({
          fullname: response.data.Response.Cname || "",
          fathername: response.data.Response.FatherName,
          pan: response.data.Response.Pan || "",
          dob: `${year}-${month}-${day}`
        });
        let Fullname = response.data.Response.Cname;
        if (Fullname !== "") {
          let name = Fullname.split(" ");
          if (name.length > 1) {
            localStorage.setItem(
              "FirstName",
              name[0]?.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
            );
            localStorage.setItem(
              "LastName",
              name[name.length - 1]?.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
            );
          }
        }
        localStorage.setItem("FullName", Fullname || "");
        localStorage.setItem(
          "FatherName",
          response.data.Response.FatherName || ""
        );
        localStorage.setItem("Dob", `${year}-${month}-${day}` || "");
        // localStorage.setItem("Dob", DOB.reverse().join("-") || "");
        localStorage.setItem("Pan", response.data.Response.Pan || "");
        localStorage.setItem("panId", response.data.Response.Id || "");

        setInValidPan(true);
        localStorage.setItem("telecaller", "yes");
      } else {
      }
    } catch (err) {
      setLoading(false);
      throw new Error(err.message)
    }
  };
  useEffect(() => {
    sendToCleverTap("BFSL_APPLICATION_VIEWED", {
      EP_PAGE_NAME: "DETAILS PAGE",
    });

    var params = getSearchParameters();
    console.log(params, "params");
    if (params.panvalue && params.mobilenumber_telecaller) {
      localStorage.clear()
      localStorage.setItem("audioPlayed", "played");

      localStorage.setItem("telecaller", "yes");
      localStorage.setItem("mobile", params.mobilenumber_telecaller);
      console.log(params.panvalue && params.mobilenumber_telecaller, "params");

      getPanTele(params.mobilenumber_telecaller);
    }
    setFatherNamePerPanCard(localStorage.getItem("FatherName"));
  }, []);



  useEffect(() => {

    var params = getSearchParameters();
    console.log(params, "params");
    if (params.panvalue && params.mobilenumber) {
      localStorage.clear()
      localStorage.setItem("audioPlayed", "played");
      localStorage.setItem("mobile", params.mobilenumber);
      console.log(params.panvalue && params.mobilenumber, "params");
      getPanTele(params.mobilenumber);
    }
    setFatherNamePerPanCard(localStorage.getItem("FatherName"));
  }, []);


  const onSubmitHandler = (values) => {
    // let DobStatus = shareError(values.dob, "dob-error-pan");

    ME_EventTriggered("PanDetailsManually", values)
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "DETAILS PAGE",
      EP_FULL_NAME: values.fullname,
      EP_FATHER_NAME: values.fathername,
      EP_PAN: values.pan,
      EP_DOB: values.dob,
      EP_OTP_CTA: "CONTINUE",
    });

    let DobStatus = shareError(values.dob, "dob-error-pan");

    console.log(DobStatus);
    if (DobStatus) {
      setLoading(true);
      updatepanManually(values);
    }
    // setLoading(true);
    // updatepanManually(values);
    // AF_EventTriggered("PAN Uploaded", "PAN Uploaded", {
    //   onclick: "PAN Uploaded",
    // });
  };

  const onSubmitHandler2 = (values) => {
    console.log("onSubmitHandler2", values);

    setLoading(true);
    updatepanManually(values);
    ME_EventTriggered("IdentityVerified", values)
  };

  const schema = yup.object().shape({
    fullname: yup
      .string()
      .required("This is required"),
    fathername: yup
      .string()
      .required("This is required"),
    pan: yup
      .string()
      .required("This is required")
      .matches(
        /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/,
        "This is not valid Pan Number"
      ),
    dob: dobVal,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    // setFocus,
    setValue,
  } = useForm({ resolver: yupResolver(schema) });
  const {
    handleSubmit: handleSubmit2,
    register: register2,
    formState: { errors: errors2 },
    reset: reset2,
    formState,
    setValue: setValue2,
  } = useForm({ resolver: yupResolver(schema2), mode: "onChange" });

  const updatepanManually = async (values) => {
    // leadCapture();
    // let fromatDob = values.dob.split("-").reverse().join("-");
    setPageBtn(true)
    let name = "";
    if (values.fullname.includes(" ")) {
      name = values.fullname.split(" ");
    } else {
      name = values.fullname;
    }
    try {
      const response = await axios.post(
        SERVICES.UPLOADPANMANUALY,
        {
          id: "0",
          name: values.fullname.toUpperCase(),
          fathername: values.fathername.toUpperCase(),
          pan: values.pan.toUpperCase(),
          dob: values.dob.reverseDob(),
          firstname: values.fullname.includes(" ")
            ? name[0].toUpperCase()
            : name,
          lastname: values.fullname.includes(" ")
            ? name[name.length - 1].toUpperCase()
            : "",
          DependentFName: values.fathername.toUpperCase(),
          DependentMName: "",
          DependentLName: "",
          mobile: localStorage.getItem("mobile"),
          IsPanUpdate: true,
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.Response == "PAN update successfully") {
        localStorage.setItem("FullName", values.fullname.toUpperCase());
        localStorage.setItem(
          "FirstName",
          name[0].replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
        );
        localStorage.setItem(
          "LastName",
          name[name.length - 1].replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
        );
        localStorage.setItem("FatherName", values.fathername.toUpperCase());
        // localStorage.setItem("Dob", fromatDob);
        localStorage.setItem("Pan", values.pan.toUpperCase());
        localStorage.setItem("Dob", values.dob.reverseDob());
        leadCapture();
        playAudio(7);
        navigate("/email-verification");
      }
    } catch (err) {
      console.log(err, "err");
      throw new Error(err.message)
    } finally {
      setLoading(false);
      setPageBtn(false)
    }
  };

  const deleteDoc = async (e) => {
    console.log(deletePan, "deletePan");
    e.preventDefault();

    try {
      const response = await axios.post(
        SERVICES.DELETEDOCUMENT,
        {
          id: localStorage.getItem("panId"),
          docName: deletePan,
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
        setPanPreviewURL("");
        setPanPreview(false);
        deletePreview(e);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      throw new Error(err.message)
    }
  };
  const deleteInput = (e) => {
    e.preventDefault();
    deleteDoc(e);
    ME_EventTriggered("DeletePan")
  };
  const deletePreview = (e) => {
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
  };

  const uploadFile = async (e, value, data) => {
    let parent = $($(e.target).parent().closest(".upload-front-side"));
    let second = $(parent).find(".second-view")[0];
    let progress = $(second).find(".current")[0];
    let dataShow = $(second).find(".byte")[0];
    let flag = $(second).find(".flag")[0];

    const formData = new FormData();
    const imagefile = e.target;
    const REFID = localStorage.getItem("panId");
    formData.append("Image", imagefile.files[0]);
    formData.append("RefId", REFID);
    formData.append("DocDef", data);
    formData.append("DocDesc", value);
    formData.append("UqId", "iushvcjhsluhrvleiukrhvlieur");
    formData.append(
      "pdfname",
      localStorage.getItem("FirstName") +
      "_" +
      localStorage.getItem("Pan") +
      "_" +
      localStorage.getItem("mobile") +
      "_" +
      "_" +
      data
    );
    var ajax = new XMLHttpRequest();
    const completeHandler = () => {
      $(flag).html(`Completed`);
    };
    const progressHandler = (event) => {
      $(dataShow).html(
        `<span className="upload-data">${event.loaded.formatBytes()}</span> of  <span className="total-data">${event.total.formatBytes()}</span>`
      );
      var percent = (event.loaded / event.total) * 100;
      $(progress).css("width", `${percent.toFixed(0)}%`);
      $(flag).html(`Uploading`);
    };
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.open("POST", SERVICES.UPLOADPANDOCUMENT);
    ajax.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    ajax.send(formData);
    ajax.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          const request = JSON.parse(this.responseText);
          if (request.Status === "Failed") {
            toast.error(request.Reason);
            deletePreview(e);
          } else {
            console.log(request, "request");
            setDownloadPan(request.Response)
            getPanDocoment(true);
            // localStorage.setItem("PaNGuid", request.Response.docId);
          }
          if (request.Status == "Success" && request.Response != "") {
            localStorage.setItem("PaNGuid", request.Response);
          } else {
            toast.error("Couldn't upload file, please try again!");
          }
        } else {
          toast.error("Couldn't upload file, please try again!");
        }
      }
    };
  };

  const getPanMasking = async (imgData) => {
    setModalLoading(true);
    getPanDocoment();
    try {
      const response = await axios.post(
        "https://masking.bajajfinservsecurities.in/api/PanDetails",
        {
          image: imgData,
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.Message === "Fail") {
        toast.error(
          "Uploaded Image quality is not proper, Please Enter PAN details manually."
        );
        setModalShow(false);
        setpanmanualModalShow(true);
        setInValidPan(true);
      } else {
        if (response.data.Pan_Number === localStorage.getItem("Pan")) {
          let PanData = response.data;
          let fromatDob = PanData.Date_of_Birth.split("/").reverse().join("-");
          setInValidPan(false);
          let data = {
            pan: PanData.Pan_Number,
            dob: fromatDob,
            fathername: PanData.Father_Name,
            fullname: PanData.Name,
          };

          updatepanManually(data);
        } else {
          setInValidPan(true);
          toast.error(
            "Entered PAN on registration page and uploaded PAN data is mismatched."
          );
        }
      }
    } catch (err) {
      throw new Error(err.message)
    } finally {
      setModalLoading(false);
    }
  };
  const firstName = localStorage.getItem("FirstName");
  const Mobile = localStorage.getItem("mobile");
  const Pan = localStorage.getItem("Pan");
  const phraseDownload = `${firstName}_${Pan}_${Mobile}`;
  localStorage.setItem("phraseDownload", phraseDownload);
  const phrase = localStorage.getItem("phraseDownload");
  const downloadInput = async (e) => {
    e.preventDefault();
    downloadPDF(downloadPan, "Pan_Document");

    // try {
    //   const panId = localStorage.getItem("panId");
    //   const downloadPan = localStorage.getItem("PaNGuid");
    //   window.open(SERVICES.PDFDOWNLOADNEW + "/" + downloadPan);
    // } catch (err) { }
  };

  const getPanDocoment = async (valid = false) => {
    try {
      const response = await axios.post(
        SERVICES.GETPANDOCUMENT,
        {
          docdef: "Pan_Card",
          panNo: localStorage.getItem("Pan"),
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
          if (docName === "Pan_Card") {
            if (valid) {
              setDeletePan(data[i].docName);
            } else {
              setDeletePan(data[i].docName);
              setDownloadPan(data[i].fileName)
              let Front = $(".upload-front-side")[0];
              $(Front).find(".first-view").css("display", "none");
              let Imagetype = getUrlExtension(data[i].fileName);
              if (Imagetype === "pdf") {
                setPanPreview(true);
                setPanPreviewURL(data[i]["fileName"]);
              } else {
                setPanPreview(false);
                setPanPreviewURL("");
                $(Front).find(".demo").attr("src", data[i]["fileName"]);
              }
              $(Front).find(".demo").css("width", "60px");
              $(Front).find(".demo").css("height", "100px");
              $(Front).find(".demo").css("object-fit", "content");
              $(Front).find(".second-view").css("display", "block");
              $(Front).find(".input-img ").removeAttr("required");
              $(Front).find(".img-status").css("display", "none");
              var index1 = data.findIndex((p) => p.docDef == "Pan_Card");
              if (index1) {
                localStorage.setItem("PaNGuid", data[i].docGuiId);
              }
            }
          }
        }
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };
  const fileValidation = (e, selected, desc) => {
    ME_EventTriggered("UploadPan", { selected })
    setPanPreviewURL("");
    setPanPreview(false);
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
    //   return ext.some((el) => icon.toLowerCase().endsWith(el));
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
        $(fileText).text(name);
        var reader = new FileReader();
        reader.onload = function (e) {
          var a = e.target.result.split(",");
          getPanMasking(a[1]);
          $(preview).attr("src", e.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
        uploadFile(e, selected, desc);
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
  // const nameValidation = (e) => {
  //   if (window.event) {
  //     var charCode = window.event.keyCode;
  //   }
  //   if (
  //     (charCode > 46 && charCode < 65) ||
  //     (charCode < 96 && charCode > 123) ||
  //     (charCode > 183 && charCode <= 222)
  //   ) {
  //     e.preventDefault();
  //   }
  // };
  const removePanRead = () => {
    $(document).ready(function () {
      if (localStorage.getItem("telecaller") === "yes") {
        $($(".panNum")[0]).attr("readonly", false);
      }
    });
  };

  const leadCapture = async (values) => {
    try {
      const response = await axios.post(
        SERVICES.LAEDSAVE,
        {
          leadCapture: {
            mobile: localStorage.getItem("mobile"),
            pan: localStorage.getItem("Pan"),
            source: "EKYCWEBSITE",
            utmSource: localStorage.getItem("source"),
            utmCampaign: localStorage.getItem("campaign"),
            utmMedium: localStorage.getItem("medium"),
            ipaddress: localStorage.getItem("IpAddress"),
            utmTerm: "ekyc",
            Longitude: localStorage.getItem("Longitude") || "",
            Latitude: localStorage.getItem("Latitude") || "",
            termContent: localStorage.getItem("terms") || "",
            fatherName: localStorage.getItem("FatherName") || "",
            dob: localStorage.getItem("Dob") || "",
            fullname: localStorage.getItem("FullName") || "",
            email: "",
            screen: 3,
            referal: localStorage.getItem("referralCode")
          },
          screenType: 1,
        },
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("leadCaptureId", response.data.Response.Id);
    } catch (err) {
      setLoading(false);
      throw new Error(err.message)
    }
  };

  // var str = " Big";
  // var regexp = /[a-zA-Z]+\s+[a-zA-Z]+/g;
  // if (regexp.test(str)) {
  //   console.log("at least two word")
  //     // at least 2 words consisting of letters
  // }else{
  //   console.log("not two word ")
  // }

  useEffect(() => {
    reset({
      fullname: localStorage.getItem("FullName").replace(".","")
        ? localStorage.getItem("FullName")?.trim() : "", fathername: localStorage.getItem("FatherName")?.trim(), pan: localStorage.getItem("Pan")
          ? localStorage.getItem("Pan")
          : "", dob: localStorage.getItem("Dob")
            ? localStorage.getItem("Dob").reverseDob() : ""
    })
     console.log(localStorage.getItem("FatherName"));
    let KrsStatus = localStorage.getItem("KraStatus")?.trim();
    if (KrsStatus == "true" && localStorage.getItem("FatherName") != '') {
      setDisable(true);
    } else {
      setDisable(false);
    }

    // setFocus("fathername")
    // document.getElementById("fatherName").focus()

  }, [])

  const doubleNameSet = (name) => {
    let regexp = /[a-zA-Z]+\s+[a-zA-Z]+/g;
    if (!name) {
      return "";
    }
    if (regexp.test(name)) {
      return name.trim()
      // at least 2 words consisting of letters
    } else {
      return "";
    }
  }

  return (
    <>
      <div className={`${loading ? "loader" : " "}`}>
        {loading && <img src={bajaj_loaderimg} className="loader-img" />}
        <main className="main-content pan-details">
          <Container>
            <Row>
              <Col md={8}>
                <div className="page-left viewHeight">
                  <a
                    role="button"
                    onClick={() => {
                      sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                        EP_PAGE_NAME: "DETAILS PAGE",
                        EP_FULL_NAME:  localStorage.getItem("FullName")? localStorage.getItem("FullName")?.trim() : "",
                        EP_FATHER_NAME: localStorage.getItem("FatherName")? localStorage.getItem("FatherName")?.trim(): "",
                        EP_PAN:  localStorage.getItem("Pan")? localStorage.getItem("Pan")?.trim(): "",
                        EP_DOB: localStorage.getItem("Dob")? localStorage.getItem("Dob").reverseDob() : "",
                        EP_CTA: "BACK",
                      });
                      navigate("/pan-page");
                      pauseAudio();
                    }}
                    className="back-button"
                  >
                    <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                  </a>
                  <h2 className="page-title">
                    {localStorage.getItem("FullName") ? (
                      <>{`Hi ${localStorage
                        .getItem("FullName")
                        .toUpperCase()}`}</>
                    ) : (
                      <>{"Hi Customer"}</>
                    )}
                    , Is this You?
                  </h2>
                  <h3 className="page-subtitle">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .WE_UR_DETAILS
                    }
                  </h3>


                  <form
                    className="page-form landing-form"
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmitHandler)}
                  >
                    <div className="row">
                      <div className="col-md-6 mb-1">
                        <div className="form-group custom-suggest" ref={fullNameRef}>
                          <input
                            type="text"
                            name="fullname"
                            nameattribute="fullName2"
                            // onFocus={() =>
                            //   setFocusState({
                            //     fullName: true,
                            //   })
                            // }
                            // onBlur={() => {
                            //   setFocusState({
                            //     fullName: false,
                            //   });
                            //   setStartListening(false);
                            // }}
                            // defaultValue={
                            //   localStorage.getItem("FullName")
                            //     ? localStorage.getItem("FullName")
                            //     : ""
                            // }
                            // onKeyPress={(e) => nameValidation(e)}
                            onInput={(e) => nameValidation(e)}
                            readOnly={(localStorage.getItem("FullName").replace(".","") && localStorage.getItem("FullName").replace(".","") !== "") ? true : false}
                            maxLength={100}
                            className={`form-control  text-uppercase has-value panName ${localStorage.getItem("FullName") ? "has-value" : ""
                              }   ${errors.fullname ? "is-invalid" : ""}`}
                            {...register("fullname", {
                              onBlur: (e) =>
                                ME_EventTriggered("PersonalInformationEntered", { "Full Name": e.target.value })
                            })}
                          />
                          <label className="form-label">
                            {
                              Language[localStorage.getItem("language") || "English"]
                                .FULLNAME
                            }

                            <span className="label-required"> *</span>
                          </label>
                          {/* {focusState.fullName && (
                    <i
                      className={
                        startListening
                          ? "icon-Unmute listen-mic"
                          : "icon-Mute listen-mic"
                      }
                      onClick={() => {
                        !startListening
                          ? setStartListening(true)
                          : setStartListening(false);
                        fullNameRef.current.children[0].focus();
                      }}
                    />
                  )} */}
                          <div className="invalid-feedback">
                            {errors.fullname?.message}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-1">
                        <div className="form-group custom-suggest" ref={fatherNameRef}>
                          <input
                            maxLength={100}
                            type="text"
                            name="fathername"
                            nameattribute="fatherName2"
                            id="fatherName"
                            disabled={disable}
                            onFocus={() =>
                              setFocusState({
                                fatherName: true,
                              })
                            }
                            autoFocus={true}
                            onBlur={() => {
                              setFocusState({
                                fatherName: false,
                              });
                              setStartListening(false);
                            }}
                            // onKeyPress={(e) => nameValidation(e)}
                            onInput={(e) => nameValidation(e)}
                            className={`form-control text-uppercase has-value panFName ${localStorage.getItem("FatherName") ? "has-value" : ""
                              }  ${errors.fathername ? "is-invalid" : ""}`}
                            {...register("fathername", {
                              onBlur: (e) =>
                                ME_EventTriggered("PersonalInformationEntered", { "fathername": e.target.value })
                            })}
                          />
                          <label className="form-label">
                            {
                              Language[localStorage.getItem("language") || "English"]
                                .FATHERNAME
                            }

                            <span className="label-required"> *</span>
                          </label>
                          {focusState.fatherName && (
                            <i
                              className={
                                startListening
                                  ? "icon-Unmute listen-mic"
                                  : "icon-Mute listen-mic"
                              }
                              onClick={() => {
                                !startListening
                                  ? setStartListening(true)
                                  : setStartListening(false);
                                fatherNameRef.current.children[0].focus();
                              }}
                            />
                          )}
                          <div className="invalid-feedback">
                            {errors.fathername?.message}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-1">
                        <div className="form-group custom-suggest">
                          <input
                            type="text"
                            name="pan"
                            // defaultValue={
                            //   localStorage.getItem("Pan")
                            //     ? localStorage.getItem("Pan")
                            //     : ""
                            // }
                            onKeyPress={(e) => validatePan(e)}
                            className={`has-value form-control text-uppercase panNum ${errors.pan ? "is-invalid" : ""
                              }`}
                            {...register("pan", {
                              onBlur: (e) =>
                                ME_EventTriggered("PersonalInformationEntered", { "pan": e.target.value })
                            })}
                            readOnly
                          />
                          <label className="form-label">
                            {
                              Language[localStorage.getItem("language") || "English"]
                                .PAN
                            }
                            <span className="label-required"> *</span>
                          </label>
                          <div className="invalid-feedback">{errors.pan?.message}</div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-1">
                        <div className="form-group">
                          <input
                            type="text"
                            id="datepicker"
                            placeholder="DD-MM-YYYY"
                            autoComplete="off"
                            // onFocus={(e) => (e.target.type = "date")}
                            name="dob"
                            readOnly
                            // defaultValue={
                            //   localStorage.getItem("Dob")
                            //     ? localStorage.getItem("Dob").reverseDob() : ""
                            // }
                            className={`form-control panDob has-value ${localStorage.getItem("Dob") ? "has-value" : ""
                              }  ${errors.dob ? "is-invalid" : ""}`}
                            onInput={dateInput}
                            maxLength={10}
                            {...register("dob", {
                              onChange: (e) =>
                                shareError(e.target.value, "dob-error-pan"),
                              onBlur: (e) =>
                                ME_EventTriggered("PersonalInformationEntered", { "dob": e.target.value })
                            })}
                          />
                          <label className="form-label">
                            {
                              Language[localStorage.getItem("language") || "English"]
                                .DOB
                            }
                            <span className="label-required"> *</span>
                          </label>
                          <div className="invalid-feedback">{errors.dob?.message}</div>
                          <div className="invalid-feedback dob-error-pan"></div>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <button type="submit" className="otp-btn " disabled={pageBtn}>
                          CONTINUE
                        </button>
                        {/* <div className="form-group mr-0 mb-0"> */}
                        {/* <button type="submit" name="submit" className="otp-btn ">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .SUBMIT
                    }
                  </button> */}
                        {/* </div> */}
                      </div>

                    </div>


                  </form>


                  {/* Datta comment for PAN PAGE Development @25-07-2023 start */}
                  {/* <div className="pan-fetch-detail">
                    <img src={pancard_demo} alt="" className="pan-demo" />
                    <div className="pan-form">
                      <form>
                        <div className="form-group">
                          <label>
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].FULLNAME
                            }
                          </label>
                          <input
                            type="text"
                            name="fullname"
                            maxLength={100}
                            value={
                              localStorage.getItem("FullName")
                                ? localStorage.getItem("FullName")
                                : ""
                            }
                            placeholder="Not Available"
                            {...register2("fullname")}
                            className={`form-control text-uppercase ${errors2?.fullname ? "is-invalid" : ""
                              }`}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].FATHERNAME
                            }
                            <span className="label-required">*</span>
                          </label>
                          <input
                            type="text"
                            name="fathername"
                            maxLength={100}
                            value={
                              localStorage.getItem("FatherName")
                                ? localStorage
                                  .getItem("FatherName")
                                  .toUpperCase()
                                : ""
                            }
                            placeholder="Not Available"
                            {...register2("fathername")}
                            className={`form-control text-uppercase ${errors2?.fathername ? "is-invalid" : ""
                              }`}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].DOB
                            }
                            <span className="label-required">*</span>
                          </label>
                          <input
                            type="date"
                            name="dob"
                            placeholder="DD-MM-YYYY"
                            value={
                              localStorage.getItem("Dob")
                                ? localStorage.getItem("Dob")
                                : ""
                            }
                            className={`form-control  ${errors2?.dob ? "is-invalid" : ""
                              }`}
                            {...register2("dob")}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].PERMANENT_ACC_NUM
                            }
                          </label>
                          <input
                            type="text"
                            name="pan"
                            value={localStorage.getItem("Pan") || ""}
                            placeholder="Not Available"
                            {...register2("pan")}
                            className={`form-control text-uppercase  ${errors2?.pan ? "is-invalid" : ""
                              }`}
                            readOnly
                          />
                        </div>
                      </form>
                    </div>
                  </div> */}
                  {/* Datta comment for PAN PAGE Development @25-07-2023 end */}
                  {/* {!formState.isValid && (
                    <div className={"pb-4 text-danger"}>
                      We experienced issues in fetching your complete details from PAN site, Kindly
                      proceed with "No, its Not Me" to upload it manually.
                    </div>
                  )} */}
                  {/* <div className="page-left-btn">
                    <button
                      onClick={handleSubmit2(onSubmitHandler2)}
                      className="common-btn"
                      type="submit"
                      disabled={!formState.isValid}
                    >
                      <i className="icon-tick" />

                      {
                        Language[localStorage.getItem("language") || "English"]
                          .YES_IT_ME
                      }
                    </button>
                    <button
                      className="secondary-btn"
                      disabled={!localStorage.getItem("Pan")}
                      onClick={() => {
                        ME_EventTriggered("IdentityNotVerified",)
                        getPanDocoment();
                        playAudio(5);
                        setModalShow(true);
                        sendToCleverTap("BFSL_APPLICATION_VIEWED", {
                          EP_PAGE_NAME: "PAN CARD VERIFICATION",
                          EP_CTA: "NO,IT’S NOT ME",
                        });
                      }}
                    >
                      <i className="icon-close" aria-hidden="true" />{" "}
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .NO_IT_ME
                      }
                    </button>
                  </div> */}
                  <BottomList />
                </div>
              </Col>
              <Col className="position-inherit" md={4}>
                <div className="d-flex flex-column h-100">
                  <ChatCard
                    chatSubtitle={
                      <>
                        <p>
                          More than 61 Cr. Indians have a PAN card but only around 13 Cr. are Demat Account holders.
                        </p>
                        <p>
                          SEBI and Govt. of India has made PAN card mandatory
                          for Investing and Trading.
                        </p>
                      </>
                    }
                  />
                  <div className="user-bottom-img ">
                    <img src={userBottomImg} alt="person icon" />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </main>

        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          className={`pan-detailModal ${modalLoading ? "modal-loader" : ""}`}
          centered
          backdrop="static"
          keyboard={false}
          id="pan-upload-file"
        >
          {modalLoading && (
            <img src={bajaj_loaderimg} className="modal-loader-img" />
          )}
          <div className="close" onClick={() => setModalShow(false)}>
            {/* <i className="icon-close" /> */}
            <svg class="new-icon new-icon-close">
              <use href="#new-icon-close"></use>
            </svg>
          </div>
          <Modal.Body>
            <div>
              <h3 className="modal-title">
                {
                  Language[localStorage.getItem("language") || "English"]
                    .TAKE_A_PICTURE
                }
              </h3>
              <h4 className="modal-subtitle">
                {
                  Language[localStorage.getItem("language") || "English"]
                    .ENSURE_PAN_SIGNATURE
                }
              </h4>
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
                        Language[localStorage.getItem("language") || "English"]
                          .UPLOAD_FRONT_SIDE
                      }
                    </p>
                  </div>
                  <div></div>
                </div>
                <div className="second-view">
                  <div className="second-view-status">
                    <p className="upload-msg">Uploaded Successfully</p>
                    <div className="second-view-icons">
                      <button
                        className="edit delete-input"
                        onClick={(e) => {
                          deleteInput(e);
                        }}
                      >
                        <i className="icon-delete" />
                      </button>
                      <button
                        className="edit resize"
                        onClick={(e) => {
                          downloadInput(e);
                        }}
                      >
                        <i className="icon-download" />
                      </button>
                    </div>
                  </div>
                  <div className="preview-img">
                    {panPreview ? (
                      <div>
                        <PDFViewer src={panPreviewURL} />
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

              <div className="modal-suggest">
                <img src={bulb_icon} alt="" />
                <a
                  className="form-tip-label"
                  role="button"
                  onClick={() => {
                    playAudio(6);
                    setuploadguideModalShow(true);
                    setModalShow(false);
                    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                      EP_PAGE_NAME: "PAN UPLOAD PHOTO",
                      EP_OTP_CTA: "OPEN",
                    });
                  }}
                >
                  {
                    Language[localStorage.getItem("language") || "English"]
                      .HOW_TO_UPLOAD_PAN
                  }
                </a>
              </div>
              {inValidPan ? (
                <>
                  <p className="manual-detail">
                    <a
                      className="social-btn"
                      onClick={() => {
                        setpanmanualModalShow(true);
                        setModalShow(false);
                        removePanRead();
                        sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                          EP_PAGE_NAME: "PAN UPLOAD PHOTO",
                          EP_OTP_CTA: "ENTER PAN DETAILS MANUALLY",
                        });
                      }}
                    >
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .ENTER_PAN_MANUALLY
                      }
                    </a>
                  </p>
                </>
              ) : null}
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={uploadguidemodalShow}
          onHide={() => setuploadguideModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          className={`pan-upload-modal`}
          id="pan-upload"
          centered
          backdrop="static"
          keyboard={false}
        >
          <div
            className="close"
            onClick={() => {
              setuploadguideModalShow(false);
              setModalShow(true);
              sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                EP_PAGE_NAME: "PAN UPLOAD PHOTO",
                EP_OTP_CTA: "CLOSE",
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
                          <i className="icon-tick" />
                          <p className="remember-points">
                            photo must be clear with readable details
                          </p>
                        </li>
                        <li>
                          <i className="icon-tick" />
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
                        make sure your PAN card is not reflective
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={panmanualmodalShow}
          onHide={() => setpanmanualModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          className="pan-manual-Modal"
          centered
          backdrop="static"
          keyboard={false}
        >
          <div
            className="close"
            onClick={() => {
              setpanmanualModalShow(false);
              sendToCleverTap("BFSL_APPLICATION_CLICKED", {
                EP_PAGE_NAME: "PAN UPLOAD PHOTO",
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
              <div className="form_header">
                <h3 className="modal-title">
                  {
                    Language[localStorage.getItem("language") || "English"]
                      .ENTER_PAN_MANUALLY
                  }
                </h3>
              </div>
              <form
                className="pan-manual-form"
                autoComplete="off"
                onSubmit={handleSubmit(onSubmitHandler)}
              >
                <div className="form-group custom-suggest" ref={fullNameRef}>
                  <input
                    type="text"
                    name="fullname"
                    nameattribute="fullName2"
                    // onFocus={() =>
                    //   setFocusState({
                    //     fullName: true,
                    //   })
                    // }
                    // onBlur={() => {
                    //   setFocusState({
                    //     fullName: false,
                    //   });
                    //   setStartListening(false);
                    // }}
                    // defaultValue={
                    //   localStorage.getItem("FullName")
                    //     ? localStorage.getItem("FullName")
                    //     : ""
                    // }
                    // onKeyPress={(e) => nameValidation(e)}
                    onInput={(e) => nameValidation(e)}

                    readOnly
                    maxLength={100}
                    className={`form-control  text-uppercase has-value panName ${localStorage.getItem("FullName") ? "has-value" : ""
                      }   ${errors.fullname ? "is-invalid" : ""}`}
                    {...register("fullname", {
                      onBlur: (e) =>
                        ME_EventTriggered("PersonalInformationEntered", { "Full Name": e.target.value })
                    })}
                  />
                  <label className="form-label">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .FULLNAME
                    }

                    <span className="label-required"> *</span>
                  </label>
                  {/* {focusState.fullName && (
                    <i
                      className={
                        startListening
                          ? "icon-Unmute listen-mic"
                          : "icon-Mute listen-mic"
                      }
                      onClick={() => {
                        !startListening
                          ? setStartListening(true)
                          : setStartListening(false);
                        fullNameRef.current.children[0].focus();
                      }}
                    />
                  )} */}
                  <div className="invalid-feedback">
                    {errors.fullname?.message}
                  </div>
                </div>
                <div className="form-group custom-suggest" ref={fatherNameRef}>
                  <input
                    maxLength={100}
                    type="text"
                    name="fathername"
                    nameattribute="fatherName2"
                    onFocus={() =>
                      setFocusState({
                        fatherName: true,
                      })
                    }
                    onBlur={() => {
                      setFocusState({
                        fatherName: false,
                      });
                      setStartListening(false);
                    }}
                    // onKeyPress={(e) => nameValidation(e)}
                    onInput={(e) => nameValidation(e)}

                    // defaultValue={
                    //   localStorage.getItem("FatherName")
                    //     ? localStorage.getItem("FatherName")
                    //     : ""
                    // }

                    // defaultValue={
                    //   localStorage.getItem("FatherName")
                    //     ? FatherNameSet(localStorage.getItem("FatherName"))
                    //     : ""
                    // }
                    className={`form-control text-uppercase has-value panFName ${localStorage.getItem("FatherName") ? "has-value" : ""
                      }  ${errors.fathername ? "is-invalid" : ""}`}
                    {...register("fathername", {
                      onBlur: (e) =>
                        ME_EventTriggered("PersonalInformationEntered", { "fathername": e.target.value })
                    })}
                  />
                  <label className="form-label">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .FATHERNAME
                    }

                    <span className="label-required"> *</span>
                  </label>
                  {focusState.fatherName && (
                    <i
                      className={
                        startListening
                          ? "icon-Unmute listen-mic"
                          : "icon-Mute listen-mic"
                      }
                      onClick={() => {
                        !startListening
                          ? setStartListening(true)
                          : setStartListening(false);
                        fatherNameRef.current.children[0].focus();
                      }}
                    />
                  )}
                  <div className="invalid-feedback">
                    {errors.fathername?.message}
                  </div>
                </div>
                <div className="form-group custom-suggest">
                  <input
                    type="text"
                    name="pan"
                    // defaultValue={
                    //   localStorage.getItem("Pan")
                    //     ? localStorage.getItem("Pan")
                    //     : ""
                    // }
                    onKeyPress={(e) => validatePan(e)}
                    className={`has-value form-control text-uppercase panNum ${errors.pan ? "is-invalid" : ""
                      }`}
                    {...register("pan", {
                      onBlur: (e) =>
                        ME_EventTriggered("PersonalInformationEntered", { "pan": e.target.value })
                    })}
                    readOnly
                  />
                  <label className="form-label">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .PAN
                    }
                    <span className="label-required"> *</span>
                  </label>
                  <div className="invalid-feedback">{errors.pan?.message}</div>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    id="datepicker"
                    placeholder="DD-MM-YYYY"
                    autoComplete="off"
                    // onFocus={(e) => (e.target.type = "date")}
                    name="dob"
                    // defaultValue={
                    //   localStorage.getItem("Dob")
                    //     ? localStorage.getItem("Dob").reverseDob() : ""
                    // }
                    className={`form-control panDob has-value ${localStorage.getItem("Dob") ? "has-value" : ""
                      }  ${errors.dob ? "is-invalid" : ""}`}
                    onInput={dateInput}
                    maxLength={10}
                    {...register("dob", {
                      onChange: (e) =>
                        shareError(e.target.value, "dob-error-pan"),
                      onBlur: (e) =>
                        ME_EventTriggered("PersonalInformationEntered", { "dob": e.target.value })
                    })}
                  />
                  <label className="form-label">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .DOB
                    }
                    <span className="label-required"> *</span>
                  </label>
                  <div className="invalid-feedback">{errors.dob?.message}</div>
                  <div className="invalid-feedback dob-error-pan"></div>
                </div>
                <div className="form-group mr-0 mb-0">
                  <button type="submit" name="submit" className="submit-btn2">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .SUBMIT
                    }
                  </button>
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default PanDetails;
