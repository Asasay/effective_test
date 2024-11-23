import request from "supertest";
import app from "./app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.product.create({
    data: { plu: "12345", name: "Test Product" },
  });
});

afterAll(async () => {
  await prisma.balance.deleteMany();
  await prisma.product.deleteMany();
  await prisma.$disconnect();
});

describe("Product API", () => {
  test("POST /products - create a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({ plu: "67890", name: "Another Product" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.plu).toBe("67890");
  });

  test("GET /products - fetch products", async () => {
    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("name");
  });

  test("GET /products - filter products by name", async () => {
    const response = await request(app).get("/products?name=Test");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0].name).toContain("Test");
  });
});

describe("Balance API", () => {
  let productId: number;

  beforeAll(async () => {
    const product = await prisma.product.findFirst({ where: { plu: "12345" } });
    productId = product?.id || 0;
  });

  test("POST /balances - create a balance", async () => {
    const response = await request(app).post("/balances").send({
      productId,
      storeId: 5,
      quantityShelf: 10,
      quantityOrder: 5,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("productId");
    expect(response.body.quantityShelf).toBe(10);
  });

  test("PATCH /balances/increase - increase shelf quantity", async () => {
    const response = await request(app).patch("/balances/increase").send({
      productId,
      storeId: 5,
      increaseBy: 5,
    });

    expect(response.status).toBe(200);
    expect(response.body.quantityShelf).toBe(15);
  });

  test("PATCH /balances/decrease - decrease shelf quantity", async () => {
    const response = await request(app).patch("/balances/decrease").send({
      productId,
      storeId: 5,
      decreaseBy: 3,
    });

    expect(response.status).toBe(200);
    expect(response.body.quantityShelf).toBe(12);
  });

  test("GET /balances - filter balances by product ID and store ID", async () => {
    const response = await request(app).get(`/balances?productId=${productId}&storeId=5`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0].productId).toBe(productId);
  });
});
