import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng — Staywise",
  description: "Điều khoản và điều kiện sử dụng dịch vụ Staywise",
};

const LAST_UPDATED = "01/01/2025";

const sections = [
  {
    title: "1. Chấp nhận điều khoản",
    content: `Bằng việc truy cập hoặc sử dụng dịch vụ Staywise, bạn đồng ý bị ràng buộc bởi các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, bạn không được phép sử dụng dịch vụ của chúng tôi.

Staywise có quyền sửa đổi các điều khoản này vào bất kỳ lúc nào. Chúng tôi sẽ thông báo cho bạn về các thay đổi quan trọng qua email hoặc thông báo trên nền tảng.`,
  },
  {
    title: "2. Mô tả dịch vụ",
    content: `Staywise là nền tảng đặt phòng khách sạn trực tuyến, cung cấp:

- Tìm kiếm và so sánh khách sạn trên toàn quốc
- Đặt phòng trực tuyến an toàn qua cổng thanh toán Stripe
- Quản lý đặt phòng và lịch sử lưu trú
- Hệ thống đánh giá và phản hồi từ khách hàng thực tế

Chúng tôi đóng vai trò là trung gian giữa khách hàng và cơ sở lưu trú. Staywise không trực tiếp sở hữu hay vận hành các khách sạn được liệt kê trên nền tảng.`,
  },
  {
    title: "3. Tài khoản người dùng",
    content: `Để sử dụng đầy đủ các tính năng, bạn cần tạo tài khoản với thông tin chính xác và đầy đủ. Bạn có trách nhiệm:

- Bảo mật thông tin đăng nhập và mật khẩu
- Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép
- Chịu trách nhiệm về mọi hoạt động diễn ra dưới tài khoản của bạn

Staywise có quyền tạm ngừng hoặc chấm dứt tài khoản vi phạm điều khoản sử dụng.`,
  },
  {
    title: "4. Chính sách đặt phòng và thanh toán",
    content: `Khi đặt phòng, bạn đồng ý với các điều kiện sau:

- Thông tin đặt phòng (tên, ngày, số khách) phải chính xác
- Thanh toán được xử lý an toàn qua Stripe
- Đặt phòng được xác nhận ngay sau khi thanh toán thành công
- Phòng được giữ trong 15 phút kể từ khi bắt đầu quy trình thanh toán

Staywise không chịu trách nhiệm về sai sót do người dùng cung cấp thông tin không chính xác.`,
  },
  {
    title: "5. Chính sách huỷ và hoàn tiền",
    content: `Chính sách huỷ phòng phụ thuộc vào từng khách sạn và được hiển thị rõ ràng trước khi đặt phòng.

Đối với các đặt phòng đủ điều kiện huỷ:
- Hoàn tiền đầy đủ nếu huỷ trong thời hạn cho phép
- Thời gian hoàn tiền về tài khoản: 5–10 ngày làm việc tùy ngân hàng
- Không hoàn tiền nếu huỷ sau thời hạn quy định hoặc không đến nhận phòng (no-show)

Trong trường hợp khách sạn không thể cung cấp phòng đã đặt, chúng tôi sẽ hỗ trợ tìm phòng thay thế hoặc hoàn tiền đầy đủ.`,
  },
  {
    title: "6. Quyền sở hữu trí tuệ",
    content: `Toàn bộ nội dung trên nền tảng Staywise — bao gồm logo, thiết kế, văn bản, hình ảnh và phần mềm — thuộc quyền sở hữu của Staywise hoặc các đối tác được cấp phép.

Bạn không được phép sao chép, phân phối, chỉnh sửa hoặc sử dụng thương mại bất kỳ nội dung nào mà không có sự cho phép bằng văn bản từ chúng tôi.

Hình ảnh khách sạn được cung cấp bởi các đối tác và chủ sở hữu của họ. Staywise không chịu trách nhiệm về tính chính xác của hình ảnh.`,
  },
  {
    title: "7. Giới hạn trách nhiệm",
    content: `Staywise cung cấp dịch vụ "nguyên trạng" và không bảo đảm dịch vụ hoạt động liên tục, không có lỗi.

Chúng tôi không chịu trách nhiệm về:
- Tổn thất gián tiếp phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ
- Hành động hoặc thiếu sót của các cơ sở lưu trú đối tác
- Lỗi kỹ thuật hoặc gián đoạn dịch vụ ngoài tầm kiểm soát của chúng tôi

Trách nhiệm tối đa của Staywise trong bất kỳ trường hợp nào không vượt quá giá trị đặt phòng liên quan.`,
  },
  {
    title: "8. Luật áp dụng",
    content: `Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại Tòa án nhân dân có thẩm quyền tại Việt Nam.

Nếu bất kỳ điều khoản nào bị coi là không hợp lệ hoặc không thể thi hành, các điều khoản còn lại vẫn có hiệu lực đầy đủ.`,
  },
  {
    title: "9. Liên hệ",
    content: `Nếu bạn có câu hỏi về Điều khoản sử dụng, vui lòng liên hệ:

Email: legal@staywise.vn
Địa chỉ: Tầng 10, Toà nhà Innovation, 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
Điện thoại: 1800 1234 (miễn phí, 8:00–22:00 hàng ngày)`,
  },
];

const TermsPage = () => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4 text-primary" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Điều khoản sử dụng
      </h1>
    </div>
    <p className="text-sm text-muted-foreground ml-12 mb-8">
      Cập nhật lần cuối: {LAST_UPDATED}
    </p>

    <div className="bg-muted/40 border border-border rounded-xl p-4 mb-8 text-sm text-muted-foreground leading-relaxed">
      Vui lòng đọc kỹ các điều khoản này trước khi sử dụng dịch vụ Staywise.
      Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận các điều
      khoản dưới đây.
    </div>

    <div className="space-y-8">
      {sections.map((section, i) => (
        <div key={i}>
          <h2 className="text-base font-semibold mb-3 text-foreground">
            {section.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {section.content}
          </p>
          {i < sections.length - 1 && <Separator className="mt-8 bg-border" />}
        </div>
      ))}
    </div>
  </div>
);

export default TermsPage;
