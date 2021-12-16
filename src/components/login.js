import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import { MonochromeIcons, CallToAction } from "@magiclabs/ui";

import { magic } from "../lib/magic";
import { UserContext } from "../lib/UserContext";
import EmailForm from "./email-form";

export const Fake = () => {
  const handleSubmit = async () => {
    try {
      const res = await API.post("api0cd770c4", "/fake", {
        body: {},
      });
      console.log("==== fake", { res });
    } catch (e) {
      console.log("error", { e });
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3 className="form-header">Fake</h3>
        <div>
          <CallToAction
            leadingIcon={MonochromeIcons.PaperPlane}
            color="primary"
            size="sm"
            onClick={handleSubmit}
          >
            Test API
          </CallToAction>
        </div>
      </form>
      <style>{`
        form,
        label {
          display: flex;
          flex-flow: column;
          text-align: center;
        }
        .form-header {
          font-size: 22px;
          margin: 25px 0;
        }
        .input-wrapper {
          width: 80%;
          margin: 0 auto 20px;
        }
      `}</style>
    </>
  );
};
const Login = () => {
  const history = useHistory();
  const [disabled, setDisabled] = useState(false);
  const [user, setUser] = useContext(UserContext);

  // If user is already logged in, redirect to profile page
  useEffect(() => {
    user && user.issuer && history.push("/profile");
  }, [user, history]);

  async function handleLoginWithEmail(email) {
    try {
      setDisabled(true); // disable login button to prevent multiple emails from being triggered
      await magic.user.logout();
      // Trigger Magic link to be sent to user
      await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL("/callback", window.location.origin).href, // optional redirect back to your app after magic link is clicked
      });
    } catch (error) {
      setDisabled(false); // re-enable login button - user may have requested to edit their email
      console.log(error);
    }
  }

  return (
    <>
      <div className="login">
        <EmailForm disabled={disabled} onEmailSubmit={handleLoginWithEmail} />
      </div>
      <style>{`
        .login {
          max-width: 20rem;
          margin: 40px auto 0;
          padding: 1rem;
          border: 1px solid #dfe1e5;
          border-radius: 4px;
          text-align: center;
          box-shadow: 0px 0px 6px 6px #f7f7f7;
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
};

export default Login;
