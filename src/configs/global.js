const globalConfig = {
  secret: process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? "th1sIsAsecr3t",
  JWT: {
    alg: "HS512",
    exp: "6h",
    secret: process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? "th1sIsAsecr3t",
  },
  protectedPath: ["/machines", "/api/v1"],
  unProtectedPath: ["/api/v1/session"],
  defaultRedirectPath: "/",
};

export default globalConfig;
