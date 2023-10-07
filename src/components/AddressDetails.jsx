import React, { useEffect, useState, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Col, Container, Row } from "react-bootstrap";
import PageProgress from "../components/PageProgress";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatCard from "./ChatCard";
import userBottomImg from "../assets/images/person-images/person-sitting.png";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import { SERVICES } from "../common/constants";
import { useSpeechRecognition } from "react-speech-kit";
import Language from "../common/Languages/languageContent.json";
import { AESDecryption, ME_EventTriggered, playAudio, sendToCleverTap } from "../common/common";

function AddressDetailManual() {
  const [addresssDetails, setAddressDetails] = useState();
  const [getCity, setGetCity] = useState();
  const [getState, setGetState] = useState();
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState();
  const [startListening, setStartListening] = useState(false);
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);
  const address3Ref = useRef(null);
  const pincodeRef = useRef(null);
  const [focusState, setFocusState] = useState({
    address1: false,
    address2: false,
    address3: false,
    pincode: false,
  });
  const navigate = useNavigate();
  useEffect(() => {
    let user = localStorage.getItem("ExistUqId");
    if (user === null || user === "" || user === "null") {
      window.location.replace(window.origin);
    }
  }, []);
  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      let voiceValue = result;

      if (document.activeElement.getAttribute("nameattribute") === "address1")
        setValue("addressDetailsOne", voiceValue);
      else if (
        document.activeElement.getAttribute("nameattribute") === "address2"
      )
        setValue("addressDetailsTwo", voiceValue);
      else if (
        document.activeElement.getAttribute("nameattribute") === "address3"
      )
        setValue("addressDetailsThree", voiceValue);
      else if (
        document.activeElement.getAttribute("nameattribute") === "pincode"
      )
        setValue("pincode", voiceValue.split(" ").join(""));
    },
  });

  useEffect(() => {
    startListening ? listen() : stop();
  }, [startListening]);

  useEffect(() => {
    sendToCleverTap("EP_PAGE_NAME", {
      EP_PAGE_NAME: "ADDRESS DETAILS PAGE",
    });
    if (addresssDetails === null) {
      sendToCleverTap("EP_PAGE_NAME", {
        EP_PAGE_NAME: "ADDRESS DETAILS PAGE",
      });
      ResumeApplication();
    }
  }, []);

  useEffect(() => {
    if (addresssDetails) {
      setGetCity(addresssDetails.City);
      setGetState(addresssDetails.State);
      reset({
        addressDetailsOne: addresssDetails.Address1 || "",
        addressDetailsTwo: addresssDetails.Address2 || "",
        addressDetailsThree: addresssDetails.Address3 || "",
        city: addresssDetails.City || "",
        pincode: addresssDetails.Zipcode || "",
        state: addresssDetails.State || "",
      });
    }
  }, [addresssDetails]);

  const schema = yup.object().shape({
    addressDetailsOne: yup.string().required("please enter valid details"),
    addressDetailsTwo: yup.string(),
    addressDetailsThree: yup.string(),
    pincode: yup
      .string()
      .required("This is required")
      .matches(/^(\d{0}|\d{6})$/, "This is not valid pincode "),
    city: yup.string().required("please enter valid details"),
    state: yup.string().required("please enter valid details"),
  });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange", 
    resolver: yupResolver(schema),
  });
  const onSubmitHandler = (values) => {
    AddressDetailsManually(values);
    sendToCleverTap("BFSL_APPLICATION_CLICKED", {
      EP_PAGE_NAME: "ADDRESS DETAILS PAGE",
      EP_ADDRESS_LINE1:values.addressDetailsOne,
      EP_ADDRESS_LINE2:values.addressDetailsTwo,
      EP_ADDRESS_LINE3:values.addressDetailsThree,
      EP_PINCODE:values.pincode,
      EP_CITY:values.city,
      EP_STATE:values.state,
      EP_CTA: "PROCEED",
    });
    ME_EventTriggered("Proced Click", values)
  };

  const formvalue = watch();
  const checkLength = (e) => {
    let ApiLength = e.target.value.length;
    const result = e.target.value.replace(/[^0-9]/gi, "");
    setValue("pincode", result);
    if (ApiLength === 6) {
      FindPinCode(e.target.value);
    }
  };
  const AddressDetailsManually = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        SERVICES.CLIENTSAVE,
        {
          insertAddressDetails: {
            address1: values.addressDetailsOne.toUpperCase(),
            address2: values.addressDetailsTwo
              ? values.addressDetailsTwo.toUpperCase()
              : "",
            address3: values.addressDetailsThree
              ? values.addressDetailsThree.toUpperCase()
              : "",
            zipCode: values.pincode,
            cityCode: values.city.toUpperCase(),
            stateCode: values.state.toUpperCase(),
            uqId:
              clientData?.FlagRes?.UQID || localStorage.getItem("ExistUqId"),
            flag: "address-details",
          },

          screenType: 10,
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setLoading(false);
      if ((response.data.Response.data = "Inserted Successfully")) {
        playAudio(11);
        navigate(`/bank-detail`);
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };
  const FindPinCode = async (value) => {
    try {
      const response = await axios.post(
        SERVICES.ZIPCODE,

        {
          pincode: value,
        },

        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setValue("city", response.data.Response[0].CITYNAME, {
        shouldvalidated: true,
      });
      setValue("state", response.data.Response[0].STATEDESC, {
        shouldvalidated: true,
      });
      setValue("pincode", response.data.Response[0].ZIPCODE, {
        shouldvalidated: true,
      });
    } catch (err) {
      throw new Error(err.message)

    }
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
      setAddressDetails(resumeResp.Response.AddressRes);
      if (resumeResp.Response) {
        setClientData(resumeResp.Response);
        localStorage.setItem("ExistUqId", resumeResp.Response.FlagRes.UQID);
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };
  useEffect(() => {
    ResumeApplication();
  }, []);

  // const validated = (e) => {
  //   if (window.event) {
  //     var charCode = window.event.keyCode;
  //   }

  //   if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)) {
  //   } else {

  //     e.preventDefault();
  //   }
  // };
  function SpecialHandle(event, block) {
    const result = event.target.value.replace(/[^a-zA-Z0-9:,-//\s]/gi, "");
    setValue(block, result);
  }

  // const BlurSharePercentage = (e) => {
  //   console.log("bhakti",e.target.value);
  // };


  return (
    <div>
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
              <Col lg="8" className="nominee-detail">
                <div className="page-header">
                  <Link className="back-button" to="/personal-detail">
                    <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                  </Link>

                  <h2 className="page-title">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .FILL_ADDRESS_DETAILS
                    }
                  </h2>

                  <h3 className="page-subtitle">
                    {
                      Language[localStorage.getItem("language") || "English"]
                        .STAYPATIENT
                    }
                  </h3>
                </div>

                <div className="nominee-detail-info common-card pr-0 pt-0 pb-0">
                  <form
                    className="nominee-form"
                    onSubmit={handleSubmit(onSubmitHandler)}
                  >
                    <div className="nominee-detail-info nominee-form wrapper-0 mb-0">
                      <h2>
                        {" "}
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].ADDRESS
                        }
                      </h2>

                      <div className="nominee">
                        <a type="button" className="nominee-rem ml-auto">
                          <svg class="new-icon new-icon-minus"><use href="#new-icon-minus"></use></svg>
                        </a>

                        <div className="form-row ">
                          <div className="form-group col" ref={address1Ref}>
                            <input
                              type="text"
                              name="addressDetailsOne"
                              nameattribute="address1"
                              onFocus={() => setFocusState({ address1: true })}
                              onBlur={(e) => {
                                setFocusState({ address1: false });
                                setStartListening(false);
                              }}
                              maxLength={100}
                              className={`form-control text-uppercase has-value ${addresssDetails ? "has-value" : ""
                                }  ${errors.addressDetailsOne ? "is-invalid" : ""
                                }`}
                              {...register("addressDetailsOne", {
                                onBlur: (e) =>
                                  ME_EventTriggered("addressDetailsOne", { "addressDetailsOne": e.target.value })
                              })}
                              onChange={(e) =>
                                SpecialHandle(e, "addressDetailsOne")
                              }
                            />

                            <label className="form-label">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].Address_Line_1
                              }
                              <span className="label-required">*</span>
                            </label>
                            {focusState.address1 && (

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
                                    address1Ref.current.children[0].focus();
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
                              {errors.addressDetailsOne?.message}
                            </div>
                          </div>

                          <div className="form-group col" ref={address2Ref}>
                            <input
                              type="text"
                              nameattribute="address2"
                              onFocus={() => setFocusState({ address2: true })}
                              onBlur={() => {
                                setFocusState({ address2: false });
                                setStartListening(false);
                              }}
                              maxLength={100}
                              className={`form-control text-uppercase has-value ${addresssDetails ? "has-value" : ""
                                }  ${errors.addressDetailsTwo ? "is-invalid" : ""
                                }`}
                              {...register("addressDetailsTwo", {
                                onBlur: (e) =>
                                  ME_EventTriggered("addressDetailsTwo", { "addressDetailsTwo": e.target.value })
                              }
                              )}
                              onChange={(e) =>
                                SpecialHandle(e, "addressDetailsTwo")
                              }
                            />

                            <label className="form-label">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].Address_Line_2
                              }
                            </label>
                            {focusState.address2 && (
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
                                    address2Ref.current.children[0].focus();
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
                              {errors?.addressDetailsTwo?.message}
                            </div>
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group col" ref={address3Ref}>
                            <input
                              type="text"
                              nameattribute="address3"
                              onFocus={() => setFocusState({ address3: true })}
                              onBlur={() => {
                                setFocusState({ address3: false });
                                setStartListening(false);
                              }}
                              maxLength={100}
                              className={`form-control text-uppercase has-value ${addresssDetails ? "has-value" : ""
                                }  ${errors.addressDetailsThree ? "is-invalid" : ""
                                }`}
                              {...register("addressDetailsThree", {
                                onBlur: (e) =>
                                  ME_EventTriggered("addressDetailsThree", { "addressDetailsThree": e.target.value })
                              })}
                              onChange={(e) =>
                                SpecialHandle(e, "addressDetailsThree")
                              }
                            />

                            <label className="form-label">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].Address_Line_3
                              }
                            </label>
                            {focusState.address3 && (
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
                                    address3Ref.current.children[0].focus();
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
                              {errors?.addressDetailsThree?.message}
                            </div>
                          </div>

                          <div className="form-group col" ref={pincodeRef}>
                            <input
                              type="text"
                              nameattribute="pincode"
                              onFocus={() => setFocusState({ pincode: true })}
                              onBlur={(e) => {
                                setFocusState({ pincode: false });
                                setStartListening(false);
                              }}
                              pattern="[0-9]*"
                              inputMode="numeric"
                              maxLength={6}
                              name="pincode"
                              className={`form-control has-value ${addresssDetails ? "has-value" : ""
                                }  ${errors.pincode ? "is-invalid" : ""}`}
                              {...register("pincode", {
                                onChange: (e) => {
                                  checkLength(e);
                                },
                                onBlur: (e) =>
                                  ME_EventTriggered("pincode", { "pincode": e.target.value })
                              })}
                            />

                            <label className="form-label">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].PINCODE
                              }
                              <span className="label-required">*</span>
                            </label>
                            {focusState.pincode && (
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
                                    pincodeRef.current.children[0].focus();
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
                            <div className="invalid-feedback ">
                              {errors?.pincode?.message}
                            </div>
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group col">
                            <input
                              name="city"
                              className={`form-control text-uppercase has-value ${addresssDetails ? "has-value" : ""
                                }  ${errors.city ? "is-invalid" : ""}`}
                              {...register("city",
                                {
                                  onBlur: (e) =>
                                    ME_EventTriggered("city", { "city": e.target.value })
                                }
                              )}
                              readOnly
                            ></input>

                            <label className="form-label">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].CITY
                              }
                              <span className="label-required">*</span>
                            </label>
                            <div className="invalid-feedback">
                              {errors?.city?.message}
                            </div>
                          </div>

                          <div className="form-group col mb-2">
                            <input
                              name="state"
                              className={`form-control text-uppercase has-value ${addresssDetails ? "has-value" : ""
                                }  ${errors.state ? "is-invalid" : ""}`}
                              {...register("state", {
                                onBlur: (e) =>
                                  ME_EventTriggered("state", { "state": e.target.value })
                              })}
                              readOnly
                            ></input>

                            <label className="form-label">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].STATE
                              }
                              <span className="label-required">*</span>
                            </label>
                            <div className="invalid-feedback">
                              {errors?.state?.message}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="nominee-bottom">
                        {formvalue.pincode &&
                          formvalue.addressDetailsOne &&
                          formvalue.city &&
                          formvalue.state ? (
                          <button
                            className="ekyc-comn-btn  continue-btn mt-4 ml-n2"
                            type="submit"
                          >
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].PROCEED
                            }
                          </button>
                        ) : (
                          <button
                            className="continue-btn mt-4 ml-n2"
                            type="submit"
                          >
                            {
                              Language[
                                localStorage.getItem("language") || "English"
                              ].PROCEED
                            }
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </Col>
              <Col className="position-inherit" lg="4">
                <div className="d-flex flex-column justify-content-between h-100">
                  <ChatCard
                    chatSubtitle={
                      "The concept of address was created by Empress Maria Theresa from modern-day Austria, in the year 1770 to find eligible men for military service. "
                    }
                    link={
                      <span>
                        Source <span className="chat-link-divider">:</span>
                        <span>
                          <a
                            href="https://economictimes.indiatimes.com/wealth/invest/rs-82000-cr-lying-in-unclaimed-bank-a/cs-life-insurance-mutual-funds-pf-how-to-get-your-money-back/articleshow/84089095.cms "
                            target="_blank"
                          >
                            Economic times
                          </a>
                        </span>
                      </span>
                    }
                  />
                  {
                    <div className="user-bottom-img">
                      <img src={userBottomImg} alt="person icon" />
                    </div>
                  }
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
}

export default AddressDetailManual;
