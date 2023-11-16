(function(window) {
  window.env = window.env || {};

  // Set Environment Variables at Server
  window["env"]["GATEWAY_URL"] = "${GATEWAY_URL}";
  window["env"]["DEBUG"] = "${DEBUG}";
})(this);