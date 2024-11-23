import app from "./src/app";

const port = process.env.PORT ?? 3002;
app.listen(port, () => console.log(`Products service is running on port ${port}`));
