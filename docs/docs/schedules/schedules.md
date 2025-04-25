---
sidebar_position: 3
---

# Schedules

We have some code that we need to execute at a specific time/interval. For this application we've decided to favour for the most part using Upstash.

​Upstash QStash is a serverless messaging and scheduling service designed to simplify message delivery in distributed systems. It acts as an intermediary between your application and target APIs, ensuring reliable message delivery with features like retries, delays, and scheduling.

### Scheduling with QStash

QStash allows you to schedule messages to be sent at specific times or intervals using CRON expressions. This is particularly useful for tasks like periodic data synchronization, scheduled notifications, or automated maintenance routines.

Each piece of code that we want to execute is configured inside a Next.js route, which is protected by out of the box authentication from Upstash.

Each route is then configured to be hit on the Upstash console by plugging in the URL and any headers we need. It's important to note that each schedule is pointing to the deployed Vercel app (main branch) so testing changes locally will require some changes here.