import React from "react";
import Routing from "./Routing";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import "./App.css";
import { useState, useEffect } from "react";
import { customSelect } from "./common/common";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(true);
  // console.log("App", selectedLanguage);

  useEffect(() => {
    // const script = document.createElement("script");
    // script.src = "https://www.googletagmanager.com/gtag/js?id=UA-178479295-1";
    // document.body.append(script);
    localStorage.setItem("domain", process.env.REACT_APP_DOMAIN);
    geoloc();
    customSelect();
    if (!localStorage.getItem("telecaller")) {
      localStorage.setItem("telecaller", "no");
    }

    // if(localStorage.getItem("telecaller") == 'yes'){
    //   localStorage.setItem("telecaller","yes")
    // }else{
    //   localStorage.setItem("telecaller","no")
    // }
  }, []);
  // useEffect(() => {
  // }, [selectedLanguage])

  function successCallback(position) {
    localStorage.setItem("Longitude", position.coords.longitude);
    localStorage.setItem("Latitude", position.coords.latitude);
  }
  function errorCallback(err) {
    localStorage.setItem("Longitude", "");
    localStorage.setItem("Latitude", "");
  }
  function geoloc() {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(successCallback, errorCallback);
    } else {
      localStorage.setItem("Longitude", "");
      localStorage.setItem("Latitude", "");
    }
  }
  function languageChange() {
    setSelectedLanguage(!selectedLanguage);
  }
  function closePopup() {
    document.querySelector("body").style.overflow = "unset";

    var contact = document.querySelectorAll(".contact-model");
    var progressBar = document.querySelector(".form-progress");
    for (let element of contact) {
      // console.log(element);
      element.classList.remove("call");
    }
    if (progressBar) {
      progressBar.classList.remove("z-index-1");
    }
    // console.log(contact);
    document.getElementById("overlay").classList.remove("overlay");
  }
  console.log("5-10-23, 04-45 pm");
  return (
    <>
      <div className="d-none">
        <audio
          id="audioEkyc"
          src="https://uat-ekyc2.bajajfinservsecurities.in/audiomedia/English/EKYC_1.mp3"
        />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="disableCaret">
        <BrowserRouter>
          <Header languageChange={languageChange} />
          <Routing selectedLanguage={selectedLanguage} />
          <div id="overlay" className="" onClick={closePopup}></div>
        </BrowserRouter>
      </div>

    </>
  );
}
export default App;
