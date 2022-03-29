import React, { useState, useContext } from 'react'
import useInput from '../../hooks/use-input';
import classes from './AuthForm.module.css'
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

const validateEmail = (email) => email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const validatePassword = (password) => password.trim() && password.trim().length > 3;


const AuthForm = () => {
    const authCtx = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setIsLoading] = useState(false);
    const history = useHistory();
    const {
        value: enteredEmail,
        isValid: enterdEmailIsValid,
        hasError: emailInputHasError,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        reset: resetEmailInput
    } = useInput(value => validateEmail(value));

    const {
        value: enteredPassword,
        hasError: passwordInputHasError,
        isValid: passwordInputIsValid,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: resetPasswordInput
    } = useInput(value => validatePassword(value));


    const switchAuthHandler = () => {
        setIsLogin((prevState) => !prevState);
    }

    let formIsValid = false;

    if (enterdEmailIsValid && passwordInputIsValid) {
        formIsValid = true;
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if (!formIsValid) {
            return;
        }

        console.log(enteredEmail, enteredPassword)

        setIsLoading(true);
        if (isLogin) {
            const sendLoginRequest = async () => {
                const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        email: enteredEmail,
                        password: enteredPassword,
                        returnSecureToken: true
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    setIsLoading(false);
                    throw new Error('Authentification failed!');
                }

                const responseFirebase = await response.json();
                console.log(responseFirebase);
                const { idToken, expiresIn } = responseFirebase;
                if (idToken) {
                    const expTime = new Date(new Date().getTime() + (+expiresIn * 1000));
                    authCtx.login(idToken, expTime.toISOString());
                    setIsLoading(false);
                    history.replace('/');
                    return responseFirebase;
                } else {
                    throw new Error('No token returned');
                }


            }

            sendLoginRequest();


        } else {
            const sendRegisterRequest = async () => {
                const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        email: enteredEmail,
                        password: enteredPassword,
                        returnSecureToken: true
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    setIsLoading(false);
                    console.log(response);
                } else {
                    const errorObj = await response.json();
                    console.log(errorObj);
                    let errorMessage = 'Authentication failed!';
                    if (errorObj && errorObj.error && errorObj.error.message) {
                        errorMessage = errorObj.error.message
                    }
                    alert(errorMessage);
                    setIsLoading(false);
                }
            }

            const responseFirebase = sendRegisterRequest();
            console.log(responseFirebase);
        }

        resetEmailInput();
        resetPasswordInput();
    }

    const emailInputClasses = emailInputHasError ? classes['invalidInput'] : '';
    const passwordInputClasses = passwordInputHasError ? classes['invalidInput'] : '';

    return (
        <section className={classes.auth}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor='email'>Your Email</label>
                    <input
                        className={emailInputClasses}
                        type='email'
                        id='email'
                        onChange={emailChangeHandler}
                        onBlur={emailBlurHandler}
                        value={enteredEmail}
                    />
                </div>
                <div className={classes.control}>
                    <label htmlFor='password'>Your Password</label>
                    <input
                        className={passwordInputClasses}
                        type='password'
                        id='password'
                        onChange={passwordChangeHandler}
                        onBlur={passwordBlurHandler}
                        value={enteredPassword}
                    />
                </div>
                <div className={classes.actions}>
                    {!loading && <button>
                        {isLogin ? 'Login' : 'Create Account'}
                    </button>}
                    {loading && <p>Sending request...</p>}
                    <button
                        type='button'
                        className={classes.toggle}
                        onClick={switchAuthHandler}
                    >
                        {isLogin ? 'Create new account' : 'Login with existing account'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default AuthForm