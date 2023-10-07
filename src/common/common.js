import $ from "jquery";
import { set } from "lodash";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import clevertap from "clevertap-web-sdk";
import moengage from "@moengage/web-sdk";

export const customSelect = () => {
  $(".custom-select").each(function () {
    var $this = $(this),
      numberOfOptions = $(this).children("option").length;
    $this.addClass("select-hidden");
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="select-styled"></div>');

    var $styledSelect = $this.next("div.select-styled");
    $styledSelect.text($this.children("option").eq(0).text());
    var $list = $("<ul />", {
      class: "select-options",
    }).insertAfter($styledSelect);
    for (var i = 0; i < numberOfOptions; i++) {
      $("<li />", {
        text: $this.children("option").eq(i).text(),
        rel: $this.children("option").eq(i).val(),
      }).appendTo($list);
    }
    var $listItems = $list.children("li");
    $styledSelect.click(function (e) {
      e.stopPropagation();
      $("div.select-styled.active")
        .not(this)
        .each(function () {
          $(this).removeClass("active").next("ul.select-options").hide();
        });
      $(this).toggleClass("active").next("ul.select-options").toggle();
    });

    $listItems.click(function (e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass("active");
      $this.val($(this).attr("rel"));
      $list.hide();
    });

    $(document).click(function () {
      $styledSelect.removeClass("active");
      $list.hide();
    });
  });
};
export const nameValidation = (e) => {
  if (e.target.value.length >= 1) {
    if (e.target.value.charAt(0) === ".") {
      e.target.value = e.target.value.slice(1, e.target.value.length);
    }
  }
  e.target.value = e.target.value.trimStart()
  console.log("name", e.target.value)
  e.target.value = e.target.value.replace(/[^A-Za-z.\s]/g, "");
};

export const digitValidate = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};
export const validatePan = (values) => {
  var k = values.charCode;
  if (values.target.value.length >= 0 && values.target.value.length < 5) {
    if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8) {
      return true;
    } else {
      values.preventDefault();
    }
  }
  if (values.target.value.length >= 5 && values.target.value.length < 9) {
    if ((k >= 48 && k <= 57) || k === 8) {
      return true;
    } else {
      values.preventDefault();
    }
  }
  if (values.target.value.length >= 9 && values.target.value.length < 10) {
    if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8) {
      return true;
    } else {
      values.preventDefault();
    }
  }
};
export const mobileVal = (e) => {
  var k = e.charCode;
  if ((k >= 48 && k <= 57) || k === 8) {
    if (e.target.value.length === 0) {
      if (k >= 54 && k <= 57) {
      } else {
        e.preventDefault();
      }
    }
    return true;
  } else {
    e.preventDefault();
  }
};

export const playAudio = (page) => {
  let audioFile = document.getElementById("audioEkyc");
  audioFile.pause();
  if (localStorage.getItem("AudioPref") == "enable") {
    audioFile.src = `https://uat-ekyc2.bajajfinservsecurities.in/audiomedia/${localStorage.getItem(
      "AudioLanguage"
    )}/EKYC_${page}.mp3`;
    audioFile.play();
  }
};
export const pauseAudio = () => {
  let audioFile = document.getElementById("audioEkyc");
  audioFile.pause();
};
export const oneDigit = (e) => {
  // console.log(e.target.value.length);
  if (e.target.value.length > 1) {
    let value = String(e.target.value)[0];
    e.target.value = value;
  }
};

export const getSearchParameters = () => {
  var prmstr = window.location.search.substr(1);
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
};
export const transformToAssocArray = (prmstr) => {
  var params = {};
  var prmarr = prmstr.split("&");
  for (var i = 0; i < prmarr.length; i++) {
    var tmparr = prmarr[i].split("=");
    params[tmparr[0].toLowerCase()] = tmparr[1];
  }
  return params;
};

export const ResetLocal = () => {
  const tm = localStorage.getItem("terms") || "";
  const cm = localStorage.getItem("campaign");
  const md = localStorage.getItem("medium");
  const src = localStorage.getItem("source");
  const long = localStorage.getItem("Longitude") || "";
  const lat = localStorage.getItem("Latitude") || "";
  const language = localStorage.getItem("language") || "";
  const tel = localStorage.getItem("telecaller") || "no";
  const audioPref = localStorage.getItem("AudioPref") ?? "enable";
  const audioPlayed = localStorage.getItem("audioPlayed");
  const audiolang = localStorage.getItem("AudioLanguage");
  localStorage.clear();
  if (audioPlayed) {
    localStorage.setItem("audioPlayed", audioPlayed);
  }
  localStorage.setItem("domain", process.env.REACT_APP_DOMAIN);
  localStorage.setItem("terms", tm);
  localStorage.setItem("AudioLanguage", audiolang);
  localStorage.setItem("AudioPref", audioPref);
  localStorage.setItem("campaign", cm);
  localStorage.setItem("medium", md);
  localStorage.setItem("source", src);
  localStorage.setItem("Longitude", long);
  localStorage.setItem("Latitude", lat);
  localStorage.setItem("language", language);
  localStorage.setItem("telecaller", tel);
};

