import express from 'express';
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import productRoute from "./routes/productr.js";
//const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

//app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // or "*" for any origin
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.use("/api/products",productRoute);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get(/(.*)/, (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:"+ PORT);
})

