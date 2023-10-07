import React, { useEffect, useState } from "react";
import ChatCard from "../components/ChatCard";
import { Col, Container, Row } from "react-bootstrap";
import LeftHand from "../assets/images/hand-jif-2.gif";
import AlertCircle from "../assets/images/alert-circle.svg";
import DropdownArrow from "../assets/images/dropdown-arrow.svg";
import Thunder from "../assets/images/gif/thunder.gif";
import PageProgress from "../components/PageProgress";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userBottomImg from "../assets/images/person-images/person-packages.png";
import bajaj_loaderimg from "../assets/images/bajaj_loader.gif";
import * as CryptoJS from "crypto-js";
import { SERVICES } from "../common/constants";
// import { AF_EventTriggered } from "../common/Event";
import Language from "../common/Languages/languageContent.json";
import {
  AESDecryption,
  ME_EventTriggered,
  pauseAudio,
  playAudio,
  sendToCleverTap,
} from "../common/common.js";
import priviledge from "../assets/images/subscription/priviledge-1.svg";
import freeStock from "../assets/images/subscription/free-stock.svg";
import freedomScanner from "../assets/images/subscription/freedom-scanner.svg";
import mtf from "../assets/images/subscription/mtf.svg";
import headset from "../assets/images/subscription/headset.svg";
import scanner from "../assets/images/subscription/scanner.svg";
import tradeCall from "../assets/images/subscription/trade-call.svg";
import discountImg from "../assets/images/discount.svg";

