export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button {...props} className="bg-black text-white px-4 py-2 rounded w-full hover:opacity-80 transition" />;
  }