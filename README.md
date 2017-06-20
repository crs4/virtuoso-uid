Virtuoso unique ID generator for Node.js
=============================================
## Description
This module allows to create unique ID for resources stored on Virtuoso.
It creates a random code and adds it to a certain prefix and verifies if this IRI is already used, if not the module inserts a triple with:
Subject : The new ID (prefix+code)
Predicate : dcterms:created
Object : The current date [new Date().toISOString()]

## Install
```
npm install [--save] virtuoso-uid
```

## Usage
```js
const ID = require("virtuoso-uid");

ID.config({
  endpoint: 'http://dbpedia.org/sparql',
  graph: 'http://www.example.org/myGraph',
  prefix: 'http://dbpedia.org/resource/'
});

ID.create().then((id)=>{
  console.log(id);
}).catch(console.log);
```

## Methods

#### `create([echo])`
Creates an unused IRI and store the new triple: <iri> <dcterms:created> date^^xsd:dateTimeStamp.
Returns a Promise that, when resolved, gives the complete result object.
 - `echo` set to 'true' to print query in standard console, 'false' is the default value;

#### `config(opts)`
Sets the options

```js
let opts = {
  endpoint: 'http://dbpedia.org/sparql',  // Virtuoso SPARQL endpoint
  graph: 'http://www.example.org/myGraph', // The graph where insert the new ID
  prefix: 'http://dbpedia.org/resource/', // The prefix
  alphabet : 'abcdeABCDE', // The set of chars used to create the code
  idLength : 10 // the code length
}
```
Default values are:
```js
let defaults = {
  endpoint: null,
  graph: null,
  prefix: null,
  alphabet : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  length : 5
}
```
