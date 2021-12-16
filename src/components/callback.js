import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Auth, API } from "aws-amplify";
import { magic } from "../lib/magic";
import awsconfig from "../aws-exports";
import { UserContext } from "../lib/UserContext";
import Loading from "./loading";

const Callback = (props) => {
  const history = useHistory();
  const [user, setUser] = useContext(UserContext);

  // The redirect contains a `provider` query param if the user is logging in with a social provider
  useEffect(() => {
    finishEmailRedirectLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `loginWithCredential()` returns a didToken for the user logging in
  const finishEmailRedirectLogin = () => {
    let magicCredential = new URLSearchParams(props.location.search).get(
      "magic_credential"
    );
    if (magicCredential)
      magic.auth
        .loginWithCredential()
        .then((didToken) => authenticateWithServer(didToken));
  };

  // Send token to server to validate
  const authenticateWithServer = async (didToken) => {
    let userMetadata = await magic.user.getMetadata();
    const res = await API.post(
      awsconfig.aws_cloud_logic_custom[0].name,
      "/auth",
      {
        body: {
          didToken,
          issuer: userMetadata.issuer,
        },
      }
    );
    const credentials = await Auth.federatedSignIn(
      "developer",
      {
        identity_id: res.IdentityId,
        token: res.Token,
        expires_at: 3600 * 1000 + new Date().getTime(),
      },
      user
    );

    if (credentials) {
      // Set the UserContext to the now logged in user
      let userMetadata = await magic.user.getMetadata();
      await setUser({ ...userMetadata, identityId: credentials.identityId });
      history.push("/profile");
    }
  };

  return <Loading />;
};

export default Callback;
