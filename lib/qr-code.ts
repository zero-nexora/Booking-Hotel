import QRCode from "qrcode";

export const generateQRBase64 = (url: string): Promise<string> => {
  return QRCode.toDataURL(url, {
    width: 160,
    margin: 1,
    color: { dark: "#1A1612", light: "#FAF7F2" },
    errorCorrectionLevel: "M",
  });
};
