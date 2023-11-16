(function(window) {
  window["env"] = window["env"] || {};

  // Set Environment Variables at Develop Machine
  window["env"]["GATEWAY_URL"] = "https://uniform-gateway-test.lpbank.com.vn";
  // window["env"]["GATEWAY_URL"] = "http://10.38.21.75:8181";
  // window["env"]["GATEWAY_URL"] = "http://10.38.21.18:8181";
  // window["env"]["GATEWAY_URL"] = "http://10.38.21.73:8080";
  // window["env"]["GATEWAY_URL"] = "http://localhost:8080";
  // window["env"]["GATEWAY_URL"] = "http://10.38.250.21:8080";
  // window["env"]["GATEWAY_URL"] = "http://10.38.250.19:8080";
  // window["env"]["BASE_URL"] = "http://10.38.21.73:8080";
  // window["env"]["GATEWAY_URL"] = "http://localhost:8080";
  window["env"]["DEBUG"] = true;
})(this);
