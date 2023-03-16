import * as dotenv from "dotenv";
dotenv.config();
import init from "./EcommApplication";
import "reflect-metadata";

const port = 8080;
const app = init();

app.get("/hello", (req, res) => {
  res.send("hello");
});
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
