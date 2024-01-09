const globalConfig = {
  secret: process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? "th1sIsAsecr3t",
  JWT: {
    alg: "HS512",
    exp: "2h",
    secret: process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? "th1sIsAsecr3t",
  },
  protectedPath: ["/machines"],
  defaultRedirectPath: "/",
};

export default globalConfig;
