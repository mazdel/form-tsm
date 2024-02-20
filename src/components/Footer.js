import moment from "moment/moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";

const Footer = () => {
  return (
    <footer id="footer" className="flex flex-initial bg-inherit">
      <div
        id="copyright"
        className="flex w-full items-center justify-center p-2 text-sm"
      >
        <FontAwesomeIcon icon={faCopyright} className="h-3" />{" "}
        <div id="copyright-text">
          {moment().format("yyyy")}, v.2.0.0 by{" "}
          <a
            href="https://github.com/mazdel"
            className="text-violet-700 hover:underline dark:font-semibold dark:text-white"
          >
            delyachmad
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
