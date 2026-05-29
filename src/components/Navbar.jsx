import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ historyCount = 0 }) {
  const location = useLocation();

  return (
    <nav
      data-testid="navbar"
      className="sticky top-0 z-50 border-b border-green-100 bg-white/90 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-green-800 font-semibold"
          data-testid="nav-logo"
        >
          <span className="text-xl">🌿</span>
          <span className="font-display text-base">GreenLens</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/about"
            className={`text-sm transition-colors ${
              location.pathname === '/about'
                ? 'text-green-700 font-medium'
                : 'text-gray-500 hover:text-green-700'
            }`}
          >
            About
          </Link>

          <Link to="/" className="relative">
            {historyCount > 0 && (
              <span
                className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-700 text-[10px] font-bold text-white"
                data-testid="history-badge"
              >
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
            <span className="text-lg">🕐</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
