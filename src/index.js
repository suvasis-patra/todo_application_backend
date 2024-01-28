import dotevn from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/index.js";

dotevn.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () =>
      console.log(`server is running in port ${process.env.PORT}`)
    );
  })
  .catch((e) => console.log("DB connection failed", e.message));
