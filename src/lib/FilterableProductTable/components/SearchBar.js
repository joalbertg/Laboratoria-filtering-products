import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({
  // Los datos que necesita nuestro SearchBar
  filterText, inStockOnly,
  // Las acciones que puede realizar
  setFilterText, setInStockOnly
}) => {
  return (
    <form>
      <input
        type="text" placeholder="Search..."
        value={filterText}
        onChange={evt => {
          setFilterText(evt.target.value)
        }}
      />
      <p>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={evt => {
            setInStockOnly(evt.target.checked)
          }}
        />
        {' '}
        Only show products in stock
      </p>
    </form>
  );
}

SearchBar.propTypes = {
  filterText: PropTypes.string.isRequired,
  inStockOnly: PropTypes.bool.isRequired,
  setFilterText: PropTypes.func.isRequired,
  setInStockOnly: PropTypes.func.isRequired
}
// Cuando los componentes son "controlados" por un contenedor, el valor por defecto
// de las props, es determinado por el state, es por eso
// que suele ser buena práctica establecer todas tus props como required

export default SearchBar;
