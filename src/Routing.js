import React, { Suspense } from "react";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import bajaj_loaderimg from "../src/assets/images/bajaj_loader.gif";
// import NewPanDetails from "./pages/NewPanDetails";

const LifeTimeAMCFree = lazy(() => import("./pages/LifeTimeAMCFree"));
const NewPanDetails = lazy(() => import("./pages/NewPanDetails"));

const BankDetail = lazy(() => import("./pages/BankDetail"));
const PersonalDetail = lazy(() => import("./pages/PersonalDetail"));
const NomineeDetail = lazy(() => import("./pages/NomineeDetail"));
const Subscription = lazy(() => import("./pages/Subscription"));
const DocumentUpload = lazy(() => import("./pages/DocumentUpload"));
const AddressDetail = lazy(() => import("./pages/AddressDetail"));
// const PanDetails = lazy(() => import("./pages/PanDetails"));
const EmailVerification = lazy(() => import("./socialApi/EmailVerification"));
const PanUpload = lazy(() => import("./pages/PanUpload"));
const CheckUpload = lazy(() => import("./pages/CheckUpload"));
const SignatureUpload = lazy(() => import("./pages/SignatureUpload"));
const SelfieUpload = lazy(() => import("./pages/SelfieUpload"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const AddressDetailManual = lazy(() => import("./components/AddressDetails"));
const FNO = lazy(() => import("./pages/FNO"));
const ResumeJourney = lazy(() => import("./pages/ResumeJourney"));
const Landing = lazy(() => import("./pages/Landing"));
const IPV = lazy(() => import("./pages/IPV"));

function Routing(props) {
  return (
    <>
      <Suspense
        fallback={
          <div>
            {/* Page is Loading... */}
            <img src={bajaj_loaderimg} className="loader-img" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/" element={<Landing {...props} />}></Route>
          <Route exact path="/pan-page" element={<NewPanDetails {...props} />}></Route>
          {process.env.REACT_APP_DOMAIN === "NAOM" && (
            <Route path="/lifetimeamcefree" element={<LifeTimeAMCFree />} />
          )}
          <Route
            path="/address-details-manually"
            element={<AddressDetailManual />}
          ></Route>
          <Route path="/nominee-detail" element={<NomineeDetail />}></Route>
          <Route path="/address-detail" element={<AddressDetail />} />
          <Route path="/subscription-pack" element={<Subscription />} />
          <Route path="/document-upload" element={<DocumentUpload />} />
          <Route path="/bank-detail" element={<BankDetail />} />
          <Route path="/personal-detail" element={<PersonalDetail />} />
          <Route path="/nominee-detail" element={<NomineeDetail />} />
          {/* <Route path="/pan-details" element={<PanDetails />}></Route> */}
          <Route path="/fno" element={<FNO />}></Route>
          <Route
            path="/email-verification"
            element={<EmailVerification />}
          ></Route>
          <Route path="/pan-upload" element={<PanUpload />}></Route>
          <Route path="/check-upload" element={<CheckUpload />}></Route>
          <Route path="/signature-upload" element={<SignatureUpload />}></Route>
          <Route path="/selfie-upload" element={<SelfieUpload />}></Route>
          <Route path="/thank-you" element={<ThankYou />}></Route>
          <Route path="/returnee-resume" element={<ResumeJourney />}></Route>
          <Route exact path="/ipvrecord" element={<IPV />}></Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default Routing;
