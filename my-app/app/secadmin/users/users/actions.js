"use server";
import fs from "fs";
export async function logData(data) {
  fs.writeFileSync("user_body_log.json", JSON.stringify(data, null, 2));
}
