import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  FormGroup,
  FormControl,
  InputGroup,
} from "react-bootstrap";

const SearchBox = () => {
  let navigate = useNavigate();

  const [keyword, setKeyword] = useState(" ");
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };
  return (
    <Form onSubmit={submitHandler} className="searchbox">
      <Row>
        <Col>
          <Form.Control
            className="search"
            type="text"
            name="q"
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="search "
            size="sm"
          ></Form.Control>
        </Col>
        <Col>
          <Button type="submit" size="sm" className="searchbutton">
            search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBox;
