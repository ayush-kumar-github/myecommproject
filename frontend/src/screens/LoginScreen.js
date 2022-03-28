import React, { useState, useEffect } from "react";

import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const [searchParms] = useSearchParams();
  const history = useNavigate();

  const redirect = searchParms.search ? searchParms.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history(redirect);
    }
  }, [history, redirect, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1 className="font-link">login</h1>
      {error && <h3>{error}</h3>}
      {loading}
      <hr />
      <Form onSubmit={submitHandler}>
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

        <Button type="submit" variant="primary" className="button">
          login
        </Button>
      </Form>
      <hr />
      <Row>
        <Col>
          New user??{""}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            <Button className="redirectbutton">register</Button>
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
