const {QueryNode, QueryString, QueryData, Triple, LocalTripleStore, Client} = require('virtuoso-sparql-client');

let SaveClient = null;
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

  SaveClient = new Client(config.endpoint);
  SaveClient.setDefaultGraph(config.graph);
  SaveClient.setDefaultFormat('application/json');
}

exports.create = (echo = false) => {
  if(!config)
    throw new Error("virtuoso-uid -> Call 'config' before...");
  //console.log(SaveClient._calculateQueryGraph());
  return new Promise((resolve, reject) => {
    let iri = config.prefix + generate();
    verify(iri, echo)
    .then((result)=>{
      if(Boolean(result.boolean))
        exports.create(echo);
      else{
        return insert(iri, echo);
      }
    })
    .then(()=>{
      return resolve(iri);
    })
    .catch((error)=>{
      reject({
        source: 'virtuoso-uid',
        method: 'create',
        error: error
      });
    });
  });
}

/*
exports.bulkCreate = (count, millis, echo = false) => {
  errororMissingConfiguration();
  return new Promise((resolve, reject) => {
    let IRIs = [];
    for(let i = 0; i < count; i++){
      setTimeout(()=>{
        exports.create(echo)
        .then((iri)=>{
          IRIs.push(iri);
          if(IRIs.length === count)
            return resolve(IRIs);
        })
        .catch((error)=>{
          reject({
            source: 'SaveClient-uid',
            method: 'bulkCreate',
            error: error
          });
        });
      }, i * millis);
    }
  });
}
*/

let verify = (iri, echo = false) => {

  let query = `ASK FROM <${config.graph}> {
    {<${iri}> ?a ?b}
    UNION {?e <${iri}> ?f}
    UNION {?c ?d <${iri}>}
  }`;
  //console.log(query);

  return SaveClient.query(query, echo);
}
let insert = (iri, echo = false) => {
  let localStore = new LocalTripleStore();
  localStore.add(
    new Triple(
      new QueryNode(iri),
      "dcterms:created",
      new QueryData(localStore.now(), "xsd:dateTimeStamp")
    )
  );

  return SaveClient.store(localStore, echo);
}
let generate = () => {
  let rtn = '';
  for (let i = 0; i < config.idLength; i++) {
    rtn += config.alphabet.charAt(Math.floor(Math.random() * config.alphabet.length));
  }
  return rtn;
}
