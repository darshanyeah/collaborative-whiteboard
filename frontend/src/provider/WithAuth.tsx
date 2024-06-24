"use client";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import React from "react";

/**
 * A higher-order component that wraps its children with authentication logic.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @return {JSX.Element} The wrapped child components.
 */
const WithAuth = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element => {
  const { token } = useAppSelector((state) => state.user);
  const router = useRouter();

  React.useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [router, token]);

  if (!token) return <>Redirecting...</>;

  return <>{children}</>;
};

export default WithAuth;
