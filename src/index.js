import Amplify, { Auth } from "aws-amplify";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "@magiclabs/ui/dist/cjs/index.css";
import { ThemeProvider } from "@magiclabs/ui";
import awsconfig from "./aws-exports";
import { magic } from "./lib/magic";
window.LOG_LEVEL = "DEBUG";

async function refreshToken() {
  const didToken = await magic.user.getIdToken();
  const userMetadata = await magic.user.getMetadata();
  const body = JSON.stringify({
    didToken,
    issuer: userMetadata.issuer,
  });
  const res = await fetch(
    `${awsconfig.aws_cloud_logic_custom[0].endpoint}/auth`,
    {
      method: "POST",
      body,
    }
  );
  const json = await res.json();
  return {
    identity_id: json.IdentityId,
    token: json.Token,
    expires_at: 3600 * 1000 + new Date().getTime(),
  };
}
Amplify.configure(awsconfig);

Auth.configure({
  refreshHandlers: {
    developer: refreshToken,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider root>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
