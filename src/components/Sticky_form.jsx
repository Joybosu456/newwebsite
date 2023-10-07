import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

function Sticky_form() {
  return (
    <>
      <div className="sticky-form">
        <Container>
          <Row>
            <Col className=" col-12 col-md-5" lg={6}>
              <div className="sticky-form-left">
                <h2 className="page-title">
                  Open<span>Free Demat Account Instantly</span>
                </h2>
                <h3 className="page-subtitle">
                  Begin your trading journey with us. Start Now!
                </h3>
              </div>
            </Col>
            <Col className="col-12 col-md-7" lg={6}>
              <div className="sticky-form-right">
                <form action method="post" className="page-form">
                  <div className="form-group-wrapper">
                    <div className="form-group">
                      <input
                        type="text"
                        name="mobile-number"
                        className="form-control"
                      />
                      <label className="form-label">Enter Mobile Number</label>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="mobile-number"
                        className="form-control"
                      />
                      <label className="form-label">Enter PAN</label>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="submit-btn"
                    type="submit"
                  >
                    GET OTP
                  </Button>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Sticky_form;
