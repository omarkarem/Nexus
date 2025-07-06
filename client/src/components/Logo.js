import { Link } from 'react-router-dom';

function Logo() {
  return (
    <div className="p-6">
      <Link to="/app/dashboard" className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-turquoise rounded-lg flex items-center justify-center">
          <span className="text-primary font-bold text-lg">N</span>
        </div>
        <span className="text-2xl font-bold">
          <span className="bg-gradient-aurora bg-clip-text text-transparent">Nexus</span>
        </span>
      </Link>
    </div>
  );
}

export default Logo; 