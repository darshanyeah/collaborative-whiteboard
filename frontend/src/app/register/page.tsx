import RegisterForm from "@/components/register-form";
import Image from "next/image";
import React from "react";

/**
 * Renders the registration page of the application.
 *
 * @return {JSX.Element} The registration page component.
 */
const page = (): JSX.Element => {
  return (
    <div className="container-2xl mx-auto px-4 py-16 grid grid-cols-7 items-center space-y-8 gap-4 h-screen">
      <div className="col-span-4 flex flex-col items-center">
        <RegisterForm />
      </div>

      <div className="col-span-3 flex flex-col items-start">
        <Image src="/png/login.png" alt="login" width={500} height={500} />
      </div>
    </div>
  );
};

export default page;
