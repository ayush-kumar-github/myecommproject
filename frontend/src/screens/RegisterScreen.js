import React, { useState, useEffect } from "react";

import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";

const RegisterScreen = () => {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;
  const [searchParms] = useSearchParams();
  const navigate = useNavigate();

  const redirect = searchParms.search ? searchParms.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("password dont match");
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <FormContainer>
      <h1 className="font-link">register user</h1>
      {message && <h3>{message}</h3>}
      {error && <h2>{error}</h2>}
      {loading}
      <hr />
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name </Form.Label>
          <Form.Control
            type="name"
            placeholder="enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>email </Form.Label>
          <Form.Control
            type="email"
            placeholder="enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>password </Form.Label>
          <Form.Control
            type="password"
            placeholder="enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>confirm password </Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="button">
          register
        </Button>
      </Form>
      <hr />
      <Row>
        <Col>
          already a user???
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            <Button className="redirectbutton"> login</Button>
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
