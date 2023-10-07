import { React, useState, useEffect } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import thankyou_left_img from "../assets/images/gif/congrats-gif-1.gif";
import thankyou_main_img from "../assets/images/gif/thankyou.gif";
import gift_icon from "../assets/images/thankyou-page/gift.svg";
import gift_icon_mobile from "../assets/images/thankyou-page/gift-mobile.svg";
import facebook_icon from "../assets/images/thankyou-page/facebook.svg";
import linkedin_icon from "../assets/images/thankyou-page/linkedin.svg";
import whatsapp_icon from "../assets/images/thankyou-page/whatsapp.svg";
import twitter_icon from "../assets/images/thankyou-page/twitter.svg";
// import QR_code from "../assets/images/thankyou-page/google-play-QR-code.svg";
import QR_code from "../assets/images/QR_thankYou.png";

import google_play_img from "../assets/images/thankyou-page/google-play.svg";
import app_store_img from "../assets/images/thankyou-page/app-store.svg";
import InfoCard from "../components/InfoCard";
import { useForm } from "react-hook-form";
import $ from "jquery";
import ReactStars from "react-rating-stars-component";
import userBottomImg from "../assets/images/person-images/Thank-you-user.png";
import axios from "axios";
import { SERVICES } from "../common/constants";
import Language from "../common/Languages/languageContent.json";
import { AESDecryption, sendToCleverTap,getSearchParameters } from "../common/common";

