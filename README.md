Virtuoso unique ID generator for Node.js
=============================================
## Description
This module allows to create unique ID for resources stored on Virtuoso. It creates a random code and adds it to a certain prefix and verifies if this IRI is already used.

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
Create an unused IRI and store the new triple: <iri> <dcterms:created> date^^xsd:dateTimeStamp.
Return a Promise with the new IRI.

#### `bulkCreate(count, millis)`
Create N unused IRI and store the new triple: <iri> <dcterms:created> date^^xsd:dateTimeStamp.
Return a Promise with an array of new IRIs.
  `count` the number of IRI to create
  `millis` the request timeout

#### `config(opts)`
Set the options

```js
let opts = {
  endpoint: 'http://dbpedia.org/sparql',  // Virtuoso SPARQL endpoint
  graph: 'http://wwwexample.org/myGraph', // The graph where insert the new ID
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
