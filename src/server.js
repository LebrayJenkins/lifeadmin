import express from "express";

const app = express();
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`LifeAdmin körs på http://localhost:${PORT}`);
});
