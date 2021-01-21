import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const { results, page, resultsPerPage } = this._data;
    const numPages = Math.ceil(results.length / resultsPerPage);

    const prevBtn = `
    <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
    </button>
    `;

    const nextBtn = `
    <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${page + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
    `;

    const pageInfo = `
    <div
        style="
          display: flex;
          justify-content: center;
          align-items: flex-end;
          height: 30px;
        "
      >
        <p>${numPages} pages</p>
      </div>
    </div>
    `;

    // We're in Page 1, there are other pages
    if (page === 1 && numPages > 1) return [nextBtn, pageInfo].join('');

    // We're in Last page
    if (page === numPages && numPages > 1) return prevBtn;

    // We're in Other page
    if (page < numPages && page > 1)
      return [prevBtn, nextBtn, pageInfo].join('');

    // We're in Page 1, there are NO other pages
    return '';
  }
}

export default new PaginationView();
