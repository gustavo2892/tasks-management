import { Link } from "@tanstack/react-router";

export const Header = () => {
  return (
    <header className="w-full flex flex-center justify-center">
      <nav className="p-2 flex gap-8">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/task-list" className="[&.active]:font-bold">
          Tasks List
        </Link>
      </nav>
    </header>
  );
}