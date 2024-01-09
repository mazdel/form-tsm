"use client";

import moment from "moment/moment";
import Cookie from "js-cookie";
import PropTypes from "prop-types";
import { Form } from "@/components/Form";
import { useRouter } from "next/navigation";
import { AuthDecode } from "@/libs/Auth";

const FormLogin = ({ children, ...moreProps }) => {
  const router = useRouter();

  const onSuccess = (response) => {
    const access_token = response.data.result.token;
    const decodedToken = AuthDecode(access_token);
    const expiresIn = moment.unix(decodedToken.exp).toDate();
    Cookie.set("access_token", access_token, { expires: expiresIn });
    return router.push(decodedToken.homePath);
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
