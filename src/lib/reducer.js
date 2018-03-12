// Supongamos que estos son los productos que recibimos de nuestra API JSON
const PRODUCTS = [
  { category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football' },
  { category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball' },
  { category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball' },
  { category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch' },
  { category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5' },
  { category: 'Electronics', price: '$1699.99', stocked: true, name: 'Nexus 7' },
];

const INIT_STATE = {
  // La de productos
  filteredProducts: PRODUCTS,
  // El texto de búsqueda que ingresa el usuario
  filterText: '',
  // El valor del checkbox
  inStockOnly: false
};

// nuestro reducer todavía no reacciona a ninguna acción, pero ya tiene un valor
// inicial
export default (state = INIT_STATE, action) => {
  switch (action.type) {
  default:
    return state;
  }
};
