import express from "express";
import { PrismaClient } from "@prisma/client";
import amqp from "amqplib";

const app = express();
const prisma = new PrismaClient();
const rabbitURL = process.env["RABBIT_URL"] || "amqp://localhost";

app.use(express.json());

async function sendMessageToQueue(message: any) {
  const connection = await amqp.connect(rabbitURL);
  const channel = await connection.createChannel();
  const queue = "action_history";
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  await channel.close();
  await connection.close();
}

app.post("/products", async (req, res) => {
  const { plu, name } = req.body;
  let product;
  try {
    product = await prisma.product.create({
      data: { plu, name },
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }
  res.status(201).json(product);
});

app.post("/balances", async (req, res) => {
  const { productId, storeId, quantityShelf, quantityOrder } = req.body;
  let balance;
  try {
    balance = await prisma.balance.create({
      data: { productId, storeId, quantityShelf, quantityOrder },
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }

  await sendMessageToQueue({ action: "balance_create", details: balance });
  res.status(201).json(balance);
});

app.patch("/balances/increase", async (req, res) => {
  const { productId, storeId, increaseBy = 1 } = req.body;
  let balance;
  try {
    balance = await prisma.balance.update({
      where: { productId_storeId: { productId, storeId } },
      data: { quantityShelf: { increment: increaseBy } },
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }

  await sendMessageToQueue({ action: "balance_increase", details: balance });
  res.json(balance);
});

app.patch("/balances/decrease", async (req, res) => {
  const { productId, storeId, decreaseBy = 1 } = req.body;
  let balance;
  try {
    balance = await prisma.balance.update({
      where: { productId_storeId: { productId, storeId } },
      data: { quantityShelf: { decrement: decreaseBy } },
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }

  await sendMessageToQueue({ action: "balance_decrease", details: balance });
  res.json(balance);
});

app.get("/balances", async (req, res) => {
  const { plu, storeId, shelfFrom, shelfTo, orderFrom, orderTo } = req.query;

  const conditions: any = {};
  if (plu) conditions.product = { plu: plu.toString() };
  if (storeId) conditions.storeId = Number(storeId);
  if (shelfFrom) conditions.quantityShelf = { ...conditions.quantityShelf, gte: Number(shelfFrom) };
  if (shelfTo) conditions.quantityShelf = { ...conditions.quantityShelf, lte: Number(shelfTo) };
  if (orderFrom) conditions.quantityOrder = { ...conditions.quantityOrder, gte: Number(orderFrom) };
  if (orderTo) conditions.quantityOrder = { ...conditions.quantityOrder, lte: Number(orderTo) };

  let balances;
  try {
    balances = await prisma.balance.findMany({
      where: conditions,
      include: { product: true },
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }

  res.json(balances);
});

app.get("/products", async (req, res) => {
  const { name, plu } = req.query;

  const conditions: any = {};
  if (name) conditions.name = { contains: name.toString(), mode: "insensitive" };
  if (plu) conditions.plu = plu.toString();

  let products;
  try {
    products = await prisma.product.findMany({
      where: conditions,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }

  res.json(products);
});

export default app;
