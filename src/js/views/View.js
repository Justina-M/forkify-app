import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  // CREATING DOCUMENTATION of render()
  // Object[] - array of objects
  // [render=true] - render parameter is optional with default value of true

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, creates markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View class instance (object)
   * @author Justina M
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Update in the DOM the part of received object, which was changed, without rerendering the whole object
   * @param {Object | Object[]} data The object, in which some data was changed
   * @returns {undefined} Updates the changed data to the DOM
   * @this {Object} View class instance (object)
   * @author Justina M
   */
  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();
    // creating document fragment of new markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // getting all elements from this document fragment
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // comparing arrays of elements
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updates changed TEXT
      if (
        // .isEqualNode checks the content of the Node
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  /**
   * Renders spinner to the DOM. Should be used while waiting for the data from API
   * @returns {undefined}
   * @author Justina M
   */
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders error message to the DOM
   * @param {string} [message=string of current View class instance (object)] Message to be rendered when error occures. If not passed in, default message is the one given in the current View class instance (object)
   * @returns {undefined}
   * @author Justina M
   */
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
          <div>
              <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
              </svg>
          </div>
          <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
          <div>
              <svg>
                  <use href="${icons}#icon-smile"></use>
              </svg>
          </div>
          <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
