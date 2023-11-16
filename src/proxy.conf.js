const PROXY_CONFIG = [
  {
    context: [
      "/admin/title",
      "/admin/branch",
      "/admin/action",
      "/admin/user",
      "/admin/role",
      "/admin/userStatusCode",
      "/admin/statusCode",
    ],
    target: "http://localhost:3000",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
