import Image from "next/image";
import Link from "next/link";

/**
 * Renders the home page of the application.
 *
 * @returns {JSX.Element} The home page component.
 */
const Home = (): JSX.Element => {
  return (
    <main className="container-2xl mx-auto px-16 py-16 grid grid-cols-7 items-center space-y-8 gap-4 h-screen bg-[#C5C9F0]">
      <div className="col-span-4 flex flex-col items-start">
        <h1 className="text-5xl text-wrap">Real-Time Collaborative</h1>
        <h2 className="text-8xl font-bold mb-4">Whiteboard</h2>
        <p className="text-2xl text-gray-700 mb-8">
          Brainstorm, design, and collaborate in real-time with anyone,
          anywhere.
        </p>
        <Link
          className="text-xl text-gray-600 bg-gray-200 px-4 py-2 rounded"
          href="/login"
        >
          Login to collaborate
        </Link>
      </div>
      <div className="col-span-3 flex flex-col">
        <Image
          src="/png/landing_hero.png"
          alt="login"
          width={500}
          height={500}
        />
      </div>
    </main>
  );
};

export default Home;