export const calLogic = (trade, monthToYear) => {
  let cashBFSL = 5,
    fnoBFSL = 5,
    intradayBFSL = 5,
    cashTrade = 0.5,
    fnoTrade = 0.05,
    intradayTrade = 0.05,
    cashValueOfTrade = 100000,
    fnoValueOfTrade = 100000,
    intradayValueOfTrade = 100000;
  let cal_bfsl, cal_tradiitional, cal_saving;
  if (trade === "Cash") {
    cal_bfsl = monthToYear * cashBFSL;
    cal_tradiitional = (cashValueOfTrade * monthToYear * cashTrade) / 100;
    cal_saving = cal_tradiitional - cal_bfsl;
    return { cal_bfsl, cal_tradiitional, cal_saving };
  } else if (trade === "F&O") {
    cal_bfsl = monthToYear * fnoBFSL;
    cal_tradiitional = (fnoValueOfTrade * monthToYear * fnoTrade) / 100;
    cal_saving = cal_tradiitional - cal_bfsl;
    return { cal_bfsl, cal_tradiitional, cal_saving };
  } else if (trade === "Intraday") {
    cal_bfsl = monthToYear * intradayBFSL;
    cal_tradiitional =
      (intradayValueOfTrade * monthToYear * intradayTrade) / 100;
    cal_saving = cal_tradiitional - cal_bfsl;
    return { cal_bfsl, cal_tradiitional, cal_saving };
  }
};

// export function CookieSet(cookieName, value, daysToLive = 2) {
//   var cookie = cookieName + "=" + encodeURIComponent(value);
//   if (typeof daysToLive === "number") {
//     // cookie += "; max-age=" + (daysToLive * 24 * 60 * 60);
//     cookie += "; max-age=" + daysToLive * 24 * 60 * 60;
//     //for secound
//     // cookie += "; max-age=" + (15);
//     document.cookie = cookie;
//   }
// }

// export function getCookie(name) {
//   var cookieArr = document.cookie.split(";");
//   for (var i = 0; i < cookieArr.length; i++) {
//     var cookiePair = cookieArr[i].split("=");
//     if (name == cookiePair[0].trim()) {
//       return decodeURIComponent(cookiePair[1]);
//     }
//   }
//   return null;
// }

// export function checkCookie() {
//   var UserName = getCookie("UserName");
//   if (UserName != "") {
//     alert("Welcome again, " + UserName);
//   } else {
//     // let  firstName = prompt("Please enter your UserName:");
//     if (UserName != "" && UserName != null) {
//       CookieSet("UserName", UserName, 30);
//     }
//   }
// }

export const onlyNumber = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};

export const onlyAlpabet = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};

