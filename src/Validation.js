import * as Yup from "yup";
// export const  dobVal = Yup.string().matches(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/,"Date of Birth must be a valid date in the format DD-MM-YYYY");
export const  dobVal = Yup.string().required("Date of Birth is required").min(10,"Please Enter Valid Date");
export const relVal = Yup.string().required("Relation  is a required");
// export const nameVal = Yup.string().required("Name is a required").matches(/^[a-zA-Z.][a-zA-Z. ]*$/, "Please enter valid name");
export const nameVal = Yup.string().required("Name is a required");

export const idProofVal = Yup.string().required("Identity Proof is required");
export const aadharVal = Yup.string().required("Aadhar Number is a required field.").matches(/^[*]{8}[0-9]{4}$/,"Please enter last 4 digit of aadhar number");
export const panVal = Yup.string().required("PAN Number is a required field.").matches(/^[A-Za-z]{3}[Pp]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]{1}$/,"Please enter 10 Character valid PAN number without white space");
export const dlVal = Yup.string().required("DL Number is a required field.").matches(/^[A-Za-z]{2}[0-9]{13}$/
,"Please enter 15 Character valid DL number without white space");
export const birthVal = Yup.string().required("Birth Certificate is a required field.").matches(/^[0-9]*$/,"Please enter valid Birth Certificate without white space").min(6, "Birth Certificate must be minimum 6 without white space").max(12, "Birth Certificate must be maximum  12 without white space");
export const votingVal = Yup.string().required("Voting ID is a required field.").matches(/^([a-zA-Z]){3}([0-9]){7}?$/,"Please enter valid 10 Character Voting ID without white space").min(6, "Birth Certificate must be minimum 6 without white space").max(12, "Birth Certificate must be maximum  12 without white space");

const requiredVal = Yup.string().required();

export const otpSchema = Yup.object().shape({
    otp1: requiredVal,
    otp2: requiredVal,
    otp3: requiredVal,
    otp4: requiredVal,

});