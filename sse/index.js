const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3001;

let clients = [];

app.get("/events", (req, res) => {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  res.write(":ok\n\n");
  clients.push(res);
  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

function broadcastSSE(data) {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

app.post("/pujas", (req, res) => {
  const nuevaPuja = req.body;
  broadcastSSE({ tipo: "nueva_puja", puja: nuevaPuja });
  res.status(201).json({ mensaje: "Puja creada y notificada", puja: nuevaPuja });
});

app.listen(PORT, () => {
  console.log(`Servidor SSE corriendo en http://localhost:${PORT}`);
});
