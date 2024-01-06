import "./globals.css";
import { Quicksand } from "next/font/google";
import PropTypes from "prop-types";
import { config } from "@fortawesome/fontawesome-svg-core";
import { Providers } from "@/contexts/Providers";

const inter = Quicksand({ subsets: ["latin"] });

config.autoAddCss = false;
export const metadata = {
  title: {
    template: "%s | Form TSM Jember",
    default: "Form TSM Jember",
  },
  icons: {
    icon: { url: "/icon.png", sizes: "180x180", type: "image/png" },
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  description: "created by delyachmad",
};

const RootLayout = ({ children }) => {
  return (
    <Providers>
      <body className={inter.className}>{children}</body>
    </Providers>
  );
};
RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default RootLayout;
