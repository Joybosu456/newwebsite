import { React, useState, useEffect, useRef } from "react";
import screen_img from "../assets/images/screen.gif";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { dobVal, panVal } from "../Validation.js";
import BottomList from "../components/BottomList";
import "react-toastify/dist/ReactToastify.css";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import { useSpeechRecognition } from "react-speech-kit";
import { SERVICES } from "../common/constants";
import axios from "axios";
import {
  validatePan,
  getSearchParameters,
  EkcyDate,
  shareError,
  decryptUserData,
  ME_EventTriggered,
  dateInput,
  sendToCleverTap
} from "../common/common.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Language from "../common/Languages/languageContent.json";
import { panValidationApi } from "../ApiMethod/LandingApi";
import DateCustom from "../components/DateCustom";
function NewPanDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [startListening, setStartListening] = useState();
  const [panSeedPopUp, setPanSeedPopUp] = useState(false)
  const pan1Ref = useRef(null);
  const [focusState, setFocusState] = useState({
    pan1: false,
    pan2: false,
  });
  const [pageBtn, setPageBtn] = useState(false);

  const schema2 = yup.object().shape({
    fullname: yup.string().required("This is required"),
    fathername: yup
      .string()
      .required("This is required")
      .matches(
        /^((\b[A-Za-z]{1,40}\b)\s*){1,}$/,
        "This is not valid Father Name"
      ),
    pan: yup.string().required("This is required"),
    dob: yup.string().required("This is required"),
  });

  const {
    handleSubmit: handleSubmit2,
    register: register2,
    formState: { errors: errors2 },
    reset: reset2,
    formState,
    setValue: setValue2,
  } = useForm({ resolver: yupResolver(schema2), mode: "onChange" });



  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      if (document.activeElement.getAttribute("nameattribute") === "pan1")
        setValue("pan", result.split(" ").join(""));
    },
  });


  useEffect(() => {
    sendToCleverTap("BFSL_APPLICATION_VIEWED", {
      EP_PAGE_NAME: "PAN VERIFICATION PAGE",
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
  }, []);

  //  Datta added @27-07-2023 for Landing Pages start
  useEffect(() => {
    var params = getSearchParameters();
    console.log(params, "params");
    if (params.panvalue && params.mobilenumber) {
      localStorage.clear()
      localStorage.setItem("audioPlayed", "played");
      localStorage.setItem("telecaller", "no");
      localStorage.setItem("mobile", params.mobilenumber);
      console.log(params.panvalue && params.mobilenumber, "params");
      getPanTele(params.mobilenumber);
    }
  }, []);


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
        const [year, month, day] = [DOB[2], DOB[0], DOB[1]]
        if (day && month && year) {
          reset({
            pan: response.data.Response.Pan || "",
            dob: `${day}-${month}-${year}` || ""
          });
        } else {
          reset({
            pan: response.data.Response.Pan || "",
            dob: ""
          });
        }


        // reset({
        //   pan: response.data.Response.Pan || "",
        //   dob: `${day}-${month}-${year}` || ""
        // });

      } else {
      }
    } catch (err) {
      setLoading(false);
      throw new Error(err.message)
    }
  };

  //  Datta added @27-07-2023 for Landing Pages start

  useEffect(() => {
    startListening ? listen() : stop();
  }, [startListening]);

  useEffect(() => {
    let params = getSearchParameters();
    if (params.req) {
      let userData = JSON.parse(decryptUserData(params.req));
      setValue("pan", userData.panNo || "");
      setValue("dob", userData.dob.split("/").reverse().join("-") || "");
    } else {
      // setValue("dob", "17-08-1998");
      return;
    }
  }, []);
  const schema = Yup.object().shape({
    pan: panVal,
    dob: dobVal,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
    clearErrors
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange"
  });


  useEffect(() => {

    reset({
      pan: localStorage.getItem("Pan") || "",
      dob: localStorage.getItem("Dob")?.reverseDob() || ""
    });
  }, [])

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
            fatherName: "",
            dob: localStorage.getItem("Dob") || "",
            fullname: localStorage.getItem("FullName") || "",
            email: "",
            screen: 2,
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

  const onSubmit = async (value) => {
    let DobStatus = shareError(getValues("dob"), "dob-error");
    console.log(DobStatus, "DobStatus");
    if (DobStatus) {
      setPageBtn(true)
      ME_EventTriggered("SubmitForm", value)
      const { panResonse, panError } = await panValidationApi(value)
      if (panResonse) {   // navigate("/pan-details")
        let ResType = typeof panResonse.Response;
        console.log(ResType);
        if (ResType == "string") {
          console.log("string");

          if (panResonse.Response == "Valid Pan But Aadhaar Not Seeded") {
            setPanSeedPopUp(true)
            return
          } else {
            setPanSeedPopUp(false);
            toast.error(panResonse.Response)
          }
        } else if (ResType == "object") {

          sendToCleverTap("BFSL_APPLICATION_CLICKED", {
            EP_PAGE_NAME: "PAN VERIFICATION PAGE",
            EP_PAN: panResonse.Response.pan,
            EP_DOB: panResonse.Response.dob,
            EP_OTP_CTA: "CONTINUE",
          });

          localStorage.setItem("Dob", panResonse.Response.dob || "");

          localStorage.setItem(
            "FirstName",
            panResonse.Response.firstName.replace(/[^a-zA-Z0-9]/g, "")
          );
          localStorage.setItem(
            "LastName",
            panResonse.Response.lastName.replace(/[^a-zA-Z0-9]/g, "")
          );
          localStorage.setItem(
            "mobile",
            panResonse.Response.mobile
          );

          localStorage.setItem(
            "Pan",
            panResonse.Response.pan
          );
          let fatherName = "";
          if (panResonse.Response.dependentFName !== "") {
            fatherName = panResonse.Response.dependentFName;
          }
          if (panResonse.Response.dependentMName !== "") {
            if (fatherName !== "") {
              fatherName =
                fatherName + " " + panResonse.Response.dependentMName;
            } else {
              fatherName = panResonse.Response.dependentMName;
            }
          }
          if (panResonse.Response.dependentLName !== "") {
            if (fatherName !== "") {
              fatherName =
                fatherName + " " + panResonse.Response.dependentLName;
            } else {
              fatherName = panResonse.Response.dependentLName;
            }
          }
          localStorage.setItem("FatherName", fatherName?.trim() || "");
          localStorage.setItem("FullName", panResonse.Response.name?.trim() || "");
          localStorage.setItem("KraStatus", panResonse.Response.kraStatus);
          leadCapture();
          // if (panResonse.Response.isPanUpdate) {
          //   navigate("/email-verification")
          // } else {
          //   navigate("/pan-details")
          // }
            navigate("/email-verification")


        }

      } else if (panError) {
        toast.error(panError.message)
      }
      setPageBtn(false)
    }




  };
  console.log(getValues("dob"), "date");


  const DateFormSet = (data) => {
    console.log(data, "data");
    setValue("dob", data)

    console.log("new date setF");
    clearErrors("dob");
    shareError(getValues("dob")
      , "dob-error")
  }
  const clearDateForm = (data) => {
    setValue("dob", data)
    shareError(getValues("dob")
      , "dob-error")
  }

  return (
    <>
      <div className={`${loading ? "loader" : " "}`}>
        {loading && (
          <>
            <img src={bajaj_loaderimg} className="loader-img" />
          </>
        )}
        <main className="main-content">
          <Container className="h-md-100 ">
            <Row className="h-md-100 ">
              <Col lg={7}>
                <div className="page-left landing-page viewheight">
                  <div>
                    <h2 className="page-title text-capitalize">
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .OPEN_YOUR
                      }
                      <span>
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].Free_Demat_Acc
                        }
                      </span>
                    </h2>
                    <h3 className="page-subtitle">
                      {
                        Language[localStorage.getItem("language") || "English"]
                          .Investment_Journey
                      }
                    </h3>
                  </div>
                  <form
                    className="page-form landing-form"
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="row">
                      <div className="col-md-6 mb-1">
                        <div
                          className="form-group pan-input custom-suggest"
                          ref={pan1Ref}
                        >
                          <span className="tooltiptext">
                            Enter your 10 digit PAN
                          </span>
                          <input
                            type="text"
                            maxLength={10}
                            nameattribute="pan1"
                            name="pan-input"
                            id="pan-landing"
                            onFocus={() => setFocusState({ pan1: true })}
                            onBlur={() => {
                              setFocusState({ pan1: false });
                              setStartListening(false);
                            }}
                            onKeyPress={(e) => validatePan(e)}
                            {...register("pan", {
                              onBlur: (e) =>
                                ME_EventTriggered("PANEntered", { "PANEntered": e.target.value })

                            })}
                            className={`mt-2 form-control has-value text-uppercase ${errors?.pan ? "is-invalid" : ""
                              }`}
                          />
                          <label
                            htmlFor="pan-landing"
                            className="form-label text-uppercase"
                          >
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].Enter_Pan
                            }
                            <span className="label-required">*</span>
                          </label>
                          {focusState.pan1 && (
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
                                pan1Ref.current.children[1].focus();
                              }}
                            />
                          )}
                          <div className="invalid-feedback">
                            {errors.pan?.message}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-1">
                        <div className="form-group">
                          <DateCustom succesDate={DateFormSet} date={getValues("dob")} clearDate={clearDateForm} currentMax={"Minor"} error={errors?.dob} />
                          <input
                            type="text"
                            {...register("dob", {
                              onChange: (e) =>
                                shareError(e.target.value, "dob-error"),
                              onBlur: (e) =>
                                ME_EventTriggered("DOB", { "DOB": e.target.value })
                            })}
                            onInput={(e) => dateInput(e)}
                            maxLength={10}
                            className={`form-control d-none has-value text-uppercase ${errors?.dob ? "is-invalid" : ""
                              }`}
                            autoComplete="off"
                          />
                          <label
                            htmlFor="date-input"
                            className="form-label text-uppercase"
                          >
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].DOB
                            }

                            <span className="label-required">*</span>
                          </label>
                          <div className="invalid-feedback">
                            {errors.dob?.message}
                          </div>
                          <div className="invalid-feedback dob-error"></div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <button type="submit" className="otp-btn pan-form" disabled={pageBtn}>
                          CONTINUE
                        </button>
                      </div>
                    </div>
                  </form>
                  <BottomList />
                </div>
              </Col>
              <Col lg={5}>
                <div className="screen-img">
                  <img src={screen_img} alt="" width="534" height="379" />
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
      <Modal
        show={panSeedPopUp}
        onHide={() => setPanSeedPopUp(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        className="popup"
      >
        <div className="close" onClick={() => setPanSeedPopUp(false)}>
          {/* <i className="icon-close" /> */}
          <svg class="new-icon new-icon-close">
            <use href="#new-icon-close"></use>
          </svg>
        </div>
        <Modal.Body>
          <div className="landing-popup-txt">
            “We regret to inform you that you will not be able to proceed ahead
            as your PAN is not linked with your Aadhar. As per the new
            regulatory guidelines it is mandatory to have your PAN linked with
            Aadhar to carry out any financial transactions.{" "}
            <a
              target="_blank"
              className="link_tag"
              href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar"
              rel="noreferrer"
            >
              Click here
            </a>{" "}
            to link your PAN with Aadhar now.”
          </div>
        </Modal.Body>
      </Modal>

    </>
  );
}
export default NewPanDetails;
