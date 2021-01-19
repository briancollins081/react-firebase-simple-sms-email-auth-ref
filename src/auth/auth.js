import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYZsxi7M5UQh9M8OyccM7dqjY2Tbx5wh8",
  authDomain: "reactsmsauth.firebaseapp.com",
  projectId: "reactsmsauth",
  storageBucket: "reactsmsauth.appspot.com",
  messagingSenderId: "437555213732",
  appId: "1:437555213732:web:8dfac2a360c08928ca7d31",
  measurementId: "G-NQQ39BF55Z",
};
firebase.initializeApp(firebaseConfig);
firebase.auth().useDeviceLanguage();

export const manageRecaptchaManenos = (idString) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      //   "recaptcha-container"
      idString
    );
  }
  if (!window.recaptchaWidgetId) {
    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  }
};

export const signInWithPhone = (phone, recaptchaVerifier, setVerifying) => {
  firebase
    .auth()
    .signInWithPhoneNumber(phone, recaptchaVerifier)
    .then((confirmationResult) => {
      //SMS Sent
      window.confirmationResult = confirmationResult;
      const recaptchaResponse = window.grecaptcha.getResponse(
        window.recaptchaWidgetId
      );
      //   console.log({ recaptchaResponse });
      setVerifying(true);
    })
    .catch((err) => {
      //SMS not sent
      window.grecaptcha.reset(window.recaptchaWidgetId);
    });
};

export const verifyUserAuthenticationCode = (code) =>
  window.confirmationResult
    .confirm(code)
    .then((result) => {
      // User signed in successfully.
      const user = result.user;
      
      console.log({ result, user });
    })
    .catch((error) => {
      // User couldn't sign in (bad verification code?)
      console.log({ error });
    });

export default firebase;
