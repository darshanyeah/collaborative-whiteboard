"use client";
import { useAppSelector } from "@/lib/hooks";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

/**
 * Renders the Page component which displays a list of whiteboards. If the user is not logged in,
 * it redirects to the login page. If there are no whiteboards, it displays a message and a button
 * to create a new whiteboard. Otherwise, it displays the list of whiteboards with a link to each
 * board. It also provides a button to create a new whiteboard.
 *
 * @return {JSX.Element | null} The rendered Page component or null if the user is not logged in.
 */
const Page = (): JSX.Element | null => {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.user);

  const [whiteboards, setWhiteboards] = React.useState<Array<any>>();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [router, token]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/whiteboard`
        );
        setWhiteboards(data?.data || []);
      } catch (error) {
        console.error("Error fetching whiteboards:", error);
      }
    })();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/whiteboard`
      );

      router.push(`/whiteboard/${response.data.data._id}`);
    } catch (error) {
      console.error("Error creating whiteboard:", error);
    }
  };

  if (!token) return null;

  if (!whiteboards)
    return (
      <div className="col-span-4 flex flex-col items-start">
        <p className="text-3xl font-bold">Loading...</p>
      </div>
    );

  if (whiteboards?.length === 0) {
    return (
      <div className="col-span-4 flex flex-col items-start">
        <p className="text-3xl font-bold">No whiteboards found</p>

        <div className="mt-4">
          <button
            className="text-xl text-gray-600 bg-gray-200 px-4 py-2 rounded"
            onClick={handleCreate}
          >
            Create new +
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-7 flex flex-col items-start">
      <p className="text-3xl font-bold">Whiteboards</p>
      <p className="text-xl mb-4">Choose any of your whiteboards to start</p>

      <div className="my-4 grid grid-cols-7 gap-4">
        {whiteboards?.map((board, i) => (
          <div key={board._id} className="col-span-1 flex flex-col items-start">
            <Link
              className="text-3xl font-bold bg-gray-200 hover:bg-gray-300 hover:cursor-pointer shadow hover:shadow-md px-4 py-2 rounded"
              href={`/whiteboard/${board._id}`}
            >
              Board {i + 1}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          className="text-xl text-gray-600 bg-gray-200 px-4 py-2 rounded shadow hover:shadow-md"
          onClick={handleCreate}
        >
          Create new +
        </button>
      </div>
    </div>
  );
};

export default Page;
