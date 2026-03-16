import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Chính sách bảo mật — Staywise",
  description: "Chính sách bảo mật và quyền riêng tư của Staywise",
};

const LAST_UPDATED = "01/01/2025";

const sections = [
  {
    title: "1. Thông tin chúng tôi thu thập",
    content: `Chúng tôi thu thập các loại thông tin sau khi bạn sử dụng Staywise:

Thông tin bạn cung cấp trực tiếp:
- Thông tin tài khoản: họ tên, địa chỉ email, số điện thoại, mật khẩu
- Thông tin đặt phòng: ngày nhận/trả phòng, số lượng người lớn và trẻ em, yêu cầu đặc biệt
- Thông tin khách lưu trú: họ tên, email và số điện thoại người đặt phòng
- Thông tin thanh toán: được xử lý hoàn toàn bởi Stripe — Staywise không lưu trữ số thẻ hoặc thông tin tài chính
- Nội dung đánh giá, nhận xét và xếp hạng bạn gửi sau khi lưu trú

Thông tin thu thập tự động:
- Địa chỉ IP, loại trình duyệt, hệ điều hành và thiết bị
- Trang bạn truy cập, thời gian, nguồn truy cập và hành vi điều hướng
- Cookie phiên làm việc và token xác thực (được quản lý bởi Better Auth)
- Dữ liệu phiên tạm thời lưu trong Redis để duy trì trạng thái đặt phòng`,
  },
  {
    title: "2. Cách chúng tôi sử dụng thông tin",
    content: `Thông tin thu thập được sử dụng để:

- Xử lý, xác nhận và quản lý đặt phòng của bạn
- Gửi email xác nhận đặt phòng, nhắc nhở check-in và thông báo trạng thái qua Resend
- Xử lý hoàn tiền tự động qua Stripe khi huỷ đặt phòng đủ điều kiện
- Hiển thị lịch sử đặt phòng và đánh giá trong tài khoản của bạn
- Hỗ trợ khách hàng và giải quyết tranh chấp
- Phát hiện và ngăn chặn gian lận, lạm dụng dịch vụ (bao gồm rate limiting)
- Cải thiện chất lượng dịch vụ và trải nghiệm tìm kiếm khách sạn
- Tuân thủ nghĩa vụ pháp lý và kế toán

Chúng tôi không sử dụng thông tin của bạn cho mục đích quảng cáo bên thứ ba mà không có sự đồng ý rõ ràng.`,
  },
  {
    title: "3. Chia sẻ thông tin",
    content: `Staywise chỉ chia sẻ thông tin của bạn với các đối tác cần thiết để cung cấp dịch vụ:

- Khách sạn nơi bạn đặt phòng: họ tên, thông tin liên lạc, ngày lưu trú và yêu cầu đặc biệt
- Stripe: xử lý thanh toán và hoàn tiền an toàn (PCI DSS Level 1)
- Resend: gửi email giao dịch như xác nhận đặt phòng, yêu cầu đánh giá
- Uploadthing: lưu trữ hình ảnh khách sạn và phòng được tải lên
- Upstash: lưu trữ cache và quản lý giới hạn tốc độ truy cập ẩn danh

Chúng tôi KHÔNG bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba cho mục đích marketing.

Chúng tôi có thể tiết lộ thông tin khi có yêu cầu hợp pháp từ cơ quan nhà nước hoặc để bảo vệ quyền lợi và an toàn của người dùng.`,
  },
  {
    title: "4. Cookie và công nghệ lưu trữ phiên",
    content: `Chúng tôi sử dụng cookie và các công nghệ tương tự để:

Cookie cần thiết (không thể tắt):
- Duy trì phiên đăng nhập (quản lý bởi Better Auth)
- Ghi nhớ trạng thái tìm kiếm, bộ lọc và ngày đặt phòng
- Bảo mật và chống giả mạo yêu cầu (CSRF)
- Khoá tạm thời phòng trong quá trình thanh toán (tối đa 15 phút, lưu trong Redis)

Cookie phân tích (có thể từ chối):
- Phân tích lưu lượng và hành vi người dùng ẩn danh
- Cải thiện hiệu suất trang web và kết quả tìm kiếm

Bạn có thể kiểm soát cookie qua cài đặt trình duyệt. Tuy nhiên, việc tắt cookie cần thiết có thể ảnh hưởng đến tính năng đặt phòng và đăng nhập.`,
  },
  {
    title: "5. Bảo mật dữ liệu",
    content: `Chúng tôi áp dụng các biện pháp kỹ thuật phù hợp để bảo vệ thông tin của bạn:

- Mã hoá SSL/TLS cho toàn bộ dữ liệu truyền tải
- Mật khẩu được băm an toàn, không bao giờ lưu dạng plaintext
- Thanh toán xử lý qua Stripe với chứng nhận PCI DSS Level 1
- Giới hạn tốc độ yêu cầu (rate limiting) để ngăn chặn lạm dụng và tấn công
- Khoá phòng tạm thời bằng token duy nhất trong quá trình thanh toán
- Quyền truy cập dữ liệu bị hạn chế theo vai trò (admin / khách hàng)
- Sao lưu dữ liệu định kỳ với PostgreSQL

Mặc dù chúng tôi nỗ lực bảo vệ thông tin, không có hệ thống nào đảm bảo an toàn tuyệt đối. Vui lòng thông báo ngay nếu phát hiện dấu hiệu truy cập trái phép vào tài khoản của bạn.`,
  },
  {
    title: "6. Thời gian lưu trữ dữ liệu",
    content: `Chúng tôi lưu trữ thông tin của bạn trong thời gian cần thiết để cung cấp dịch vụ:

- Thông tin tài khoản: đến khi bạn xoá tài khoản
- Lịch sử đặt phòng và thanh toán: 7 năm (theo quy định kế toán)
- Đánh giá khách sạn: đến khi bạn yêu cầu xoá
- Dữ liệu cache Redis (phiên tạm thời): tự động hết hạn sau 15 phút đến 24 giờ
- Log hệ thống và giám sát: 90 ngày
- Dữ liệu phân tích ẩn danh: tối đa 2 năm

Sau khi bạn xoá tài khoản, chúng tôi sẽ ẩn danh hoá hoặc xoá thông tin cá nhân trong vòng 30 ngày, ngoại trừ dữ liệu cần giữ lại theo nghĩa vụ pháp lý.`,
  },
  {
    title: "7. Quyền của bạn",
    content: `Bạn có các quyền sau đối với dữ liệu cá nhân của mình:

- Quyền truy cập: xem lịch sử đặt phòng, thanh toán và đánh giá trong tài khoản
- Quyền chỉnh sửa: cập nhật họ tên, số điện thoại và ảnh đại diện trong phần Cài đặt
- Quyền xoá: xoá tài khoản và toàn bộ dữ liệu liên quan trực tiếp trong ứng dụng
- Quyền từ chối: huỷ đăng ký nhận email marketing bất kỳ lúc nào qua link trong email
- Quyền di chuyển dữ liệu: liên hệ để nhận bản sao dữ liệu ở định dạng có thể đọc máy

Để thực hiện các quyền trên, bạn có thể thao tác trực tiếp tại trang Tài khoản hoặc liên hệ privacy@staywise.vn.`,
  },
  {
    title: "8. Trẻ em",
    content: `Dịch vụ Staywise không dành cho người dưới 18 tuổi. Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em.

Nếu bạn phát hiện người dưới 18 tuổi đã tạo tài khoản hoặc cung cấp thông tin cá nhân cho chúng tôi, vui lòng liên hệ ngay để chúng tôi xoá thông tin đó.`,
  },
  {
    title: "9. Thay đổi chính sách",
    content: `Chúng tôi có thể cập nhật Chính sách bảo mật này định kỳ. Khi có thay đổi quan trọng, chúng tôi sẽ:

- Thông báo qua email đến địa chỉ đăng ký tài khoản
- Hiển thị thông báo nổi bật trên trang web
- Cập nhật ngày "Cập nhật lần cuối" ở đầu trang

Việc tiếp tục sử dụng dịch vụ sau khi chính sách được cập nhật đồng nghĩa với việc bạn chấp nhận chính sách mới.`,
  },
  {
    title: "10. Liên hệ",
    content: `Nếu bạn có câu hỏi hoặc yêu cầu liên quan đến quyền riêng tư, vui lòng liên hệ:

Email: privacy@staywise.vn
Địa chỉ: Tầng 10, Toà nhà Innovation, 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
Điện thoại: 1800 1234 (miễn phí, 8:00–22:00 hàng ngày)

Chúng tôi cam kết phản hồi trong vòng 72 giờ làm việc.`,
  },
];

const PrivacyPage = () => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-4 h-4 text-primary" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Chính sách bảo mật
      </h1>
    </div>
    <p className="text-sm text-muted-foreground ml-12 mb-8">
      Cập nhật lần cuối: {LAST_UPDATED}
    </p>

    <div className="bg-muted/40 border border-border rounded-xl p-4 mb-8 text-sm text-muted-foreground leading-relaxed">
      Staywise cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích
      cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi
      sử dụng nền tảng đặt phòng khách sạn.
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

export default PrivacyPage;
