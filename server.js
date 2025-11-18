import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const ASTRA_HOST = "https://astra.datastax.com";

app.all("/*", async (req, res) => {
  try {
    const targetUrl = ASTRA_HOST + req.originalUrl;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
      },
      body: req.method === "GET" ? undefined : JSON.stringify(req.body),
    });

    const data = await response.text();

    res.status(response.status).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy running at port", PORT));
