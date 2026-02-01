
import { GoogleGenAI } from "@google/genai";
import { MMIRecord } from "../types";

export const getAIInsights = async (records: MMIRecord[]): Promise<string> => {
  if (!process.env.API_KEY || records.length === 0) return "Tiada data mencukupi untuk analisis AI.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const recordsSummary = records.slice(0, 50).map(r => 
    `- ${r.tarikh} | ${r.nama} | ${r.kelas} | ${r.status} | ${r.sebab}`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Bertindak sebagai Pegawai Analitis Pendidikan. Analisis data keberadaan guru MMI berikut untuk SMK Penambang dan berikan ringkasan eksekutif dalam Bahasa Melayu. Kenal pasti trend utama (cth: sebab ketidakhadiran paling kerap) dan cadangan penambahbaikan. \n\nData:\n${recordsSummary}`,
      config: {
        systemInstruction: "Anda adalah pakar sistem pendidikan Malaysia (MMI - Melindungi Masa Instruksional). Berikan jawapan yang profesional, padat, dan bernilai dalam Bahasa Melayu.",
        temperature: 0.7,
      },
    });

    return response.text || "Gagal menjana analisis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gangguan sambungan AI. Sila cuba lagi kemudian.";
  }
};
