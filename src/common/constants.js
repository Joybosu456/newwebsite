// import { SERVICE_URL } from "./AppSetting";
// import { IMPS_URL } from "./AppSetting";
// import { DIGILOCKER_URL } from "./AppSetting";
// import { DIGIESIGN_URL } from "./AppSetting";

// "EKYC"
let SERVICE_URL, BASE_URL;
if (process.env.REACT_APP_DOMAIN === "EKYC") {
  // EKYC
  SERVICE_URL = "https://uat-ekyc2.bajajfinservsecurities.in/api/ekyc2";
  BASE_URL = "https://uat-ekyc2.bajajfinservsecurities.in";
} else if (process.env.REACT_APP_DOMAIN === "NAOM") {
  // NAOM
  SERVICE_URL = "https://uat-free-demat.bajajfinservsecurities.in/api/ekyc2";
  BASE_URL = "https://uat-free-demat.bajajfinservsecurities.in";
} else if (process.env.REACT_APP_DOMAIN === "PWA") {
  // PWA
  SERVICE_URL = "https://uat-pwa.bajajfinservsecurities.in/api/ekyc2";
  BASE_URL = "https://uat-pwa.bajajfinservsecurities.in";
}

export const SERVICES = {
  // CLIENTSAVE: SERVICE_URL + "/Client/Save",
  LAEDSAVE: SERVICE_URL + "/Client/v2/lead",
  CLIENTSAVE: SERVICE_URL + "/Client/Save",
  MOBILEOTP: SERVICE_URL + "/Client/mobileotp",
  MOBILEOTPVERIFICATION: SERVICE_URL + "/Client/mobileOptValidation",
  MOBILESMSVALIDATION: SERVICE_URL + "/Client/v2/mobileSMSValidation",
  CLIENTRESUME: SERVICE_URL + "/Client/resume",
  PIXELTRIGGER: SERVICE_URL + "/Client/PixelTrigger",
  UPLOADPANMANUALY: SERVICE_URL + "/Client/UpdatepanManually",
  ACCOUNTOPENING: SERVICE_URL + "/Client/AccountOpening",
  UPDATEPACKINFO: SERVICE_URL + "/Client/UpdatePackInfo",
  GETPACKWISEPERCENTAGE: SERVICE_URL + "/Client/GetPackwisePercentage",
  UPDATEPAYMENTINFODESC: SERVICE_URL + "/Client/UpdatePaymentInfoDec",
  GETALLDOCUMENT: SERVICE_URL + "/Client/GetAllDocuments",
  GETPANDOCUMENT: SERVICE_URL + "/Client/GetPanDocuments",
  DELETEDOCUMENT: SERVICE_URL + "/Client/DeleteDocument",
  PDFDOWNLOAD: SERVICE_URL + "/Client/pdfdownolad",
  IPVDOWNLOAD: SERVICE_URL + "/Client/DownloadIPV",
  PDFDOWNLOADNEW: SERVICE_URL + "/Client/DownloadPDF",
  TradingNSEBSEDerivtive: SERVICE_URL + "/Client/TradingNSEBSEDerivtive",
  UPLOADDOCUMENTFILE: SERVICE_URL + "/Client/UploadDocuments",
  GETALLMERGEPDF: SERVICE_URL + "/Client/GetAllDocumentsMergePDF",
  ZIPCODE: SERVICE_URL + "/Client/zipcode",
  UPLOADPANDOCUMENT: SERVICE_URL + "/Client/UploadPANDocument",
  GETPACKDETAILS: SERVICE_URL + "/Client/GetPackDetails",
  GETBANKNAME: SERVICE_URL + "/Client/GetBankNameNew",
  GETBANKDISTRICT: SERVICE_URL + "/Client/GetDistrictName",
  GETBRANCHNAME: SERVICE_URL + "/Client/GetBranchNameNew",
  GETSTATENAME: SERVICE_URL + "/Client/GetStateName",
  INSERTBANKDETAILS: SERVICE_URL + "/Client/InsertBankDetails",
  GETIFSCCODE: SERVICE_URL + "/Client/GetIfscCodeNew",
  DIGIOLOGGER: SERVICE_URL + "/Client/LoggerBeforeDigioEsign",
  WELCOMESMS: SERVICE_URL + "/Client/SendSMSOnSubmit",
  WELCOMEEMAIL: SERVICE_URL + "/Client/SendEMAILOnSubmit",
  UPLOADIPV: SERVICE_URL + "/Client/saveIpvWebM",
  SENDEMAILOTP: SERVICE_URL + "/Client/SendEMAILOTP",
  VALIDATEDEMAILOTP: SERVICE_URL + "/Client/ValidateEMAILOTP",
  DOCUMENT_REDIRECT: BASE_URL + "/document-upload",
  GET_ALL_PACK: SERVICE_URL + "/Client/AllGetPackDetails",
  DIGIO_DOC_UPLOAD: SERVICE_URL + "/Client/DigioDocUpload",
  IMPSAPI: SERVICE_URL + "/Client/ImpsService", 
  DIGILOCKERURL: "https://uat-digilocker.bajajfinservsecurities.in",
  DIGIESIGNURL: "https://ekycmuatapk.bajajfinservsecurities.in/EsignDev/DIGIO_ESIGN.aspx",
  DIGIOKID: "https://uat-digilocker.bajajfinservsecurities.in/?kid=",
  // DIGILOCKERURL: "https://cug-digilocker.bajajfinservsecurities.in",
  // DIGIESIGNURL: "https://ekycmuatapk.bajajfinservsecurities.in/EsignCug/DIGIO_ESIGN.aspx",
  // DIGIOKID: "https://cug-digilocker.bajajfinservsecurities.in/?kid=",
  DigioInitializer: SERVICE_URL + "/Client/DigioInitializer",
  resumebymobile: SERVICE_URL + "/Client/resumebymobile",
  ValiadatePan:SERVICE_URL + "/Client/v2/ValidatePan",
  mobileotp:SERVICE_URL + "/Client/v2/mobileotp",
  mobileOptValidation:SERVICE_URL + "/Client/v2/mobileOptValidation",
  DigioInitializerTelecaller: SERVICE_URL + "/Client/v2/DigioInitializer",
  DIGIO_DOC_UPLOAD_TELECALLER: SERVICE_URL + "/Client/v2/DigioDocUpload"
};
