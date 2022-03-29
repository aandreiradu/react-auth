import { useState } from "react";

const useInput = (validateFunction) => {
    const [enteredValue, setEnteredValue] = useState('');
    const [isTouched, setIsTouched] = useState(false);


    const valueIsValid = validateFunction(enteredValue);
    const hasError = !valueIsValid && isTouched;

    const valueChangeHandler = e => {
        setEnteredValue(e.target.value);
    }

    const inputBlurHandler = () => {
        setIsTouched(true);

        // setTimeout(() => {
        //     setIsTouched(false);
        // }, 1500)
    }

    const reset = () => {
        setIsTouched(false);
        setEnteredValue('');
    }

    return {
        value: enteredValue,
        isValid: valueIsValid,
        hasError,
        valueChangeHandler,
        inputBlurHandler,
        reset
    }

}


export default useInput;