const Subscription = () => {
  const [bajajpriviagePack, setBajajPriviagePack] = useState();
  const [freedomPack, setFreedomPack] = useState();
  const [professionalPack, setProfessionalPack] = useState();
  const [packInfo, setPackInfo] = useState();
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState();
  const [cityData, setCityData] = useState("-");
  const [showDiv, setShowDiv] = useState({
    privilege: false,
    professional: false,
    freedom: false,
  });
  const [plus, setPlus] = useState(false);
  const [firstPack, setFirstPack] = useState({});
  const [secondPack, setSecondPack] = useState({});
  const [thirdPack, setThirdPack] = useState({});

  const [isReferal, setIsReferal] = useState(false);
  const [isRefText, setIsRefText] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    let user = localStorage.getItem("ExistUqId");
    if (user === null || user === "" || user === "null") {
      window.location.replace(window.origin);
    } else {
      sendToCleverTap("BFSL_APPLICATION_VIEWED", {
        EP_PAGE_NAME: "PACK SELECTED PAGE",
      });

      ResumeApplication();
    }
  }, []);

  useEffect(() => {  }, [packInfo]);
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
      console.log(resumeResp);
      if (resumeResp.Response.FlagRes.IsKycChanged === "true") {
        navigate("/personal-detail");
      }
      if (
        resumeResp.Response.PersonalDetailsRes.NominateAction === "" ||
        resumeResp.Response.PersonalDetailsRes.Gender === "" ||
        resumeResp.Response.PersonalDetailsRes.IncomeRange === "" ||
        resumeResp.Response.PersonalDetailsRes.MaritalStatus === ""
      ) {
        navigate("/personal-detail");
      } else if (
        resumeResp.Response.BankDetailsRes.AccountNo === "" ||
        resumeResp.Response.BankDetailsRes.AccountType === "" ||
        resumeResp.Response.BankDetailsRes.IfscCode === ""
      ) {
        navigate("/bank-detail");
      } else {
        let City = resumeResp.Response.AddressRes.City;
        if (City) {
          localStorage.setItem("cityName", City);
          setCityData(City);
        }
        // GetPackwisePercentage();

        setPackInfo(resumeResp.Response.PackInfo.PackType);
        if (resumeResp.Response.FlagRes.Imps != "") {
          localStorage.setItem("ifscflag", resumeResp.Response.FlagRes.Imps);
        }
        if (
          resumeResp.Response.FlagRes.Imps == "" ||
          resumeResp.Response.FlagRes.Imps == null ||
          resumeResp.Response.FlagRes.Imps == undefined
        ) {
          localStorage.setItem("ifscflag", "0");
        }

        if (resumeResp.Response.FlagRes.Fno != "") {
          localStorage.setItem("fno", resumeResp.Response.FlagRes.Fno);
        }

        if (resumeResp.Response.FlagRes.IsKyc != "") {
          localStorage.setItem("KYC", resumeResp.Response.FlagRes.IsKyc);
        }
      }

      if (resumeResp.Response) {
        setClientData(resumeResp.Response);
        localStorage.setItem("ExistUqId", resumeResp.Response.FlagRes.UQID);
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };

  const updatePackInfo = async (pack_type, Amount) => {
    ME_EventTriggered(`${pack_type}Selected`);

    localStorage.setItem("packSelected", pack_type);
    localStorage.setItem("amtSelected", Amount);

    // AF_EventTriggered("Payment", "Payment", { onclick: "Payment" });
    try {
      const response = await axios.post(
        SERVICES.UPDATEPACKINFO,
        {
          packType: pack_type,
          packAmount: Amount,
          id:
            clientData?.FlagRes?.Id ||
            localStorage.getItem("UserRefID") ||
            localStorage.getItem("refId"),
          paymentStatus: "", 
          transactionRefNo: "",
        },
        {  
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      let selectedPack = '';
      if(pack_type == "Free Pack"){
        selectedPack = "Freedom Pack"
      }

      if(pack_type == "Professional Pack"){
        selectedPack = "Freedom Pack"
      }

      if(pack_type == "BPC"){
        selectedPack = "Bajaj Privilege Club"
      }

      if (response.data.Response.outflag == "Y") {
        sendToCleverTap("BFSL_APPLICATION_CLICKED", {
          EP_PAGE_NAME: "PACK SELECTED PAGE",
          EP_PACK_SELECTED: selectedPack,
          EP_CTA: "SELECT NOW",
        });

        setLoading(false);
        if (pack_type != "Free Pack") {
          const dataAmount = Amount;
          const dataMobile =
            clientData?.AccountOpeningRes?.Mobile ||
            localStorage.getItem("mobile");
          const redirecturl = SERVICES.DOCUMENT_REDIRECT;
          const iv = "SLF3AMUkbk4QZuIC";
          const key = "OBmzjguunYPBtGy9";
          const fkey = CryptoJS.enc.Utf8.parse(key);
          const fiv = CryptoJS.enc.Utf8.parse(iv);
          const encamount = CryptoJS.AES.encrypt(dataAmount, fkey, {
            iv: fiv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });
          const encmobile = CryptoJS.AES.encrypt(dataMobile, fkey, {
            iv: fiv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });
          const encUrl = CryptoJS.AES.encrypt(redirecturl, fkey, {
            iv: fiv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });
          const finalamount = encamount.ciphertext.toString(
            CryptoJS.enc.Base64
          );
          const finalmobile = encmobile.ciphertext.toString(
            CryptoJS.enc.Base64
          );
          const finalURL = encUrl.ciphertext.toString(CryptoJS.enc.Base64);
          window.location.replace(
            "https://ekycmuatapk.bajajfinservsecurities.in/paymentgateway/Home/Payment?amount=" +
            finalamount +
            "&mobile=" +
            finalmobile +
            "&redirectUrl=" +
            finalURL +
            ""
          );
        } else {
          playAudio(14);
          navigate("/document-upload");
        }
      } else if (response.data.Response == "Already BPC selected") {
        playAudio(14);
        navigate("/document-upload");
      } else if (
        response.data.Response == "Already Professional Pack selected"
      ) {
        playAudio(14);
        navigate("/document-upload");
      }
      else if (response.data.Response == "Already Freedom Plus selected") {
        playAudio(14);
        navigate("/document-upload");
      }

    } catch (err) {
      throw new Error(err.message)

    }
  };

  const GetPackwisePercentage = async () => {
    try {
      const response = await axios.post(
        SERVICES.GETPACKWISEPERCENTAGE,
        {
          CityName: localStorage.getItem("cityName")
            ? localStorage.getItem("cityName").toLowerCase()
            : "Mumbai",
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setBajajPriviagePack(response.data.Response[1]);
      setFreedomPack(response.data.Response[2]);
      setProfessionalPack(response.data.Response[3]);
    } catch (err) {
      throw new Error(err.message)

    }
  };

  const viewMtf = (e) => { };
  const hideMTF = (e) => {
    // e.target.nextSibling.classList.remove("mystyle");
  };
  const openPack = (pack, data) => {
    let newSetTab = { ...showDiv };
    var Truekeys = Object.keys(newSetTab).filter((k) => newSetTab[k] === true);
    Object.keys(newSetTab).forEach(function (key, value) {
      return (newSetTab[key] = false);
    });
    if (Truekeys !== undefined) {
      if (Truekeys[0] == data) {
        setShowDiv({ ...newSetTab });
      } else {
        setShowDiv({ ...newSetTab, ...pack });
      }
    } else {
      setShowDiv({ ...newSetTab, ...pack });
    }
  };

  const AllPackDetails = async () => {
    const mobileNumber = localStorage.getItem("mobile");
    try {
      const response = await axios.post(
        `${SERVICES.GET_ALL_PACK}?Mobile=${mobileNumber}`,
        {
          header: {
            "content-Type": "applicaion/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.Response) {
        setFirstPack({
          packamount: response.data.Response[2].packamount,
          packname: response.data.Response[2].packname.toUpperCase(),
          order: response.data.Response[2].intrarateRs,
        });
        setSecondPack({
          packamount: response.data.Response[1].packamount,
          packname: response.data.Response[1].packname.toUpperCase(),
          order: response.data.Response[1].intrarateRs,
        });
        setThirdPack({
          packamount: response.data.Response[0].packamount,
          packname: response.data.Response[0].packname.toUpperCase(),
          order: response.data.Response[0].intrarateRs,
        });
        if (response.data.Response[0].packname == "Freedom Plus") {
          setPlus(true);
          console.log("pluse true");
        } else {
          setPlus(false);
          console.log("dfalse");
        }
      }
    } catch (err) {
      throw new Error(err.message)

    }
  };
  useEffect(() => {
    GetPackwisePercentage();
    if (process.env.REACT_APP_DOMAIN === "NAOM") {
      AllPackDetails();
      //  NAOM
      if (
        !localStorage.getItem("referralCode") ||
        !localStorage.getItem("referralCode") === ""
      ) {
        if (localStorage.getItem("source") === "Freedom_Plus") {
          //  having Freedom_Plus
          setIsRefText(true);
          setIsReferal(true);
        } else {
          // not having Freedom_Plus
          setIsReferal(false);
          setIsRefText(false);
        }
      } else {
        // having Referal COde
        setIsRefText(true);
        setIsReferal(true);
      }
      // GetPackwisePercentage("NAOM")
    } else {
      // not NAOM
      setIsReferal(false);
      setIsRefText(false);
    }
  }, []);

  return (
    <>
      <PageProgress progress="payment" />
      {loading ? (
        <>
          <img className="loader-css" src={bajaj_loaderimg} alt="" />
        </>
      ) : (
        <>
          <main className="main-content">
            <Container>
              <Row>
                <Col lg="8">
                  <div className="page-left">
                    <div className="page-header">
                      <a
                        role="button"
                        to="/"
                        onClick={() => {
                          navigate("/bank-detail");
                          pauseAudio();
                        }}
                        className="back-button"
                      >
                    <svg class="new-icon new-icon-left-arrow"><use href="#new-icon-left-arrow"></use></svg>
                      </a>
                      <h2 className="page-title">
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].SUITS_UR_NEEDS
                        }
                      </h2>
                      <h3 className="page-subtitle">
                        {
                          Language[
                            localStorage.getItem("language") || "English"
                          ].INVESTING_UR_DECADES
                        }
                      </h3>
                    </div>
                    {isReferal ? (
                      <>
                        <div className="subscribe">
                          <div
                            className={`packs privilege-pack ${showDiv["privilege"] && "active"
                              }`}
                          >
                            <div className="suggestion-msg">
                              <div className="suggestion-top">
                                <img src={LeftHand} alt="left hand icon" />
                              </div>
                              <div className="suggestion-bottom">
                                <p>
                                  <span>
                                    {bajajpriviagePack != undefined ||
                                      (null &&
                                        bajajpriviagePack.packpercentage !=
                                        undefined) ||
                                      null
                                      ? Math.round(
                                        bajajpriviagePack.packpercentage
                                      ) + "%"
                                      : "-"}
                                  </span>
                                  <span>
                                    people from {cityData.toLowerCase()} have
                                    subscribed to this plan
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="packs-wrapper">
                              <div className="packs__left">
                                <h3 className="packs__title">
                                  {firstPack?.packname}
                                </h3>
                                <p className="packs__subtitles">
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].REFERAL_REGULAR_TRADER
                                  }
                                </p>
                                <div className="packs__bottom independence-pack">
                                  <p className="order">
                                    {
                                      Language[localStorage.getItem("language") || "English"].RS_Hindi
                                    }
                                    <span className="pack-delivery-text subs-value">0</span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].for
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Delivery
                                      }
                                    </span>

                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Trades
                                      }
                                    </span>




                                    {/* {firstPack?.order}
                                    {
                                      Language[
                                        localStorage.getItem("language") ||
                                        "English"
                                      ].ORDER
                                    } */}
                                  </p>
                                  <div className="d-flex flex-sm-row align-items-baseline">
                                    {/* <p className="interest">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].PER_9_ANNUM
                                      }
                                    </p>

                                    <p className="mtf" class="tip">
                                      &nbsp;
                                      <img
                                        src={AlertCircle}
                                        alt="alert"
                                        onMouseEnter={(e) => viewMtf(e)}
                                        onMouseLeave={(e) => hideMTF(e)}
                                      />
                                      <p className="sup-tooltip" id="sup">
                                        Margin Trade Funding is an exciting
                                        feature! Buy stocks up to 4 times more
                                        in price, with your limited cash, using
                                        the MTF feature. We charge one of the
                                        lowest interest rates on MTF.
                                      </p>
                                    </p> */}
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].RS_Hindi
                                      }
                                    </span>
                                    <span className="pack-delivery-text subs-value">
                                      {firstPack?.order}
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].for
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].FQ
                                      }
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].and
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Intraday
                                      }
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Trades
                                      }
                                    </span>
                                    {/* <p> for F&Q and Intraday Trades</p> */}
                                  </div>
                                </div>
                                <div className="packs__bottom">
                                  <div className="d-flex flex-sm-row align-items-baseline">
                                    <p className="interest">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].PER_9_ANNUM
                                      }
                                    </p>

                                    <p className="mtf" class="tip">
                                      &nbsp;
                                      <img
                                        src={AlertCircle}
                                        alt="alert"
                                        onMouseEnter={(e) => viewMtf(e)}
                                        onMouseLeave={(e) => hideMTF(e)}
                                      />
                                      <p className="sup-tooltip" id="sup">
                                        Margin Trade Funding is an exciting
                                        feature! Buy stocks up to 4 times more
                                        in price, with your limited cash, using
                                        the MTF feature. We charge one of the
                                        lowest interest rates on MTF.
                                      </p>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="packs__right best-deal pack-bg">
                                <p>
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].RS_Hindi
                                  }
                                  <span className="packs-amount">
                                    {firstPack?.packamount}
                                  </span>
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ]._9999Year
                                  }
                                </p>
                                <button
                                  className={`${packInfo == "BPC" ? "proceed" : "select-now"
                                    }`}
                                  onClick={() => updatePackInfo("BPC", "1")}
                                >
                                  {packInfo == "BPC"
                                    ? Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].PROCEED
                                    : Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].SELECT_NOW}
                                </button>
                              </div>
                            </div>
                            <ul className="packs-list-item">
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={priviledge} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>
                                    * MTF - Margin Trade Financing allows you to
                                    buy more shares than your available capital.
                                    Buy up to 4x more.
                                  </p>
                                </div>
                              </li>
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={headset} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>Dedicated dealing desk support.</p>
                                </div>
                              </li>
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={tradeCall} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>Daily researched trade calls .</p>
                                </div>
                              </li>
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={scanner} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>
                                    Scanners, Trading View chart, Tools and
                                    Calculators.
                                  </p>
                                </div>
                              </li>
                            </ul>
                            {/* dropdown-btn */}
                            <a
                              className="subscribe-dropdown"
                              onClick={() =>
                                openPack({ privilege: true }, "privilege")
                              }
                            >
                              <img src={DropdownArrow} alt="" />
                            </a>
                            <a className="lightning-deal">
                              <img src={Thunder} alt="" />
                            </a>
                            <span className="people-subscribed">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].SUBSCRIPTION_10K
                              }
                            </span>
                          </div>
                          <div
                            className={`packs professional-pack ${showDiv["professional"] && "active"
                              } `}
                          >
                            <div className="packs-wrapper">
                              {/* packs-left side */}
                              <div className="packs__left">
                                <h3 className="packs__title">
                                  {secondPack?.packname}
                                </h3>
                                <p className="packs__subtitles">
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].REFFERAL_TRADE_ONCE_MONTH
                                  }
                                </p>
                                <div className="packs__bottom independence-pack">
                                  {/* order */}
                                  <p className="order">
                                    {
                                      Language[localStorage.getItem("language") || "English"].RS_Hindi
                                    }
                                    <span className="pack-delivery-text subs-value">0</span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].for
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Delivery
                                      }
                                    </span>

                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Trades
                                      }
                                    </span>




                                    {/* {firstPack?.order}
                                    {
                                      Language[
                                        localStorage.getItem("language") ||
                                        "English"
                                      ].ORDER
                                    } */}

                                  </p>
                                  <div className="d-flex flex-sm-row align-items-baseline">

                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].RS_Hindi
                                      }
                                    </span>
                                    <span className="pack-delivery-text subs-value">
                                      {secondPack?.order}
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].for
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].FQ
                                      }
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].and
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Intraday
                                      }
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Trades
                                      }
                                    </span>

                                  </div>

                                </div>
                                <div className="packs__bottom">
                                  <div className="d-flex  flex-sm-row align-items-baseline">
                                    <p className="interest">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].PER_12_ANNUM
                                      }
                                    </p>

                                    <p className="mtf" class="tip">
                                      &nbsp;
                                      <img
                                        src={AlertCircle}
                                        alt="alert"
                                        onMouseEnter={(e) => viewMtf(e)}
                                        onMouseLeave={(e) => hideMTF(e)}
                                      />
                                      <p className="sup-tooltip" id="sup">
                                        Margin Trade Funding is an exciting
                                        feature! Buy stocks up to 4 times more
                                        in price, with your limited cash, using
                                        the MTF feature. We charge one of the
                                        lowest interest rates on MTF.
                                      </p>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* packs-right side */}
                              <div className="packs__right">
                                <p>
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].RS_Hindi
                                  }

                                  <span className="packs-amount">
                                    {secondPack?.packamount}
                                  </span>
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ]._2500Year
                                  }
                                </p>

                                    <button
                                      className={`${packInfo == "Professional Pack"
                                        ? "proceed"
                                        : "select-now"
                                        }`}
                                      onClick={() =>
                                        updatePackInfo("Professional Pack", "2500")
                                      }
                                    >
                                      {packInfo == "Professional Pack"
                                        ? Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].PROCEED
                                        : Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].SELECT_NOW}
                                    </button>
                                  </div>
                                </div>
                                <ul className="packs-list-item">
                                  <li>
                                    <div className="pack-list-item-left">
                                      <img src={priviledge} />
                                    </div>
                                    <div className="pack-list-item-right">
                                      <p>
                                        * MTF - Margin Trade Financing allows you to
                                        buy more shares than your available capital.
                                        Buy up to 4x more.
                                      </p>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="pack-list-item-left">
                                      <img src={headset} />
                                    </div>
                                    <div className="pack-list-item-right">
                                      <p>Dedicated dealing desk support.</p>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="pack-list-item-left">
                                      <img src={tradeCall} />
                                    </div>
                                    <div className="pack-list-item-right">
                                      <p>Daily researched trade calls .</p>
                                    </div>
                                  </li>
                                </ul>
                                {/* dropdown-btn */}
                                <a
                                  className="subscribe-dropdown"
                                  onClick={() =>
                                    openPack({ professional: true }, "professional")
                                  }
                                >
                                  <img src={DropdownArrow} alt="" />
                                </a>
                              </div>
                              {plus ? (
                                <>
                                  <div
                                    className={`packs freedom-pack ${showDiv["freedom"] && "active"
                                      }`}
                                  >
                                    <div className="packs-wrapper">
                                      {/* packs-left side */}
                                      <div className="packs__left">
                                        <h3 className="packs__title">
                                          {thirdPack?.packname}
                                        </h3>
                                        <p className="packs__subtitles pack-bold-txt">
                                          <img src={discountImg} />
                                          <span></span>
                                          {
                                            Language[
                                              localStorage.getItem("language") ||
                                              "English"
                                            ].LIFE_TIME_AMC
                                          }
                                        </p>
                                        <div className="packs__bottom">
                                          {/* order */}
                                          <p className="order">
                                            {
                                              Language[
                                                localStorage.getItem("language") ||
                                                "English"
                                              ].RS_Hindi
                                            }
                                            {thirdPack?.order}
                                            {
                                              Language[
                                                localStorage.getItem("language") ||
                                                "English"
                                              ].ORDER
                                            }
                                          </p>
                                          <div className="d-flex flex-column flex-sm-row align-items-baseline">
                                            {/* interest */}
                                            <p className="interest">
                                              {
                                                Language[
                                                  localStorage.getItem(
                                                    "language"
                                                  ) || "English"
                                                ]._18_ANNUM
                                              }
                                            </p>
                                            {/* mtf */}
                                            {/* <p className="mtf" class="tip">
                                              &nbsp;
                                              <img
                                                src={AlertCircle}
                                                alt="alert"
                                                onMouseEnter={(e) => viewMtf(e)}
                                                onMouseLeave={(e) => hideMTF(e)}
                                              />
                                              <p className="sup-tooltip" id="">
                                                Margin Trade Funding is an exciting
                                                feature! Buy stocks up to 4 times
                                                more in price, with your limited
                                                cash, using the MTF feature. We
                                                charge one of the lowest interest
                                                rates on MTF.
                                              </p>
                                            </p> */}
                                          </div>
                                        </div>
                                      </div>
                                      {/* packs-right side */}
                                      <div className="packs__right">
                                        <p>
                                          <p className="free_value">
                                            {
                                              Language[
                                                localStorage.getItem("language") ||
                                                "English"
                                              ].RS_Hindi
                                            }
                                            {thirdPack?.packamount}
                                          </p>
                                          <span className="small-txt">
                                            {
                                              Language[
                                                localStorage.getItem("language") ||
                                                "English"
                                              ].FREEDOM_ONE_TIME
                                            }
                                          </span>
                                        </p>
                                        <button
                                          className={`${packInfo == "Freedom Plus"
                                            ? "proceed"
                                            : "select-now"
                                            }`}
                                          onClick={() => {
                                            updatePackInfo("Freedom Plus", "1");
                                          }}
                                        >
                                          {packInfo == "Freedom Plus"
                                            ? Language[
                                              localStorage.getItem("language") ||
                                              "English"
                                            ].PROCEED
                                            : Language[
                                              localStorage.getItem("language") ||
                                              "English"
                                            ].SELECT_NOW}
                                        </button>
                                      </div>
                                    </div>
                                    <ul className="packs-list-item">
                                      <li>
                                        <div className="pack-list-item-left">
                                          <img src={freeStock} />
                                        </div>
                                        <div className="pack-list-item-right">
                                          <p>
                                            Free Stock Suggestions Every Day for
                                            Trading and Investing
                                          </p>
                                        </div>
                                      </li>
                                      <li>
                                        <div className="pack-list-item-left">
                                          <img src={freedomScanner} />
                                        </div>
                                        <div className="pack-list-item-right">
                                          <p>
                                            Access to Scanners, Trading View Charts
                                            and Tools, Detailed Reports and much
                                            more.
                                          </p>
                                        </div>
                                      </li>
                                      <li>
                                        <div className="pack-list-item-left">
                                          <img src={mtf} />
                                        </div>
                                        <div className="pack-list-item-right">
                                          <p>
                                            MTF- Margin Trade Financing allows you
                                            to buy more shares than your available
                                            capital. Buy up to 4x more.
                                          </p>
                                        </div>
                                      </li>
                                    </ul>
                                    <a
                                      className="subscribe-dropdown"
                                      onClick={() =>
                                        openPack({ freedom: true }, "freedom")
                                      }
                                    >
                                      <img src={DropdownArrow} alt="" />
                                    </a>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    className={`packs freedom-pack ${showDiv["freedom"] && "active"
                                      }`}
                                  >
                                    <div className="packs-wrapper">
                                      <div className="packs__left">
                                        <h3 className="packs__title">
                                          {thirdPack?.packname}
                                        </h3>
                                        <p className="packs__subtitles">
                                          {
                                            Language[
                                              localStorage.getItem("language") ||
                                              "English"
                                            ].NEW_TO_TRADING_
                                          }
                                        </p>
                                        <div className="packs__bottom">
                                          <p className="order">
                                            {
                                              Language[
                                                localStorage.getItem("language") ||
                                                "English"
                                              ].RS_Hindi
                                            }
                                            {thirdPack?.order}
                                            {
                                              Language[
                                                localStorage.getItem("language") ||
                                                "English"
                                              ].ORDER
                                            }
                                          </p>
                                          <div className="d-flex flex-column flex-sm-row align-items-baseline">
                                            <p className="interest">
                                              {
                                                Language[
                                                  localStorage.getItem(
                                                    "language"
                                                  ) || "English"
                                                ]._18_ANNUM
                                              }
                                            </p>

                                        <p className="mtf" class="tip">
                                          &nbsp;
                                          <img
                                            src={AlertCircle}
                                            alt="alert"
                                            onMouseEnter={(e) => viewMtf(e)}
                                            onMouseLeave={(e) => hideMTF(e)}
                                          />
                                          <p className="sup-tooltip" id="">
                                            Margin Trade Funding is an exciting
                                            feature! Buy stocks up to 4 times
                                            more in price, with your limited
                                            cash, using the MTF feature. We
                                            charge one of the lowest interest
                                            rates on MTF.
                                          </p>
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="packs__right">
                                    <p>
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].RS_Hindi
                                      }
                                      {thirdPack?.packamount}
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].FREE_1_YEAR
                                      }
                                    </p>

                                    <button
                                      className={`${packInfo == "Free Pack"
                                        ? "proceed"
                                        : "select-now"
                                        }`}
                                      onClick={() =>
                                        updatePackInfo("Free Pack", "0")
                                      }
                                    >
                                      {packInfo == "Free Pack"
                                        ? Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].PROCEED
                                        : Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].SELECT_NOW}
                                    </button>
                                  </div>
                                </div>
                                <ul className="packs-list-item">
                                  <li>
                                    <div className="pack-list-item-left">
                                      <img src={freeStock} />
                                    </div>
                                    <div className="pack-list-item-right">
                                      <p>
                                        Free Stock Suggestions Every Day for
                                        Trading and Investing
                                      </p>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="pack-list-item-left">
                                      <img src={freedomScanner} />
                                    </div>
                                    <div className="pack-list-item-right">
                                      <p>
                                        Access to Scanners, Trading View Charts
                                        and Tools, Detailed Reports and much
                                        more.{" "}
                                      </p>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="pack-list-item-left">
                                      <img src={mtf} />
                                    </div>
                                    <div className="pack-list-item-right">
                                      <p>
                                        MTF- Margin Trade Financing allows you
                                        to buy more shares than your available
                                        capital. Buy up to 4x more.
                                      </p>
                                    </div>
                                  </li>
                                </ul>

                                <a
                                  className="subscribe-dropdown"
                                  onClick={() =>
                                    openPack({ freedom: true }, "freedom")
                                  }
                                >
                                  <img src={DropdownArrow} alt="" />
                                </a>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="subscribe">
                          <div
                            className={`packs privilege-pack  ${showDiv["privilege"] && "active"
                              }`}
                          >
                            <div className="suggestion-msg">
                              <div className="suggestion-top">
                                <img src={LeftHand} alt="left hand icon" />
                              </div>
                              <div className="suggestion-bottom">
                                <p>
                                  <span>
                                    {bajajpriviagePack != undefined ||
                                      (null &&
                                        bajajpriviagePack.packcount !=
                                        undefined) ||
                                      null
                                      ? Math.round(bajajpriviagePack.packcount)
                                      : "-"}
                                  </span>
                                  <span>
                                    people from {cityData.toLowerCase()} have
                                    subscribed to this plan
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div
                              className="packs-wrapper"
                              onClick={() =>
                                process.env.REACT_APP_DOMAIN === "PWA" &&
                                updatePackInfo("BPC", "1")
                              }
                            >
                              <div className="packs__left">
                                <h3 className="packs__title">
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].BAJAJ_PRIVILEGE_CLUB
                                  }
                                </h3>
                                <p className="packs__subtitles">
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].NEW_TO_TRADING_IND
                                  }
                                </p>

                                <div className="packs__bottom independence-pack">
                                  <p className="order">

                                    {
                                      Language[localStorage.getItem("language") || "English"].RS_Hindi
                                    }
                                    <span className="pack-delivery-text subs-value">0</span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].for
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Delivery
                                      }
                                    </span>

                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Trades
                                      }
                                    </span>

                                  </p>

                                  <div className="d-flex flex-sm-row align-items-baseline">
                                    {/* <p className="interest">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].PER_9_ANNUM
                                      }
                                    </p>

                                    <p className="mtf" class="tip">
                                      &nbsp;
                                      <img
                                        src={AlertCircle}
                                        alt="alert"
                                        onMouseEnter={(e) => viewMtf(e)}
                                        onMouseLeave={(e) => hideMTF(e)}
                                      />
                                      <p className="sup-tooltip" id="sup">
                                        Margin Trade Funding is an exciting
                                        feature! Buy stocks up to 4 times more
                                        in price, with your limited cash, using
                                        the MTF feature. We charge one of the
                                        lowest interest rates on MTF.
                                      </p>
                                    </p> */}
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].RS_Hindi
                                      }
                                    </span>
                                    <span className="pack-delivery-text subs-value">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Five
                                      }                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].for
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].FQ
                                      }
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].and
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Intraday
                                      }
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Trades
                                      }
                                    </span>

                                  </div>
                                </div>
                                <div className="packs__bottom">
                                  <div className="d-flex flex-sm-row align-items-baseline">

                                    <p className="interest">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].PER_9_ANNUM
                                      }
                                    </p>

                                    <p className="mtf" class="tip">
                                      &nbsp;
                                      <img
                                        src={AlertCircle}
                                        alt="alert"
                                        onMouseEnter={(e) => viewMtf(e)}
                                        onMouseLeave={(e) => hideMTF(e)}
                                      />
                                      <p className="sup-tooltip" id="sup">
                                        Margin Trade Funding is an exciting
                                        feature! Buy stocks up to 4 times more
                                        in price, with your limited cash, using
                                        the MTF feature. We charge one of the
                                        lowest interest rates on MTF.
                                      </p>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="packs__right best-deal pack-bg">
                                <p>
                                  {/* <span> */}
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].RS_Hindi
                                  }
                                  {/* </span> */}
                                  <span className="packs-amount">
                                    {
                                      Language[
                                        localStorage.getItem("language") ||
                                        "English"
                                      ].Amount
                                    }
                                  </span>
                                  {/* <span> */}
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ]._9999Year
                                  }
                                  {/* </span> */}
                                </p>

                                <button
                                  className={`${packInfo == "BPC" ? "proceed" : "select-now"
                                    }`}
                                  onClick={() =>
                                    process.env.REACT_APP_DOMAIN !== "PWA" &&
                                    updatePackInfo("BPC", "1")
                                  }
                                >
                                  {packInfo == "BPC"
                                    ? Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].PROCEED
                                    : Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].SELECT_NOW}
                                </button>
                              </div>
                            </div>
                            <ul className="packs-list-item">
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={priviledge} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>
                                    * MTF - Margin Trade Financing allows you to
                                    buy more shares than your available capital.
                                    Buy up to 4x more.
                                  </p>
                                </div>
                              </li>
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={headset} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>Dedicated dealing desk support.</p>
                                </div>
                              </li>
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={tradeCall} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>Daily researched trade calls .</p>
                                </div>
                              </li>
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={scanner} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>
                                    Scanners, Trading View chart, Tools and
                                    Calculators.
                                  </p>
                                </div>
                              </li>
                            </ul>
                            {/* dropdown-btn */}
                            <a
                              className="subscribe-dropdown"
                              onClick={() =>
                                openPack({ privilege: true }, "privilege")
                              }
                            >
                              <img src={DropdownArrow} alt="" />
                            </a>
                            <a className="lightning-deal">
                              <img src={Thunder} alt="" />
                            </a>
                            <span className="people-subscribed">
                              {
                                Language[
                                  localStorage.getItem("language") || "English"
                                ].SUBSCRIPTION_10K
                              }
                            </span>
                          </div>
                          <div
                            className={`packs professional-pack ${showDiv["professional"] && "active"
                              } `}
                          >
                            <div
                              className="packs-wrapper"
                              onClick={() =>
                                process.env.REACT_APP_DOMAIN === "PWA" &&
                                updatePackInfo("Professional Pack", "1")
                              }
                            >
                              {/* packs-left side */}
                              <div className="packs__left">
                                <h3 className="packs__title">
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].PROFESSIONAL_PACK
                                  }
                                </h3>

                                <p className="packs__subtitles">
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].REFFERAL_TRADE_ONCE_MONTH
                                  }
                                </p>
                                <div className="packs__bottom independence-pack">
                                  {/* order */}
                                  <p className="order">
                                    {
                                      Language[localStorage.getItem("language") || "English"].RS_Hindi
                                    }
                                    <span className="pack-delivery-text subs-value">0</span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].for
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Delivery
                                      }
                                    </span>

                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Trades
                                      }
                                    </span>
                                  </p>
                                  <div className="d-flex flex-sm-row align-items-baseline">
                                    {/* <p className="interest">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].PER_12_ANNUM
                                      }
                                    </p>
                                    <p className="mtf" class="tip">
                                      &nbsp;
                                      <img
                                        src={AlertCircle}
                                        alt="alert"
                                        onMouseEnter={(e) => viewMtf(e)}
                                        onMouseLeave={(e) => hideMTF(e)}
                                      />
                                      <p className="sup-tooltip" id="">
                                        Margin Trade Funding is an exciting
                                        feature! Buy stocks up to 4 times more
                                        in price, with your limited cash, using
                                        the MTF feature. We charge one of the
                                        lowest interest rates on MTF.
                                      </p>
                                    </p> */}

                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].RS_Hindi
                                      }
                                    </span>
                                    <span className="pack-delivery-text subs-value">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Ten
                                      }                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].for
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].FQ
                                      }
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].and
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Intraday
                                      }
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Trades
                                      }
                                    </span>

                                  </div>
                                </div>
                                <div className="packs__bottom">
                                  <div className="d-flex flex-sm-row align-items-baseline">

                                    <p className="interest">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].PER_12_ANNUM
                                      }
                                    </p>
                                    <p className="mtf" class="tip">
                                      &nbsp;
                                      <img
                                        src={AlertCircle}
                                        alt="alert"
                                        onMouseEnter={(e) => viewMtf(e)}
                                        onMouseLeave={(e) => hideMTF(e)}
                                      />
                                      <p className="sup-tooltip" id="">
                                        Margin Trade Funding is an exciting
                                        feature! Buy stocks up to 4 times more
                                        in price, with your limited cash, using
                                        the MTF feature. We charge one of the
                                        lowest interest rates on MTF.
                                      </p>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* packs-right side */}
                              <div className="packs__right">
                                <p >
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].RS_Hindi
                                  }
                                  <span className="packs-amount">
                                    {
                                      Language[
                                        localStorage.getItem("language") ||
                                        "English"
                                      ].SecoundAm
                                    }
                                  </span>

                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ]._2500Year
                                  }
                                </p>
                                <button
                                  className={`${packInfo == "Professional Pack"
                                    ? "proceed"
                                    : "select-now"
                                    }`}
                                  onClick={() =>
                                    process.env.REACT_APP_DOMAIN !== "PWA" &&
                                    updatePackInfo("Professional Pack", "1")
                                  }
                                >
                                  {packInfo == "Professional Pack"
                                    ? Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].PROCEED
                                    : Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].SELECT_NOW}
                                </button>
                              </div>
                            </div>
                            <ul className="packs-list-item">
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={priviledge} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>
                                    * MTF - Margin Trade Financing allows you to
                                    buy more shares than your available capital.
                                    Buy up to 4x more.
                                  </p>
                                </div>
                              </li>
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={headset} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>Dedicated dealing desk support.</p>
                                </div>
                              </li>
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={tradeCall} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>Daily researched trade calls .</p>
                                </div>
                              </li>
                            </ul>

                            <a
                              className="subscribe-dropdown"
                              onClick={() =>
                                openPack({ professional: true }, "professional")
                              }
                            >
                              <img src={DropdownArrow} alt="" />
                            </a>
                          </div>
                          <div
                            className={`packs freedom-pack ${showDiv["freedom"] && "active"
                              }`}
                          >
                            <div
                              className="packs-wrapper"
                              onClick={() =>
                                process.env.REACT_APP_DOMAIN === "PWA" &&
                                updatePackInfo("Free Pack", "0")
                              }
                            >
                              <div className="packs__left">
                                <h3 className="packs__title">
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].FREEDOM_PACK
                                  }
                                </h3>
                                <p className="packs__subtitles">
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].NEW_TO_TRADING_IND
                                  }
                                </p>
                                <div className="packs__bottom independence-pack">
                                  {/* <p className="order">
                                    {
                                      Language[
                                        localStorage.getItem("language") ||
                                        "English"
                                      ]._20ORDER
                                    }
                                  </p> */}
                                  <p className="order">
                                    {
                                      Language[localStorage.getItem("language") || "English"].RS_Hindi
                                    }
                                    <span className="pack-delivery-text subs-value">0</span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].for
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Delivery
                                      }
                                    </span>

                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Trades
                                      }
                                    </span>
                                  </p>
                                  <div className="d-flex flex-sm-row align-items-baseline">
                                    {/* <p className="interest">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ]._18_ANNUM
                                      }
                                    </p>

                                    <p className="mtf" class="tip">
                                      &nbsp;
                                      <img
                                        src={AlertCircle}
                                        alt="alert"
                                        onMouseEnter={(e) => viewMtf(e)}
                                        onMouseLeave={(e) => hideMTF(e)}
                                      />
                                      <p className="sup-tooltip" id="">
                                        Margin Trade Funding is an exciting
                                        feature! Buy stocks up to 4 times more
                                        in price, with your limited cash, using
                                        the MTF feature. We charge one of the
                                        lowest interest rates on MTF.
                                      </p>
                                    </p> */}
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].RS_Hindi
                                      }
                                    </span>
                                    <span className="pack-delivery-text subs-value">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Twenty
                                      }
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].for
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].FQ
                                      }
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].and
                                      }
                                    </span>
                                    <span className="pack-delivery-text blue-txt">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Intraday
                                      }
                                    </span>
                                    <span className="pack-delivery-text">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ].Trades
                                      }
                                    </span>

                                  </div>
                                </div>
                                <div className="packs__bottom">
                                  <div className="d-flex flex-sm-row align-items-baseline">

                                    <p className="interest">
                                      {
                                        Language[
                                          localStorage.getItem("language") ||
                                          "English"
                                        ]._18_ANNUM
                                      }
                                    </p>

                                    <p className="mtf" class="tip">
                                      &nbsp;
                                      <img
                                        src={AlertCircle}
                                        alt="alert"
                                        onMouseEnter={(e) => viewMtf(e)}
                                        onMouseLeave={(e) => hideMTF(e)}
                                      />
                                      <p className="sup-tooltip" id="">
                                        Margin Trade Funding is an exciting
                                        feature! Buy stocks up to 4 times more
                                        in price, with your limited cash, using
                                        the MTF feature. We charge one of the
                                        lowest interest rates on MTF.
                                      </p>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* packs-right side */}
                              <div className="packs__right">
                                <p >
                                  <span className="packs-amount">
                                    {
                                      Language[
                                        localStorage.getItem("language") ||
                                        "English"
                                      ].FREE
                                    }
                                  </span>
                                  {
                                    Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].FREE_1_YEAR
                                  }

                                </p>

                                <button
                                  className={`${packInfo == "Free Pack"
                                    ? "proceed"
                                    : "select-now"
                                    }`}
                                  onClick={() =>
                                    process.env.REACT_APP_DOMAIN !== "PWA" &&
                                    updatePackInfo("Free Pack", "0")
                                  }
                                >
                                  {packInfo == "Free Pack"
                                    ? Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].PROCEED
                                    : Language[
                                      localStorage.getItem("language") ||
                                      "English"
                                    ].SELECT_NOW}
                                </button>
                              </div>
                            </div>
                            <ul className="packs-list-item">
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={freeStock} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>
                                    Free Stock Suggestions Every Day for Trading
                                    and Investing
                                  </p>
                                </div>
                              </li>
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={freedomScanner} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>
                                    Access to Scanners, Trading View Charts and
                                    Tools, Detailed Reports and much more.{" "}
                                  </p>
                                </div>
                              </li>
                              <li>
                                <div className="pack-list-item-left">
                                  <img src={mtf} />
                                </div>
                                <div className="pack-list-item-right">
                                  <p>
                                    MTF- Margin Trade Financing allows you to
                                    buy more shares than your available capital.
                                    Buy up to 4x more.
                                  </p>
                                </div>
                              </li>
                            </ul>
                            <a
                              className="subscribe-dropdown"
                              onClick={() =>
                                openPack({ freedom: true }, "freedom")
                              }
                            >
                              <img src={DropdownArrow} alt="" />
                            </a>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Col>
                <Col className="position-inherit" lg="4">
                  <div className="page-right  d-flex h-100 flex-column ">
                    {isRefText ? (
                      <>
                        <ChatCard
                          chatSubtitle={
                            "Bajaj Privilege Club subscription helps you save 4 times more brokerage on every trade"
                          }
                        />
                      </>
                    ) : (
                      <>
                        <ChatCard
                          chatSubtitle={
                            "Bajaj Privilege Club (BPC) pack reduces your brokerage fee by 75% flat. While you pay Rs. 20 per order as standard charges per order, you only pay Rs. 5 with BPC pack."
                          }
                        />
                      </>
                    )}
                    <div className="user-bottom-img subcriptionPack-img">
                      <img src={userBottomImg} alt="person icon" />
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </main>
        </>
      )}
    </>
  );
};

export default Subscription;