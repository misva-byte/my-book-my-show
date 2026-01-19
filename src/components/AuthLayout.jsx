import Logo from "./logo";

function AuthLayout ({ children }) {
    return (
        <div className="login-container">
            {/* LEFT PANEL (STATIC) */}
            <div className="left-panel">
                <Logo />
                <div className="welcome-text">
                    <h1>Welcome.</h1>
                    <p>
                        Begin your cinematic adventure now with our ticket platform!

                    </p>
                </div>
            </div>

            {/* RIGHT PANEL (DYNAMIC) */}   
            <div className="right-panel">
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;