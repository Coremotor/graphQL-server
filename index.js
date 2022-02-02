const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { readFileSync } = require("fs");
const cors = require("cors");
const morgan = require("morgan");
const DB = require("./DB");
const initialData = require("./users");

const schemaString = readFileSync("./schema.graphql", { encoding: "utf8" });
const schema = buildSchema(schemaString);

const data = new DB(initialData);

const app = express();
app.use(cors());
app.use(morgan("dev"));

const rootResolver = {
  getAllUsers: async () => {
    try {
      return await data.getUsers();
    } catch (e) {
      console.error("error", e);
    }
  },
  getUser: async ({ id }) => {
    try {
      return data.getUser(id);
    } catch (e) {
      console.error("error", e);
    }
  },
  createUser: async ({ input }) => {
    try {
      const user = {
        id: Date.now(),
        ...input,
      };
      data.addUser(user);
      return user;
    } catch (e) {
      console.error(e);
    }
  },
  deleteUser: async ({ id }) => {
    console.log(id);
    try {
      data.deleteUser(id);
      return true;
    } catch (e) {
      console.error(e);
    }
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
    rootValue: rootResolver,
  })
);

app.get("/", (res, req) => req.status(200).send("Ok"));

app.listen(5000, () => console.log("Server starting..."));
