import React, { useContext } from 'react'
import AuthContext from '../../store/auth-context'
import classes from './MainNavigation.module.css'
import { Link } from 'react-router-dom';


const MainNavigation = () => {
    const authCtx = useContext(AuthContext);

    const isLoggedIn = authCtx.isLoggedIn;

    const logOutHandler = () => {
        authCtx.logout();
    }

    return (
        <header className={classes.header}>
            <Link to='/'>
                <div className={classes.logo}>
                    React Auth
                </div>
            </Link>
            <nav>
                <ul>
                    {!isLoggedIn && <li>
                        <Link to='/auth'>
                            Login
                        </Link>
                    </li>}
                    {isLoggedIn && <li>
                        <Link to='/profile'>
                            Profile
                        </Link>
                    </li>}
                    {isLoggedIn && <li>
                        <button onClick={logOutHandler}>
                            Logout
                        </button>
                    </li>}
                </ul>
            </nav>
        </header>
    )
}

export default MainNavigation