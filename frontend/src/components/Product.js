import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, Col, Row } from "react-bootstrap";
import Rating from "../components/Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3 rounded ">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title>
            <p className="h1-responsive font-weight-bold  font-link ">
              {product.name}
            </p>
          </Card.Title>
        </Link>
        <hr />

        <Card.Text as="div" className="text-center ">
          <Row>
            <Col>
              <Rating value={product.rating} />
            </Col>
            <Col>
              <h5>Rs {product.price}</h5>{" "}
            </Col>
          </Row>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
