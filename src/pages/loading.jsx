import { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignUp, useUser } from "@clerk/clerk-react";
import SpinningLogo3D from "../components/SpinningLogo3D";

const Loading = () => {
  const [loadingSteps, setLoadingSteps] = useState([]);
  const [showCommandPrompt, setShowCommandPrompt] = useState(false);
  const [commandLines, setCommandLines] = useState([]);
  const [showFinalCommand, setShowFinalCommand] = useState(false);
  const [typedCommand, setTypedCommand] = useState("");
  const [showMainContent, setShowMainContent] = useState(false);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [loadingDots, setLoadingDots] = useState("");
  const [showLoginTransition, setShowLoginTransition] = useState(false);
  const [logoTransitioned, setLogoTransitioned] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetPasswordToken, setResetPasswordToken] = useState(null);
  
  const navigate = useNavigate();
  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (showMainContent) {
        const audio = new Audio('/music/Introlydtilwebsite.mp3');
        audio.volume = 0.5;

        const playSoundOnInteraction = () => {
            audio.play().catch(e => console.error("Audio play failed until user interaction", e));
            // Remove listeners after first interaction
            document.removeEventListener('click', playSoundOnInteraction);
            document.removeEventListener('keydown', playSoundOnInteraction);
        };

        document.addEventListener('click', playSoundOnInteraction);
        document.addEventListener('keydown', playSoundOnInteraction);

        return () => {
            document.removeEventListener('click', playSoundOnInteraction);
            document.removeEventListener('keydown', playSoundOnInteraction);
        };
    }
  }, [showMainContent]);

  const initialBootMessages = [
    "[7100_S3$$10N.01] :: L@D3R... V1_K0MM3R_S3N3R3",
    "V1_3R_S!D$T_!ND ↔️ G3NN3M_1NDG@NG",
    "F4!LL0UT:: LINGARD M0D3_4KT1V INDSPARK = DR3NGER4M7 TOP ⇄ TÅ — S7ADIG_1NT@KT",
    "M1N_H0$7ORY: H0ND4_C1V1C x 365 NATT3R_OG_DAG3 — J4G7_SKiLL1N9 GLÆND3R3T = CHECKP0!NT C1RK3LN_L4ND3R_4LD!G:: 100_PÅ_ALL3EN",
    "[C0M-D-G@RC0NS.1NPU7] L1D7_C4L1 — L0VL1G_BL4ND!N9 P4N$3RN:: F4NG3R_N0G3T T4LJ3N_RØRT F@RV3K0DE = B0L1V14",
    "KUGL3R:: SP1L SOM_B1LL14RD N@B0:: LUKK3R_G4RD1N3R [PL0T_S3Q] — V1_K0MM3R_M3D_B0UNCE K£UB_M0D3: +1 P1CKERZ",
    "[UL7IMAT3:: GÆSTB0G] UR3T_T1KK3R — DROP_DRESSC0D3 HGBB_1NPU7: AirMax_1 NAVN = L0GG3T_1N",
    "BROR_V1L_RYGE:: M3N70L_G4RR0 HALLO:: S7OPP3D_V3D_N3T70 P0SITION: BAGUD"
  ];

  const randomCommands = [
    "V1_3R_S!D$T_!ND ↔️ G3NN3M_1NDG@NG",
    "F4!LL0UT:: LINGARD M0D3_4KT1V INDSPARK = DR3NGER4M7 TOP ⇄ TÅ — S7ADIG_1NT@KT",
    "M1N_H0$7ORY: H0ND4_C1V1C x 365 NATT3R_OG_DAG3 — J4G7_SKiLL1N9 GLÆND3R3T = CHECKP0!NT C1RK3LN_L4ND3R_4LD!G:: 100_PÅ_ALL3EN",
    "[7100_S3$$10N.01] :: L@D3R... V1_K0MM3R_S3N3R3",
  ];

  // We'll keep the ASCII art as a fallback in case the 3D component fails to load
  const asciiArt = `
                                              .=*#*=.                                               
                                           :*@@@*+*@@@*:                               <             
                                        .+@@%=.     .-%@@+.                                         
                                      :@@@=.           .=%@%-.                                      
                                   .=@@@@.      .#@@@.    .%@@=.                                    
                                  +@@@@@@       :@@@@@.     *@@@#.                                  
                               .+@@@@@@@@*     .@@@@@@+     #@@%@@*.                                
                             .=@@+..+@@@@@:    =@=@@@@@.   :@@@..=@@+.                              
                            :%@*.   .%@@@@#   .%#.=@@@@@.  #@@-   .*@@-                             
                          .*@%:      .@@@@@=  +@. .%@@@@= =@@*.     :%@#.                           
                         -@@=.        +@@@@%.:@=   .@@@@@:%@@:        =@@-.                         
                       .*@%....  ..=:..@@@@@+*@.    =@@@@@@@=      .:-#@@@*.                        
                      .@@*..+@@@@@@@@@..@@@@@@.     .@@@@@@#....=%@@@@@@*+@%:                       
                     .@@-     .#@@@@@. .*@@@@*      .@@@@@@*. %@@@@@@@@:  -@@-.                     
                    =@@.     .*@@@@@=.  .@@@@:     .%@@@@@@@:     .#@@*    :@@=                     
                  .+@@.      =@@@@@*.    :-..  .-#@@@@@@@@@@@@-   .%@@.     .%@+                    
                  =@%.      .@@@@@%.       :*%@@@@@@@@@@@@@@@@@@+.-@@+.      .%@+.                  
                .=@@.      .%@@@@@:   .=#@@@@@@@@@@@@@#**%@@@@@@@@@@@:        .#@=                  
                -@@.       +@@@@@=-+%@@@@@@@@@@@@%+:       :%@@@@@@@%.         .@@=.                
               :@@-      .-@@@@@@@@@@@@@@@@@@@@.             .#@@@@@@:          .@@:                
              .#@=       :@@@@@@@@@@@@@@%*. .@%                =@@@@@@.          =@%.               
              -@%.      .#@@@@@@@@@@@:.     .@%                 #@@@@@*           #@+.              
             .@@=      .*@@@@@%..:%@@@@@%:. .@%     ...         .%@@@@@.          :@%.              
             .@@@-     :@@@@@#      .:=@@@@@%@%.    -@+         .=@@@@@@.       .-@@%.              
              .:*@@%**#@@@@@@:           .-+@@@@@#*-#@+           *@@@@@*.   .+%@@#:                
                  .=%@@@@@@@%                 .=#@@@@@+           :@@@@@@@@@@@@+.                   
                      .=*@@@@@+=..                .=%@+          .*@@@@@@@*=.                       
                           .:*#@@@@@@%*===-:..      -@+:-===*%@@@@@@#*:.                            
                                  ..-*##%@@@@@@@@@@@@@@@@@%##*-..                                   
  `;

  const finalCommand = "launch 1waykundo.com";

  useEffect(() => {
    // First wave - Fast boot messages
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < initialBootMessages.length) {
        setLoadingSteps((prev) => [...prev, initialBootMessages[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setLoadingSteps([]);
          setShowCommandPrompt(true);
        }, 500);
      }
    }, 80); // Increased interval from 40ms to 80ms

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Command prompt blinking effect
    const cursorInterval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    // Second wave - Random commands and stagebooked.com
    if (showCommandPrompt) {
      let currentIndex = 0;
      const commandInterval = setInterval(() => {
        if (currentIndex < randomCommands.length - 1) {
          setCommandLines((prev) => [...prev, randomCommands[currentIndex]]);
          currentIndex++;
        } else if (currentIndex === randomCommands.length - 1) {
          setCommandLines((prev) => [...prev, randomCommands[currentIndex]]);
          clearInterval(commandInterval);

          // Wait at stagebooked.com line
          setTimeout(() => {
            // Clear screen before final command
            setCommandLines([]);
            // Small delay before showing final command
            setTimeout(() => {
              // Third wave - Launch command with typing effect
              setShowFinalCommand(true);
              let typedIndex = 0;
              const typingInterval = setInterval(() => {
                if (typedIndex <= finalCommand.length) {
                  setTypedCommand(finalCommand.slice(0, typedIndex));
                  typedIndex++;
                } else {
                  clearInterval(typingInterval);
                  // Wait at launch command
                  setTimeout(() => {
                    // Clear and show login
                    setShowCommandPrompt(false);
                    setTimeout(() => {
                      setShowMainContent(true);
                    }, 1000);
                  }, 1000);
                }
              }, 60); // Speed of typing effect
            }, 1800); // Increased from 800 to 1800ms
          }, 1000);
        }
      }, 300); // Slowed down from 150 to 300ms

      return () => clearInterval(commandInterval);
    }
  }, [showCommandPrompt]);

  // Check if user is already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/home');
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isSignUp) {
        // Handle Sign Up - First create the account with phone and password
        const signUpAttempt = await signUp.create({
          phoneNumber,
          password
        });

        // Prepare phone verification
        await signUpAttempt.preparePhoneNumberVerification();
        setPendingVerification(signUpAttempt);
        setShowVerification(true);
      } else if (isForgotPassword) {
        // Handle forgot password - Aligning with Clerk Next.js example
        try {
          const result = await signIn.create({
            identifier: phoneNumber,
            strategy: "reset_password_phone_code", // Updated strategy
          });
          
          // If create is successful, code should be sent. No prepareFirstFactor needed here for this strategy.
          console.log('Forgot Password Sign In Create Result (reset_password_phone_code strategy):', result);
          
          setPendingVerification(result); // Store the sign-in attempt
          setShowVerification(true);     // Show verification code input
          // No need to setResetPasswordToken here yet

        } catch (err) {
          console.error("Forgot Password Create Error:", err);
          const isE164Error = err.errors?.some(e => e.code === 'form_param_format_invalid' && e.meta?.paramName === 'identifier');
          if (isE164Error) {
            setError("Phone number format is invalid. Please check the number.");
          } else {
            setError(err.errors?.[0]?.message || "Could not start password reset. Please try again.");
          }
        }
      } else {
        // Handle Sign In - First attempt password-based sign in
        try {
          // First try to sign out any existing session
          await signIn.signOut();
        } catch (error) {
          // Ignore any errors from signOut
        }

        // Now attempt to sign in
        const signInAttempt = await signIn.create({
          identifier: phoneNumber,
          password,
        });

        if (signInAttempt.status === "complete") {
          await setSignInActive({ session: signInAttempt.createdSessionId });
          navigate("/home", { replace: true });
        } else {
          // If 2FA is required, prepare phone verification
          await signInAttempt.prepareFirstFactor({
            strategy: "phone_code",
            phoneNumber
          });
          setPendingVerification(signInAttempt);
          setShowVerification(true);
        }
      }
    } catch (err) {
      console.error("Error:", err);
      // Check for specific E.164 format error
      const isE164Error = err.errors?.some(e => e.code === 'form_param_format_invalid' && e.meta?.paramName === 'identifier');
      if (isE164Error) {
        setError("Phone number format is invalid. Please check the number.");
      } else {
        // Use the existing generic error logic for other cases
        setError(err.errors?.[0]?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!pendingVerification) {
        throw new Error("No verification pending");
      }

      if (isSignUp) {
        // Complete sign-up verification
        const result = await pendingVerification.attemptPhoneNumberVerification({
          code: verificationCode
        });

        if (result.status === "complete") {
          await setSignUpActive({ session: result.createdSessionId });
          navigate("/home", { replace: true });
        } else {
          throw new Error("Verification failed");
        }
      } else if (isForgotPassword) {
        // Handle password reset verification - Aligning with Clerk Next.js example
        
        // --- Client-side Password Validation ---
        if (password.length < 8) {
          setError("Password must be at least 8 characters long.");
          setIsLoading(false); // Ensure loading state is reset
          return; // Stop before calling Clerk
        }
        // --- End Validation ---

        try {
          const result = await pendingVerification.attemptFirstFactor({
            strategy: "reset_password_phone_code", // Updated strategy
            code: verificationCode,
            password: password                  // Pass the new password
          });

          // if (result.status === "needs_new_password") { // Old check
          if (result.status === "complete") { // Password reset is complete, user is signed in
            // Set the active session to the newly created session
            await setSignInActive({ session: result.createdSessionId });
            navigate("/home", { replace: true }); // Redirect to home
            // No need for setShowVerification, setPassword, setResetPasswordToken here as we are navigating away
          } else if (result.status === 'needs_second_factor') {
            // Handle 2FA if needed (though the example UI doesn't fully support it)
            setError("Two-factor authentication is required."); 
            // Potentially set another state here to show 2FA UI if you build it
          } else {
            console.error("Reset Verification Error Status:", result.status);
            throw new Error("Password reset failed. Please check the code and password."); // Updated error
          }
        } catch (err) {
          console.error("Error:", err);
          // Use Clerk error message if available, otherwise fallback
          setError(err.errors?.[0]?.message || err.message || "Invalid verification code or password issue.");
        }
      } else {
        // Complete sign-in verification
        const result = await pendingVerification.attemptFirstFactor({
          strategy: "phone_code",
          code: verificationCode
        });

        if (result.status === "complete") {
          await setSignInActive({ session: result.createdSessionId });
          navigate("/home", { replace: true });
        } else {
          throw new Error("Verification failed");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!resetPasswordToken) {
        throw new Error("No reset token available");
      }

      await resetPasswordToken.update({
        password: password
      });

      // Sign in with the new password
      const signInAttempt = await signIn.create({
        identifier: phoneNumber,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setSignInActive({ session: signInAttempt.createdSessionId });
        navigate("/home", { replace: true });
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Could not reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
    setError("");
    setShowVerification(false);
    setPhoneNumber("");
    setPassword("");
    setVerificationCode("");
    setPendingVerification(null);
    setResetPasswordToken(null);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsSignUp(false);
    setError("");
    setShowVerification(false);
    setPassword("");
    setVerificationCode("");
    setPendingVerification(null);
    setResetPasswordToken(null);
  };

  useEffect(() => {
    if (showMainContent) {
      const dotsInterval = setInterval(() => {
        setLoadingDots((prev) => {
          if (prev === "") return ".";
          if (prev === ".") return "..";
          if (prev === "..") return "...";
          return "";
        });
      }, 500);

      // Start transition to login after 4 seconds
      const transitionTimeout = setTimeout(() => {
        setShowLoginTransition(true);
        // Give time for the logo to move up
        setTimeout(() => {
          setLogoTransitioned(true);
        }, 1000);
      }, 4000);

      return () => {
        clearInterval(dotsInterval);
        clearTimeout(transitionTimeout);
      };
    }
  }, [showMainContent]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden font-['Courier_Prime'] select-none">
      {/* Initial Boot Messages */}
      <div className="absolute top-0 overflow-hidden left-0 p-2 sm:p-4 w-full">
        {loadingSteps.map((step, index) => (
          <div
            key={index}
            className="text-[#00ff00] font-medium text-sm sm:text-base leading-relaxed whitespace-pre break-words"
          >
            {step}
          </div>
        ))}
      </div>

      {/* Command Prompt */}
      {showCommandPrompt && (
        <div className="absolute top-0 overflow-hidden left-0 p-2 sm:p-4 w-full text-[#00ff00] text-sm sm:text-base">
          {commandLines.map((cmd, index) => (
            <div key={index} className="flex items-center mb-2 break-words">
              <span className="text-sm sm:text-lg flex-shrink-0">C:\System&gt;</span>
              <span className="ml-2 text-sm sm:text-lg break-words">{cmd}</span>
            </div>
          ))}
          <div className="flex overflow-hidden items-center">
            <span className="text-sm sm:text-lg flex-shrink-0">C:\System&gt;</span>
            {showFinalCommand ? (
              <div className="flex overflow-hidden items-center">
                <span className="ml-2 text-sm sm:text-lg overflow-hidden font-bold break-words">
                  {typedCommand}
                </span>
                <span
                  className={`ml-0 text-sm sm:text-lg overflow-hidden ${
                    cursorBlink ? "opacity-100" : "opacity-0"
                  }`}
                >
                  █
                </span>
              </div>
            ) : (
              <span
                className={`ml-2 text-sm sm:text-lg max-w-[100vw] overflow-hidden ${
                  cursorBlink ? "opacity-100" : "opacity-0"
                }`}
              >
                █
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Content with Logo and Login Transition */}
      {showMainContent && (
        <div className="fixed inset-0 flex flex-col items-center justify-center">
          {/* Logo Container */}
          <div
            className={`w-full h-1/3 transition-all duration-1000 ease-in-out ${
              showLoginTransition ? "transform -translate-y-12" : ""
            }`}
          >
            <Suspense fallback={<div className="w-full h-full bg-black" > test</div>}>
              <SpinningLogo3D />
            </Suspense>
            
            {!showLoginTransition && (
              <div className="text-[#00ff00] text-lg sm:text-xl text-center mt-4 sm:mt-8 transition-opacity duration-500 px-4">
                loading{loadingDots}
              </div>
            )}
          </div>

          {/* Authentication Form */}
          {showLoginTransition && (
            <div
              className={`w-full flex justify-center items-start transition-all duration-1000 ${
                logoTransitioned 
                  ? "opacity-100 transform translate-y-0" 
                  : "opacity-0 transform translate-y-8"
              }`}
            >
              <form
                onSubmit={
                  resetPasswordToken && !showVerification
                    ? handleResetPassword
                    : showVerification 
                      ? handleVerificationSubmit 
                      : handlePhoneSubmit
                }
                className="w-full max-w-md p-4 sm:p-8 mx-4 sm:mx-0 rounded-lg bg-black/50 backdrop-blur-sm border border-[#00ff00]/30"
              >
                <div className="space-y-4 sm:space-y-6">
                  {error && (
                    <div className="text-red-500 text-sm mb-4">
                      {error}
                    </div>
                  )}
                  
                  <div className="text-[#00ff00] text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6">
                    {isForgotPassword 
                      ? "Reset Password"
                      : isSignUp 
                        ? "Create Account" 
                        : "Login"}
                  </div>

                  {!showVerification ? (
                    <>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-[#00ff00] text-sm font-medium mb-2"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={phoneNumber}
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            const previousValue = phoneNumber; // Get previous state
                            
                            // Allow only digits and a leading plus
                            let cleanedValue = rawValue.replace(/[^\d+]/g, '');
                            if (cleanedValue.startsWith('+') && cleanedValue.length > 1) {
                              cleanedValue = '+' + cleanedValue.substring(1).replace(/\+/g, '');
                            } else if (!cleanedValue.startsWith('+')) {
                              cleanedValue = cleanedValue.replace(/\+/g, '');
                            }
                            
                            let formattedValue = cleanedValue;
                            
                            // Specific check for backspace from +45
                            if (previousValue === '+45' && rawValue === '+4') {
                              formattedValue = '+'; 
                            } else if (cleanedValue.startsWith('+45')) {
                              formattedValue = cleanedValue;
                            } else if (cleanedValue.startsWith('+') && cleanedValue !== '+') {
                              formattedValue = '+45' + cleanedValue.substring(1);
                            } else if (cleanedValue && !cleanedValue.startsWith('+')) {
                              formattedValue = '+45' + cleanedValue;
                            } else if (rawValue === '' || cleanedValue === '+') {
                              formattedValue = rawValue === '' ? '' : '+';
                            } else if (!cleanedValue) {
                              formattedValue = '';
                            }
                            
                            setPhoneNumber(formattedValue);
                            setError("");
                          }}
                          className="w-full px-4 py-2 bg-black/70 border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/50 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none rounded"
                          placeholder="+45 ..."
                          autoFocus
                          disabled={isLoading || (resetPasswordToken && !showVerification)}
                        />
                      </div>
                      {(!isForgotPassword || (resetPasswordToken && !showVerification)) && (
                        <div>
                          <label
                            htmlFor="password"
                            className="block text-[#00ff00] text-sm font-medium mb-2"
                          >
                            {resetPasswordToken ? "New Password" : "Password"}
                          </label>
                          <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setError("");
                            }}
                            className="w-full px-4 py-2 bg-black/70 border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/50 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none rounded"
                            placeholder={
                              resetPasswordToken 
                                ? "Enter new password"
                                : isSignUp 
                                  ? "Create password" 
                                  : "Enter password"
                            }
                            disabled={isLoading}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <label
                        htmlFor="code"
                        className="block text-[#00ff00] text-sm font-medium mb-2"
                      >
                        Verification Code
                      </label>
                      <input
                        type="text"
                        id="code"
                        value={verificationCode}
                        onChange={(e) => {
                          setVerificationCode(e.target.value);
                          setError("");
                        }}
                        className="w-full px-4 py-2 bg-black/70 border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/50 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none rounded"
                        placeholder="Enter verification code"
                        autoFocus
                        disabled={isLoading}
                      />
                      {isForgotPassword && (
                        <div className="mt-4">
                          <label
                            htmlFor="password"
                            className="block text-[#00ff00] text-sm font-medium mb-2"
                          >
                            New Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setError("");
                            }}
                            className="w-full px-4 py-2 bg-black/70 border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/50 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none rounded"
                            placeholder="Enter new password"
                            disabled={isLoading}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 bg-[#00ff00]/20 hover:bg-[#00ff00]/30 border border-[#00ff00]/30 text-[#00ff00] rounded transition-colors duration-200 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading 
                      ? 'Processing...' 
                      : showVerification 
                        ? 'Verify Code'
                        : resetPasswordToken
                          ? 'Reset Password'
                          : isForgotPassword
                            ? 'Send Code'
                            : isSignUp 
                              ? 'Sign Up' 
                              : 'Login'}
                  </button>

                  {!showVerification && !resetPasswordToken && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="w-full py-2 px-4 bg-transparent text-[#00ff00]/70 hover:text-[#00ff00] transition-colors duration-200"
                      >
                        {isSignUp 
                          ? "Already have an account? Login" 
                          : "Don't have an account? Sign Up"}
                      </button>

                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={toggleForgotPassword}
                          className="w-full py-2 px-4 bg-transparent text-[#00ff00]/70 hover:text-[#00ff00] transition-colors duration-200"
                        >
                          {isForgotPassword
                            ? "Back to Login"
                            : "Forgot Password?"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Loading;
