const config = {
  "env": "local",
  "useFcMock": process.env.USE_FC_MOCK !== 'false',
  "fcHost": process.env.FC_URL || "https://fcp.dev.dev-franceconnect.fr",
  "checkTokenPath": "/api/v1/checktoken"
};

export default config;
