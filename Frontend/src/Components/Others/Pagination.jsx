import React from "react";

const Pagination = ({ totalRecords, recordsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
