# Filtering products with React and Redux

* Instalamos ´create-react-app´ para crear proyectos con react.

```sh
node install -g create-react-app
```

* Ejecutamos

```sh
create-react-app name-app
```

* Verificamos si todo está ok con

```sh
cd name-app
yarn start
```

* Instalamos

```sh
yarn add redux react-redux
yarn add -D redux-devtools
```

* Creamos `lib/components/Main.js`

```jsx
// lib/components/Main.js

import React from 'react';
import PropTypes from 'prop-types';

// y ahora importamos nuestro componente
import FilterableProductTable from '../FilterableProductTable/components';

// toda los datos que Main necesita, ahora los recibimos como props
const Main = ({ products }) => {
  // TODO: Hack para que renderice. Quitar luego de setear Redux.
  products = [];

  return (
    <div>
      <FilterableProductTable products={products} />
    </div>
  )
}

Main.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
}

export default Main;
```

* Creamos `lib/FilterableProductTable/components/index.js`

```jsx
import React from 'react'

const FilterableProductTable = () => {
  const style = {
    width: '70%',
    float: 'left'
  }
  return (
    <div style={style}>
      <h2>Filterable Product Table</h2>
    </div>
  )
}

export default FilterableProductTable
```

* Y la plantilla generada por `create-react-app` y `App.js` quedando de la siguiente manera

```jsx
import React, { Component } from 'react';

import Main from './lib/components/Main'

import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Main />
      </div>
    );
  }
}

export default App;
```
> `App.css`

```css
body {
  padding: 5px
}
```

> Con ésta configuración ya tenemos preparada una plantilla

## COMIENZA CON UN MOCK

![alt text][mock-1]

[mock-1]: ./assets/images/Screenshot_1.png "MOCK"

> JSON correspondiente

```js
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## DIVIDE LA INTERFAZ (UI) EN UNA JERARQUÍA DE COMPONENTES


![alt text][mock-2]

[mock-2]: ./assets/images/Screenshot_2.png "Components"

Aquí verás que tenemos 5 componentes:

1. `FilterableProductTable` **(naranja):** contiene el bloque completo
2. `SearchBar` **(azul):** recibe el input del usuario
3. `ProductTable` **(verde):** muestra y filtra la colección según el input del usuario
4. `ProductCategoryRow` **(turquesa):** muestra la cabecera para cada categoría
5. `ProductRow` **(rojo):** muestra una fila para cada producto

Si observas a `ProductTable`, verás que la cabecera de la tabla (que tiene los labels **"Name"** y **"Price"**) no están en su propio componente. Esto es según la preferencia de cada uno. En este ejemplo, los dejamos como parte de `ProductTable` porque es parte de la lógica de renderizado de la colección, que es responsabilidad de `ProductTable`. Sin embargo si con el tiempo este **header** crece y se complejiza (por ejemplo para permitir ordenamiento), probablemente tenga sentido crearle su propio componente `ProductTableHeader`.

Ahora que hemos identificado cuáles son nuestro componentes, vamos a ordenarlos en una jerarquía. Esto es simple, si un componente aparece dentro de otro componente en el mock, entonces debería aparecer como hijo en la jerarquía:

* `FilterableProductTable`
  * `SearchBar`
  * `ProductTable`
    * `ProductCategoryRow`
    * `ProductRow`

***

## CONSTRUYE UNA VERSIÓN ESTÁTICA EN REACT

```jsx
// lib/FilterableProductTable/components/index.js
import React from 'react';

import SearchBar from './SearchBar';
import ProductTable from './ProductTable';

