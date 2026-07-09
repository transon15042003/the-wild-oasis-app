/**
 * Downloads cabin images and uploads them to Supabase Storage.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node scripts/upload-cabin-images.mjs
 *
 * Get the service role key from:
 * Supabase Dashboard -> Project Settings -> API -> service_role (secret)
 */

import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import path from "node:path";

const SUPABASE_URL =
    process.env.SUPABASE_URL || "https://tpzkqxwytqlubdvdszlz.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
    console.error("Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY before running.");
    process.exit(1);
}
const SOURCE_BASE =
    "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/cabin-images";
const BUCKET = "cabin_images";
const TEMP_DIR = path.join(process.cwd(), ".tmp-cabin-images");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
});

const images = Array.from({ length: 8 }, (_, i) => {
    const num = String(i + 1).padStart(3, "0");
    return `cabin-${num}.jpg`;
});

await mkdir(TEMP_DIR, { recursive: true });

try {
    for (const fileName of images) {
        const sourceUrl = `${SOURCE_BASE}/${fileName}`;
        const tempPath = path.join(TEMP_DIR, fileName);

        console.log(`Downloading ${fileName}...`);
        const response = await fetch(sourceUrl);
        if (!response.ok) {
            throw new Error(`Failed to download ${sourceUrl}: ${response.status}`);
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        await writeFile(tempPath, buffer);

        console.log(`Uploading ${fileName}...`);
        const fileData = await readFile(tempPath);
        const { error } = await supabase.storage
            .from(BUCKET)
            .upload(fileName, fileData, {
                contentType: "image/jpeg",
                upsert: true,
            });

        if (error) {
            throw new Error(`Upload failed for ${fileName}: ${error.message}`);
        }

        console.log(`Uploaded ${fileName}`);
    }

    console.log("All cabin images uploaded successfully.");
} finally {
    await rm(TEMP_DIR, { recursive: true, force: true });
}
