import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import * as Components from './Components';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';
import "./SignIn.css"
const SignIn = () => {
    const [signIn, toggle] = React.useState(true);
    const [signInSuccess, setSignInSuccess] = React.useState(false);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSignUp = (event) => {
        event.preventDefault(); // Prevents the default form submission behavior
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email-signup').value;
        const password = document.querySelector('#password-signup').value;
        const confirmpass = document.querySelector('#confirmpass-signup').value;
        const mobileno = document.querySelector('#mobileno-signup').value;

        // Validate input fields
        if (!name || !email || !password) {
            toast.error('Please fill out all fields.', {
                position: "top-center"
            });
            return;
        }
        const signUpData = {
            name: name,
            email: email,
            password: password,
            confirmpass: confirmpass,
            mobileno: mobileno,
            companies: []
        };

        localStorage.setItem('signUpData', JSON.stringify(signUpData));
        toast.success("SignUp Completed")
        console.log('Sign Up:', signUpData);
    };

    const handleSignIn = (event) => {
        event.preventDefault(); // Prevents the default form submission behavior
        const email = document.querySelector('#email-signin').value;
        const password = document.querySelector('#password-signin').value;

        const signUpData = JSON.parse(localStorage.getItem('signUpData'));

        if (signUpData && signUpData.email === email && signUpData.password === password) {
            setSignInSuccess(true);
            navigate('/Setup'); // Navigate to the dashboard route
            console.log('Sign In successful');
        } else {
            setSignInSuccess(false);
            toast.error("You don't have an account.", {
                position: "top-center"
            });
            console.log('Sign In failed');
        }
    };

    return (
        <div>
            <header className="half-circle-header">
                <h1>SHKUNSOFT INNOVATIONS</h1>
            </header>
            <ToastContainer position="top-center" />
            <Components.Container>
                <Components.SignUpContainer className='containersign' signinIn={signIn}>
                    <Components.Form onSubmit={handleSignUp}>
                        <Components.Title>Create Account</Components.Title>
                        <Components.Input id="name" type='text' placeholder='Name' />
                        <Components.Input id="email-signup" type='email' placeholder='Email' />
                        <Components.Input id="password-signup" type='password' placeholder='Password' />
                        <Components.Input id="confirmpass-signup" type='password' placeholder='Confirm Password' />
                        <Components.Input id="mobileno-signup" type='number' placeholder='Register Mobile No' />
                        <Components.Button type="submit">Sign Up</Components.Button>
                    </Components.Form>
                </Components.SignUpContainer>

                <Components.SignInContainer signinIn={signIn}>
                    <Components.Form onSubmit={handleSignIn}>
                        <Components.Title>Sign in</Components.Title>
                        <Components.Input id="email-signin" type='email' placeholder='Email' />
                        <Components.Input id="password-signin" type='password' placeholder='Password' />
                        <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                        <Components.Button type="submit">Sign In</Components.Button>
                    </Components.Form>
                </Components.SignInContainer>

                <Components.OverlayContainer signinIn={signIn}>
                    <Components.Overlay signinIn={signIn}>

                        <Components.LeftOverlayPanel signinIn={signIn}>
                            <Components.Title style={{ marginLeft: 50 }}>Welcome Back!</Components.Title>
                            <Components.Paragraph style={{ marginLeft: 50 }}>
                                To keep connected with us please login with your personal info
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => toggle(true)} style={{ marginLeft: 46 }}>
                                Sign In
                            </Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        <Components.RightOverlayPanel signinIn={signIn}>
                            <Components.Title style={{ marginRight: 30 }}>Hello, Friend!</Components.Title>
                            <Components.Paragraph style={{ marginRight: 30 }}>
                                Enter Your personal details and start the journey with us
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => toggle(false)} style={{ marginRight: 35 }}>
                                Sign Up
                            </Components.GhostButton>
                        </Components.RightOverlayPanel>

                    </Components.Overlay>
                </Components.OverlayContainer>

            </Components.Container>
        </div>
    );
};

export default SignIn;
