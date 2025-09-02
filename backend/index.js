import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/prices", async (req, res) => {
  try {
    const response = await fetch("https://saglamoglualtin.com/");
    const html = await response.text();
    const $ = cheerio.load(html);

    // Bu kısımda doğru selector'ları bulmamız lazım!
    const altin = $(".altin-fiyat").first().text().trim();
    const dolar = $(".dolar-fiyat").first().text().trim();
    const euro = $(".euro-fiyat").first().text().trim();

    res.json({ 
      altin, 
      dolar, 
      euro,
      lastUpdate: new Date().toLocaleString('tr-TR', { 
        timeZone: 'Europe/Istanbul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    });
  } catch (error) {
    res.status(500).json({ error: "Veri çekilemedi" });
  }
});

app.listen(5000, () => console.log("✅ Backend 5000 portunda çalışıyor"));
