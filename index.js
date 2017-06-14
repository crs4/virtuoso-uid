const SPARQL = require('virtuoso-sparql-client');

let Client = null;

let config = null;

let defaults = {
  endpoint: null,
  graph: null,
  prefix: null,
  alphabet : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  idLength : 5
}

exports.config = (options) => {
  config = Object.assign({}, defaults, options);
  if(config.idLength < 1) config.idLength = 1;
  if(!config.prefix) throw new Error("VirtuosoID: prefix is null");


  let prefixes = {
    dcterms : "http://purl.org/dc/terms/",
    ex : "http://www.example.org/",
  };
  Client = new SPARQL.Client(config.endpoint);
  Client.setOptions("application/json", prefixes, config.graph);
}

exports.create = () => {
  errororMissingConfiguration();
  return new Promise((resolve, reject) => {
    let iri = config.prefix + generate();
    verify(iri)
    .then((result)=>{
      if(result.boolean)
        exports.create();
      else{
        return insert(iri);
      }
    })
    .then(()=>{
      return resolve(iri);
    })
    .catch(reject);
  });
}

exports.bulkCreate = (count, millis) => {
  errororMissingConfiguration();
  return new Promise((resolve, reject) => {
    let IRIs = [];
    for(let i = 0; i < count; i++){
      setTimeout(()=>{
        exports.create()
        .then((iri)=>{
          IRIs.push(iri);
          if(IRIs.length === count)
            return resolve(IRIs);
        })
        .catch(reject);
      }, i * millis);
    }
  });
}

let verify = (iri) => {

  let query = `ASK FROM <${config.graph}> {
    {<${iri}> ?a ?b}
    UNION {?e <${iri}> ?f}
    UNION {?c ?d <${iri}>}
  }`;
  //console.log(query);
  return Client.query(query);
}

let insert = (iri) => {
  let query = `WITH <${config.graph}> INSERT
    {<${iri}> dcterms:created "${new Date().toISOString()}"^^xsd:dateTimeStamp}
  `;
  //console.log(query);
  return Client.query(query);
}

let generate = ()=>{
  let rtn = '';
  for (let i = 0; i < config.idLength; i++) {
    rtn += config.alphabet.charAt(Math.floor(Math.random() * config.alphabet.length));
  }
  return rtn;
}

let errororMissingConfiguration = ()=>{
  if(!config) throw new Error("VirtuosoID: Call 'config' before...");
}
