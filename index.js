import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Replicate from "replicate";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.get("/weather", async (req, res) => {
  try {
    const { location } = req.query;
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHERSAPI_TOKEN}&units=metric`
    );
    const data = await weatherRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

app.post("/generate-poem", async (req, res) => {
  try {
    const { location, weather, time } = req.body;
    const prompt = `Write a short, beautiful poem about ${location}. 
    The current weather is ${weather}, and the time is ${time}. 
    Make it atmospheric and creative.`;

  
    const output = await replicate.run(
      "ibm-granite/granite-3.3-8b-instruct:618ecbe80773609e96ea19d8c96e708f6f2b368bb89be8fad509983194466bf8",
      {
        input: {
          prompt,
          max_tokens: 300,
          temperature: 0.7
        },
      }
    );

    res.json({ poem: output.join("") });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate poem" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
