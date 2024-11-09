/* eslint-disable @typescript-eslint/no-require-imports */
// app/api/upload/route.ts (Next.js 13.4+ API routes)

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    // إزالة البيانات غير الضرورية مثل قاعدة بيانات Base64
    const base64Data = image.split(",")[1]; // فصل base64 عن البيانات الأخرى

    // تحويل الصورة إلى buffer وحفظها
    const buffer = Buffer.from(base64Data, "base64");

    // حفظ الصورة في النظام (أو إرسالها إلى خدمة تخزين مثل S3 أو Firebase)
    // هذا مجرد مثال لحفظ الصورة محليًا
    const filePath = `./public/uploads/watermarked-image.png`;

    // حفظ الصورة على الخادم
    const fs = require("fs");
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Error during image upload", error);
    return NextResponse.json({ message: "Failed to upload image" }, { status: 500 });
  }
}
