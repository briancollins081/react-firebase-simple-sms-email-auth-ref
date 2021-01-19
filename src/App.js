import { useEffect, useRef, useState } from "react";
import { getbackenddata } from "./api/client";
import firebase, {
  signInWithPhone,
  manageRecaptchaManenos,
  verifyUserAuthenticationCode,
} from "./auth/auth";

const App = () => {
  const [phone, setPhone] = useState();
  const [verificationCode, setVerificationCode] = useState(null);
  const [message, setMessage] = useState("");
  const [authStatus, setAuthStatus] = useState("");
  const [verifying, setVerifying] = useState(false);

  const modalRef = useRef(null);

  const signIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword("briancollins081@gmail.com", "password")
      .then((res) => {
        setAuthStatus("Authorized successfully.");
      })
      .catch((err) => {
        setAuthStatus(err);
      });
  };

  useEffect(() => {
    manageRecaptchaManenos("recaptcha-container");
    /* if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container"
      );
    }
    if (!window.recaptchaWidgetId) {
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    } */
  });

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setAuthStatus("Signed out successfully.");
        localStorage.removeItem("accesstoken");
      })
      .catch((err) => {
        setAuthStatus(err);
      });
  };
  const sendRequest = (e) => {
    e.preventDefault();
    getbackenddata(firebase).then((res) => {
      setMessage(res.data.message);
    });
  };

  // FORMS START HERE
  const handlePhoneChange = (e) => {
    e.preventDefault();
    setPhone(e.target.value);
  };
  const handleCodeChange = (e) => {
    e.preventDefault();
    setVerificationCode(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithPhone(phone, window.recaptchaVerifier, setVerifying);
  };

  const handleSubmitCode = (e) => {
    e.preventDefault();
    verifyUserAuthenticationCode(verificationCode);
  };

  return (
    <>
      <div className="container-fluid py-4">
        <h3 className="text-muted text-center">
          Firebase AUTH Appliation with React & Node.js
        </h3>
        <hr />
        <div className="px-5 text-center">
          <p className="lead mt-2">{authStatus || "Not Authorized"}</p>
          <div className="d-flex my-4 justify-content-center">
            <button onClick={signIn} className="btn btn-outline-primary mx-4">
              Sign In &gt;
            </button>
            <button
              onClick={(e) => sendRequest(e)}
              className="btn btn-outline-success mx-4"
            >
              Send Request &gt;
            </button>
            <button onClick={signOut} className="btn btn-outline-danger mx-4">
              Sign Out &gt;
            </button>
          </div>
          <p className="lead">{message}</p>
          <hr />
          <div className="d-flex flex-column justify-content-center align-items-center">
            {verifying === false ? (
              <form
                className="text-left"
                style={{ minWidth: "400px", maxWidth: "100%" }}
                onSubmit={handleSubmit}
              >
                <div className="form-group my-4">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                <div className="d-flex justify-content-between align-items-end">
                  <button type="submit" className="btn btn-primary">
                    Sign in
                  </button>
                  <div
                    className="d-block"
                    style={{
                      height: "2rem",
                    }}
                    id="recaptcha-container"
                  ></div>
                </div>
              </form>
            ) : (
              <form
                className="text-left"
                style={{ minWidth: "400px", maxWidth: "100%" }}
                onSubmit={handleSubmitCode}
              >
                <div className="form-group my-4">
                  <label htmlFor="phoneNumber">Enter Verification Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="verificationCode"
                    placeholder="Verification Code"
                    autoFocus
                    autoComplete={false}
                    value={verificationCode}
                    onChange={handleCodeChange}
                  />
                </div>
                <div className="d-flex justify-content-between align-items-end">
                  <button type="submit" className="btn btn-primary">
                    Verify Code
                  </button>
                  <div
                    className="d-block"
                    style={{
                      height: "2rem",
                    }}
                    id="recaptcha-container"
                  ></div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
