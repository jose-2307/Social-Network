require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "dev",
  isProd: process.env.NODE_ENV === "production",
  port: process.env.PORT || 3000,
  DBuser: process.env.DB_USER,
  DBpassword: process.env.DB_PASSWORD,
  email: process.env.EMAIL,
  emailPass: process.env.EMAIL_PASS,
  jwtSecretLogin: process.env.JWT_SECRET_LOGIN,
  jwtSecretRefresh: process.env.JWT_SECRET_REFRESH,
  jwtSecretRecovery: process.env.JWT_SECRET_RECOVERY_PASSWORD,
  recoveryUri: process.env.RECOVERY_URI,
}

module.exports = { config };
