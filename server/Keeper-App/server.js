import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { notesRouter } from "./src/routes/notes.js";
import { usersRouter } from "./src/routes/users.js";
// Constants
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3001;
const base = process.env.BASE || "/";

// Create http server
const app = express();
app.use(express.json());
app.use(cors());

app.use("/notes", notesRouter);
app.use("/users", usersRouter);

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// MONGODB //
mongoose.connect(process.env.data_URL);

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
