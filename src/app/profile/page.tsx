import Link from "next/link";

export default function Profile() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl md:text-4xl font-serif mb-8 text-gray-800">
        Un paso más el Rodeo ...
      </h1>

      <div className="bg-[#ccc4aa] py-10 px-6 rounded-2xl border border-blue-900 shadow-lg w-full max-w-sm text-center min-h-[28rem] flex flex-col justify-between">
        <img src="/Jack.png" alt="Jack logo" className="mx-auto mb-4" />

        <div className="text-left space-y-4 mb-6">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-semibold text-gray-700"
            >
              Nombre
            </label>
            <input
              type="name"
              id="name"
              className="mt-1 bg-white text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700"
              placeholder="Jacques Webster"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-lg font-semibold text-gray-700"
            >
              Tipo de Usuario
            </label>
            <select
              id="type"
              className="mt-1 bg-white text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700"
              defaultValue=""
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              <option value="cliente">Cliente</option>
              <option value="anfitrion">Anfitrión</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <button className="bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow hover:bg-blue-800 transition">
            IR AL RODEO
          </button>
        </div>
      </div>
    </div>
  );
}
