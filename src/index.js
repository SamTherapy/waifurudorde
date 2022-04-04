import { search } from "./helpers/API.js";
import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.set("Cache-Control", "no-store");
  main();
  res.sendFile("src/public/assets/waifu.png", { root: "." });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

function main() {
  search();
}
