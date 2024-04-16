import React from 'react';
export default function Sidebar() {
    return (
      <div className="fixed w-1/6 h-full top-0 left-0 bg-gray-700">
      <div className="p-4 text-white">
        <div className="text-center mb-8">
          <img src="logo.png" alt="Logo" className="w-16 h-16 mx-auto" />
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-700">Chat 1</a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-700">Chat 2</a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-700">Chat 3</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
