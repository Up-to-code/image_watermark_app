"use client";
import React, { useState, ChangeEvent, useRef } from "react";

const ImageWithLogoUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle Image Upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Logo to Image
  const addLogoToImage = () => {
    if (!image || !logo) return;

    setLoading(true); // Start loading while processing the image

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const logoImg = new Image();

    // Load main image
    img.onload = () => {
      logoImg.onload = () => {
        // Draw main image onto canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Draw logo on top
        const logoWidth = 120; // Logo width
        const logoHeight = 120; // Logo height
        const xPos = (canvas.width - logoWidth) / 2;
        const yPos = (canvas.height - logoHeight) / 2;

        ctx.globalAlpha = 0.5; // Set logo opacity
        ctx.drawImage(logoImg, xPos, yPos, logoWidth, logoHeight);
        setWatermarkedImage(canvas.toDataURL()); // Save the canvas image as base64

        setLoading(false); // Stop loading once processing is done
      };
      logoImg.src = logo; // Set logo image source
    };
    img.src = image; // Set main image source
  };

  // Download watermarked image
  const downloadImage = () => {
    if (!watermarkedImage) return;

    const link = document.createElement("a");
    link.href = watermarkedImage;
    link.download = "watermarked-image.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="max-w-screen-lg w-full text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          أضف الشعار إلى الصورة
        </h1>
        <p className="text-lg text-gray-600">
          حمّل صورتك، ثم حمّل الشعار لإضافته على الصورة.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 max-w-screen-lg w-full">
        {/* Image Upload */}
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="p-3 bg-white border-2 border-gray-300 rounded-md shadow-md hover:border-blue-500 transition-all duration-300 mb-6 w-72"
          />
          {image && (
            <div className="relative">
              <img
                src={image}
                alt="Uploaded"
                className="w-96 h-96 object-cover border-4 border-gray-300 rounded-lg shadow-lg"
              />
              <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full opacity-75">
                صورة تم تحميلها
              </p>
            </div>
          )}
        </div>

        {/* Logo Upload */}
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="p-3 bg-white border-2 border-gray-300 rounded-md shadow-md hover:border-blue-500 transition-all duration-300 mb-6 w-72"
          />
          {logo && (
            <div className="relative">
              <img
                src={logo}
                alt="Logo"
                className="w-24 h-24 object-contain mb-4 opacity-50"
              />
              <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 text-sm rounded-full">
                شعار تم تحميله
              </p>
            </div>
          )}
        </div>

        {/* Add Logo to Image */}
        {image && logo && !loading && (
          <button
            onClick={addLogoToImage}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            إضافة الشعار إلى الصورة
          </button>
        )}
        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-blue-600 rounded-full"></div>
            <p className="ml-2 text-gray-500">جارٍ المعالجة...</p>
          </div>
        )}

        {/* Show Watermarked Image */}
        {watermarkedImage && !loading && (
          <div className="mt-8 text-center">
            <img
              src={watermarkedImage}
              alt="Watermarked Image"
              className="w-96 h-96 object-cover border-4 border-gray-300 rounded-lg shadow-xl mb-6"
            />
            <button
              onClick={downloadImage}
              className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300"
            >
              تحميل الصورة
            </button>
          </div>
        )}
      </div>

      {/* Canvas element for logo addition */}
      <canvas ref={canvasRef} width={500} height={500} className="hidden" />
    </div>
  );
};

export default ImageWithLogoUpload;
