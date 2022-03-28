import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = ({ color }) => {
  return (
    <div style={{ backgroundColor: "black" }}>
      <Container>
        <Row>
          <Col style={{ color }} className="text-center py-3">
            <i class="fas fa-map-marker"></i>
            <h4 style={{ color }}>beside junkie road</h4>
            <h5 style={{ color }}>next to eiffel tower</h5>
            <h5 style={{ color }}>paris,Europe</h5>
          </Col>
          <Col style={{ color }} className="text-center py-3">
            copyright@2022
          </Col>
          <Col style={{ color }} className="text-center py-3">
            <h5 style={{ color }}>stay connected</h5>
            <i class="fab fa-facebook"></i> <i class="fab fa-whatsapp"></i>{" "}
            <i class="fab fa-instagram"></i>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
Footer.defaultProps = {
  color: "white",
};

export default Footer;
