const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017";
const mongoClient = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let dbClient;

const mongoConnect = (cb) => {
  mongoClient.connect((err, client) => {
    if (err) {
      console.log(err);
      return;
    }
    dbClient = client.db("shop");
    cb();
  });
};

const getDb = () => {
  if (dbClient) return dbClient;
};

process.on("SIGINT", () => {
  mongoClient.close();
  process.exit();
});

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
