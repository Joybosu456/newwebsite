/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { Col, Container, Row } from "react-bootstrap";
import ChatCard from "../components/ChatCard";
import PageProgress from "../components/PageProgress";
import $ from "jquery";
import userBottomImg from "../assets/images/person-images/personal-details.png";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SERVICES } from "../common/constants";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import Language from "../common/Languages/languageContent.json";
import {
  AESDecryption,
  ME_EventTriggered,
  dateInput,
  nameValidation,
  nomError,
  pauseAudio,
  playAudio,
  sendToCleverTap,
  shareError,
  underAgeValidate,
} from "../common/common.js";
import {
  dobVal,
  relVal,
  nameVal,
  idProofVal,
  aadharVal,
  panVal,
  dlVal,
  birthVal,
  votingVal,
} from "../Validation.js";
import { useNavigate } from "react-router-dom";
import { useSpeechRecognition } from "react-speech-kit";
import DateCustom from "../components/DateCustom";

function NomineeDetail() {
  const navigate = useNavigate();
  const ToastFunction = (value) => toast(value);
  const [nomineeId, setNomineeId] = useState();
  const [guardianId, setGuardianId] = useState();
  const [birthDate, setBirthDate] = useState();
  const [idVal, setIdVal] = useState();
  const [nomineeDetails, setNomineeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startListening, setStartListening] = useState(false);
  const [clientData, setClientData] = useState();
  const [focusState, setFocusState] = useState({
    nomineeName: false,
    sharePercent: false,
    proof: false,
  });
  const [pageBtn, setPageBtn] = useState(false);
  const nomineeName1Ref = useRef(null);
  const sharePercent1Ref = useRef(null);
  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      let voiceValue = result;

      if (
        document.activeElement.getAttribute("nameattribute") === "nomineeName0"
      )
        setValue("Nominee.0.NomineeName", voiceValue.split(" ").join(""));
      else if (
        document.activeElement.getAttribute("nameattribute") === "sharePercent0"
      )
        setValue("Nominee.0.SharePercent", voiceValue.split(" ").join(""));
      else if (
        document.activeElement.getAttribute("nameattribute") ===
        "proofIdentityNo0"
      )
        setValue("Nominee.0.ProofIdentityNo", voiceValue.split(" ").join(""));

      if (
        document.activeElement.getAttribute("nameattribute") === "nomineeName1"
      )
        setValue("Nominee.1.NomineeName", voiceValue.split(" ").join(""));
      else if (
        document.activeElement.getAttribute("nameattribute") === "sharePercent1"
      )
        setValue("Nominee.1.SharePercent", voiceValue.split(" ").join(""));
      else if (
        document.activeElement.getAttribute("nameattribute") ===
        "proofIdentityNo1"
      )
        setValue("Nominee.1.ProofIdentityNo", voiceValue.split(" ").join(""));

      if (
        document.activeElement.getAttribute("nameattribute") === "nomineeName2"
      )
        setValue("Nominee.2.NomineeName", voiceValue.split(" ").join(""));
      else if (
        document.activeElement.getAttribute("nameattribute") === "sharePercent2"
      )
        setValue("Nominee.2.SharePercent", voiceValue.split(" ").join(""));
      else if (
        document.activeElement.getAttribute("nameattribute") ===
        "proofIdentityNo2"
      )
        setValue("Nominee.2.ProofIdentityNo", voiceValue.split(" ").join(""));
    },
  });

  useEffect(() => {
    startListening ? listen() : stop();
  }, [startListening]);

  const perShareValidation = (e) => {
    if (e.target.value.length > 2) {
      e.preventDefault();
    }
  };
  function shareChange(e) {
    let data = getValues("Nominee");
    var total = 0;
    for (let i = 0; i < data.length; i++) {
      let percent = parseInt(data[i].SharePercent);
      total = total + percent;
    }
    if (total != 100) {
      if (isNaN(total)) {
        $(".share-error").html(
          `The total Share percent is empty, Overall nominee percent should be 100%`
        );
      } else {
        $(".share-error").html(
          `The total is  ${total} % , Overall nominee percent should be 100%`
        );
      }
      $(".share-error").css("display", "block");
    } else {
      $(".share-error").html(``);
      $(".share-error").css("display", "block");
    }
  }
  useEffect(() => {
    sendToCleverTap("BSFL_APPLICATION_VIEWED", {
      EP_PAGE_NAME: "NOMINEE DETAILS FILLED",
    });
    let user = localStorage.getItem("ExistUqId");
    if (user === null || user === "" || user === "null") {
      window.location.replace(window.origin);
    } else if (nomineeDetails === null) {
      sendToCleverTap("BSFL_APPLICATION_VIEWED", {
        EP_PAGE_NAME: "NOMINEE DETAILS FILLED",
      });
      const ResumeNomepage = async () => {
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
          console.log(resumeResp.Response.PersonalDetailsRes.NominateAction );
          if (resumeResp.Response.PersonalDetailsRes.NominateAction === "1") {
            ResumeNominee();
          }
          // if (resumeResp.Response.PersonalDetailsRes.NominateAction === "0") {
          //   navigate("/personal-detail");
          // } else {
          //   ResumeNominee();
          // }
          if (resumeResp.Response) {
            console.log(resumeResp.Response);
            setClientData(resumeResp.Response);
            localStorage.setItem("ExistUqId", resumeResp.Response.FlagRes.UQID);
          }
        } catch (err) { }
      };
      ResumeNomepage();
    }
  }, []);

  function isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop));
      return false;
    }
    return true;
  }
  function guardDisplay(data) {
    $(document).ready(function () {
      if (data) {
        for (let i in data) {
          if (data?.[i]?.GaurdName === null) {
            $(`.${i}-guardian`).css("display", "none");
          } else {
            $(`.${i}-guardian`).css("display", "flex");
          }
        }
        if (data.length == 3) {
          $(".nominee-add").css("display", "none");
        } else {
          $(".nominee-add").css("display", "flex");
        }
      }
    });
  }
  useEffect(() => {
    let empty = isEmpty(nomineeDetails);
    if (!empty) {
      guardDisplay(nomineeDetails);
      reset({
        Nominee: nomineeDetails,
        NomineeCount: nomineeDetails.length,
      });
    }
  }, [nomineeDetails]);

  const ResumeNominee = async () => {
    try {
      const response = await axios.post(
        SERVICES.CLIENTSAVE,
        {
          nomineeDetails: {
            nomineeType: "ResumeNominee",
          },
          resumeNomineeDetails: {
            mobile: localStorage.getItem("mobile"),
            uqId: localStorage.getItem("ExistUqId"),
          },
          screenType: 7,
        },

        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      let nomineeData = response.data.Response.Data;
      for (let i = 0; i <= nomineeData.length - 1; i++) {
        nomineeData[i].NomineeBDate = nomineeData[i].NomineeBDate.split("/")
          .join("-");
        if (nomineeData[i].GuardId) {
          nomineeData[i].GaurdBDate = nomineeData[i].GaurdBDate.split("/")
            .join("-");
        }
        nomineeData[i].SharePercent = Number(nomineeData[i].SharePercent);
      }
      setNomineeDetails(response.data.Response.Data);
    } catch (err) { }
  };
  const delNominee = async (id) => {
    try {
      const response = await axios.post(
        SERVICES.CLIENTSAVE,
        {
          nomineeDetails: {
            nomineeType: "DeleteNominee",
          },
          deleteNomineeDtls: {
            id: id.toString(),
          },
          screenType: 7,
        },

        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) { }
  };
  const JsSchema = Yup.object().shape({
    NomineeCount: Yup.string().required("Value is mendatory!"),
    Nominee: Yup.array().of(
      Yup.object()
        .shape({
          Id: Yup.number(),
          NomineeName: nameVal,
          NomineeBDate: dobVal,
          Relationship: relVal,
          SharePercent: Yup.number()
            .required("this field Required")
            .typeError("Share percent is required")
            .min(1, "share percent must be minimum 1%")
            .max(100, "share percent is not greater than 100%"),
          ProofIdentity: idProofVal,
          isminor: Yup.bool().required("Required"),
        })
        .when((values, schema) => {
          if (values.ProofIdentity == "Adhar Card") {
            return schema.shape({
              ProofIdentityNo: aadharVal,
            });
          } else if (values.ProofIdentity === "Pan Card") {
            return schema.shape({
              ProofIdentityNo: panVal,
            });
          } else if (values.ProofIdentity === "Driving Lincence") {
            return schema.shape({
              ProofIdentityNo: dlVal,
            });
          } else if (values.ProofIdentity === "Birth Certificate") {
            return schema.shape({
              ProofIdentityNo: birthVal,
            });
          } else if (values.ProofIdentity === "Voter ID") {
            return schema.shape({
              ProofIdentityNo: votingVal,
            });
          } else {
            return schema.shape({
              ProofIdentityNo: Yup.string().required("this field Required"),
            });
          }
        })
        .when((values, schema) => {
          if (values.isminor === true) {
            return schema
              .shape({
                GuardId: Yup.number(),
                GaurdName: nameVal,
                GaurdBDate: dobVal,
                GaurdRelationship: relVal,
                GaurdProofIdentity: idProofVal,
              })
              .when((values, schema) => {
                if (values.GaurdProofIdentity === "Adhar Card") {
                  return schema.shape({
                    GaurdProofIdentityNo: aadharVal,
                  });
                } else if (values.GaurdProofIdentity === "Pan Card") {
                  return schema.shape({
                    GaurdProofIdentityNo: panVal,
                  });
                } else if (values.GaurdProofIdentity === "Driving Lincence") {
                  return schema.shape({
                    GaurdProofIdentityNo: dlVal,
                  });
                } else if (values.GaurdProofIdentity === "Birth Certificate") {
                  return schema.shape({
                    GaurdProofIdentityNo: birthVal,
                  });
                } else if (values.GaurdProofIdentity === "Voter ID") {
                  return schema.shape({
                    GaurdProofIdentityNo: votingVal,
                  });
                }
              });
          }
        })
    ),
  });

  if (birthDate >= 18) {
    var proofName = [
      { value: "", text: "Select One" },
      { value: "Adhar Card", text: "Aadhar Card" },
      { value: "Pan Card", text: "PAN Card" },
      { value: "Driving Lincence", text: "Driving Licence" },
      { value: "Voter ID", text: "Voter ID" },
      { value: "Birth Certificate", text: "Birth Certificate" },
    ];
  } else if (birthDate < 18) {
    var proofName = [
      { value: "", text: "Select One" },
      { value: "Adhar Card", text: "Aadhar Card" },
      { value: "Pan Card", text: "PAN Card" },
      { value: "Birth Certificate", text: "Birth Certificate" },
    ];
  } else {
    var proofName = [
      { value: "", text: "Select One" },
      { value: "Adhar Card", text: "Aadhar Card" },
      { value: "Pan Card", text: "PAN Card" },
      { value: "Driving Lincence", text: "Driving Licence" },
      { value: "Voter ID", text: "Voter ID" },
      { value: "Birth Certificate", text: "Birth Certificate" },
    ];
  }

  const guardianProofName = [
    { value: "", text: "Select One" },
    { value: "Adhar Card", text: "Aadhar Card" },
    { value: "Pan Card", text: "PAN Card" },
    { value: "Driving Lincence", text: "Driving Licence" },
    { value: "Voter ID", text: "Voter ID" },
    { value: "Birth Certificate", text: "Birth Certificate" },
  ];

  const relationName = [
    { value: "", text: "Select One" },
    { value: "Spouse", text: "Spouse" },
    { value: "Son", text: "Son" },
    { value: "Daughter", text: "Daughter" },
    { value: "Father", text: "Father" },
    { value: "Mother", text: "Mother" },
    { value: "Brother", text: "Brother" },
    { value: "Sister", text: "Sister" },
    { value: "Grand Son", text: "Grand Son" },
    { value: "Grand Daughter", text: "Grand Daughter" },
    { value: "Grand Father", text: "Grand Father" },
    { value: "Grand Mother", text: "Grand Mother" },

    { value: "Others", text: "Others" },
  ];
  const GuardianrelationName = [
    { value: "", text: "Select One" },
    { value: "Father", text: "Father" },
    // { value: "Daughter", text: "Daughter" },pse
    { value: "Mother", text: "Mother" },
    { value: "Brother", text: "Brother" },
    { value: "Sister", text: "Sister" },
    // { value: "Grand Son", text: "Grand Son" },
    // { value: "Grand Daughter", text: "Grand Daughter" },
    { value: "Grand Father", text: "Grand Father" },
    { value: "Grand Mother", text: "Grand Mother" },
    { value: "Others", text: "Others" },
  ];
  const optionsDf = {
    resolver: yupResolver(JsSchema),
    // mode: "onChange",
  };
  const {
    control,
    formState,
    handleSubmit,
    register,
    clearErrors,
    resetField,
    setValue,
    watch,
    getValues,
    reset,
    setError,
    setFocus,
  } = useForm(optionsDf);
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    name: "Nominee",
    control,
  });
  const NomineeCount = watch("NomineeCount");

  useEffect(() => {
    const currentProp = parseInt(NomineeCount || 1);
    const previousProp = fields.length;
    if (currentProp > previousProp) {
      for (let i = previousProp; i < currentProp; i++) {
        let nomId = nomineeDetails?.[i]?.Id || 0;
        append({
          NomineeName: "",
          NomineeBDate: "",
          Relationship: "",
          ProofIdentity: "",
          ProofIdentityNo: "",
          SharePercent: 0,
          Id: nomId,
          GuardId: 0,
          isminor: false,
          GaurdName: "",
          GaurdBDate: "",
          GaurdRelationship: "",
          GaurdProofIdentity: "",
          GaurdProofIdentityNo: "",
        });
      }
    } else {
      for (let i = previousProp; i > currentProp; i--) {
        remove(i - 1);
      }
    }
  }, [NomineeCount]);

  function nomineeJson(nominee) {
    for (let i = 0; i < nominee.length; i++) {
      nominee[i].SharePercent = nominee[i].SharePercent.toString();
      delete nominee[i]["isminor"];
    }
    return nominee;
  }
  function onSubmit(data) {
    console.log(data);

    let totalPercent = 0;

    for (let i = 0; i < data.Nominee.length; i++) {
      totalPercent = totalPercent + data.Nominee[i].SharePercent;
    }

    if (totalPercent === 100) {
      $(".share-error").html(``);
      $(".share-error").css("display", "none");
      let error = 0;
      for (let i = 0; i < data.Nominee.length; i++) {
        if ($(`.nomineeid-error${i}`).text() || $(`.nom-error${i}`).text() || $(`.dob-error${i}`).text()) {
          error = error + 1;
        }
      }
      if (error === 0) {
        ME_EventTriggered("ContinueClicked", { data });
        for (let i = 0; i < data.Nominee.length; i++) {
          data.Nominee[i].NomineeBDate = data.Nominee[i].NomineeBDate.split("-").join("/");
          if (data.Nominee[i].isminor === true) {
            data.Nominee[i].GaurdBDate = data.Nominee[i].GaurdBDate.split("-").join("/");
            // ME_EventTriggered("ContinueClicked",data)
          } else {
            delete data.Nominee[i]["GaurdBDate"];
            delete data.Nominee[i]["GaurdName"];
            delete data.Nominee[i]["GaurdProofIdentity"];
            delete data.Nominee[i]["GaurdProofIdentityNo"];
            delete data.Nominee[i]["GaurdRelationship"];
            delete data.Nominee[i]["GuardId"];
          }
        }

        nomineeJson(data.Nominee);

        updateNominee(data.Nominee);
      }
    } else {
      if (isNaN(totalPercent)) {
        $(".share-error").html(
          `The total Share percent is empty, Overall nominee percent should be 100%`
        );
      } else {
        $(".share-error").html(
          `The total is  ${totalPercent} % , Overall nominee percent should be 100%`
        );
      }
      $(".share-error").css("display", "block");
    }
  }
  const updateNominee = async (nominee) => {
    console.log(nominee.length);
    console.log(nominee[0]);
    console.log(nominee[1]);
    if (nominee.length == 1) {
      sendToCleverTap("BFSL_APPLICATION_CLICKED", {
        EP_PAGE_NAME: "NOMINEE DETAILS FILLED",
        EP_NOMINEE_NAME: nominee[0].NomineeName,
        EP_NOMINEE_DOB: nominee[0].NomineeBDate,
        EP_NOMINEE_RELATION: nominee[0].Relationship,
        EP_NOMINEE_ID: nominee[0].ProofIdentity,
        EP_ID_NUMBER: nominee[0].ProofIdentityNo,
        EP_SHARE_PERCENTAGE: nominee[0].SharePercent,
        EP_CTA: "CONTINUE"
      });
    }
    if (nominee.length == 2) {
      sendToCleverTap("BFSL_APPLICATION_CLICKED", {
        EP_PAGE_NAME: "NOMINEE DETAILS FILLED",
        EP_NOMINEE_NAME: nominee[1].NomineeName,
        EP_NOMINEE_DOB: nominee[1].NomineeBDate,
        EP_NOMINEE_RELATION: nominee[1].Relationship,
        EP_NOMINEE_ID: nominee[1].ProofIdentity,
        EP_ID_NUMBER: nominee[1].ProofIdentityNo,
        EP_SHARE_PERCENTAGE: nominee[1].SharePercent,
        EP_CTA: "CONTINUE"
      });
    }
    if (nominee.length == 3) {
      sendToCleverTap("BFSL_APPLICATION_CLICKED", {
        EP_PAGE_NAME: "NOMINEE DETAILS FILLED",
        EP_NOMINEE_NAME: nominee[2].NomineeName,
        EP_NOMINEE_DOB: nominee[2].NomineeBDate,
        EP_NOMINEE_RELATION: nominee[2].Relationship,
        EP_NOMINEE_ID: nominee[2].ProofIdentity,
        EP_ID_NUMBER: nominee[2].ProofIdentityNo,
        EP_SHARE_PERCENTAGE: nominee[2].SharePercent,
        EP_CTA: "CONTINUE"
      });
    }
    setPageBtn(true)
    try {
      const response = await axios.post(
        SERVICES.CLIENTSAVE,
        {
          NomineeDetails: {
            NomineeType: "AddUpdate",
          },

          AddUptNomineeDtls: {
            RefId: clientData?.FlagRes?.Id || localStorage.getItem("refId"),
            NominateAction: true,
            Mobile:
              clientData?.AccountOpeningRes?.Mobile ||
              localStorage.getItem("mobile"),
            Nominee: nominee,
          },
          ScreenType: 7,
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.Response === "Saved Successfully") {
        const kycstatus =
          clientData?.FlagRes?.IsKyc || localStorage.getItem("IsKyc");

        if (kycstatus == 0) {
          pauseAudio();
          navigate("/address-details-manually");
        } else {
          playAudio(11);
          navigate("/bank-detail");
        }
      }
    } catch (err) { }
    finally {
      setPageBtn(false)
    }
  };
  function addNom() {
    setBirthDate();
    var currentNom = getValues("NomineeCount");
    ME_EventTriggered("AddAnotherNomineeClicked");

    if (currentNom == 1) {
      setValue("NomineeCount", 2);
      $(`.${currentNom}-guardian`).css("display", "none");
    } else if (currentNom == 2) {
      setValue("NomineeCount", 3);
      $(`.${currentNom}-guardian`).css("display", "none");
      $(".nominee-add").css("display", "none");
    } else if (currentNom == 3) {
      return;
    }
  }
  const remNom = (i, e, nomineeDetails) => {
    var currentNom = getValues("NomineeCount");
    console.log(nomineeDetails, "nomineeDetails[i]");
    if (currentNom === 1) {
      return;
    } else {
      if (currentNom === 2) {
        setValue("NomineeCount", 1);
        remove(i);
        $(".nominee-add").css("display", "flex");
        if (nomineeDetails[i]) {
          delNominee(nomineeDetails?.[i]?.Id);
        }
      } else if (currentNom === 3) {
        if (i === 1) {
          let guardian = getValues().Nominee[2].isminor;
          if (guardian === true) {
            $(`.${i}-guardian`).css("display", "flex !important");
          } else {
            $(`.${i}-guardian`).css("display", "none !important");
          }
        }
        if (nomineeDetails[i]) {
          delNominee(nomineeDetails?.[i]?.Id);
        }
        setValue("NomineeCount", 2);
        $(".nominee-add").css("display", "flex");
        remove(i);
      }
    }
  };
  const idCheck = (i, e) => {
    let proofBlock = e.target.classList[1];
    if (proofBlock === "nominee-proof") {
      setNomineeId(e.target.value);
      setValue(`Nominee.${i}.ProofIdentityNo`, "");
      clearErrors(`Nominee.${i}.ProofIdentityNo`);
      setFocus(`Nominee[${i}]ProofIdentityNo`);
      console.log(e.target.value);
      if (e.target.value === "Adhar Card") {
        setValue(`Nominee[${i}]ProofIdentityNo`, "********")
      }
    } else if (proofBlock === "guardian-proof") {
      setGuardianId(e.target.value);
      setValue(`Nominee.${i}.GaurdProofIdentityNo`, "");
      clearErrors(`Nominee.${i}.GaurdProofIdentityNo`);
      setFocus(`Nominee[${i}]GaurdProofIdentityNo`);
      if (e.target.value === "Adhar Card") {
        setValue(`Nominee[${i}]GaurdProofIdentityNo`, "********")
      }
    }
  };
  const formatDate = (date) => {
    var day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var year = date.getFullYear();
    let fdate = `${day}-${month}-${year}`;
    return fdate;
  };

  const ageCheck = (i, data) => {
    let currentAge = underAgeValidate(data)
    setBirthDate(currentAge);
    console.log(currentAge, "currentAge");
    console.log(currentAge, "currentAge");
    let dateValid = data.isValidDate();
    if (dateValid && currentAge < 18) {
      $(`.${i}-guardian`).css("display", "flex");
      setValue(`Nominee.${i}.isminor`, true);
      setValue(`Nominee.${i}.GuardId`, 0);
    } else {
      $(`.${i}-guardian`).css("display", "none");
      setValue(`Nominee.${i}.isminor`, false);
      setValue(`Nominee.${i}.GaurdName`, "");
      setValue(`Nominee.${i}.GuardId`, "");
      setValue(`Nominee.${i}.GaurdBDate`, "");
      setValue(`Nominee.${i}.GaurdRelationship`, "");
      setValue(`Nominee.${i}.GaurdProofIdentity`, "");
      setValue(`Nominee.${i}.GaurdProofIdentityNo`, "");
    }
  };

  const guardianDate = (data, block) => {
    let a = data;
    var todayYear = new Date();
    var enterYear = new Date(a);
    todayYear = todayYear.getFullYear();
    enterYear = enterYear.getFullYear();
    var currentAge = todayYear - enterYear;
    if (currentAge < 18) {
      $($(`.${block}`)[0]).css("display", "block");
      $($(`.${block}`)[0]).html("Below 18 year is not allowed");
      return false;
    } else {
      $($(`.${block}`)[0]).css("display", "none");
      $($(`.${block}`)[0]).html("");
      return true;
    }
  };
  const skipNominee = () => {
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "NOMINEE DETAILS FILLED",
      EP_CTA: "I'LL SKIP AND DO IT LATER",
    });
    const kycstatus =
      clientData?.FlagRes?.IsKyc || localStorage.getItem("IsKyc");
    if (kycstatus == 0) {
      pauseAudio();
      navigate("/address-details-manually");
    } else {
      playAudio(11);
      navigate("/bank-detail");
    }
    ResumeApplication();
  };

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
      if (resumeResp.Response.PersonalDetailsRes) {
        savePersonalDetails(resumeResp.Response.PersonalDetailsRes);
      }
    } catch (err) { }
  };
  const savePersonalDetails = async (data) => {
    try {
      const response = await axios.post(
        SERVICES.CLIENTSAVE,
        {
          addUptPrimaryDtls: {
            firstName: "",
            middleName: "",
            lastName: "",
            dependentStatus: "Father",
            dependentFName: clientData?.PersonalDetailsRes?.DependentFName || localStorage.getItem("dependentFirstName"),
            dependentMName: clientData?.PersonalDetailsRes?.DependentMName || localStorage.getItem("dependentMiddleName"),
            dependentLName: clientData?.PersonalDetailsRes?.DependentLName || localStorage.getItem("dependentLastName"),
            incomeRange: data.IncomeRange,
            occupation: "Private Sector Service",
            isPolitical: "Not Applicable",
            regulatoryAction: "",
            authorityName: "",
            authorityGround: "",
            otherAuthorityName: "",
            tradingPreference: "",
            uqId:
              clientData?.FlagRes?.UQID || localStorage.getItem("ExistUqId"),
            gender: data.Gender === "M" ? "Male" : "Female",
            maritalStatus: data.MaritalStatus,
            nationality: "INDIAN",
            nominateAction: false,
            mobile:
              clientData?.AccountOpeningRes?.Mobile ||
              localStorage.getItem("mobile"),
            ddpiAction: data.DdpiAction == "True" ? true : false,
            fno: data.fno == "True" ? true : false,
            eq: true,
            poaAction: true,
            flag: "primary-details",
          },
          screenType: 8,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.Response === "Updated Successfully") {
        const kycstatus =
          clientData?.FlagRes?.IsKyc || localStorage.getItem("IsKyc");
        if (kycstatus == 0) {
          navigate("/address-details-manually");
        } else {
          playAudio(11);
          navigate("/bank-detail");
        }
      }
    } catch (err) { }
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

  const idNumberValidation = (e, i) => {
    if (nomineeId === "Pan Card") {
      var k = e.charCode;
      if (e.target.value.length >= 0 && e.target.value.length < 5) {
        if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8) {
          return true;
        } else {
          e.preventDefault();
        }
      }
      if (e.target.value.length >= 5 && e.target.value.length < 9) {
        if ((k >= 48 && k <= 57) || k === 8) {
          return true;
        } else {
          e.preventDefault();
        }
      }
      if (e.target.value.length >= 9 && e.target.value.length < 10) {
        if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8) {
          return true;
        } else {
          e.preventDefault();
        }
      } else if (e.target.value.length >= 10) {
        e.preventDefault();
      }
    } else if (nomineeId === "Adhar Card") {
      var char = e.charCode;
      if (e.target.value.length >= 0 && e.target.value.length < 12) {
        if ((char >= 48 && char <= 57) || char === 8) {
          return true;
        } else {
          e.preventDefault();
        }
      } else if (e.target.value.length >= 12) {
        e.preventDefault();
      }
    } else {
      if (e.target.value.length > 14) {
        e.preventDefault();
      }
    }
  };
  const guardianIdNumberValidation = (e, i) => {
    if (guardianId === "Pan Card") {
      var k = e.charCode;
      if (e.target.value.length >= 0 && e.target.value.length < 5) {
        if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8) {
          return true;
        } else {
          e.preventDefault();
        }
      }
      if (e.target.value.length >= 5 && e.target.value.length < 9) {
        if ((k >= 48 && k <= 57) || k === 8) {
          return true;
        } else {
          e.preventDefault();
        }
      }
      if (e.target.value.length >= 9 && e.target.value.length < 10) {
        if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8) {
          return true;
        } else {
          e.preventDefault();
        }
      } else if (e.target.value.length >= 10) {
        e.preventDefault();
      }
    } else if (guardianId === "Adhar Card") {
      var char = e.charCode;
      if (e.target.value.length >= 0 && e.target.value.length < 12) {
        if ((char >= 48 && char <= 57) || char === 8) {
          return true;
        } else {
          e.preventDefault();
        }
      } else if (e.target.value.length >= 12) {
        e.preventDefault();
      }
    } else {
      if (e.target.value.length > 14) {
        e.preventDefault();
      }
    }
  };

  const currentDate = new Date();
  const yyyy = currentDate.getFullYear();
  let mm = currentDate.getMonth() + 1;
  let dd = currentDate.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  const FormatedDate = dd + "/" + mm + "/" + yyyy;
  const DateReverse = FormatedDate.split("/").reverse().join("-");
  const subtractYears = (date1, years) => {
    const dateCopy = new Date(date1);
    dateCopy.setFullYear(date1.getFullYear() - years);
    return dateCopy;
  };

  const date1 = new Date();
  const newDate = subtractYears(date1, 18);
  var updateDate = new Date(newDate),
    mnth = ("0" + (updateDate.getMonth() + 1)).slice(-2),
    day = ("0" + updateDate.getDate()).slice(-2);
  const year = updateDate.getFullYear();
  const minDate = year + "-" + mnth + "-" + day;

  const guardianIdValue = (e, block) => {
    if (idVal === e.target.value) {
      $($(`.${block}`)[0]).css("display", "block");
      $($(`.${block}`)[0]).html(
        "Guardian ID Number should be different from Nominee ID Number"
      );
    } else {
      $($(`.${block}`)[0]).css("display", "none");
      $($(`.${block}`)[0]).html("");
    }
  };
  const nomineeIdChange = (e, i, block) => {
    setIdVal(e.target.value);
    let nominee0 = getValues().Nominee[0]?.ProofIdentityNo;
    let nominee1 = getValues().Nominee[1]?.ProofIdentityNo;
    let nominee2 = getValues().Nominee[2]?.ProofIdentityNo;
    if (i == 0) {
      if (nominee1) {
        if (nominee1 === e.target.value) {
          $($(`.${block}0`)).css("display", "block");
          $($(`.${block}0`)).html("Nominee ID Number should be different");
          $($(`.${block}1`)).css("display", "block");
          $($(`.${block}1`)).html("Nominee ID Number should be different");
        } else {
          $($(`.${block}0`)).css("display", "none");
          $($(`.${block}0`)).html("");
          $($(`.${block}1`)).css("display", "none");
          $($(`.${block}1`)).html("");
        }
      }
      if (nominee2) {
        if (nominee2 === e.target.value) {
          $($(`.${block}0`)).css("display", "block");
          $($(`.${block}0`)).html("Nominee ID Number should be different");
          $($(`.${block}2`)).css("display", "block");
          $($(`.${block}2`)).html("Nominee ID Number should be different");
        } else {
          $($(`.${block}0`)).css("display", "none");
          $($(`.${block}0`)).html("");
          $($(`.${block}2`)).css("display", "none");
          $($(`.${block}2`)).html("");
        }
      }
      if (nominee1 === nominee2) {
        $($(`.${block}1`)).css("display", "block");
        $($(`.${block}1`)).html("Nominee ID Number should be different");
        $($(`.${block}2`)).css("display", "block");
        $($(`.${block}2`)).html("Nominee ID Number should be different");
      } else {
        $($(`.${block}1`)).css("display", "none");
        $($(`.${block}1`)).html("");
        $($(`.${block}2`)).css("display", "none");
        $($(`.${block}2`)).html("");
      }
    }

    if (i == 1) {
      if (nominee0) {
        if (nominee0 === e.target.value) {
          $($(`.${block}0`)).css("display", "block");
          $($(`.${block}0`)).html("Nominee ID Number should be different");
          $($(`.${block}1`)).css("display", "block");
          $($(`.${block}1`)).html("Nominee ID Number should be different");
        } else {
          $($(`.${block}0`)).css("display", "none");
          $($(`.${block}0`)).html("");
          $($(`.${block}1`)).css("display", "none");
          $($(`.${block}1`)).html("");
        }
      }
      if (nominee2) {
        if (nominee2 === e.target.value) {
          $($(`.${block}1`)).css("display", "block");
          $($(`.${block}1`)).html("Nominee ID Number should be different");
          $($(`.${block}2`)).css("display", "block");
          $($(`.${block}2`)).html("Nominee ID Number should be different");
        } else {
          $($(`.${block}1`)).css("display", "none");
          $($(`.${block}1`)).html("");
          $($(`.${block}2`)).css("display", "none");
          $($(`.${block}2`)).html("");
        }
      }
      if (nominee0 === nominee2) {
        $($(`.${block}0`)).css("display", "block");
        $($(`.${block}0`)).html("Nominee ID Number should be different");
        $($(`.${block}2`)).css("display", "block");
        $($(`.${block}2`)).html("Nominee ID Number should be different");
      } else {
        $($(`.${block}0`)).css("display", "none");
        $($(`.${block}0`)).html("");
        $($(`.${block}2`)).css("display", "none");
        $($(`.${block}2`)).html("");
      }
    }
    if (i == 2) {
      if (nominee0) {
        if (nominee0 === e.target.value) {
          $($(`.${block}0`)).css("display", "block");
          $($(`.${block}0`)).html("Nominee ID Number should be different");
          $($(`.${block}2`)).css("display", "block");
          $($(`.${block}2`)).html("Nominee ID Number should be different");
        } else {
          $($(`.${block}0`)).css("display", "none");
          $($(`.${block}0`)).html("");
          $($(`.${block}2`)).css("display", "none");
          $($(`.${block}2`)).html("");
        }
      }
      if (nominee1) {
        if (nominee1 === e.target.value) {
          $($(`.${block}1`)).css("display", "block");
          $($(`.${block}1`)).html("Nominee ID Number should be different");
          $($(`.${block}2`)).css("display", "block");
          $($(`.${block}2`)).html("Nominee ID Number should be different");
        } else {
          $($(`.${block}1`)).css("display", "none");
          $($(`.${block}1`)).html("");
          $($(`.${block}2`)).css("display", "none");
          $($(`.${block}2`)).html("");
        }
      }
      if (nominee0 === nominee1) {
        $($(`.${block}0`)).css("display", "block");
        $($(`.${block}0`)).html("Nominee ID Number should be different");
        $($(`.${block}1`)).css("display", "block");
        $($(`.${block}1`)).html("Nominee ID Number should be different");
      } else {
        $($(`.${block}0`)).css("display", "none");
        $($(`.${block}0`)).html("");
        $($(`.${block}1`)).css("display", "none");
        $($(`.${block}1`)).html("");
      }
    }
  };

  const formvalue = watch();
  const isInValid = formvalue?.Nominee?.map((nom) => {
    return (
      !!nom.NomineeBDate &&
      nom.NomineeName !== "" &&
      !!nom.ProofIdentity &&
      !!nom.ProofIdentityNo &&
      !!nom.Relationship &&
      !!nom.SharePercent
    );
  }).some((x) => x === false);

  const BlurSharePercentage = (data, i) => {
    console.log(data);
  };
  const DateFormSet = (data, i) => {
    console.log(data, i, "data");
    setValue(`Nominee.${i}.NomineeBDate`, data)
    clearErrors(`Nominee.${i}.NomineeBDate`);
    nomError(getValues(`Nominee.${i}.NomineeBDate`)
      , `nom-error${i}`)
    ageCheck(i, data.reverseDob());


    // shareError(getValues(`Nominee.${i}.NomineeBDate`)
    //   , "dob-error")
  }
  const GDateFormSet = (data, i) => {
    let validDate = shareError(data, `dob-error${i}`);
    setValue(`Nominee.${i}.GaurdBDate`, data)
    console.log(validDate, "validDate")
    clearErrors(`Nominee.${i}.GaurdBDate`);

  }

  const GclearDateForm = (data, i) => {
    setValue(`Nominee.${i}.GaurdBDate`, data)
    console.log(data, "data");
    console.log(getValues(`Nominee.${i}.GaurdBDate`), "getValues(`Nominee.${i}.GaurdBDate`)");

    shareError(getValues(`Nominee.${i}.GaurdBDate`)
      , `dob-error${i}`)

  }

  const clearDateForm = (data, i) => {
    console.log(data, "data");
    setValue(`Nominee.${i}.NomineeBDate`, data)
    // setError(`Nominee.${i}.NomineeBDate`, {
    //   type: "custom",
    //   message: "Please Enter valid Date format,DD-MM-YYYY",
    // })
    // console.log(getValues(`Nominee.${i}.NomineeBDate`));

    console.log(data, "data");
    console.log(getValues(`Nominee.${i}.NomineeBDate`), "getValues(`Nominee.${i}.NomineeBDate`)");
    nomError(getValues(`Nominee.${i}.NomineeBDate`)
      , `nom-error${i}`)

    console.log("hello");

    $(`.${i}-guardian`).css("display", "none");
    setValue(`Nominee.${i}.isminor`, false);
    setValue(`Nominee.${i}.GaurdName`, "");
    setValue(`Nominee.${i}.GuardId`, "");
    setValue(`Nominee.${i}.GaurdBDate`, "");
    setValue(`Nominee.${i}.GaurdRelationship`, "");
    setValue(`Nominee.${i}.GaurdProofIdentity`, "");
    setValue(`Nominee.${i}.GaurdProofIdentityNo`, "");
  }

  const identityInput = (e, i, block) => {

    console.log(e, i, block);
    if (block === "nominee") {
      let ProofSel = getValues(`Nominee.${i}.ProofIdentity`);
      console.log(ProofSel);
      if (ProofSel === "Adhar Card" && e.target.value.length <= 8) {
        setValue(`Nominee.${i}.ProofIdentityNo`, "********")
      }
    }
    if (block === "guardian") {
      let ProofSel = getValues(`Nominee.${i}.GaurdProofIdentity`);
      console.log(ProofSel);
      if (ProofSel === "Adhar Card" && e.target.value.length <= 8) {
        setValue(`Nominee.${i}.GaurdProofIdentityNo`, "********")
      }
    }
  }

  return (
    <>
      <PageProgress progress="personal-details" />

      <div className={`${loading ? "loader" : " "}`}>
        {loading && (
          <>
            <img src={bajaj_loaderimg} className="loader-img" />
          </>
        )}

        <main className="main-content nominee-page">
          <Container>
            <Row>
              <Col lg="7" className="nominee-detail">
                <div className="page-header">
                  <a
                    role="button"
                    className="back-button"
                    onClick={() => {
                      navigate("/personal-detail");
                      pauseAudio();
                    }}
                  >
                    <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                  </a>
                  <h2 className="page-title">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .GOODMOVE
                    }
                  </h2>
                  <h3 className="page-subtitle">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .STAYPATIENT
                    }
                  </h3>
                </div>
                <div className="nominee-detail-info common-card">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="nominee-form"
                  >
                    <div className="form-group d-none">
                      <select
                        name="NomineeCount"
                        {...register("NomineeCount")}
                        className={`form-control has-value ${errors.NomineeCount ? "is-invalid" : ""
                          }`}
                      >
                        {[1, 2, 3].map((i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                      <div className="invalid-feedback">
                        {errors.NomineeCount?.message}
                      </div>
                    </div>
                    {fields.map((item, i) => (
                      <div key={i} className={`wrapper-${i} nominee-wrapper`}>
                        <h2>
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].NOMINEE
                          }{" "}
                          {i + 1}
                        </h2>
                        <div className={`${i} nominee`}>
                          <a
                            type="button"
                            onClick={(e) => remNom(i, e, nomineeDetails)}
                            className="nominee-rem ml-auto"
                          >
                            <svg class="new-icon new-icon-minus"><use href="#new-icon-minus"></use></svg>                          </a>
                          <div className="form-row ">
                            <div className="form-group d-none">
                              <input
                                type="text"
                                name={`Nominee[${i}]Id`}
                                {...register(`Nominee.${i}.Id`)}
                                value={0}
                              />
                            </div>
                            <div
                              className="form-group col"
                              ref={nomineeName1Ref}
                            >
                              <input
                                type="text"
                                nameattribute={`nomineeName${i}`}
                                onFocus={(e) => {
                                  e.target.classList.add("speechActive");
                                  setFocusState({ nomineeName: true });
                                }}
                                onInput={(e) => nameValidation(e)}
                                // onKeyDown={(e) => nameValidation(e)}
                                name={`Nominee[${i}]NomineeName`}
                                {...register(`Nominee.${i}.NomineeName`, {
                                  onBlur: (e) =>
                                    ME_EventTriggered(`Nomininee${i + 1}NomineeName`, { "NomineeName": e.target.value })
                                })}
                                className={`form-control has-value addSpeech ${errors?.Nominee?.[i]?.NomineeName
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                maxLength={100}
                              />
                              <label className="form-label">
                                {
                                  Language[
                                    localStorage.getItem("language") ||
                                    "English"
                                  ].NOMINEE_NAME
                                }
                                <span className="label-required">*</span>
                              </label>
                              {focusState.nomineeName && (
                                <i className="listen-mic">
                                  <svg
                                    className={
                                      startListening
                                        ? "new-icon new-icon-Unmute"
                                        : "new-icon new-icon-Mute"
                                    }
                                    onClick={() => {
                                      !startListening
                                        ? setStartListening(true)
                                        : setStartListening(false);
                                      setFocus(`Nominee.${i}.NomineeName`);
                                    }}
                                  >
                                    {
                                      startListening
                                        ? <use href="#new-icon-Unmute"></use>
                                        : <use href="#new-icon-Mute"></use>
                                    }
                                  </svg>
                                </i>
                              )}

                              <div className="invalid-feedback">
                                {errors?.Nominee?.[i]?.NomineeName?.message}
                              </div>
                            </div>
                            <div className="form-group col">
                              <DateCustom succesDate={DateFormSet} date={getValues(`Nominee.${i}.NomineeBDate`)} clearDate={clearDateForm} currentMax={"Today"} index={i} error={errors?.Nominee?.[i]?.NomineeBDate} />
                              <input
                                type="text"
                                {...register(`Nominee.${i}.NomineeBDate`)}
                                maxLength={10}
                                className={`form-control d-none has-value text-uppercase ${errors?.dob ? "is-invalid" : ""
                                  }`}
                                autoComplete="off"
                              />
                              {/* <input
                                type="date"
                                placeholder="DD/MM/YYYY"
                                name={`Nominee[${i}]NomineeBDate`}
                                max={DateReverse}
                                {...register(`Nominee.${i}.NomineeBDate`, {
                                  onChange: (e) => {
                                    ageCheck(i, e);
                                  },
                                  onBlur: (e) =>
                                    ME_EventTriggered(`Nomininee${i + 1}NomineeBDate`, { "NomineeBDate":e.target.value })
                                })}
                                className={`form-control has-value ${
                                  errors?.Nominee?.[i]?.NomineeBDate
                                    ? "is-invalid"
                                    : ""
                                }`}
                              /> */}
                              <label className="form-label">
                                {
                                  Language[
                                    localStorage.getItem("language") ||
                                    "English"
                                  ].NOMINEE_DOB
                                }
                                <span className="label-required">*</span>
                              </label>
                              <div className="invalid-feedback">
                                {errors?.Nominee?.[i]?.NomineeBDate?.message}
                              </div>
                              <div
                                className={`invalid-feedback nom-error${i}`}
                              ></div>
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group col select-wrapper">
                              <select
                                name={`Nominee[${i}]Relationship`}
                                {...register(`Nominee.${i}.Relationship`, {
                                  onBlur: (e) =>
                                    ME_EventTriggered(`Nomininee${i + 1}Relationship`, { "Relationship": e.target.value })
                                })
                                }
                                className={`form-control has-value nomine-dropdown ${errors?.Nominee?.[i]?.Relationship
                                  ? "is-invalid"
                                  : ""
                                  }`}
                              >
                                {relationName.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.text}
                                  </option>
                                ))}
                              </select>

                              <label className="form-label">
                                {
                                  Language[
                                    localStorage.getItem("language") ||
                                    "English"
                                  ].RELATION_NOMINEE
                                }
                                <span className="label-required">*</span>
                              </label>
                              <div className="invalid-feedback">
                                {errors?.Nominee?.[i]?.Relationship?.message}
                              </div>
                            </div>
                            <div className="form-group col select-wrapper">
                              <select
                                name={`Nominee[${i}]ProofIdentity`}
                                {...register(`Nominee.${i}.ProofIdentity`, {
                                  onChange: (e) => idCheck(i, e),
                                  onBlur: (e) =>
                                    ME_EventTriggered(`Nomininee${i + 1}ProofIdentity`, { "ProofIdentity": e.target.value })
                                })}
                                className={`form-control nominee-proof has-value nomine-dropdown ${errors?.Nominee?.[i]?.ProofIdentity
                                  ? "is-invalid"
                                  : ""
                                  }`}
                              >
                                {proofName.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.text}
                                  </option>
                                ))}
                              </select>
                              <label className="form-label">
                                {
                                  Language[
                                    localStorage.getItem("language") ||
                                    "English"
                                  ].NOMINEE_IDENTITY_PROOF
                                }

                                <span className="label-required">*</span>
                              </label>
                              <div className="invalid-feedback">
                                {errors?.Nominee?.[i]?.ProofIdentity?.message}
                              </div>
                            </div>
                          </div>
                          <div className="form-row flex-wrap-reverse">
                            <div
                              className="form-group col mb-0"
                              ref={sharePercent1Ref}
                            >
                              <input
                                type="number"
                                nameattribute={`sharePercent${i}`}
                                onFocus={(e) => {
                                  if (e.target.value == 0) {
                                    e.target.value = "";
                                  }
                                  e.target.classList.add("speechActive");
                                  setFocusState({ sharePercent: true });
                                }}
                                onKeyPress={(e) => {
                                  perShareValidation(e);
                                }}
                                min={1}
                                max={100}
                                maxLength={3}
                                defaultValue={0}
                                // onBlur={(e)=>BlurSharePercentage(e.target.value)}
                                name={`Nominee[${i}]SharePercent`}
                                {...register(`Nominee.${i}.SharePercent`, {
                                  onChange: (e) => {
                                    shareChange(e);
                                  },
                                  onBlur: (e) =>
                                    ME_EventTriggered(`Nomininee${i + 1}SharePercentageEntered`, { "sharePercentage": e.target.value })
                                })}
                                className={`form-control has-value addSpeech ${errors?.Nominee?.[i]?.SharePercent
                                  ? "is-invalid"
                                  : ""
                                  }`}
                              />
                              <label className="form-label">
                                {
                                  Language[
                                    localStorage.getItem("language") ||
                                    "English"
                                  ].SHARE_PERCENTAGE
                                }
                                <span className="label-required">*</span>
                              </label>
                              {focusState.sharePercent && (
                                <i className="listen-mic">
                                  <svg
                                    className={
                                      startListening
                                        ? "new-icon new-icon-Unmute"
                                        : "new-icon new-icon-Mute"
                                    }
                                    onClick={() => {
                                      !startListening
                                        ? setStartListening(true)
                                        : setStartListening(false);
                                      setFocus(`Nominee.${i}.SharePercent`);
                                    }}
                                  >
                                    {
                                      startListening
                                        ? <use href="#new-icon-Unmute"></use>
                                        : <use href="#new-icon-Mute"></use>
                                    }
                                  </svg>
                                </i>
                              )}
                              <div className="invalid-feedback">
                                {errors?.Nominee?.[i]?.SharePercent?.message}
                              </div>
                            </div>

                            <div
                              className={`form-group col ml-auto ninput-${i}`}
                            >
                              <div className="inputFeild">
                                <input
                                  type="text"
                                  placeholder=""
                                  nameattribute={`proofIdentityNo${i}`}
                                  onFocus={(e) => {
                                    e.target.classList.add("speechActive");
                                    setFocusState({ proof: true });
                                  }}
                                  onInput={(e) => identityInput(e, i, "nominee")}
                                  onKeyPress={(e) => {
                                    idNumberValidation(e);
                                  }}
                                  onPaste={(e) => e.preventDefault()}
                                  name={`Nominee[${i}]ProofIdentityNo`}
                                  {...register(`Nominee.${i}.ProofIdentityNo`, {
                                    onChange: (e) =>
                                      nomineeIdChange(e, i, `nomineeid-error`),
                                    onBlur: (e) =>
                                      ME_EventTriggered(`Nomininee${i + 1}ProofIdentityNo`, { "ProofIdentityNo": e.target.value })
                                  })}
                                  className={`form-control has-value text-uppercase  ${errors?.Nominee?.[i]?.ProofIdentityNo
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                />
                                <label htmlFor="" className="form-label">
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].IDENTITY_NUMBER
                                  }

                                  <span className="label-required">*</span>
                                </label>
                                {focusState.proof && (
                                  <i className="listen-mic">
                                    <svg
                                      className={
                                        startListening
                                          ? "new-icon new-icon-Unmute"
                                          : "new-icon new-icon-Mute"
                                      }
                                      onClick={() => {
                                        !startListening
                                          ? setStartListening(true)
                                          : setStartListening(false);
                                        setFocus(`Nominee.${i}.ProofIdentityNo`);
                                      }}
                                    >
                                      {
                                        startListening
                                          ? <use href="#new-icon-Unmute"></use>
                                          : <use href="#new-icon-Mute"></use>
                                      }
                                    </svg>
                                  </i>
                                )}
                                <div className="invalid-feedback">
                                  {
                                    errors?.Nominee?.[i]?.ProofIdentityNo
                                      ?.message
                                  }
                                </div>
                                <div
                                  className={`invalid-feedback nomineeid-error${i}`}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`${i}-guardian nominee-guardian`}>
                          <h3 className="nominee-guardian-heading mb-5">
                            Guardian Details
                          </h3>
                          <input
                            type="checkbox"
                            name={`Nominee[${i}]isminor`}
                            {...register(`Nominee.${i}.isminor`)}
                            className="d-none"
                          />
                          <div className="form-row ">
                            <div className="form-group d-none">
                              <input
                                type="text"
                                name={`Nominee[${i}]GuardId`}
                                {...register(`Nominee.${i}.GuardId`)}
                                value={0}
                              />
                            </div>
                            <div className="form-group col">
                              <input
                                type="text"
                                // onKeyDown={(e) => nameValidation(e)}
                                onInput={(e) => nameValidation(e)}
                                name={`Nominee[${i}]GaurdName`}
                                {...register(`Nominee.${i}.GaurdName`)}
                                className={`form-control has-value ${errors?.Nominee?.[i]?.GaurdName
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                maxLength={100}
                              />

                              <label className="form-label">
                                Guardian Name
                                <span className="label-required">*</span>
                              </label>
                              <div className="invalid-feedback">
                                {errors?.Nominee?.[i]?.GaurdName?.message}
                              </div>
                            </div>
                            <div className="form-group col">
                              <DateCustom succesDate={GDateFormSet} date={getValues(`Nominee.${i}.GaurdBDate`)} clearDate={GclearDateForm} currentMax={"Minor"} index={i} error={errors?.Nominee?.[i]?.GaurdBDate} />
                              <input
                                type="date"
                                placeholder="DD/MM/YYYY"
                                name={`Nominee[${i}]GaurdBDate`}
                                max={minDate}
                                {...register(`Nominee.${i}.GaurdBDate`, {
                                  onChange: (e) =>
                                    guardianDate(e, `dob-error${i}`),
                                })}
                                className={`form-control d-none has-value ${errors?.Nominee?.[i]?.GaurdBDate
                                  ? "is-invalid"
                                  : ""
                                  }`}
                              />
                              <label className="form-label">
                                Guardian DOB
                                <span className="label-required">*</span>
                              </label>
                              <div className={`invalid-feedback`}>
                                {errors?.Nominee?.[i]?.GaurdBDate?.message}
                              </div>
                              <div
                                className={`invalid-feedback dob-error${i}`}
                              ></div>
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group col select-wrapper">
                              <select
                                name={`Nominee[${i}]GaurdRelationship`}
                                {...register(`Nominee.${i}.GaurdRelationship`)}
                                className={`form-control has-value nomine-dropdown ${errors?.Nominee?.[i]?.GaurdRelationship
                                  ? "is-invalid"
                                  : ""
                                  }`}
                              >
                                {GuardianrelationName.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.text}
                                  </option>
                                ))}
                              </select>

                              <label className="form-label">
                                Guardian is Nominee’s
                                <span className="label-required">*</span>
                              </label>
                              <div className="invalid-feedback">
                                {
                                  errors?.Nominee?.[i]?.GaurdRelationshipl
                                    ?.message
                                }
                              </div>
                            </div>
                            <div className="form-group col select-wrapper">
                              <select
                                name={`Nominee[${i}]GaurdProofIdentity`}
                                {...register(
                                  `Nominee.${i}.GaurdProofIdentity`,
                                  {
                                    onChange: (e) => idCheck(i, e),
                                  }
                                )}
                                className={`form-control  guardian-proof has-value nomine-dropdown ${errors?.Nominee?.[i]?.GaurdProofIdentity
                                  ? "is-invalid"
                                  : ""
                                  }`}
                              >
                                {guardianProofName.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.text}
                                  </option>
                                ))}
                              </select>
                              <label className="form-label">
                                Guardian Identity Proof
                                <span className="label-required">*</span>
                              </label>
                              <div className="invalid-feedback">
                                {
                                  errors?.Nominee?.[i]?.GaurdProofIdentity
                                    ?.message
                                }
                              </div>
                            </div>
                          </div>
                          <div className="form-row">
                            <div
                              className={`form-group col mb-0 ml-auto ginput-${i}`}
                            >
                              <div className="inputFeild">
                                <input
                                  type="text"
                                  placeholder=""
                                  onInput={(e) => identityInput(e, i, "guardian")}
                                  onKeyPress={(e) => {
                                    guardianIdNumberValidation(e);
                                  }}
                                  onPaste={(e) => e.preventDefault()}
                                  name={`Nominee[${i}]GaurdProofIdentityNo`}
                                  {...register(
                                    `Nominee.${i}.GaurdProofIdentityNo`,
                                    {
                                      onChange: (e) =>
                                        guardianIdValue(e, `id-error${i}`),
                                    }
                                  )}
                                  className={`form-control has-value text-uppercase Nominee.${i}.GaurdProofIdentityNo ${errors?.Nominee?.[i]?.GaurdProofIdentityNo
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                />
                                <label htmlFor="" className="form-label">
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].IDENTITY_NUMBER
                                  }

                                  <span className="label-required">*</span>
                                </label>
                                <div className="invalid-feedback">
                                  {
                                    errors?.Nominee?.[i]?.GaurdProofIdentityNo
                                      ?.message
                                  }
                                </div>
                                <div
                                  className={`invalid-feedback id-error${i}`}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <p className="share-error"></p>
                    <div className="d-flex justify-content-between align-item-center position-relative">
                      <a type="button" onClick={addNom} className="nominee-add">
                        {/* <i className="icon-add nominee-add-icon" /> */}
                        <svg class="new-icon new-icon-add nominee-add-icon"><use href="#new-icon-add"></use></svg>
                        <p className="nominee-add-text">
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].ADD_NOMINEE_DETAILS
                          }
                        </p>
                      </a>
                    </div>
                    <div className="nominee-bottom">
                      <button
                        className="continue-btn"
                        style={{
                          backgroundColor: isInValid ? "#bcbcbc" : "#ff5500",
                        }}
                        type="submit"
                        disabled={pageBtn}
                      >
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].CONTINUE
                        }
                      </button>
                      <p className="nominee-bottom-txt">
                        <a
                          className="social-btn"
                          onClick={(e) => {
                            skipNominee(e)
                            ME_EventTriggered("SkipAndDoItLaterClicked")
                          }}
                        >
                          {
                            Language[
                              localStorage.getItem("language") || "English"
                            ].SKIP_LATER
                          }
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </Col>
              <Col className="position-inherit" md="5">
                <div className="d-flex flex-column h-100">
                  <ChatCard
                    chatSubtitle={
                      "There is Rs.82000 Cr unaccounted due to improper or lack of nominee in a user’s account. But hey! Don’t worry you’ve already made a smart choice"
                    }
                  />
                  <div className="user-bottom-img nominee-details">
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
}
export default NomineeDetail;
