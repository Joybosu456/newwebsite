import React from "react";
import "./assets/css/style.min.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import clevertap from "clevertap-web-sdk";
import moengage from "@moengage/web-sdk";
import * as Sentry from "@sentry/react";
import { ZeroPrefix } from './common/common.js'

moengage.initialize({

    app_id: "HQ8BFGBM7RC3AOEVOKDNZYD2",
    debug_logs: 1,
    cluster: "DC_3",
    //swPath: "/serviceworker.js",
    // swPath: "/service-worker.js"

});


if (process.env.REACT_APP_DOMAIN === "PWA") {
    clevertap.privacy.push({ optOut: false })
    clevertap.privacy.push({ useIP: true })
    clevertap.init('TEST-K9K-97K-8Z6Z', 'in1', '')
    clevertap.setLogLevel(3)
}


Sentry.init({
    // dsn: "https://50288a7eef564417ae2b9779fad83330@o4505544089403392.ingest.sentry.io/4505544091107328",

    // integrations: [
    //     new Sentry.BrowserTracing({
    //         // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    //         tracePropagationTargets: ["http://localhost:3000", "https://uat-ekyc2.bajajfinservsecurities.in/api/ekyc2"],
    //     }),
    //     new Sentry.Replay(),
    // ],
    // // Performance Monitoring
    // tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // // Session Replay
    // replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    // replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);


serviceWorkerRegistration.register();
String.prototype.underFutureDate = function () {
    console.log(this, "this");
    let EnteredDate = new Date(this);
    console.log("EnteredDate", EnteredDate);

    if (EnteredDate === NaN || this.length !== 10 || EnteredDate == "Invalid Date") {
        return false
    }
    let CurrentDate = new Date()
    let MajorDateSet = CurrentDate.setFullYear(CurrentDate.getFullYear() - 90);
    let MajorFormat = new Date(MajorDateSet);
    let MajorDateTime = EnteredDate.getTime() - MajorFormat.getTime();
    let FutherDate = Date.now() - EnteredDate.getTime();
    if (Math.sign(FutherDate) === -1 || Math.sign(MajorDateTime) === -1) {
        return false
    } else {
        return true
    }
};

String.prototype.getMinor = function () {
    let enteredDate = new Date(this);

    console.log(enteredDate);
    // return Math.abs(ageDate.getUTCFullYear() - 1970);
    let enteredTime = enteredDate.getTime();
    console.log(enteredTime, "enteredTime");
    let CurrentDate = new Date();
    let MinorDateSet = CurrentDate.setFullYear(CurrentDate.getFullYear() - 18);
    console.log(MinorDateSet, "MinorDateSet");
    let MinorFormat = new Date(MinorDateSet);
    console.log(MinorFormat, "MinorFormat");
    let CompareDate = MinorFormat - enteredTime;
    console.log(CompareDate, "CompareDate");

    if (Math.sign(CompareDate) === -1) {
        return false
    } else {
        return true
    }
}

String.prototype.reverseDob = function () {
    let enteredArray = this.split("-").reverse().join("-");
    return enteredArray
};


Number.prototype.formatBytes = function () {
    var units = ["B", "KB", "MB", "GB", "TB"],
        bytes = this,
        i;
    for (i = 0; bytes >= 1024 && i < 4; i++) {
        bytes /= 1024;
    }

    return bytes.toFixed(2) + units[i];
};






String.prototype.isValidDate = function () {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    let currentDate = new Date(this);
    if (currentDate == "Invalid Date" || this.length !== 10) {
        return false
    }
    let [year, month, day] = this.split("-");

    console.log(currentDate, "currentDate");

    console.log(currentDate.getDay(), "currentDate.getDay()");

    console.log(currentDate, "currentDate");

    console.log(currentDate.getDate(), "currentDate");

    let [matchday, matchmonth, matchyear] = [currentDate.getDate(), currentDate.getMonth() + 1, currentDate.getFullYear()]




    // day = ZeroPrefix(day)
    // month = ZeroPrefix(month)

    matchday = ZeroPrefix(matchday)
    matchmonth = ZeroPrefix(matchmonth)


console.log(day == matchday && matchmonth == month,"vvvvvvvvvvvvv")
    return day == matchday && matchmonth == month

};
String.prototype.getDayOfString = function () {
    let currentDate = new Date(this);
    return currentDate.getDate();

};
String.prototype.getMonthOfString = function () {
    let currentDate = new Date(this);
    return currentDate.getMonth() + 1;

};
String.prototype.getYearOfString = function () {
    let currentDate = new Date(this);
    return currentDate.getFullYear();

};

