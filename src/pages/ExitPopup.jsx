import React from 'react';
import { Modal } from 'react-bootstrap';
import exit_icon from '../assets/images/exit-popup-gif.gif';

function ExitPopup() {
    const [exitmodalShow, setexitModalShow] = React.useState(true);
    return (
        <>
            <Modal show={exitmodalShow}
                onHide={() => setexitModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                className='exit-popup'
                centered
                backdrop="static"
                keyboard={false}
            >
                <div className="close" onClick={() => setexitModalShow(false)} >
                    {/* <i className="icon-close" /> */}
                    <svg class="new-icon new-icon-close">
                        <use href="#new-icon-close"></use>
                    </svg>
                </div>
                <Modal.Body>
                    <div className="exit-popup-content">
                        <a href>
                            <img src={exit_icon} alt="exit-popup-img" className="exit-popup-img" />
                        </a>
                        <h3 className="modal-title">Leaving so soon?</h3>
                        <p className="modal-subtitle">There's still more to do. <a href>Upload document</a>
                            and we'll help you out.</p>
                        <p className="modal-desc">Are you sure you want to leave this page?</p>
                        <div>
                            <a href className="common-btn">I'll stay</a>
                            <a href className="secondary-btn">I'll take a leave</a>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>
        </>
    )
}

export default ExitPopup