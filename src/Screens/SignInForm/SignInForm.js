import React from 'react'
import './SignInForm.css'
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
const SignInForm = () => {
    return (
        <div className='loginbody'>
            <div className='wrapper'>
                <div className='form-box login'>
                    <form action=''>
                        <h4>Login</h4>
                        <div className='input-box'>
                            <input type='text'
                                placeholder='Username' required />
                            <FaUser className='icon' />
                        </div>
                        <div className='input-box'>
                            <input type='password'
                                placeholder='Password' required />
                            <FaLock className='icon' />
                        </div>
                        <div className='remember-forgot'>
                            <label><input
                                type='checkbox'
                            />Remember me</label>
                            <a href='#'>Forgot Password?</a>
                        </div>
                        <button type='submit'>SignIn</button>
                        <div className='register-link'>
                            <p>Dont have an account?<a href='#'>Register</a></p>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default SignInForm
