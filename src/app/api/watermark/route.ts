// app/api/watermark/route.ts
import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

interface WatermarkRequest {
  image: string;
  watermarkText: string;
}

export async function POST(req: NextRequest) {
  const { image, watermarkText } = (await req.json()) as WatermarkRequest;

  // تحويل الصورة إلى Buffer
  const buffer = Buffer.from(image.split(",")[1], "base64");

  // إضافة العلامة المائية
  const editedImage = await sharp(buffer)
    .composite([
      {
        input: Buffer.from(
          `<svg>
            <text x="10" y="50" font-size="30" fill="white" opacity="0.5">${watermarkText}</text>
          </svg>`
        ),
        gravity: "southeast",
      },
    ])
    .png()
    .toBuffer();

  // تحويل الصورة المعدلة إلى Base64
  const base64Image = `data:image/png;base64,${editedImage.toString("base64")}`;

  return NextResponse.json({ image: base64Image });
}
