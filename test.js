const ID = require("./index");

ID.config({
  endpoint: "http://tzuccuru.crs4.it:8890/sparql",
  graph: 'http://www.example.org/myGraph',
  prefix: 'http://dbpedia.org/test/'
});

ID.create(false).then((id)=>{
  console.log(JSON.stringify(id)); //X74a9
}).catch(console.log);
