import React, { useState, useEffect } from "react";
import msgIcon from "../assets/images/msg-icon.png";
import $ from "jquery";
import { Modal } from "react-bootstrap";
import call_icon from "../assets/images/call.svg";
import mail_icon from "../assets/images/mail.svg";
import whatsapp_icon from "../assets/images/whatsapp.svg";
import Language from "../common/Languages/languageContent.json";

const ChatCard = (props) => {
  // const [text2, setText2] = useState("");
  const [dname, setDName] = useState("Pablo");
  const [contactmodalShow, setcontactModalShow] = React.useState(false);
  function handleChatCard() {
    if (localStorage.getItem("FullName")) {
      setDName(localStorage.getItem("FullName"));
    } else {
      setDName("Pablo");
    }
  }
  function userClick(event) {
    if (window.innerWidth < 991) {
      $(".dashed-border").css("display", "block");
      $("#root").addClass("overlay2");
      event.stopPropagation();
    }
  }
  useEffect(() => {
    handleChatCard();
  }, []);

  return (
    <>
      <div className="chat-card">
        <div className="dashed-border">
          <div className="chat-card-header">
            <h3 className="chat-title">
              {
                Language[localStorage.getItem("language") || "English"]
                  .DO_YOU_KNOW
              }
            </h3>
            <div className="chat-subtitle">{props.chatSubtitle}</div>
            <div className="chat-link">{props.link}</div>

          </div>
          <div className="chat-card-footer">
            {props.text2}

          </div>
          <Modal
            show={contactmodalShow}
            onHide={() => setcontactModalShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            className="contact-us"
            centered
          >
            <div className="close" onClick={() => setcontactModalShow(false)}>
              {/* <i className="icon-close" /> */}
              <svg class="new-icon new-icon-close">
                <use href="#new-icon-close"></use>
              </svg>
            </div>
            <Modal.Body>
              <div>
                <h4 className="modal-title">Contact US</h4>
                <div className="contact-us">
                  <ul className="contact-us">
                    <li>
                      <a href="tel:18008338888" class="tip">
                        <img src={call_icon} alt="" />
                        <span>18008338888</span>
                      </a>
                    </li>
                    <li>
                      <a href="mailto:connect@bajajfinserv.in" class="tip">
                        <img src={mail_icon} alt="" />
                        <span>mailto:connect@bajajfinserv.in</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://wa.me/message/WGISDGQFHRYLI1"
                        target="_blank"
                      >
                        <img src={whatsapp_icon} alt="" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
        <img
          src={msgIcon}
          alt=""
          className="user"
          onClick={(e) => userClick(e)}
        />
      </div>
    </>
  );
};

export default ChatCard;
