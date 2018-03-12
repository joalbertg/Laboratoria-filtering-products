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

[mock-1]: ./assets/images/Screenshot_1.png "Logo Title Text 2"

> JSON correspondiente

```json
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

[mock-2]: ./assets/images/Screenshot_2.png "Logo Title Text 2"

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


