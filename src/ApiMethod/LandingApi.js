import axios from "axios";
import { SERVICES } from "../common/constants";

export const mobileotpApi = async (data) => {
    // const url = "https://uat-ekyc2.bajajfinservsecurities.in/api/ekyc2/Client/v2/mobileotp";
    const url=SERVICES.mobileotp;
    let reqObject = {
        "name": localStorage.getItem("FullName"),
        "mobile": localStorage.getItem("mobile"),
        "refferalCode": localStorage.getItem("referralCode")
    }
    try {
        const mobileotpResponse = await axios.post(
            url,
            reqObject,
            {
                headers: {
                    "content-Type": "application/json",
                },
            }
        );
        return { mobileotpResponse: mobileotpResponse.data }
    } catch (error) {
        return  { mobileotpError: error }

    }

}

export const panValidationApi = async (data) => {
    // const url = "https://uat-ekyc2.bajajfinservsecurities.in/api/ekyc2/Client/v2/ValiadatePan";
    const url=SERVICES.ValiadatePan;
    const { pan, dob } = data;
    localStorage.setItem("Dob", dob.reverseDob() || "");
    localStorage.setItem("Pan", pan.toUpperCase() || "");
    const reqObject = {
        "pan": pan.toUpperCase(),
        "dob": dob.reverseDob(),
        "mobile": localStorage.getItem("mobile")
    }
    try {
        const panResonse = await axios.post(
            url,
            reqObject,
            {
                headers: {
                    "content-Type": "application/json",
                },
            }
        );
        return { panResonse: panResonse.data }
    } catch (error) {
        return { panError: error }

    }

}


export const OptValidationApi = async (data) => {
    // const url = "https://uat-ekyc2.bajajfinservsecurities.in/api/ekyc2/Client/v2/mobileOptValidation";
    const url=SERVICES.mobileOptValidation;
    console.log(data);


    const { mobile, otp, fullname } = data;
    const reqObject = {
        "accountOpening": {
            "mobile": mobile,
            "otpuqid": "B05724CE-39E7-45BA-87D8-4D9137BE693B",
            "mobpswd": otp,
            "fullname": fullname,
        },
        "screenType": 0
    }
    try {
        const OptValidationResponse = await axios.post(
            url,
            reqObject,
            {
                headers: {
                    "content-Type": "application/json",
                },
            }
        );
        return { OptValidationResponse: OptValidationResponse.data }
    } catch (error) {
        return { OptValidationError: error }

    }

}