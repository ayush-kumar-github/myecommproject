import React, { useEffect, useState } from "react";
import { Button, Row, Col, ListGroup, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

const OrderScreen = () => {
  const params = useParams();
  let navigate = useNavigate();

  const [sdkReady, setSdkReady] = useState(false);

  const orderId = params.id;
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });

      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    dispatch,
    successPay,
    successDeliver,
    order,
    orderId,
    navigate,
    userInfo,
  ]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <h4>loading...</h4>
  ) : error ? (
    <h4>{error}</h4>
  ) : (
    <>
      <Row>
        <Col md={8}>
          <Col md={4}></Col>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2 className="font-link">shipping</h2>
              <p>
                <strong>name:</strong>
                {order.user.name}
              </p>
              <p>
                <strong>email:</strong>
              </p>
              <p>
                <strong>address</strong>
                {order.shippingAddress.address},{order.shippingAddress.city}
                {""}
                {order.shippingAddress.postalCode},{""}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? <h4>delivered</h4> : <h4>undelivered</h4>}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2 className="font-link">Payment method</h2>
              <p> {order.paymentMethod}</p>
              {order.isPaid ? <h4>paid</h4> : <h4>unpaid</h4>}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2 className="font-link">selected Items</h2>
              {order.orderItems.length === 0 ? (
                <h5>Your cart is empty</h5>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>{item.name}</Col>
                        <Col md={4}>
                          {item.qty} x Rs {item.price} =Rs{" "}
                          {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2 className="font-link">Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>total cost</Col>
                <Col>Rs {order.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>delivery charges</Col>
                <Col>Rs {order.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>gst</Col>
                <Col>Rs {order.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h4>total</h4>
                </Col>

                <Col>Rs {order.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            {!order.isPaid && (
              <ListGroup.Item>
                {loadingPay && <h4>loading...</h4>}
                {!sdkReady ? (
                  <h5>loading...</h5>
                ) : (
                  <PayPalButton
                    amount={order.totalPrice}
                    onSuccess={successPaymentHandler}
                  />
                )}
              </ListGroup.Item>
            )}
            {loadingDeliver && <h4>loading...</h4>}

            {userInfo &&
              userInfo.isAdmin &&
              !order.isPaid &&
              !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
