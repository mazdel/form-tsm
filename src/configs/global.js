const defaultSecret = "th1sIsAsecr3t";
const globalConfig = {
  secret: process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? defaultSecret,
  encryption: {
    secret: defaultSecret,
    saltLength: 5,
  },
  JWT: {
    alg: "HS512",
    exp: "6h",
    secret: process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? defaultSecret,
  },
  protectedPath: ["/machines", "/api/v1"],
  unProtectedPath: ["/api/v1/session"],
  defaultRedirectPath: "/",
  CONSTANT: {
    THEME: { DARK: "dark", LIGHT: "light" },
    ACCESS_TOKEN: "access_token",
    SIDEMENU: { OPEN: "open", CLOSE: "close" },
  },
};

export default globalConfig;
