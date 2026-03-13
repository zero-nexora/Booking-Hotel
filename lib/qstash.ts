import { Client } from "@upstash/qstash";
import { env } from "./env";

export const qstash = new Client({ token: env.QSTASH_TOKEN });

const APP_URL = env.NEXT_PUBLIC_APP_URL;

export const scheduleCrons = async () => {
  const schedules = qstash.schedules;

  const list = await schedules.list();
  const existingIds = list.map((s) => s.scheduleId);

  const cronConfigs = [
    {
      destination: `${APP_URL}/api/cron/expire-bookings`,
      cron: "*/5 * * * *",
      scheduleId: "expire-bookings",
    },
    {
      destination: `${APP_URL}/api/cron/checkin-reminder`,
      cron: "0 8 * * *",
      scheduleId: "checkin-reminder",
    },
    {
      destination: `${APP_URL}/api/cron/review-request`,
      cron: "0 10 * * *",
      scheduleId: "review-request",
    },
  ];

  await Promise.all(
    cronConfigs
      .filter((c) => existingIds.includes(c.scheduleId))
      .map((c) => schedules.delete(c.scheduleId)),
  );

  await Promise.all(cronConfigs.map((c) => schedules.create(c)));

  console.log(
    "Schedules created:",
    cronConfigs.map((c) => c.scheduleId),
  );
};
