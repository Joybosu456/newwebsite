import { React, useEffect, useState } from "react";
import axios from "axios";
import { SERVICES } from "../common/constants";
import Language from "../common/Languages/languageContent.json";

const SubscriptionPackTable = () => {
  const [freedomPack, setFreedomPack] = useState();
  const [professionalPack, setProfessionalPack] = useState();
  const [bajajpriviagePack, SetBajajPriviagePack] = useState();
  const getPackDetails = async () => {

    console.log(SERVICES, "SERVICES");
    try {
      const response = await axios.get(
        SERVICES.GETPACKDETAILS,
        {},

        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFreedomPack(response.data.Response[0]);
      setProfessionalPack(response.data.Response[1]);
      SetBajajPriviagePack(response.data.Response[2]);
    } catch (err) {
      console.log(err);
      throw new Error(err.message)
    }
  };
  useEffect(() => {
    getPackDetails();
  }, []);

  return (
    <>
      <table id="subscription" className="subscription-table" role="table">
        <thead role="rowgroup">
          <tr role="row">
            <th role="columnheader" scope="col"> {Language[localStorage.getItem("language") || "English"].PLAN}</th>
            <th role="columnheader" scope="col">
              {freedomPack != undefined ||
                (null && freedomPack.packname != undefined) ||
                null
                ? freedomPack.packname
                : "FREEDOM PACK"}
            </th>
            <th role="columnheader" scope="col">
              {professionalPack != undefined ||
                (null && professionalPack.packname != undefined) ||
                null
                ? professionalPack.packname
                : "PROFESSIONAL PACK"}
            </th>
            <th role="columnheader" scope="col">
              {bajajpriviagePack != undefined ||
                (null && bajajpriviagePack.packname != undefined) ||
                null
                ? bajajpriviagePack.packname
                : "BAJAJ PRIVILEGE CLUB"}
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          <tr role="row"></tr>
          <tr className="pack-data" role="row">
            <td role="cell">
              {" "}
              {
                Language[localStorage.getItem("language") || "English"]
                  .ANNUAL_SUBCRIPTION_AMOUNT
              }
            </td>

            <td className="subscription-amount">
              <span className="bold">
                {Language[localStorage.getItem("language") || "English"].FREE}
              </span>
              <p>{Language[localStorage.getItem("language") || "English"].TEXT_4_YEAR}</p>
            </td>
            <td className="subscription-amount" role="cell">
              <span>
                {Language[localStorage.getItem("language") || "English"].RS}
              </span>
              <span>
                {professionalPack != undefined ||
                  (null && professionalPack.mtfrateper != undefined) ||
                  null
                  ? professionalPack.mtfrateper
                  : "-"}
              </span>
            </td>
            <td className="subscription-amount" role="cell">
              <span className="bold">
                {Language[localStorage.getItem("language") || "English"].RS}
              </span>
              <span className="bold">
                {bajajpriviagePack != undefined ||
                  (null && bajajpriviagePack.mtfrateper != undefined) ||
                  null
                  ? bajajpriviagePack.mtfrateper
                  : "-"}
              </span>
            </td>
          </tr>
          <tr className="pack-title premium" role="row">
            <td colSpan={3} role="cell">Premium Feature</td>
          </tr>
          <tr className="pack-title" role="row">
            <td colSpan={3} role="cell">
              {Language[localStorage.getItem("language") || "English"].BROKERAGE_FEE}
            </td>
          </tr>
          <tr className="pack-data" role="row">
            <td role="cell">{Language[localStorage.getItem("language") || "English"].BROKERAGE_FEE}</td>
            <td className="pack-data-odd" role="cell">
              {Language[localStorage.getItem("language") || "English"].Rs_20_order}
              {/* <span className="bold">
                {Language[localStorage.getItem("language") || "English"].Delivery_order}
              </span>
              <p>{Language[localStorage.getItem("language") || "English"].Rs_20_order}</p> */}
            </td>
            <td className="pack-data-odd" role="cell">
              {Language[localStorage.getItem("language") || "English"].Rs_10_order}
              {/* <span className="bold">
                {Language[localStorage.getItem("language") || "English"].Delivery_order}
              </span>
              <p>{Language[localStorage.getItem("language") || "English"].Intraday_FO_order}</p> */}
            </td>
            <td className="pack-data-odd bold bpc-hightlighted" role="cell">
              {Language[localStorage.getItem("language") || "English"].Rs_5_order}
              {/* <span className="bold">
                {Language[localStorage.getItem("language") || "English"].Delivery_order}
              </span>
              <p>{Language[localStorage.getItem("language") || "English"].Intraday_BPC_SUB_order}</p> */}

            </td>
          </tr>
          <tr className="pack-title" role="row">
            <td colSpan={3} role="cell">
              {Language[localStorage.getItem("language") || "English"].SAVINGS}
            </td>
          </tr>
          <tr className="pack-data" role="row">
            <td role="cell">{Language[localStorage.getItem("language") || "English"].SAVINGS}</td>
            <td className="pack-data-content" role="cell">
              {Language[localStorage.getItem("language") || "English"].STANDARD}
            </td>
            <td className="pack-data-content" role="cell">
              {Language[localStorage.getItem("language") || "English"].ON_50_ALL_ORDERS}
            </td>
            <td role="cell" className="pack-data-content bold">
              {Language[localStorage.getItem("language") || "English"].ON_70_ALL_ORDERS}
            </td>
          </tr>
          <tr className="pack-title" role="row">
            <td role="cell" colSpan={3}>
              {Language[localStorage.getItem("language") || "English"].MTF_INTEREST_RATES}

            </td>
          </tr>
          <tr className="pack-data" role="row">
            <td role="cell">{Language[localStorage.getItem("language") || "English"].MTF_INTEREST_RATES}</td>
            <td role="cell" className="pack-data-odd">
              {Language[localStorage.getItem("language") || "English"]._18}

            </td>
            <td role="cell" className="pack-data-odd">
              {Language[localStorage.getItem("language") || "English"].packNumber}
            </td>
            <td role="cell" className="pack-data-odd bold">
              {Language[localStorage.getItem("language") || "English"].LOWEST_MARKET}

            </td>
          </tr>
          <tr className="pack-title" role="row">
            <td role="cell" colSpan={3}>
              {Language[localStorage.getItem("language") || "English"].DEDICATED_DEALER}

            </td>
          </tr>
          <tr className="pack-data" role="row">
            <td role="cell"> {Language[localStorage.getItem("language") || "English"].DEDICATED_DEALER}</td>
            <td role="cell">
              {Language[localStorage.getItem("language") || "English"].No}
            </td>
            <td role="cell">
              {Language[localStorage.getItem("language") || "English"].Yes}
            </td>
            <td role="cell" className="bold">
              {Language[localStorage.getItem("language") || "English"].Yes}
            </td>
          </tr>

          <tr className="pack-title" role="row">
            <td role="cell" colSpan={3}>Annual Maintenance Charges</td>
          </tr>
          <tr className="pack-data" role="row">
            <td role="cell">  {Language[localStorage.getItem("language") || "English"].AMC}</td>
            <td role="cell" className="pack-data-odd bold">
              {Language[localStorage.getItem("language") || "English"].FREE}

            </td>
            <td role="cell" className="pack-data-odd bold">
              {Language[localStorage.getItem("language") || "English"].FREE}
            </td>
            <td role="cell" className="pack-data-odd bold bpc-hightlighted">
              {Language[localStorage.getItem("language") || "English"].FREE}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default SubscriptionPackTable;
