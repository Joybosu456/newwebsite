// export const AF_EventTriggered = (
//   eventCategory,
//   eventName,
//   eventValue = {}
// ) => {
//   // console.log("event1", eventCategory, eventName, eventValue);
//   let defaultValue = { 
//     userId: localStorage.getItem("mobile"),

//     timeStamp: new Date().toLocaleTimeString(),

//     dateStamp: new Date(),
//   };

//   let updatedEventValue = Object.assign({}, eventValue, defaultValue);

//   if (eventCategory && eventName) {
//     window.AF("pba", "event", {
//       eventType: "EVENT",

//       eventName: eventName,

//       eventCategory: eventCategory,

//       eventValue: updatedEventValue,
//     });
//   }

//   window.AF("pba", "setCustomerUserId", "test");

//   // window.AF.setCustomerUserId(getUserID());
// };
