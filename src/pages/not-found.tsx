import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-dvh text-2xl flex flex-col justify-center items-center">
      <p>404 page not-found</p>
      <Link to="/" className="text-blue-500">
        Home
      </Link>
    </div>
  );
}
