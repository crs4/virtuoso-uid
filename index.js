const SPARQL = require('virtuoso-sparql-client');

let Client = null;

let config = null;

let defaults = {
  endpoint: null,
  prefix: null,
  alphabet : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  length : 5
}

exports.config = (options) => {
  config = Object.assign({}, defaults, options);
  if(config.cache < 1) config.cache = 1;
  if(config.length < 1) config.length = 1;
  if(!config.prefix) throw new Error("VirtuosoID: prefix is null");
  Client = new SPARQL.Client(config.endpoint);
  Client.setOptions("application/json");
}

exports.create = () => {
  err();
  return new Promise((resolve, reject) => {
    let id = generate();
    let iri = config.prefix + id;
    verify(iri)
    .then((result)=>{
      if(result.boolean)
        exports.create();
      else
        return resolve(iri);
    })
    .catch(reject);
  });

}

let verify = (iri) => {
  let query = `ASK {
    { <${iri}> ?a ?b } UNION {?c ?d <${iri}>} UNION {?e <${iri}> ?f}
  }`;
  return Client.query(query);
}


let generate = ()=>{
  let rtn = '';
  for (let i = 0; i < config.length; i++) {
    rtn += config.alphabet.charAt(Math.floor(Math.random() * config.alphabet.length));
  }
  return rtn;
}

let err = ()=>{
  if(!config) throw new Error("VirtuosoID: Call 'config' before...");
}
