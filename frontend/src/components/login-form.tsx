"use client";
import { useAppDispatch } from "@/lib/hooks";
import { LOGIN } from "@/lib/reducers/userSlice";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

/**
 * Renders a login form component.
 *
 * @return {JSX.Element} The login form component.
 */
const LoginForm = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Handles the login functionality by sending a POST request to the login API endpoint.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form event triggering the login process.
   * @return {Promise<void>} A promise that resolves once the login process is complete.
   */
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
        {
          username,
          password,
        }
      );
      dispatch(LOGIN(data));
      router.replace("/whiteboard");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
      <form
        className="flex flex-col space-y-3 w-full max-w-md border-dashed border rounded-xl border-spacing-2 border-gray-300 p-4"
        onSubmit={handleLogin}
      >
        <div className="space-y-1">
          <p className="text-xl text-gray-400">
            Want to access your own whiteboard?
          </p>
        </div>
        <div className="space-y-1">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-700"
          >
            User name
          </label>
          <input
            type="text"
            id="username"
            className="shadow-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 rounded-md w-full sm:text-sm px-3 py-2 border border-gray-300"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-1 pb-4">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 rounded-md w-full sm:text-sm px-3 py-2 border border-gray-300"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </form>
      <p className="text-sm text-center text-gray-500 mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/register">
          <span className="text-indigo-600 hover:text-indigo-700">
            Register Here
          </span>
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