export const otpFocusNext = (e, num) => {
  let element = document.querySelectorAll(`.${e.target.className}`);
  if (num > 1 && element[num - 1].value == "") {
    element[num - 2].focus();
  }
  if (num < 4 && element[num - 1].value != "") {
    element[num].focus();
  }
};
export const previewReset = () => {
  let previewAllDiv = document.querySelectorAll(".second-view");
  for (let previewDiv of previewAllDiv) {
    if (
      previewDiv.style.display === "block" ||
      previewDiv.style.display === "flex"
    ) {
      let deleteBtn = previewDiv.querySelector(".edit.delete-input");
      deleteBtn.click();
    }
  }
};
export const getUrlExtension = (url) => {
  return url.split(/[#?]/)[0].split(".").pop().trim();
};
export const downloadPDF = (url, name) => {
  const isMobileDevice=()=> {
    return window
      .matchMedia("only screen and (max-width: 998px)").matches;
  }
  if (process.env.REACT_APP_DOMAIN === "PWA" && isMobileDevice() ) {
    let format = getUrlExtension(url);
    let link = document.createElement("a");
    link.href = url;
    link.download = `${name}.${format}`;
    link.click();
  } else {
    let xhr = new XMLHttpRequest();
    let format = getUrlExtension(url);
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
      if (this.status == 200) {
        let myBlob = this.response;
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(myBlob);
        link.download = `${name}.${format}`;
        link.click();
      }
    };
    xhr.send();
  }

};

export const AESDecryption = (data) => {
  const iv = "SLF1AMTkbk4PZsIC";
  const key = "OBlzjguunYOBsGx9";
  const fkey = CryptoJS.enc.Utf8.parse(key);
  const fiv = CryptoJS.enc.Utf8.parse(iv);
  return CryptoJS.AES.decrypt(data, fkey, {
    iv: fiv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
};
export const dateInput = (e) => {
  e.target.value = e.target.value.replace(/[^0-9-]/g, "");
};
export const sendToCleverTap = async (name, data) => {
  const utm_source_check = localStorage.getItem("source");
  if (utm_source_check == "BFA_app") {
    console.log(data);
    process.env.REACT_APP_DOMAIN === "PWA" && clevertap.event.push(name, data);
  }
};
export const randomClickEvent = (value) => {
  // 👇️ refers to the link element
  sendToCleverTap("BFSL_APPLICATION_CLICKED", {
    EP_PAGE_NAME: "HOME PAGE",
    EP_MOBILE_NO: localStorage.getItem("mobile"),
    EP_PAN: localStorage.getItem("Pan"),
    EP_DOB: localStorage.getItem("Dob"),
    EP_REFERRAL_CODE: localStorage.getItem("referralCode"),
    EP_CTA: value,
  });
};

export const clevertapIdentity = (mobile) => {
  process.env.REACT_APP_DOMAIN === "PWA" &&
    clevertap.onUserLogin.push({
      Site: {
        Identity: mobile, // String or number
      },
    });
};
export const ZeroPrefix = (number) => {

  let PrefixedNumber;
  if (parseInt(number) < 10 && !`${number}`.startsWith("0")) {
    PrefixedNumber = `0${number}`;
  } else {
    PrefixedNumber = number;
  }
  return PrefixedNumber;
};
const minMinorDate = () => {
  let CurrentDate = new Date();
  let MinorDateSet = CurrentDate.setFullYear(CurrentDate.getFullYear() - 18);
  let MinorFormat = new Date(MinorDateSet);
  let [day, month, year] = [
    MinorFormat.getDate(),
    MinorFormat.getMonth() + 1,
    MinorFormat.getFullYear(),
  ];

  month = ZeroPrefix(month);
  day = ZeroPrefix(day);
  return `${year}-${month}-${day}`;
};

export const maxDate = () => {
  return "2023-08-17";
};

export const EkcyDate = {
  minorDate: minMinorDate(),
};

export const shareError = (value, block) => {
  // if (value.length !== 10) {
  //   $(`.${block}`).css("display", "block");
  //   $(`.${block}`).html("Enter Valid Date Format , DD-MM-YYYY");
  //   return false
  // }
  if (value.reverseDob().underFutureDate() && value.reverseDob().isValidDate()) {
    let age = value.reverseDob().getMinor();
    console.log(age);
    if (age) {
      $(`.${block}`).css("display", "none");
      $(`.${block}`).html("");
      return true;
    } else {
      $(`.${block}`).css("display", "block");
      $(`.${block}`).html("Below 18 year is not allowed");
      return false;
    }
  } else {
    $(`.${block}`).css("display", "block");
    $(`.${block}`).html("Enter Valid Date Format , DD-MM-YYYY");
    return false;
  }
};
export const nomError = (value, block) => {
  // if (value.length !== 10) {
  //   $(`.${block}`).css("display", "block");
  //   $(`.${block}`).html("Enter Valid Date Format , DD-MM-YYYY");
  //   return false
  // }
  console.log(value, "nomeror value");
  if (value.reverseDob().underFutureDate() && value.reverseDob().isValidDate()) {
    // let age = value.reverseDob().getMinor();
    // console.log(age);
    $(`.${block}`).css("display", "none");
    $(`.${block}`).html("");
    return true;

  } else {
    $(`.${block}`).css("display", "block");
    $(`.${block}`).html("Enter Valid Date Format , DD-MM-YYYY");
    return false;
  }
};

export const isImage = (icon) => {
  let ext = [".jpg", ".jpeg", ".png"];
  return ext.some((el) => icon.toLowerCase().endsWith(el));
};

export const isVideo = (icon) => {
  var ext = [".mp4", ".webm"];
  return ext.some((el) => icon.toLowerCase().endsWith(el));
};
export const decryptUserData = (data) => {
  if (!data) return null;

  const parsedKey = CryptoJS.enc.Utf8.parse("kXp2s5v8y/B?E(H+MbQeThWmYq3t6w9z");

  const parsedIV = CryptoJS.enc.Utf8.parse("2r5u8x/A?D(G+KbP");

  const decrypted = CryptoJS.AES.decrypt(decodeURIComponent(data), parsedKey, {
    iv: parsedIV,

    mode: CryptoJS.mode.CBC,

    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const ME_EventTriggered = (eventName, eventValue = {}) => {
  //let moEngageStatus = localStorage.getItem("moEngageStatus") ? localStorage.getItem("moEngageStatus"):true
  // console.log("moEngageStatus",moEngageStatus)
  console.log("tttt", eventName, eventValue);
  let defaultValue = {
    "User ID": localStorage.getItem("mobile"),
    Timestamp: Math.floor(new Date().getTime() / 1000.0),
    // dateStamp: getFormatedDate().stringDate+" "+new Date().toLocaleTimeString()
    platform_name: "eKYC_2.0",
  };
  let updatedEventValue = Object.assign({}, eventValue, defaultValue);
  console.log(updatedEventValue, "updatedEventValue");
  if (eventName) {
    // if(eventName == ){
    //     //alert("loginnnn")
    //     moengage.destroy_session();
    // }
    if (eventName == "Get OTP") {
      //alert("loginnnn")
      //moengage.destroy_session();
      moengage.add_unique_user_id(localStorage.getItem("mobile"));
    }
    if (eventName == "IdentityVerified" || eventName == "SubmitEmail") {
      //alert("called")
      console.log(
        "eventValue.name",
        eventValue.fullname,
        eventValue.email,
        // eventValue.mobNo,
        eventValue.pan
      );
      moengage.add_first_name(
        eventValue.fullname ? eventValue.fullname.split(" ")[0] : null
      );
      moengage.add_last_name(
        eventValue.fullname ? eventValue.fullname.split(" ")[1] : null
      );
      moengage.add_email(eventValue.email ? eventValue.email : null);
      moengage.add_mobile(localStorage.getItem("mobile") ? localStorage.getItem("mobile") : null);
      moengage.add_user_name(eventValue.fullname ? eventValue.fullname : null);
    } else if (eventName !== "IdentityVerified") {
      //alert("event")
      moengage.track_event(eventName, updatedEventValue);
    }
  }
};
export const underAgeValidate = (birthday) => {

  // it will accept two types of format yyyy-mm-dd and yyyy/mm/dd

  let optimizedBirthday = birthday.replace(/-/g, "/");

  //set date based on birthday at 01:00:00 hours GMT+0100 (CET)

  let myBirthday = new Date(optimizedBirthday);

  // set current day on 01:00:00 hours GMT+0100 (CET)

  let currentDate = new Date().toJSON().slice(0, 10) + ' 01:00:00';

  // calculate age comparing current date and borthday

  let myAge = ~~((Date.now(currentDate) - myBirthday) / (31557600000));

  console.log(myAge, "myAge");
  return myAge
  // if (myAge < 18) {
  //   return true;
  // } else {
  //   return false;
  // }
}

export const nameFirstLetter = (e) => {
  if (e.target.value.length >= 1) {
    if (e.target.value.charAt(0) === ".") {
      e.target.value = e.target.value.slice(1, e.target.value.length);
    }
  }
}

export const allTrim = (e) => {
  e.target.value = e.target.value.replaceAll(' ', '');
}

export const startTrimString = (e) => {
  e.target.value = e.target.value.trimStart();
}


export const checkUrlValid = async (image) => {
  let ImageStatus = await fetch(image)
    .then(response => {
      console.log(response);
      if (response.ok) {
        console.log('Image URL is valid');
        return true
      } else {
        console.log('Image URL is invalid');
        return false
      }
    })
    .catch(error => {
      console.error('Error validating image URL:', error);
      return false
    });
  return ImageStatus
}

// let UrlStatus = await checkUrlValid("https://ekyc2-docs.s3.ap-south-1.amazonaws.com/prod/preview/EGSPB6593R/JOY_QDAADEGSPB6593R_6296582055_Cheque.pdf?X-Amz-Expires=1200&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAZNSJWK6MQBT7D27M/20230913/ap-south-1/s3/aws4_request&X-Amz-Date=20230913T123438Z&X-Amz-SignedHeaders=host&X-Amz-Signature=3dd484aec9dfcbcedb9498ad83bd8d85e663739d86c6ed375f851b8392485b42")
