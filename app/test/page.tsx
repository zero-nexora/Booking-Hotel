import { generateQRBase64 } from "@/lib/qr-code";
import { Img } from "@react-email/components";

const NotFound = async () => {
  const base64 = await generateQRBase64(
    "http://localhost:3000/" +
      "cmmu63to0000104lah1jlqsmu",
  );
  return (
    <Img src={base64} width={160} height={160} alt={`QR xác minh đặt phòng`} />
  );
};

export default NotFound;
