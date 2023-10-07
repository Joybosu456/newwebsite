import React, { useEffect } from 'react';
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ZeroPrefix } from '../common/common';

const DateCustom = (props) => {


    useEffect(() => {

        let newDate = props?.date?.reverseDob();
        // let valiDate = props?.date?.reverseDob()?.isValidDate();
        // if (valiDate) {
        //     customCalendarReset({
        //         day: `${ZeroPrefix(newDate.getDayOfString())}`,
        //         month: `${ZeroPrefix(newDate.getMonthOfString())}`,
        //         year: `${newDate.getYearOfString()}`
        //     })
        // } else {
        if (newDate) {
            // let [year, month, day] = newDate.split("-")
            // month = ZeroPrefix(month);
            let year, month, day;

            if (newDate.includes("/")) {
                [day, month, year] = newDate.split("/")
            }
            if (newDate.includes("-")) {
                [year, month, day] = newDate.split("-")
            }
            // day = ZeroPrefix(day);
            customCalendarReset({
                day: day,
                month: month,
                year: year
            })
        } else {
            customCalendarReset({
                day: "",
                month: "",
                year: ""
            })
        }

        // }
    }, [props.date, props.error])




    const FocusToEle = (state, e, focusTo, blur) => {
        let parent = e.target.parentNode;
        console.log(parent);
        let focusToElement = parent?.querySelector(`.dateCustom-${focusTo}`);
        if (!e.target.value.toString().startsWith("0") && e.target.value.length === 1) {
            customCalendarSetVal(state, `0${e.target.value}`)
            // e.target.value = `0${e.target.value}`
        }
        if (focusToElement && e.target.value.length === 2) {
            customCalendarSetVal(state, e.target.value)
            if (blur !== "blur") {
                focusToElement.focus()

            }
        }
        if (e.target.value.length === 1 && e.target.value == 0) {
            if (state != "year") {
                customCalendarSetVal(state, "01")

                if (blur !== "blur") {
                    focusToElement.focus()
                }

            }

        }
    }

    const DayInput = (e) => {
        console.log(e.target.value, "start dayinput");
        let length = e.target.value.length;
        let enteredText = e.target.value.slice(-1);
        let NumberRegex = /^[0-9]$/;
        let existingValue = e.target.value.slice(0, length - 1)

        if (!enteredText.match(NumberRegex)) {
            // e.target.value = existingValue;
            customCalendarSetVal("day", existingValue)

            return
        }

        if (parseInt(e.target.value) > 3 && e.target.value.length == 1) {
            FocusToEle("day", e, "month", "input")
        }
        if (parseInt(e.target.value) > 9 && e.target.value.length == 2) {
            FocusToEle("day", e, "year", "input");

        }
        if (parseInt(e.target.value) > 31 && e.target.value.length === 2) {
            // e.target.value = "31"
            customCalendarSetVal("day", "31")
            FocusToEle("day", e, "month", "input")

        }
        if (e.target.value.length >= 2) {
            // e.target.value = e.target.value.substring(0, 2);
            customCalendarSetVal("day", e.target.value.substring(0, 2))

            FocusToEle("day", e, "month", "input")
        }
        if (e.target.value == 0 & e.target.value.length >= 2) {
            // e.target.value = "01";
            customCalendarSetVal("day", "01")
            FocusToEle("day", e, "month", "input")
        }
        console.log(e.target.value, "end dayinput");

    }
    const MonthInput = (e) => {
        let length = e.target.value.length;
        let enteredText = e.target.value.slice(-1);
        let NumberRegex = /^[0-9]$/;
        let existingValue = e.target.value.slice(0, length - 1)

        if (!enteredText.match(NumberRegex)) {
            // e.target.value = existingValue;
            customCalendarSetVal("month", existingValue)
            return
        }

        if (parseInt(e.target.value) > 1) {
            FocusToEle("month", e, "year", "input")
        }
        if (parseInt(e.target.value) > 12 && e.target.value.length === 2) {
            // e.target.value = "12"
            customCalendarSetVal("month", "12")

            FocusToEle("month", e, "year", "input")
        }
        if (e.target.value.length > 2) {
            // e.target.value = e.target.value.substring(0, 2);
            customCalendarSetVal("month", e.target.value.substring(0, 2))
            FocusToEle("month", e, "year", "input")
        }
        if (e.target.value.length > 1) {
            FocusToEle("month", e, "year", "input")
        }
        if (e.target.value == 0 & e.target.value.length >= 2) {
            // e.target.value = "01";
            customCalendarSetVal("month", "01")
            FocusToEle("month", e, "year", "input")
        }
    }
    const YearInput = (e) => {
        let firstLetter = parseInt(e.target.value.substring(0, 1));
        let secondLetter = parseInt(e.target.value.substring(1, 2));
        let length = e.target.value.length;
        let enteredText = e.target.value.slice(-1);
        let NumberRegex = /^[0-9]$/;
        let existingValue = e.target.value.slice(0, length - 1)

        if (!enteredText.match(NumberRegex)) {
            e.target.value = existingValue;
            FocusToEle("year", e)

            return
        }
        if (e.target.value.substring(0, 1)) {
            if (!(firstLetter == 1 || firstLetter == 2)) {
                e.target.value = ""
            }
        }
        if (e.target.value.substring(1, 2)) {
            if (firstLetter === 1 && secondLetter !== 9) {
                e.target.value = e.target.value.substring(0, 1)
            }
            if (firstLetter === 2 && secondLetter !== 0) {
                e.target.value = e.target.value.substring(0, 1)
            }
        }
        if (e.target.value.length == 4) {
            let yearEntered = parseInt(e.target.value);
            let yearMinor = props.currentMax == "Today" ? new Date().getFullYear() : new Date().getFullYear() - 18;
            let year90 = new Date().getFullYear() - 90;
            if (year90 > yearEntered) {
                e.target.value = `${year90}`
            }
            if (yearMinor < yearEntered) {
                e.target.value = `${yearMinor}`
            }
        }
        if (e.target.value.length > 4) {
            e.target.value = e.target.value.substring(0, 4);
        }
    }

    const customCalendarSchema = Yup.object().shape({
        day: Yup.string().required().min(1).matches(/^[0-3]{1}[0-9]{1}$/),
        month: Yup.string().required().min(1).matches(/^[0-1]{1}[0-2]{1}$/),
        year: Yup.string().required().min(4).matches(/^[1-2]{1}[0-9]{3}$/),
    });

    const {
        register: customCalendarReg,
        handleSubmit: customCalendarHandle,
        formState: { errors: customCalendarErr },
        getValues: customCalendarGetVal,
        setValue: customCalendarSetVal,
        reset: customCalendarReset,
        formState: customCalendarState


    } = useForm({
        resolver: yupResolver(customCalendarSchema),
        mode: "onBlur",
    });


    console.log(customCalendarErr);

    const checkValidDate = () => {


        setTimeout(() => {
            console.log(customCalendarErr, "customCalendarErr")
            console.log(customCalendarState, "customCalendarState")

            console.log(customCalendarState.isValid, "isValid");
            // if (customCalendarState.isValid) {
            //     let { day, month, year } = customCalendarGetVal();
            //     let dateFormat = `${day}-${month}-${year}`
            //     props.succesDate(dateFormat, props?.index)
            // } else {
            //     let { day, month, year } = customCalendarGetVal();
            //     let dateFormat = `${day}-${month}-${year}`
            //     console.log("cleardate");
            //     props.clearDate(dateFormat, props?.index)
            // }

            let { day, month, year } = customCalendarGetVal();

            console.log(day, month, year);

            console.log(customCalendarGetVal());

            let dateFormat = `${day}-${month}-${year}`
            if (day.length === 2 && month.length === 2 && year.length === 4) {
                props.succesDate(dateFormat, props?.index)
            } else {
                props.clearDate(dateFormat, props?.index)
            }
        }, 500);



    }


    return (
        <div className={`dateCustom mt-2 form-control ${props.error ? "is-invalid" : ""}`}>
            <input
                type="text"
                placeholder='DD'
                className={`dateCustom-day ${customCalendarErr?.day ? "error-border-red" : ""}`}
                {...customCalendarReg("day", {
                    // onBlur: (e) => { FocusToEle(e, "month") },
                    // onInput: (e) => { DayInput(e); checkValidDate() }

                }

                )}
                onBlur={(e) => FocusToEle("day", e, "month", "blur")}
                onKeyUp={checkValidDate}
                maxLength={2}
                pattern="[0-9]*"
                inputMode="numeric"
                onInput={(e) => { DayInput(e); checkValidDate() }}

            />
            <input
                type="text"
                // placeholder='DD'
                disabled
                value={"-"}
                className='dateCustom-dash'

            />
            <input
                type="text"
                placeholder='MM'
                maxLength={2}
                onKeyUp={checkValidDate}
                pattern="[0-9]*"
                inputMode="numeric"
                className={`dateCustom-month ${customCalendarErr?.month ? "error-border-red" : ""}`}
                onInput={(e) => { MonthInput(e); checkValidDate() }}
                {...customCalendarReg("month", {
                    // onBlur: (e) => { FocusToEle(e, "year"); checkValidDate() },
                    // onInput: (e) => { MonthInput(e); checkValidDate() }
                }
                )}
                onBlur={(e) => FocusToEle("month", e, "year", "blur")}


            />
            <input
                type="text"
                // placeholder='DD'
                disabled
                value={"-"}
                className=' dateCustom-dash'
            />
            <input
                type="text"
                placeholder='YYYY'
                maxLength={4}
                pattern="[0-9]*"
                inputMode="numeric"
                onKeyUp={checkValidDate}
                {...customCalendarReg("year")}
                onInput={(e) => { YearInput(e); checkValidDate() }}
                onBlur={checkValidDate}
                className={`dateCustom-year ${customCalendarErr?.year ? "error-border-red" : ""}`}


            />
        </div>
    )
}

export default DateCustom