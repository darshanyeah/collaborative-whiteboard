import WithAuth from "@/provider/WithAuth";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Whiteboard",
  description: "Real-Time Collaborative Whiteboard",
};

/**
 * Renders the layout with the provided children.
 *
 * @param {Readonly<{ children: React.ReactNode; }>} children - The children elements to be rendered.
 * @return {JSX.Element} The layout component with the children.
 */
const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element => {
  return (
    <WithAuth>
      <div className="container-2xl mx-auto px-16 py-16 grid grid-cols-7 space-y-8 gap-4 h-screen">
        {children}
      </div>
    </WithAuth>
  );
};

export default layout;
