const express = require("express");
const { PrismaClient } = require("@prisma/client");
const amqp = require("amqplib");

const app = express();
const prisma = new PrismaClient();
const rabbitURL = process.env["RABBIT_URL"] || "amqp://localhost";

app.use(express.json());

async function listenToQueue() {
  const connection = await amqp.connect(rabbitURL);
  const channel = await connection.createChannel();
  const queue = "action_history";
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    const action = JSON.parse(msg.content.toString());
    console.log(action);
    await prisma.action_history.create({
      data: {
        action: action.action,
        productId: action.details.productId,
        storeId: action.details.storeId,
        details: action.details,
      },
    });
    channel.ack(msg);
  });
}

app.get("/history", async (req, res) => {
  const { shop_id, plu, action, start_date, end_date, page = 1, size = 10 } = req.query;
  const skip = (page - 1) * size;
  const take = Number(size);

  const conditions = {};
  if (shop_id) conditions.storeId = Number(shop_id);
  if (plu)
    conditions.productId = await prisma.product
      .findFirst({ where: { plu: plu.toString() } })
      .then((p) => p?.id);
  if (action) conditions.action = action.toString();
  if (start_date) conditions.createdAt = { ...conditions.createdAt, gte: new Date(start_date) };
  if (end_date) conditions.createdAt = { ...conditions.createdAt, lte: new Date(end_date) };

  const actions = await prisma.action_history.findMany({
    where: conditions,
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });

  res.json(actions);
});

listenToQueue();
const port = process.env.PORT ?? 3001;
app.listen(port, () => console.log(`Action history service is running on port ${port}`));
