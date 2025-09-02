import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const app = express();
const PORT = 3001;

app.get("/api", async (req, res) => {
  try {
    const response = await fetch("https://www.altinkaynak.com/");
    const body = await response.text();
    const $ = cheerio.load(body);

    const marka = "Birko Kuyumculuk";
    const piyasa = "B.Piyasa";
    const data = [];

    $("table tbody tr").each((i, el) => {
      const cells = $(el).find("th, td");

      if (cells.length >= 3) {
        const name = $(cells[0])
          .text()
          .replace(/\s+/g, " ")
          .replace(/&nbsp;/g, " ")
          .trim();

        const alis = $(cells[1])
          .html()
          .replace(/<[^>]+>/g, "")
          .replace(/\s+/g, "")
          .trim();

        const satis = $(cells[2])
          .html()
          .replace(/<[^>]+>/g, "")
          .replace(/\s+/g, "")
          .trim();

        data.push({ name, alis, satis });
      }
    });

    res.json({ 
      marka, 
      piyasa, 
      lastUpdate: new Date().toLocaleString('tr-TR', { 
        timeZone: 'Europe/Istanbul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      data 
    });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Veri alınamadı" });
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
