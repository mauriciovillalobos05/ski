import Link from "next/link";

export default function Login() {
  return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <h1 className="text-5xl md:text-4xl font-serif mb-8 text-gray-800">
          LOGIN
        </h1>

        <div className="bg-[#ccc4aa] py-10 px-6 rounded-2xl border border-blue-900 shadow-lg w-full max-w-sm text-center min-h-[28rem] flex flex-col justify-between">
          <img src="/Jack.png" alt="Jack logo" className="mx-auto mb-4" />

          <div className="text-left space-y-4 mb-6">
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-semibold text-gray-700"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 bg-white text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700"
                placeholder="tuemail@ejemplo.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg font-semibold text-gray-700"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 bg-white text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700"
                placeholder="Tu contraseña"
              />
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button className="bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow hover:bg-blue-800 transition">
              IR AL RODEO
            </button>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-700">
            <p className="font-medium">¿No tienes cuenta?</p>
            <Link href="/register">
              <span className="font-semibold text-gray-700 cursor-pointer hover:underline">
                Regístrate
              </span>
            </Link>
          </div>
        </div>
      </div>
  );
}
