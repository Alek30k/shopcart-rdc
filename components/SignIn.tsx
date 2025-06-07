import { SignInButton } from "@clerk/nextjs";

const SignIn = () => {
  return (
    <SignInButton>
      <button className="text-sm font-semibold hover:text-darkcolor text-lightcolor hover:cursor-pointer hoverEffect">
        Login
      </button>
    </SignInButton>
  );
};

export default SignIn;
