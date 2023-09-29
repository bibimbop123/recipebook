import React from "react";
import "./App.css";
function Pagination({ numberOfPages, currentPage, setCurrentPage }) {
  const pageNumbers = [...Array(numberOfPages + 1).keys()].slice(1);

  function nextPage() {
    if (currentPage !== numberOfPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function previousPage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <div>
      <nav>
        <ul className="ul">
          <li className="prev" onClick={previousPage}>
            prev
          </li>
          {pageNumbers.map((page) => (
            <li key={page} onClick={() => setCurrentPage(page)}>
              <a href="#">{page}</a>
            </li>
          ))}
          <li className="next" onClick={nextPage}>
            next
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