function ThankYou() {

  let score;
  const user = document.querySelector(".thankyou-msg-card .user");
  const dashed = document.querySelector(".thankyou-msg-card .dashed-border");
  const [clientData, setClientData] = useState();
  const [EsignData, setEsignData] = useState({uid:"", uid2:""});
  const [thankyoumodalShow, setthankyouModalShow] = useState(false);
  $(function () {
    $(".personal-input").click(function () {
      $(".thank-btn").prop(
        "disabled",
        $("input.personal-input:checked").length == 0
      );
    });
  });
  console.log(EsignData);
  console.log(EsignData?.uid,"Esign Redirection Data-uid");
  console.log(EsignData?.uid2,"Esign Redirection Data-uid2");
  useEffect(() => {
 
    var params = getSearchParameters();
    let requid;
    console.log(params, "params");
    if (params.uid && params.uid2) {
      localStorage.clear()
      requid = AESDecryption(params.uid);
      console.log(requid);
      console.log(params, "params list"); 
      localStorage.setItem("mobile", requid);
      localStorage.setItem("ExistUqId", params.uid2);
      console.log(params.uid && params.uid2, "params");

      const newEsignData = params
      console.log(newEsignData)
      if(newEsignData.uid && newEsignData.uid2){
        console.log(newEsignData);
        setEsignData({
          // update the uid and uid2
          "uid2": newEsignData.uid2,
          "uid": requid,

        })
      }
      
    }
    
    // This Page reload is for PWA only 
    // localStorage.setItem("source", "BFA_app");
    // console.log("uid",params?.uid);
    // console.log("uid2",params?.uid2);
    sendToCleverTap("BSFL_APPLICATION_VIEWED", {
     
      EP_PAGE_NAME: "SUCCESS PAGE",
      EP_MOBILE_NO: requid || localStorage.getItem("mobile"),
      EP_JOURNEY_NAME: "EKYC BFSL",
      EP_SUCCESS_MESSAGE: "FROM EXPERT PICKED STOCKS TO FINANCING MARGINS AT LOW INTEREST,GET READY TO ENJOY THE BEST OF STOCK MARKET INVESTING."
    });
  }, []);

  useEffect(() => {
    if (EsignData.uid && EsignData.uid2) {
      console.log('RESUMING', EsignData);
      ResumeApplication().then();
    }
  }, [EsignData]);

  const rating = {
    size: 40,
    count: 5,
    isHalf: false,
    value: 4,
    color: "silver",
    activeColor: "orange",
    onChange: (newValue) => {
      console.log(newValue);
      score = newValue;
    },
  };
  const { register, handleSubmit, reset } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });  const onSubmit = () => { 
    sendToCleverTap("NPS_SUBMITTED", {
      EP_NPS_CTA: "SUBMIT",
      EP_NPS_SCORE: score || 4,
      EP_REASON1: "",
      EP_REASON2: "",
      EP_REASON3: "",
      EP_REASON4: "",
      EP_REASON: ""
    });

    reset();
    if ($("input.personal-input:checked").length == 0) {
      $(".thank-btn").prop("disabled", true);
    }
  };
  // useEffect(() => {
  //   ResumeApplication()
  // }, []);

  const welcomeSMS = async (data) => {
    const mobilenumber = data.AccountOpeningRes.Mobile || localStorage.getItem("mobile");
    const refNo = data.FlagRes.Id || localStorage.getItem("refId");
    const emailid = data.AccountOpeningRes.EmailId || localStorage.getItem("emailid");
    const custName = `${data.PersonalDetailsRes.FirstName.replace(/[^a-zA-Z0-9]/g, '')} ${data.PersonalDetailsRes.LastName.replace(/[^a-zA-Z0-9]/g, '')}` || localStorage.getItem("FullName");
    try {
      const response = await axios.post(
        SERVICES.WELCOMESMS,
        {
          mobileNo: mobilenumber,
          customerName: custName,
          url: "",
          option: "",
          refId: refNo,
          emailID: emailid,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
    }
  };

  const welcomeEmail = async (data) => {
    const emailid = data.AccountOpeningRes.EmailId || localStorage.getItem("emailid");
    const refNo = data.FlagRes.Id || localStorage.getItem("refId");
    const custName = `${data.PersonalDetailsRes.FirstName.replace(/[^a-zA-Z0-9]/g, '')} ${data.PersonalDetailsRes.LastName.replace(/[^a-zA-Z0-9]/g, '')}` || localStorage.getItem("FullName");

    try {
      const response = await axios.post(
        SERVICES.WELCOMEEMAIL,
        {
          emailId: emailid,
          customername: custName,
          refid: refNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
    }
  };
  const ResumeApplication = async () => {
    
    try {
      const response = await axios.post(
        SERVICES.CLIENTRESUME,

        {
          resumeClientDetails: {
            mobile: EsignData?.uid || localStorage.getItem("mobile"),
            uqid: EsignData?.uid2 || localStorage.getItem("ExistUqId"),
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
        welcomeSMS(resumeResp.Response);
        welcomeEmail(resumeResp.Response);
      }
    } catch (err) { }
  };
  return (
    <>
      <main className="main-content">
        <Container>
          <Row>
            <Col lg={8} col={12}>
              <div className="page-left">
                <div className="thankyou">
                  <div className="thankyou__card">
                    <div className="thankyou__top">
                      <img
                        className="left-gif thankyou__top-bg-gif"
                        src={thankyou_left_img}
                        alt="left"
                      />
                      <img
                        className="right-gif thankyou__top-bg-gif"
                        src={thankyou_left_img}
                        alt="right"
                      />

                      <img
                        className="thankyou__top-gif"
                        src={thankyou_main_img}
                        alt="Thankyou Gif"
                      />
                      <h4 className="title">
                        {
                          Language[localStorage.getItem("language") || "English"]
                            .CONGRATURATION_TEXT
                        }
                      </h4>
                      <p className="details">
                        {
                          Language[localStorage.getItem("language") || "English"]
                            .PICKED_STOCKS
                        }
                      </p>

                    </div>
                    <div className="thankyou__bottom">
                      <div className="reference-link d-flex">
                        <div className="refer d-flex">
                          <img
                            className="gift-img"
                            src={gift_icon}
                            alt="Gift Img"
                          />
                          <img
                            className="gift-img-mobile"
                            src={gift_icon_mobile}
                            alt="Gift Img Mobiule"
                          />
                          <p className="refer-invite">
                            {
                              Language[localStorage.getItem("language") || "English"]
                                .INVITE_FRIEND
                            }

                          </p>
                          <Link
                            className="common-btn refer-btn"
                            onClick={() => setthankyouModalShow(true)
                            }
                            to
                            role="button"
                          >

                            {Language[localStorage.getItem("language") || "English"].DOWNLOAD_NOW}
                          </Link>
                        </div>
                        <ul className="social d-flex">
                          <li className="social__item">
                            <Link className="social-link" target="_blank" to="https://www.facebook.com/profile.php?id=100094140476736">
                              <img src={facebook_icon} alt="" />
                            </Link>
                          </li>
                          <li className="social__item">
                            <Link className="social-link" target="_blank" to="https://www.linkedin.com/company/bajajfinsec/ ">
                              <img src={linkedin_icon} alt="" />
                            </Link>
                          </li>
                          <li className="social__item">
                            <Link className="social-link" to="https://wa.me/message/WGISDGQFHRYLI1" target="_blank">
                              <img src={whatsapp_icon} alt="" />
                            </Link>
                          </li>
                          <li className="social__item">
                            <Link className="social-link" target="_blank" to="https://t.me/bajajfinservsecurities">
                              <img src={twitter_icon} alt="" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="download-app">
                  <h4 className="download-app__title text-capitalize">
                    {Language[localStorage.getItem("language") || "English"].TRADING_APP}
                  </h4>
                  <div className="download-app__store">
                    <div className="store">
                      <img
                        className="qr-code"
                        src={QR_code}
                        alt="Qr code for play store"
                      />
                      <Link className="store-link" to="">
                        <img src={google_play_img} alt="Play store Link" />
                      </Link>
                    </div>
                    <div className="store">
                      <img
                        className="qr-code"
                        src={QR_code}
                        alt="Qr code for app store"
                      />
                      <Link className="store-link" to="">
                        <img src={app_store_img} alt="APP store Link" />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </Col>
            <Col md={4}>
              <div className="d-flex flex-column justify-content-between">
                <InfoCard />
              </div>
              <div className="user-bottom-img">
                <img src={userBottomImg} alt="person icon" />
              </div>
            </Col>
          </Row>
        </Container>
      </main>

      <Modal
        show={thankyoumodalShow}
        onHide={() => setthankyouModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="feedback-modal"
        centered
        backdrop="static"
        keyboard={false}
      >
        <div className="close" onClick={() => setthankyouModalShow(false)}>
          {/* <i className="icon-close" /> */}
          <svg class="new-icon new-icon-close">
            <use href="#new-icon-close"></use>
          </svg>
        </div>
        <Modal.Body>
          <div>
            <h3 className="modal-title text-left">
              We hope your journey has been great!
            </h3>
            <p className="modal-para text-left">
              Share feedback &amp; rate your experience with us
            </p>
            <form
              className="feedback-form"
              action=""
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="rating d-flex">

                <ReactStars {...rating} />
              </div>
              <div className="tell-us">
                <h4>Tells us what you liked most?</h4>
                <div className="feedback-message form-group">
                  <label>
                    <input
                      className="personal-input"
                      type="checkbox"
                      name="feedbackCheck"
                      defaultValue="Overall process"
                      {...register("feedbackcheck")}
                    />
                    <span className="form-card">Overall process</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="feedbackCheck"
                      defaultValue="Customer support"
                      {...register("feedbackcheck")}
                      className="personal-input"
                    />
                    <span className="form-card">Customer support</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="personal-input"
                      name="feedbackCheck"
                      defaultValue="Speed and efficiency"
                      {...register("feedbackcheck")}
                    />
                    <span className="form-card">Speed and efficiency</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="personal-input"
                      name="feedbackCheck"
                      defaultValue="Easy and intuitive"
                      {...register("feedbackcheck")}
                    />
                    <span className="form-card">Easy and intuitive</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="personal-input"
                      name="feedbackCheck"
                      defaultValue="Journey experience"
                      {...register("feedbackcheck")}
                    />
                    <span className="form-card">Journey experience</span>
                  </label>
                </div>
              </div>
              <div className="add-comments">
                <textarea placeholder="Add your comments here..." />
              </div>
              <button type="submit" className="common-btn thank-btn" disabled>
                Submit
              </button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ThankYou;
