import dynamic from "next/dynamic";
import React from "react";

const Whiteboard = dynamic(() => import("@/components/Whiteboard"), {
  ssr: false,
});

/**
 * Renders the Whiteboard component with the provided ID.
 *
 * @param {any} params - The parameters object containing the ID
 * @return {JSX.Element} The Whiteboard component with the specified ID
 */
const page = ({ params }: any): JSX.Element => {
  return <Whiteboard id={params.id} />;
};

export default page;
