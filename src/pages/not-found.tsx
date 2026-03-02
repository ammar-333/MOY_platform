import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-dvh text-2xl flex flex-col justify-center items-center">
      <p>page not-found</p>
      <p>404</p>
      <Link to="/" className="text-blue-500">
        Home
      </Link>
    </div>
  );
}
