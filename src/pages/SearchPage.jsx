import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchPage = () => {
  const location = useLocation();
  const results = location.state;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">
        🔍 Search Results
      </h1>

      {results ? (
        Object.entries(results).some(([, items]) => items.length > 0) ? (
          Object.entries(results).map(([category, items]) =>
            items.length > 0 ? (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-700 capitalize mb-2 border-b border-gray-300 pb-1">
                  {category}
                </h2>
                <ul className="space-y-2 pl-4">
                  {items.map((item) => (
                    <li
                      key={item._id}
                      className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition duration-200"
                    >
                      <p className="font-bold text-gray-800">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )
        ) : (
          <p className="text-center text-gray-500 mt-10">No results found.</p>
        )
      ) : (
        <p className="text-center text-gray-500 mt-10">
          Please enter a search above.
        </p>
      )}
    </div>
  );
};

export default SearchPage;
