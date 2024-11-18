## To start the app:

1. `cd effective-test`
2. `docker compose up`

## Endpoints:

### Users:

#### Reset user issue:

```http
PATCH http://localhost:3000/users/:id/reset-issue
```

### Balances:

#### Create product:

```http
POST http://localhost:3002/products
```

| Parameter | Type     | Description                      |
| :-------- | :------- | :------------------------------- |
| `plu`     | `string` | **Required**. Price look-up code |
| `name`    | `string` | **Required**. Product name       |

#### Create product balance:

```http
POST http://localhost:3002/balances
```

| Parameter       | Type     | Description                                       |
| :-------------- | :------- | :------------------------------------------------ |
| `productId`     | `number` | **Required**. Product ID                          |
| `storeId`       | `number` | **Required**. Store ID                            |
| `quantityShelf` | `number` | **Required**. How many items is left on the shelf |
| `quantityOrder` | `number` | **Required**. How many items in orders            |

#### Increase the balance of the product in the store:

```http
PATCH http://localhost:3002/balances/increase
```

| Parameter    | Type     | Description              |
| :----------- | :------- | :----------------------- |
| `productId`  | `number` | **Required**. Product ID |
| `storeId`    | `number` | **Required**. Store ID   |
| `increaseBy` | `number` | Default = 1              |

#### Decrease the balance of the product in the store:

```http
PATCH http://localhost:3002/balances/decrease
```

| Parameter    | Type     | Description              |
| :----------- | :------- | :----------------------- |
| `productId`  | `number` | **Required**. Product ID |
| `storeId`    | `number` | **Required**. Store ID   |
| `decreaseBy` | `number` | Default = 1              |

#### Get balances by parameters:

```http
GET http://localhost:3002/balances
```

| Query       | Type     | Description                                 |
| :---------- | :------- | :------------------------------------------ |
| `plu`       | `string` | Price look-up code                          |
| `storeId`   | `number` | Store ID                                    |
| `shelfFrom` | `number` | Lower limit of quantity of goods on shelves |
| `shelfTo`   | `number` | Upper limit of quantity of goods on shelves |
| `orderFrom` | `number` | Lower limit of quantity of goods in orders  |
| `orderTo`   | `number` | Upper limit of quantity of goods in orders  |

#### Retrieve products:

```http
GET http://localhost:3002/products
```

| Query  | Type     | Description        |
| :----- | :------- | :----------------- |
| `name` | `string` | Product name       |
| `plu`  | `string` | Price look-up code |

### Action history:

```http
GET http://localhost:3001/history
```

#### Possible actions:

- `"balance_create"`
- `"balance_increase"`
- `"balance_decrease"`

| Query        | Type     | Description              |
| :----------- | :------- | :----------------------- |
| `shop_id`    | `string` | Shop ID                  |
| `plu`        | `string` | Price look-up code       |
| `action`     | `string` | Action type              |
| `start_date` | `string` | Starting from date       |
| `end_date`   | `string` | Ending with date         |
| `page`       | `string` | Default = 1. Page number |
| `size`       | `string` | Default = 10. Page size  |
