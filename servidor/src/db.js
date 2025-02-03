import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  //node: "http://localhost:9200/",
  node: "http://69.48.204.36:9200/",
  
});

