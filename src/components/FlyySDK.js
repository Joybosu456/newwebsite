import FlyySDK from "flyy-web-sdk";


let partner_key = "O5ktvcKCPP7duwp8dsvqBLXfepugrA7IBq73PvGD";

let headers = {
  "Content-Type": "application/json",
  "PARTNER-KEY": partner_key,
};

export async function getUserToken(number, referal) {
  const flyySDK = new FlyySDK();
  
  console.log(number, referal, "number,referal");
  let url =
    "https://uat-ekyc2.bajajfinservsecurities.in/api/external/event/token";
  let bodyData = {
    isNew: true,
    username: number,
    mobileNo: number,
    displayName: number,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(bodyData),
    });
    const resp = await response.json();
    console.log("flyyUsertoken", resp);
    // if (resp.response_code === 200 && resp.ext_user_id) { for stage

    if (resp.Data.response_code === 200 && resp.Data.ext_user_id) {
      let data = {
        package_name: "com.msf.bfsl.uat",
        partner_id: "3660b0af2ab941bee191",
        ext_user_token: resp.Data.token,
        attachMode: "popup",
        environment: "STAGING",
        device_id:resp.Data.device_id
      };
      flyySDK.init(JSON.stringify(data));
    }
  } catch (error) {
    console.log("error", error);
  }
}


export function getReferralCodeFromURL(params) {
  if (params?.referal_code) {
    let code = params.referal_code.split("~");
    console.log("referral", code);
    return code[0];
  }
  return false;
}
 