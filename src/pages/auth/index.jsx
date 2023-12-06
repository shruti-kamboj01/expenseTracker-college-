import React from "react";
import { auth, provider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    const authInfo = {
      userID: result.user.uid,
      name: result.user.displayName,
      profilePhoto: result.user.photoURL,
      isAuth: true,
    };
    localStorage.setItem("auth", JSON.stringify(authInfo));
    navigate("/expense-tracker");
  };

  return (
    <div className=" flex flex-col items-center mx-auto mt-[150px]">
      <p className="text-5xl font-bold font-inter text-richblue-900 mb-16">
        WELCOME TO EXPENSE TRACKER
      </p>
      <p className="text-3xl font-bold font-inter text-richblue-900 mt-16 pt-16">
        Sign In With Google to Continue
      </p>
      <button
        onClick={signInWithGoogle}
        className="bg-richblue-800 mt-3 text-richblue-25 font-semibold py-2 px-6 text-2xl rounded-2xl hover:bg-richblue-50 hover:border-2 hover:font-bold hover:text-richblack-900 transition-all duration-200"
      >
        Sign In
      </button>
    </div>
  );
};

export default Auth;
