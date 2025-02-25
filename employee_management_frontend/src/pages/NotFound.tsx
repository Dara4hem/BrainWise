import React from "react";
import { Container } from "react-bootstrap";

const NotFound: React.FC = () => {
  return (
    <Container className="text-center my-5">
      <h1>404</h1>
      <p>Sorry, the page you're looking for does not exist.</p>
    </Container>
  );
};

export default NotFound;
