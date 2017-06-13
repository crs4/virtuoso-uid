Virtuoso unique ID generator for Node.js
=============================================
## Description
This module allows to create unique ID for resources stored on Virtuoso. It creates a random code and adds it to a certain prefix and verifies if the this IRI is already used.

## Install
```
npm install virtuoso-uid
```

## Usage
```js
const ID = require("virtuoso-uid");

ID.config({
  endpoint: 'http://dbpedia.org/sparql',
  prefix: 'http://dbpedia.org/resource/'
});

ID.create().then((id)=>{
  console.log(id); //X74a9
}).catch(console.log);
```

## Methods

#### `create()`
Create an unused IRI.
Return a Promise

#### `config(opts)`
Set the options

```js
let opts = {
  endpoint: 'http://dbpedia.org/sparql', // Virtuoso SPARQL endpoint
  prefix: 'http://dbpedia.org/resource/', // The prefix
  alphabet : 'abcdeABCDE', // The set of chars used to create the code
  length : 10 // the code length
}
```

Default values are:
```js
let defaults = {
  endpoint: null,
  prefix: null,
  alphabet : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  length : 5
}
```
