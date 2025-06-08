import Link from "next/link";
import Image from "next/image"

export default function Home() {

  return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <h1 className="text-5xl md:text-4xl font-serif mb-8 text-gray-800">
          Bienvenido a Terrazas Jack
        </h1>

        <div className="bg-[#ccc4aa] py-10 px-6 rounded-2xl border border-blue-900 shadow-lg w-full max-w-sm text-center min-h-[28rem] flex flex-col justify-between">
          <Image src="/Jack.png" alt="Jack logo" width={120} height={120} className="mx-auto mb-4" />
          <p className="text-xl font-serif text-gray-900 mb-6">
            Encuentra la terraza perfecta para un rodeo en familia o con amigos.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <button className="bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow hover:bg-blue-800 transition">
                REGISTER
              </button>
              </Link>
            <Link href="/login">
              <button className="bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow hover:bg-blue-800 transition">
                LOGIN
              </button>
            </Link>
          </div>
        </div>
      </div>
  );
}
