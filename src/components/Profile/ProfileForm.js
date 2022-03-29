import classes from './ProfileForm.module.css';
import useInput from '../../hooks/use-input';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

const validatePassword = (pw) => pw.trim().length > 6;
const ProfileForm = () => {
    const history = useHistory();
    const authCtx = useContext(AuthContext);
    const {
        value: newPasswordValue,
        hasError: newPasswordHasError,
        isValid: newPasswordIsValid,
        inputBlurHandler: newPasswordBlurHandler,
        valueChangeHandler: newPasswordChangeHandler,
        reset: newPasswordResetValue
    } = useInput(validatePassword);

    let formIsValid = false;

    if (newPasswordIsValid) {
        formIsValid = true;
    }

    const submitFormHandler = (e) => {
        e.preventDefault();

        if (!formIsValid) {
            return;
        }

        const sendChangePasswordRequest = async () => {
            const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_API_KEY}`, {
                method: 'POST',
                body: JSON.stringify({
                    idToken: authCtx.token,
                    password: newPasswordValue,
                    returnSecureToken: false
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.log(response);
                throw new Error('An error occured while sending the request');
            }
            // const data = await response.JSON();
            // console.log(data);
            newPasswordResetValue();
            history.replace('/');
        }

        sendChangePasswordRequest()
            .catch(error => console.log(error));

    }

    const newPasswordClasses = newPasswordHasError ? classes['invalidInput'] : '';
    return (
        <form className={classes.form} onSubmit={submitFormHandler}>
            <div className={classes.control}>
                <label htmlFor='new-password'>New Password</label>
                <input
                    className={newPasswordClasses}
                    type='password'
                    id='new-password'
                    value={newPasswordValue}
                    onChange={newPasswordChangeHandler}
                    onBlur={newPasswordBlurHandler}
                    minLength='7'
                />
            </div>
            <div className={classes.action}>
                <button disabled={!newPasswordIsValid}>Change Password</button>
            </div>
        </form>
    );
}

export default ProfileForm;