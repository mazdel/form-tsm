"use client";

import PropTypes from "prop-types";
import { Form } from "@/components/Form";

const FormLogin = ({ children, ...moreProps }) => {
  const onSuccess = (response) => {
    console.log("form login", response);
    // TODO : router push response.data.result.redirect
  };
  return (
    <Form onSuccess={onSuccess} {...moreProps}>
      {children}
    </Form>
  );
};
FormLogin.propTypes = {
  children: PropTypes.node.isRequired,
};
export { FormLogin };
