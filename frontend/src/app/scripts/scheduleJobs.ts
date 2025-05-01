import path from "path";
import { Client } from "@upstash/qstash";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const qstash = new Client({
  token: process.env.QSTASH_TOKEN,
});

export async function scheduleJobs() {
  const baseUrl = process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_URL;

  if (!baseUrl)
    throw new Error(
      "❌ Missing NEXT_PUBLIC_URL or VERCEL_URL in environment variables.",
    );

  const jobs = [
    {
      url: `${baseUrl}/api/withdrawals`,
      cron: "* 1 * * *",
      id: "PierTwo-Withdrawals-Job",
    },
    {
      url: `${baseUrl}/api/deposits`,
      cron: "* 1 * * *",
      id: "PierTwo-Deposits-Job",
    },
  ];

  // Get existing schedules
  const existingSchedules = await qstash.schedules.list();

  for (const job of jobs) {
    try {
      // Check if schedule already exists
      const existingSchedule = existingSchedules.find(
        (schedule) => schedule.destination === job.url,
      );

      if (existingSchedule) continue;

      const response = await qstash.schedules.create({
        destination: job.url,
        cron: job.cron,
        retries: 3,
      });

      console.log(`✅ Scheduled job for ${job.url} with response:`, response);
    } catch (error) {
      console.error(`❌ Error scheduling job for ${job.url}:`, error);
      throw error;
    }
  }

  console.log("🎉 All jobs scheduled successfully.");
}

void scheduleJobs();
