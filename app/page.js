import Image from "next/image";
import { InputText, Button, ValidationInfo } from "@/components/Form";
import { FormLogin } from "@/components/FormLogin";
import brandImage from "@/public/images/logo-tsm-2022-sm.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import moment from "moment/moment";

export const metadata = {
  title: "Login | Form TSM Jember",
};

export default function Login() {
  return (
    <main className="min-w-screen relative flex h-svh flex-col items-center justify-between bg-violet-700 lg:h-screen lg:flex-row lg:justify-center lg:bg-violet-900">
      <section
        id="login-brand"
        className=" m-0 flex h-1/4 w-full items-center justify-center p-5 lg:h-2/3 lg:w-3/12 lg:rounded-3xl"
      >
        <Image src={brandImage} alt="brand image" width={300} />
      </section>
      <section
        id="login-form"
        className="m-0 flex h-3/4 w-full flex-col rounded-b-none rounded-t-3xl bg-violet-50 text-violet-900 lg:h-2/3 lg:max-h-screen lg:w-3/12 lg:rounded-3xl"
      >
        <div
          id="form-header"
          className="my-3 flex-initial rounded-t-3xl p-2 text-violet-700"
        >
          <h1 className="text-center text-2xl font-extrabold">
            Selamat datang,
          </h1>
        </div>
        <div
          id="form-body"
          className="flex flex-auto flex-col justify-start rounded-t-3xl bg-white p-3 "
        >
          <FormLogin action="/api/v1/session" id="form-login">
            <div className="flex flex-col justify-around px-8 py-5">
              <div
                id="div-username"
                className="relative z-0 m-auto mb-7 flex w-full items-center rounded-full border border-violet-900 bg-transparent p-3 px-4"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="h-4 pr-2 text-violet-500"
                />
                <InputText
                  name="username"
                  className="peer relative block flex-auto bg-transparent focus:outline-none focus:ring-0"
                  required
                  placeholder=" "
                />

                <label
                  htmlFor="username"
                  className="
                  absolute -z-10 -translate-y-7 translate-x-3 scale-90 transform
                  rounded-lg bg-white p-0 px-2 text-base text-violet-400 duration-200
                  peer-placeholder-shown:translate-x-5 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-none 
                  peer-focus:-translate-y-7 peer-focus:translate-x-3 peer-focus:scale-90 peer-focus:bg-white peer-focus:px-2 peer-focus:text-violet-900
                  peer-placeholder-shown:lg:translate-x-6 
                  "
                >
                  Username
                </label>
              </div>
              <div
                id="div-password"
                className="relative z-0 m-auto mb-7 flex w-full items-center rounded-full border border-violet-900 bg-transparent p-3 px-4"
              >
                <FontAwesomeIcon
                  icon={faLock}
                  className="h-4 pr-2 text-violet-500"
                />
                <InputText
                  name="password"
                  type="password"
                  className="peer relative block w-full flex-auto bg-transparent focus:outline-none focus:ring-0"
                  required
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="
                  absolute -z-10 -translate-y-7 translate-x-3 scale-90 transform
                  rounded-lg bg-white p-0 px-2 text-base text-violet-400 duration-200
                  peer-placeholder-shown:translate-x-5 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-none
                  peer-focus:-translate-y-7 peer-focus:translate-x-3 peer-focus:scale-90 peer-focus:bg-white peer-focus:px-2 peer-focus:text-violet-900 
                  peer-placeholder-shown:lg:translate-x-6
                  "
                >
                  Password
                </label>
              </div>
            </div>
            <div>
              <ValidationInfo
                field="_all"
                className="justify-center p-2 text-center text-sm"
                classError="text-red-500"
                classSuccess="text-green-500"
              />
            </div>
            <div id="login-btn" className="flex justify-center px-8 py-5">
              <Button
                className="
                  w-full rounded-full bg-violet-700 p-3 font-bold text-white
                  hover:bg-violet-500 focus:bg-violet-500 active:bg-violet-500
                "
                type="submit"
                form="form-login"
              >
                Login
              </Button>
            </div>
            <div className="flex justify-center px-8 py-5 text-sm">
              Lupa password?
            </div>
          </FormLogin>
        </div>
        <div
          id="form-footer"
          className="flex flex-initial items-center justify-center bg-white p-2 text-sm lg:rounded-b-3xl"
        >
          <FontAwesomeIcon icon={faCopyright} className=" h-3" />{" "}
          <div id="copyright-text">
            2023 - {moment().format("yyyy")}, v.2.0.0 by{" "}
            <a
              href="https://github.com/mazdel"
              className="text-violet-700 hover:underline"
            >
              delyachmad
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
