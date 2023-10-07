import React, { useEffect, useState, useCallback } from "react";
import call_icon from "../assets/images/call.svg";
import mail_icon from "../assets/images/mail.svg";
import whatsapp_icon from "../assets/images/whatsapp.svg";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { ME_EventTriggered, customSelect, pauseAudio, playAudio, randomClickEvent, sendToCleverTap } from "../common/common.js";
import { Form } from "react-bootstrap";
import logoupdate from "../assets/images/logo.webp";

function Header(props) {
  const [audioModalShow, setAudioModalShow] = useState(false);
  const [playhome, setPlayHome] = useState(false);
  const [lang, setLang] = useLocalStorage("language", "English");
  const [AMCLanguage, setAMCLanguage] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  function useLocalStorage(key, initialState) {
    const [value, setValue] = useState(
      localStorage.getItem(key) ?? initialState
    );
    const updatedSetValue = useCallback(
      (newValue) => {
        if (typeof newValue === "undefined") {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, newValue);
        }
        setValue(newValue ?? initialState);
      },
      [initialState, key]
    );
    return [value, updatedSetValue];
  }
  useEffect(() => {
    localStorage.setItem("AudioLanguage", "English");

    customSelect();
    if (!localStorage.getItem("audioPlayed")) {
      localStorage.setItem("audioPlayed", "played");
      setAudioModalShow(true);
      setPlayHome(true);
    } else {
      setPlayHome(false);
    }
  }, []);

  function languagesChanges(event) {
    setLang(event.target.value);
    ME_EventTriggered(`${event.target.value}`)
    props.languageChange();
    sendToCleverTap("BFSL_APPLICATION_VIEWED", {
      EP_PAGE_NAME: "HOME PAGE COACH MARK",
      EP_JOURNEY_NAME: " EKYC BFSL",
      EP_PAGE_LOAD: "YES"
    });
  }
  const [audioPref, setAudioPref] = useState(
    localStorage.getItem("AudioPref") || "enable"
  );
  function AudioChange(value) {
    localStorage.setItem("AudioLanguage", value);
    ModalPlay();
    ME_EventTriggered("AudioLanguage", { value })
  }
  function playHomePage() {
    if (window.location.pathname == "/") {
      if (playhome) {
        setPlayHome(false);
        playAudio(2);
      }
    }
  }
  function ModalPlay() {
    console.log(audioPref, "click");
    ME_EventTriggered("Play Recent")
    // setAudioModalShow(false);
    // togglePlay()
    let urlPath = window.location.pathname;
    if (urlPath == "/") {
      playAudio(2);
    } else if (urlPath == "/pan-details") {
      playAudio(4);
    } else if (urlPath == "/email-verification") {
      playAudio(7);
    } else if (urlPath == "/returnee-resume") {
      playAudio(8);
    } else if (urlPath == "/personal-detail") {
      playAudio(9);
    } else if (urlPath == "/nominee-detail") {
      playAudio(10);
    } else if (urlPath == "/bank-detail") {
      playAudio(11);
    } else if (urlPath == "/subscription-pack") {
      playAudio(13);
    } else if (urlPath == "/document-upload") {
      playAudio(14);
    } else if (urlPath == "/address-detail") {
      playAudio(15);
    } else if (urlPath == "/pan-upload") {
      playAudio(16);
    } else if (urlPath == "/signature-upload") {
      playAudio(17);
    } else if (urlPath == "/selfie-upload") {
      playAudio(18);
    }



  }
  // useEffect(() => {
  //   ModalPlay()
  // }, [])

  function callPopup(data) {
    var contact = document.querySelectorAll(".contact-model");
    var progressBar = document.querySelector(".form-progress");
    for (let element of contact) {
      element.classList.remove("call");
    }
    if (progressBar) {
      progressBar.classList.add("z-index-1");
    }
    var contact = document.querySelector(data);
    var main = document.getElementById("overlay");
    contact.classList.add("call");
    main.classList.add("overlay");
    document.querySelector("body").style.overflow = "hidden";
  }

  console.log(isPlaying, "isplaying")
  function togglePlay() {
    var myAudio = document.getElementById("audioEkyc");
    if (localStorage.getItem("AudioPref") == "enable") {
      myAudio.paused ? myAudio.play() : myAudio.pause();
      myAudio.paused ? setIsPlaying(false) : setIsPlaying(true);
      let x = document.getElementById("audioEkyc").duration;
      console.log("timeer", x * 1000);

      setTimeout(() => {
        setIsPlaying(false);
      }, x * 1000);
    } else {
      setIsPlaying(false);

    }


  };

  function checkAudioState() {
    var myAudio = document.getElementById("audioEkyc");
    // console.log(x, "x");
    console.log(myAudio.paused, " myAudio.paused ");
    myAudio.paused ? setIsPlaying(false) : setIsPlaying(true);
  };
  // useEffect(() => {
  //   ModalPlay()
  //   checkAudioState()
  // }, [])

  // function closePopup() {
  //   document.querySelector("body").style.overflow = "unset";

  //   var contact = document.querySelectorAll(".contact-model");

  //   for (let element of contact) {
  //     element.classList.remove("call");
  //   }
  //   document.getElementById("overlay").classList.remove("overlay");
  // }


  useEffect(() => {
    if (window.location.pathname == "/lifetimeamcefree" && process.env.REACT_APP_DOMAIN === "NAOM") {
      setAMCLanguage(true)
    } else {
      setAMCLanguage(false)
    }


  }, [])


  return (
    <>
      <header className="header">
        <Container>
          <Row className="align-items-center">
            <Col xs={5}>
              <div className="main-logo">
                <a href="https://www.bajajfinservsecurities.in/ " >
                  <img src={logoupdate} alt="logo" width="145" height="41" />
                </a>
              </div>
            </Col>
            <Col xs={7}>

              <div className="header-right">
                <Form.Select
                  aria-label="Default select example"
                  className="custom-form-select mr-3"
                  id="LanguageSelect"
                  defaultValue={localStorage.getItem("language") ?? "English"}
                  onChange={languagesChanges}
                >
                  {AMCLanguage ? <option value="English">English</option>
                    : <><option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Gujarati">Gujarati</option></>}
                </Form.Select>
                <div className="header-list">
                  <ul>
                    <li>
                      <div
                        className="tip"
                        onClick={() => {
                          setAudioModalShow(true);
                        }}
                      >
                        <svg class="new-icon new-icon-speaker icon-Headset headSpeaker"><use href="#new-icon-Headset"></use></svg>
                        {/* <i className="" /> */}
                      </div>
                    </li>
                    <li>
                      <div
                        className=""
                        onClick={() => {
                          callPopup(".callmodel");
                          randomClickEvent("CALL")
                        }}
                      >
                        <img src={call_icon} alt="" width="29" height="34" />

                        <div className="contact-model callmodel">
                          <div className="contact-details">
                            <p className="contact-title">Contact Us</p>
                            <ul className="contact-content">
                              <li>
                                <img src={call_icon} width="25" height="25" alt="" />
                                <span className="contact-name">Toll Free</span>
                                <span>:</span>
                              </li>
                              <li>
                                <a
                                  href="tel:18008338888"
                                  className="contact-txt"
                                >
                                  1800-833-8888
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div
                        className=""
                        onClick={() => {
                          callPopup(".mailmodel"); randomClickEvent("MAIL")
                        }}
                      >
                        <img src={mail_icon} width="25" height="25" alt="" />
                        <div className="contact-model mailmodel">
                          <div className="contact-details">
                            <p className="contact-title">Contact Us</p>
                            <ul className="contact-content">
                              <li>
                                <img src={mail_icon} alt="" />
                                <span className="contact-name">Email</span>
                                <span>:</span>
                              </li>
                              <li>
                                <a
                                  href="mailto:connect@bajajfinserv.in"
                                  className="contact-txt"
                                >
                                  connect@bajajfinserv.in
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => { callPopup(".whatsappmodel"); randomClickEvent("WHATSAPP") }}
                      >
                        <img src={whatsapp_icon} width="25" height="25" alt="" />
                        <div className="contact-model whatsappmodel">
                          <div className="contact-details">
                            <p className="contact-title">Contact Us</p>
                            <ul className="contact-content">
                              <li>
                                <img src={whatsapp_icon} alt="" />
                                <span className="contact-name">Whatsapp</span>
                                <span>:</span>
                              </li>

                              <li>
                                <a
                                  href="https://wa.me/message/WGISDGQFHRYLI1"
                                  target="_blank"
                                  className="contact-txt"
                                >
                                  9607904422
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>

                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
      <Modal
        show={audioModalShow}
        onHide={() => setAudioModalShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        className="AudioModal audio-modal"
        backdrop="static"
        keyboard={false}
      >
        <div
          className="close"
          onClick={() => {
            setAudioModalShow(false);
            playHomePage();
          }}
        >
          <svg class="new-icon new-icon-close"><use href="#new-icon-close"></use></svg>
        </div>
        <Modal.Body >
          {/* <div>
            <h3 className="modal-title">Audio Setting</h3>
            <p className="modal-para">
              Select your Audio preference
              <br />
            </p>
          </div> */}
          <div className="audio-btn-grp">
            <Button
              className="audioicon"
              size="lg"
              onClick={() =>
                ModalPlay()
                // togglePlay()
              }
            >
              Play Recent

              {/* {isPlaying ? (<span className="icon-pause"></span>) : (<span className="icon-play"></span>)} */}
              {/* {audioPref ?(<>PL</>):(<>PU</>)} */}
            </Button>
            <Form.Select
              aria-label="Default select example"
              className="custom-form-select"
              id="LanguageSelect"
              defaultValue={localStorage.getItem("AudioLanguage")}
              onChange={(e) => { AudioChange(e.target.value) }}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </Form.Select>
            {audioPref == "disable" && (
              <div
                className="audioP"
                role="button"
                onClick={() => {
                  localStorage.setItem("AudioPref", "enable");
                  setAudioPref("enable");
                }}
              >

                <svg class="new-icon new-icon-mute headSpeaker"><use href="#new-icon-mute"></use></svg>
                {/* <i className="icon-mute headSpeaker" /> */}
              </div>
            )}
            {audioPref == "enable" && (
              <div
                className="audioP"
                role="button"
                onClick={() => {
                  pauseAudio();
                  localStorage.setItem("AudioPref", "disable");
                  setAudioPref("disable");
                }}
              >
                <svg class="new-icon new-icon-speaker headSpeaker"><use href="#new-icon-speaker"></use></svg>
                {/* <i className="icon-speaker headSpeaker" /> */}
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default Header;
