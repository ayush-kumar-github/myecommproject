import React, { useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  ListGroupItem,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../actions/orderActions";

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  if (!cart.shippingAddress.address) {
    navigate("/shipping");
  } else if (!cart.paymentMethod) {
    navigate("/payment");
  }
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  cart.shippingPrice = addDecimals(cart.itemsPrice < 100 ? 0 : 100);
  cart.taxPrice = addDecimals(Number(0.1 * cart.itemsPrice));
  cart.totalPrice =
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
    }
    //enlist-disable-next-line
  }, [navigate, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };
  return (
    <>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2 className="font-link">shipping</h2>
              <p>
                {cart.shippingAddress.address},{cart.shippingAddress.city}
                {""}
                {cart.shippingAddress.postalCode},{""}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment method</h2>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>selected Items</h2>
              {cart.cartItems.length === 0 ? (
                <h5>Your cart is empty</h5>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
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
                          {item.qty} x Rs {item.price} = Rs{" "}
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
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>total cost</Col>
                <Col>Rs {cart.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>delivery charges</Col>
                <Col>Rs {cart.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>gst</Col>
                <Col>Rs {cart.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h4>total</h4>
                </Col>

                <Col>Rs {cart.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>{error && <h5>{error}</h5>}</ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cart.cartItems === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
