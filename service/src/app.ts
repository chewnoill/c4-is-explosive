import express from "express";

const app = express();

app.get("/health-check", (_, resp) => {
  resp.send("OK");
});

export default app;