const FilterableProductTable = ({ products }) => {
  const style = {
    width: '70%',
    float: 'left'
  }

  return (
    <div style={style}>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

export default FilterableProductTable;
```

```jsx
// lib/FilterableProductTable/components/SearchBar.js
import React from 'react';

const SearchBar = () => {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <p>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </p>
    </form>
  );
}

export default SearchBar;
```

```jsx
// lib/FilterableProductTable/components/ProductTable.js
import React from 'react';

const ProductCategoryRow = ({ category }) => {
  return (
    <tr><th colSpan="2">{category}</th></tr>
  );
}

const ProductRow = ({ product }) => {
  const name = product.stocked ?
    product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;
  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

const ProductTable = ({ products }) => {
  const rows = [];
  let lastCategory = null;
  products.forEach(product => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow category={product.category} key={product.category} />
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

export default ProductTable;
```

> Agregamos data ficticia en `Main.js` para ver cómo se muestra:

```js
// lib/components/Main.js
/*...*/
products = [
    { category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football' },
    { category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball' },
    { category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball' },
    { category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch' },
    { category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5' },
    { category: 'Electronics', price: '$1666699.99', stocked: true, name: 'Nexus 7' }
  ];
/*...*/
```

> Con esto ya podemos ver la data estructurada

## IDENTIFICA LA REPRESENTACIÓN MÍNIMA (PERO COMPLETA) DEL ESTADO DE TU UI

* La lista de productos
* El texto de búsqueda que ingresa el usuario
* El valor del checkbox

> Ahora hacemos la integración de React con Redux para comenzar con este estado global.

> Primero creamos un nuevo archivo `lib/store.js` que contendrá la configuración de nuestro `Redux` store.

```jsx
// lib/store.js

import { createStore, combineReducers } from 'redux';

import AppReducer from './reducer';

const rootReducer = combineReducers({
  // aquí puedes ir agregando entradas de tu store
  AppReducer,
});

const store = createStore(
  rootReducer,
  // inyectamos la capacidad de usar Redux Dev Tools
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
```

```jsx
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
  products: PRODUCTS,
  // El texto de búsqueda que ingresa el usuario
  filterText: '',
  // El valor del checkbox
  inStockOnly: false,
};

// nuestro reducer todavía no reacciona a ninguna acción, pero ya tiene un valor
// inicial
export default (state = INIT_STATE, action) => {
  switch (action.type) {
  default:
    return state;
  }
};
```

> Si chequeas `Redux Dev Tools` verás como el `state` de la aplicación ya cuenta con la info indicada en **INIT_STATE**

![alt text][mock-3]

[mock-3]: ./assets/images/Screenshot_3.png "Redux devTools"

* Luego, quitemos el **hack** que colocamos en `lib/components/Main.js` e inyectemos la magia de `Redux` a nuestros componentes.

> Para ello necesitamos hacer solamente dos cosas. Primero vamos a crear nuestro HOC a la altura de la carpeta `components` que se encargará de setear la data que necesita `lib/components/Main.js`, lo crearemos en `lib/Main.js`

```jsx
// lib/Main.js
import { connect } from 'react-redux';
// Y el componente puramente presentacional de Main, ya sin hack
import MainComponent from './components/Main';

const MainWithRedux = connect(
  // `connect` recibe dos parámetros. El primero de ellos es
  // `mapStateToProps` que justamente lo que haces es mapear valores del state
  // a props que recibirá `MainComponent`
  function mapStateToProps(state) {
    // buscamos los valores que nos interesan
    const {
      filteredProducts
    } = state.AppReducer;

    // y devolvemos las nuevas props
    return {
      // fijate q los productos filtrados en el state se llaman `filteredProducts`
      // pero que la props del componente `Main` se llama `products`
      products: filteredProducts
    };
  }
)(MainComponent);

export default MainWithRedux;
```

* Y lo segundo es indicar en `App.js` que ya no queremos usar `lib/components/Main`, sino su versión mejorada `lib/Main`.

> **Nota:** en `reducer.js` cambiamos `products` por `filteredProducts`

```js
const INIT_STATE = {
  // La de productos
  filteredProducts: PRODUCTS,
  // El texto de búsqueda que ingresa el usuario
  filterText: '',
  // El valor del checkbox
  inStockOnly: false
};
```

## IDENTIFICA TUS ACCIONES Y AGREGA INVERSE DATA FLOW (STATE IS READ-ONLY)

> Hasta ahora, tenemos una aplicación que configura su `store` de **Redux**, toma esos valores y los pasa a la interfaz para renderizarlo. Ahora necesitamos conseguir que la información fluya en la otra dirección: de los `componentes` al `state`. Como habíamos definido al comienzo, en el mundo de **Redux**, la única forma de conseguirlo es a través de `actions`.

> ¿cuáles son las acciones que un usuario puede realizar en nuestra aplicación?

* escribir en el input
* seleccionar o limpiar el checkbox

> Lo primero que vamos a necesitar, es una archivo `lib/actions.js` donde definiremos nuestros `action types` y `action creators` (funciones que devuelven acciones).

```js
export const actionTypes = {
  FILTER_TEXT_CHANGED: 'FILTER_TEXT_CHANGED',
  IN_STOCK_ONLY_CHANGED: 'IN_STOCK_ONLY_CHANGED'
};

export const filterTextChanged = text => ({
  type: actionTypes.FILTER_TEXT_CHANGED,
  text
});

export const inStockOnlyChanged = value => ({
  type: actionTypes.IN_STOCK_ONLY_CHANGED,
  value
});
```

> Y luego necesitamos dotar a `SearchBar` de la capacidad para disparar estas acciones. Para eso, vamos a crear un nuevo **HOC** `SearchBarWithRedux`.

```jsx
// lib/FilterableProductTable/SearchBar
import { connect } from 'react-redux';

import SearchBarComponent from './components/SearchBar';
import { filterTextChanged, inStockOnlyChanged } from '../actions';

const SearchBarWithRedux = connect(
  function mapStateToProps(state) {
    // buscamos los valores que nos interesan para el SearchBar
    // fíjate que el SearchBar no tiene por qué saber nada de los productos
    const {
      filterText,
      inStockOnly
    } = state.AppReducer;

    // y devolvemos las nuevas props
    return {
      filterText,
      inStockOnly
    };
  },
  // El segundo parámetro de `connect` es `mapDispatchToProps`.
  // El el mundo Redux al llamar a un `action creator` lo único que obtenemos
  // es un objeto que expresa que es lo que ha sucedido, pero no dispara la acción.
  // Para esto necesitas llamar a la función `dispatch` del store.
  // Esto es lo que hace `mapDispatchToProps` mapea llamadas a `dispatch` para
  // tus `action creators`
  function mapDispatchToProps(dispatch) {
    return {
      setFilterText(newFilterText) {
        dispatch(filterTextChanged(newFilterText));
      },
      setInStockOnly(newValue) {
        dispatch(inStockOnlyChanged(newValue));
      }
    };
  }
)(SearchBarComponent);

export default SearchBarWithRedux;
```

> Modificamos `FilterableProductTable` para que en lugar de usar el componente `SearchBar` utilice el contenedor `SearchBarWithRedux`.

> Y ahora si, hacemos que nuestro componente `SearchBar` entienda todas estas nuevas capacidades:

```jsx
// lib/components/SearchBar
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
```

## DETERMINA CÓMO REACCIONA TU STATE A LAS ACTIONS DISPARADAS

> Ya tenemos a las acciones disparándose, ahora analicemos cómo queremos que el `state` se modifique ante cada una de ellas. Como lo establece nuestro principio de **Changes are made with pure functions**, vamos a modificar nuestro `reducer`.

```jsx
// importamos los `actionTypes` que definimos en el paso anterior
import { actionTypes } from './actions';

// Supongamos que estos son los productos que recibimos de nuestra API JSON
const PRODUCTS = [
  { category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football' },
  { category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball' },
  { category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball' },
  { category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch' },
  { category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5' },
  { category: 'Electronics', price: '$1699.99', stocked: true, name: 'Nexus 7' }
];

// El state inicial
const INIT_STATE = {
  originalProducts: PRODUCTS,
  filterText: '',
  inStockOnly: false,
  filteredProducts: PRODUCTS
}

// nuestro reducer
export default (state = INIT_STATE, action) => {
  switch (action.type) {
    // Si el action es `FILTER_TEXT_CHANGED`
    case actionTypes.FILTER_TEXT_CHANGED:
      state = {
        ...state,
        // actualizamos `filterText` en el state con el `text` del action
        filterText: action.text
      }
      break;
    // Si el action es `IN_STOCK_ONLY_CHANGED`
    case actionTypes.IN_STOCK_ONLY_CHANGED:
      state = {
        ...state,
        // actualizamos `inStockOnly` en el state con el `value` del action
        inStockOnly: action.value
      }
      break;
  }

  // Y que sucede con los `filteredProducts`?
  // `filteredProducts` se actualiza cuando cualquiera de las dos acciones
  // es ejecutada
  if (
    action.type === actionTypes.FILTER_TEXT_CHANGED ||
    action.type === actionTypes.IN_STOCK_ONLY_CHANGED
  ) {
    const filteredProducts = state.originalProducts.filter(p => {
      const filterText =
        // si el action es `FILTER_TEXT_CHANGED`
        (action.type === actionTypes.FILTER_TEXT_CHANGED ?
          // usamos el `text` del action
          action.text :
          // si no usamos el `filterText` del `state`
          state.filterText).trim()
      const inStockOnly =
        // si el action es `IN_STOCK_ONLY_CHANGED`
        action.type === actionTypes.IN_STOCK_ONLY_CHANGED ?
          // usamos el `value` del action
          action.value :
          // si no usamos el `inStockOnly` del `state`
          state.inStockOnly

      // el producto `p` va a la lista de `filteredProducts` si:
      return (
        // el checkbox esta prendido y `p.stocked === true`
        // si el checkbox esta apagado siempre true
        (inStockOnly ? p.stocked : true) &&
        // y el `p.name` matchea `filterText` case insensitive
        p.name.match(new RegExp(filterText, 'ig'))
      )
    })

    state = {
      ...state,
      filteredProducts
    }
  }

  // Siempre, siempre, siempre, un reducer debe retornar un `state`.
  // En el caso que no reaccione al `action` actual, debe explícitamente
  // devolver el `state` anterior
  return state;
}
```
