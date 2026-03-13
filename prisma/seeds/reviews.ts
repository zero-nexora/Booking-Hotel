import { prisma } from "./client";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDate(date: Date): Date {
  return new Date(date.toISOString().split("T")[0]);
}

async function createBookingAndReview(opts: {
  userId: string;
  hotelId: string;
  roomId: string;
  roomBasePrice: number;
  nights: number;
  ciOffset: number;
  guestName: string;
  guestEmail: string;
  overallRating: number;
  title: string;
  comment: string;
  status: string;
}) {
  const today = toDate(new Date());
  const checkIn = addDays(today, opts.ciOffset);
  const checkOut = addDays(checkIn, opts.nights);
  const total = opts.roomBasePrice * opts.nights;

  const booking = await prisma.booking.create({
    data: {
      userId: opts.userId,
      hotelId: opts.hotelId,
      status: "CHECKED_OUT",
      paymentStatus: "PAID",
      guestName: opts.guestName,
      guestEmail: opts.guestEmail,
      checkIn,
      checkOut,
      totalAmount: total,
      currency: "USD",
      items: {
        create: [
          {
            roomId: opts.roomId,
            checkIn,
            checkOut,
            nights: opts.nights,
            adults: 2,
            children: 0,
            unitPrice: opts.roomBasePrice,
            total,
            currency: "USD",
            status: "CHECKED_OUT",
          },
        ],
      },
      payments: {
        create: [
          {
            userId: opts.userId,
            type: "CHARGE",
            status: "PAID",
            amount: total,
            currency: "USD",
            stripePaymentIntentId: `pi_rev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            paidAt: addDays(checkIn, -7),
          },
        ],
      },
    },
  });

  return prisma.review.create({
    data: {
      bookingId: booking.id,
      hotelId: opts.hotelId,
      userId: opts.userId,
      overallRating: opts.overallRating,
      title: opts.title,
      comment: opts.comment,
      status: opts.status as any,
    },
  });
}

export async function seedReviews(
  users: Record<string, { id: string }>,
  bookings: Record<string, { id: string; hotelId: string }>,
  hotels: Record<string, { id: string }>,
  rooms: { id: string; hotelId: string; basePrice: any; slug: string }[],
) {
  const { customer1, customer2, customer3, customer4, customer5 } =
    users as any;

  const findRoom = (slug: string) => {
    const r = rooms.find((r) => r.slug === slug);
    if (!r) throw new Error(`Room not found: ${slug}`);
    return r;
  };

  const metropoleId = hotels["sofitel-legend-metropole-hanoi"].id;

  const metropoleReviews = [
    {
      userId: customer1.id,
      roomSlug: "classic-room",
      nights: 3,
      ciOffset: -200,
      guestName: "Nguyen Van An",
      guestEmail: "nguyenvanan@gmail.com",
      overallRating: 5,
      title: "Bước vào thiên đường giữa lòng Hà Nội",
      comment:
        "Metropole xứng đáng là khách sạn huyền thoại của Hà Nội. Phòng Classic Wing tỏa ra vẻ đẹp thực dân Pháp tinh tế, dịch vụ hoàn hảo từng chi tiết. Bể bơi tuyệt vời và nhà hàng Le Beaulieu phục vụ bữa sáng đáng nhớ nhất trong cuộc đời. Nhất định sẽ quay lại!",
      status: "APPROVED",
    },
    {
      userId: customer2.id,
      roomSlug: "prestige-room-pool-wing",
      nights: 4,
      ciOffset: -190,
      guestName: "Tran Thi Bich",
      guestEmail: "tranthibich@gmail.com",
      overallRating: 5,
      title: "Khách sạn đỉnh cao, dịch vụ không chê được",
      comment:
        "Lần đầu ở Metropole và thực sự bị chinh phục hoàn toàn. Pool Wing cực kỳ sang trọng, bể bơi ngoài trời thơ mộng giữa lòng Hà Nội náo nhiệt. Nhân viên chăm sóc từng chi tiết nhỏ — từ việc nhớ tên khách đến chuẩn bị đúng loại trà yêu thích vào buổi sáng. Điểm sáng tuyệt đối.",
      status: "APPROVED",
    },
    {
      userId: customer3.id,
      roomSlug: "classic-room",
      nights: 5,
      ciOffset: -180,
      guestName: "David Chen",
      guestEmail: "david.chen@email.com",
      overallRating: 5,
      title: "The most atmospheric hotel I've ever stayed in",
      comment:
        "Staying at the Metropole felt like stepping back into French Indochina. The colonial corridors, the ceiling fans slowly turning, the smell of frangipani in the garden courtyard — it's an experience, not just a hotel stay. Our Classic Wing room was romantic and perfectly maintained. The wartime bunker tour was a bonus we didn't expect to love as much as we did.",
      status: "APPROVED",
    },
    {
      userId: customer4.id,
      roomSlug: "grand-suite-metropole",
      nights: 6,
      ciOffset: -170,
      guestName: "Sophie Martin",
      guestEmail: "sophie.martin@email.fr",
      overallRating: 5,
      title: "L'âme de Hanoi dans une suite majestueuse",
      comment:
        "La Grand Suite dépasse tout ce qu'on pouvait imaginer. Les parquets en bois ciré, les moulures au plafond, le service de majordome irréprochable... On se sent comme un diplomate des années 30. Le restaurant Le Beaulieu offre une cuisine française mémorable. Notre meilleur séjour en Asie du Sud-Est, sans hésitation.",
      status: "APPROVED",
    },
    {
      userId: customer5.id,
      roomSlug: "classic-room",
      nights: 3,
      ciOffset: -160,
      guestName: "Yuki Tanaka",
      guestEmail: "yuki.tanaka@mail.jp",
      overallRating: 4,
      title: "歴史と現代が融合した素晴らしい滞在",
      comment:
        "ハノイのメトロポールは期待を超えていました。クラシックウィングの部屋はフランスコロニアル様式で美しく、スタッフの対応も丁寧でした。プールエリアは静かで癒しの空間。唯一の難点はWi-Fiが部屋によって不安定だったこと。それ以外は完璧な滞在でした。",
      status: "APPROVED",
    },
    {
      userId: customer1.id,
      roomSlug: "prestige-room-pool-wing",
      nights: 7,
      ciOffset: -150,
      guestName: "Nguyen Van An",
      guestEmail: "nguyenvanan@gmail.com",
      overallRating: 5,
      title: "Kỷ niệm 10 năm ngày cưới hoàn hảo",
      comment:
        "Vợ chồng tôi chọn Metropole để kỷ niệm 10 năm ngày cưới. Ban đầu lo ngại giá phòng nhưng quyết định chi mạnh và không hối hận một giây. Prestige Room với view bể bơi lãng mạn tuyệt đối. Nhân viên tự chuẩn bị hoa hồng và champagne trong phòng khi chúng tôi đến — không ai nhờ họ làm vậy. Đây mới là đẳng cấp dịch vụ thực sự.",
      status: "APPROVED",
    },
    {
      userId: customer2.id,
      roomSlug: "classic-room",
      nights: 4,
      ciOffset: -140,
      guestName: "Tran Thi Bich",
      guestEmail: "tranthibich@gmail.com",
      overallRating: 4,
      title: "Vị trí tuyệt vời, không gian đẳng cấp",
      comment:
        "Metropole nằm ngay trung tâm Hoàn Kiếm, đi bộ là đến Hồ Gươm và Phố Cổ. Phòng Classic đẹp, giữ được nét cổ điển nhưng đầy đủ tiện nghi hiện đại. Spa rất chuyên nghiệp. Trừ nửa sao vì giá đồ uống ở quầy bar khá cao so với mặt bằng Hà Nội, nhưng hiểu được vì đây là khách sạn 5 sao.",
      status: "APPROVED",
    },
    {
      userId: customer3.id,
      roomSlug: "prestige-room-pool-wing",
      nights: 5,
      ciOffset: -130,
      guestName: "David Chen",
      guestEmail: "david.chen@email.com",
      overallRating: 5,
      title: "Best pool in Hanoi, best service in Vietnam",
      comment:
        "I've stayed in many luxury hotels across Southeast Asia, and the Metropole's Prestige Pool Wing rooms are genuinely world-class. The pool is genuinely beautiful — not a rooftop gimmick, but a proper garden pool surrounded by heritage architecture. The concierge team arranged everything flawlessly: a cyclo tour, a cooking class, and dinner reservations with zero fuss.",
      status: "APPROVED",
    },
    {
      userId: customer4.id,
      roomSlug: "classic-room",
      nights: 3,
      ciOffset: -120,
      guestName: "Sophie Martin",
      guestEmail: "sophie.martin@email.fr",
      overallRating: 3,
      title: "Beau cadre, mais quelques déceptions",
      comment:
        "L'hôtel est magnifique et l'histoire palpable dans chaque couloir. Cependant, notre chambre donnait sur une cour intérieure bruyante en raison de travaux. Le service au spa était en dessous des attentes pour ce niveau de prix. Le petit-déjeuner, en revanche, était excellent. Un séjour mitigé qui aurait mérité mieux avec une chambre différente.",
      status: "APPROVED",
    },
    {
      userId: customer5.id,
      roomSlug: "grand-suite-metropole",
      nights: 4,
      ciOffset: -110,
      guestName: "Yuki Tanaka",
      guestEmail: "yuki.tanaka@mail.jp",
      overallRating: 5,
      title: "グランドスイートは人生最高の宿泊体験",
      comment:
        "グランドスイートに宿泊しました。75平米の広さはゆったりとしており、アンティーク家具と現代設備の融合が絶妙。バトラーサービスが終始丁寧で、チェックイン前から細やかな気遣いを感じました。ハノイの中心部でありながら、窓の外に広がる緑豊かな中庭の景色は都会を忘れさせてくれます。また必ず来たいと思います。",
      status: "APPROVED",
    },
    {
      userId: customer1.id,
      roomSlug: "classic-room",
      nights: 2,
      ciOffset: -100,
      guestName: "Nguyen Van An",
      guestEmail: "nguyenvanan@gmail.com",
      overallRating: 5,
      title: "Đến lần thứ 3 vẫn thấy như lần đầu",
      comment:
        "Đây là lần thứ ba tôi ở Metropole và không bao giờ thất vọng. Một vài nhân viên cũ vẫn còn đó và nhớ mặt tôi — đó là điều hiếm thấy ở bất kỳ khách sạn nào. Classic Room luôn được bảo trì xuất sắc. Bữa breakfast buffet phong phú, đặc biệt là phần bánh mì và pate kiểu Pháp.",
      status: "APPROVED",
    },
    {
      userId: customer2.id,
      roomSlug: "prestige-room-pool-wing",
      nights: 3,
      ciOffset: -90,
      guestName: "Tran Thi Bich",
      guestEmail: "tranthibich@gmail.com",
      overallRating: 5,
      title: "Spa Metropole — trải nghiệm không thể quên",
      comment:
        "Lần này ghé Metropole chủ yếu vì Spa và không hối hận. Gói massage 90 phút kết hợp kỹ thuật Đông-Tây thực sự xuất thần. Phòng Pool Wing nhìn xuống bể bơi xanh mát giữa khu vườn — buổi sáng thức dậy mở cửa ban công ra là ngay lập tức thấy khỏe người. Dịch vụ tuyệt hảo như mọi lần.",
      status: "APPROVED",
    },
    {
      userId: customer3.id,
      roomSlug: "classic-room",
      nights: 6,
      ciOffset: -80,
      guestName: "David Chen",
      guestEmail: "david.chen@email.com",
      overallRating: 4,
      title: "A classic that holds up",
      comment:
        "The Metropole is exactly what you want from a heritage hotel: genuine history, beautiful architecture, and service that still remembers the human touch. The Classic Wing room was quieter than expected — the thick colonial walls block street noise beautifully. Le Spa is exceptional. The only area I'd push them on is the gym, which is smaller than you'd expect for this tier.",
      status: "APPROVED",
    },
    {
      userId: customer4.id,
      roomSlug: "prestige-room-pool-wing",
      nights: 5,
      ciOffset: -70,
      guestName: "Sophie Martin",
      guestEmail: "sophie.martin@email.fr",
      overallRating: 5,
      title: "Séjour de rêve pour notre lune de miel",
      comment:
        "Nous avons choisi le Metropole pour notre lune de miel et c'était la meilleure décision possible. La chambre Prestige Pool Wing avec son accès direct à la piscine était parfaite. Le personnel a organisé une surprise romantique dans notre chambre avec des pétales de roses et du champagne. Le dîner au Spices Garden sous les étoiles était inoubliable.",
      status: "APPROVED",
    },
    {
      userId: customer5.id,
      roomSlug: "classic-room",
      nights: 4,
      ciOffset: -60,
      guestName: "Yuki Tanaka",
      guestEmail: "yuki.tanaka@mail.jp",
      overallRating: 4,
      title: "ハノイ観光の完璧な拠点",
      comment:
        "旧市街まで徒歩圏内で観光に非常に便利。クラシックルームはコロニアル調の内装が美しく、清潔感も申し分なし。コンシェルジュがハノイのおすすめスポットを丁寧に案内してくれました。唯一の注意点は、週末の朝食時間帯は混雑するため早めに行くことをおすすめします。",
      status: "APPROVED",
    },
    {
      userId: customer1.id,
      roomSlug: "grand-suite-metropole",
      nights: 3,
      ciOffset: -50,
      guestName: "Nguyen Van An",
      guestEmail: "nguyenvanan@gmail.com",
      overallRating: 5,
      title: "Grand Suite — xứng đáng từng đồng",
      comment:
        "Nhân dịp thăng chức, tôi quyết định thưởng cho mình một đêm ở Grand Suite Metropole. Không gian 75m² với nội thất cổ điển, butler phục vụ tận tình, champagne welcome — tất cả đều hoàn hảo. View nhìn ra vườn xanh mướt ngay giữa trung tâm Hà Nội là điều tôi không tưởng tượng ra được trước khi trực tiếp nhìn thấy.",
      status: "APPROVED",
    },
    {
      userId: customer2.id,
      roomSlug: "classic-room",
      nights: 2,
      ciOffset: -40,
      guestName: "Tran Thi Bich",
      guestEmail: "tranthibich@gmail.com",
      overallRating: 2,
      title: "Kỳ vọng quá cao, thực tế hơi hụt hẫng",
      comment:
        "Lần này ở Metropole cảm thấy không được như những lần trước. Phòng có mùi hơi ẩm, điều hòa kêu khá to lúc đêm. Khi phản ánh với lễ tân, họ xử lý chậm và không có lời xin lỗi chính thức. Bữa sáng vẫn ngon nhưng chất lượng dịch vụ tổng thể lần này giảm so với tiêu chuẩn của một khách sạn 5 sao. Hy vọng đây chỉ là ngày xui.",
      status: "APPROVED",
    },
    {
      userId: customer3.id,
      roomSlug: "prestige-room-pool-wing",
      nights: 7,
      ciOffset: -30,
      guestName: "David Chen",
      guestEmail: "david.chen@email.com",
      overallRating: 5,
      title: "Seven nights, zero complaints",
      comment:
        "A full week at the Metropole and I could genuinely have stayed longer. The Prestige Pool Wing room never felt cramped — if anything, the daily turn-down service made it feel freshly arrived every evening. The staff recognized us after day two and started anticipating our preferences: extra coffee at breakfast, local newspaper, preferred walking route to the lake. This is what 5-star truly means.",
      status: "APPROVED",
    },
    {
      userId: customer4.id,
      roomSlug: "classic-room",
      nights: 3,
      ciOffset: -25,
      guestName: "Sophie Martin",
      guestEmail: "sophie.martin@email.fr",
      overallRating: 4,
      title: "Une adresse mythique qui mérite sa réputation",
      comment:
        "Le Sofitel Legend Metropole est une institution qui mérite pleinement ses étoiles. L'architecture coloniale est magnifiquement préservée, les chambres sont élégantes sans être ostentatoires. Le Hanoi Social Club tout proche est une excellente recommandation du concierge. Un bémol mineur: le check-in a pris plus de 20 minutes malgré une réservation confirmée.",
      status: "APPROVED",
    },
    {
      userId: customer5.id,
      roomSlug: "prestige-room-pool-wing",
      nights: 5,
      ciOffset: -15,
      guestName: "Yuki Tanaka",
      guestEmail: "yuki.tanaka@mail.jp",
      overallRating: 5,
      title: "プールウィングは別格の贅沢",
      comment:
        "プレステージプールウィングは予想以上の素晴らしさでした。専用プールへのアクセスが部屋から直接できるため、朝の散歩がてらひと泳ぎするのが習慣になりました。スパも最高品質で、アロマセラピーマッサージは疲れを完全に癒してくれました。ハノイ訪問の際は必ずここに泊まると決めています。",
      status: "APPROVED",
    },
  ];

  const otherReviews: {
    bookingKey: string;
    userId: string;
    overallRating: number;
    title: string;
    comment: string;
    status: string;
  }[] = [
    {
      bookingKey: "booking2",
      userId: customer2.id,
      overallRating: 4,
      title: "Park Hyatt Saigon — đẳng cấp thật sự",
      comment:
        "Vị trí trung tâm quận 1 không thể tốt hơn. Phòng rộng rãi, thiết kế sang trọng pha lẫn nghệ thuật Việt Nam. Bể bơi ngoài trời tuyệt đẹp. Trừ một điểm vì dịch vụ phòng hơi chậm vào bữa tối, nhưng nhân viên rất thân thiện và nhanh chóng khắc phục.",
      status: "APPROVED",
    },
    {
      bookingKey: "booking3",
      userId: customer3.id,
      overallRating: 5,
      title: "Vegas done right — Bellagio never disappoints",
      comment:
        "The Fountain View King room is absolutely worth the upgrade. Waking up to the fountains every morning was surreal. The room itself is spacious, immaculately maintained, and the bed was incredibly comfortable. Spa was excellent, and the casino is right there when you're feeling lucky. Will definitely return.",
      status: "APPROVED",
    },
    {
      bookingKey: "booking4",
      userId: customer4.id,
      overallRating: 5,
      title: "Le Ritz — l'excellence parisienne incarnée",
      comment:
        "Séjour inoubliable à l'occasion de notre anniversaire de mariage. La chambre Vendôme était somptueuse, la vue sur la place magnifique. Le Bar Hemingway reste un moment suspendu dans le temps. Le service d'étage est d'une précision horlogère. Un investissement qui en vaut chaque centime.",
      status: "APPROVED",
    },
    {
      bookingKey: "booking5",
      userId: customer5.id,
      overallRating: 4,
      title: "The Peninsula — Tokyo's finest",
      comment:
        "The garden view room was serene and beautifully designed. Technology in the room is impressive — controls for everything at your fingertips. The deep soaking tub was a highlight after long days of sightseeing. The Peter restaurant downstairs is excellent. Minor note: breakfast was slightly overpriced for what was offered.",
      status: "APPROVED",
    },
    {
      bookingKey: "booking6",
      userId: customer1.id,
      overallRating: 5,
      title: "Fusion Maia — honeymoon perfection",
      comment:
        "We chose Fusion Maia for our honeymoon and it exceeded every expectation. The garden pool villa was completely private — our own little paradise. The all-inclusive spa is genius: we did treatments every single day. The staff decorated our villa with flowers and candles on arrival. Magical.",
      status: "APPROVED",
    },
    {
      bookingKey: "booking7",
      userId: customer2.id,
      overallRating: 4,
      title: "Mandarin Oriental Bangkok — timeless elegance",
      comment:
        "Staying at the MO Bangkok is a history lesson in hospitality. The riverside setting is incomparable — watching longboats glide past at sunset from the terrace is pure magic. Staff remembered our daughter's name every time. The Authors' Lounge afternoon tea is a must. The only slight negative: some rooms in the Authors' Wing could use refreshing.",
      status: "APPROVED",
    },
    {
      bookingKey: "booking8",
      userId: customer3.id,
      overallRating: 4,
      title: "Vinpearl Nha Trang — fantastic for families",
      comment:
        "Our kids absolutely loved it — the water park is incredible and they could have stayed there all day. The island setting via cable car is a unique experience. Ocean view room was clean and spacious with a great view. Food variety at the buffet was impressive. Would knock off one star only because the beach was crowded on weekends.",
      status: "APPROVED",
    },
    {
      bookingKey: "booking11",
      userId: customer1.id,
      overallRating: 5,
      title: "Trung tâm Sài Gòn, tầm nhìn triệu đô",
      comment:
        "Phòng Executive River View tại Liberty Central cho tầm nhìn sông Sài Gòn cực đỉnh. Giá cả hợp lý cho chất lượng này. Bể bơi rooftop đẹp, nhân viên nhiệt tình. Sẽ là địa chỉ yêu thích mỗi khi ghé Sài Gòn công tác.",
      status: "APPROVED",
    },
    {
      bookingKey: "booking12",
      userId: customer2.id,
      overallRating: 5,
      title: "Marina Bay Sands — bucket list complete!",
      comment:
        "Finally stayed at MBS and it lived up to all the hype. The SkyPark infinity pool at 57 floors up is an experience unlike anything else — swimming with the Singapore skyline stretching to the horizon. The city view room was modern and comfortable. The casino and shopping are dangerous for the wallet but irresistible!",
      status: "APPROVED",
    },
  ];

  const reviews = [];

  for (const def of metropoleReviews) {
    const room = findRoom(def.roomSlug);
    const review = await createBookingAndReview({
      userId: def.userId,
      hotelId: metropoleId,
      roomId: room.id,
      roomBasePrice: Number(room.basePrice),
      nights: def.nights,
      ciOffset: def.ciOffset,
      guestName: def.guestName,
      guestEmail: def.guestEmail,
      overallRating: def.overallRating,
      title: def.title,
      comment: def.comment,
      status: def.status,
    });
    reviews.push(review);
  }

  for (const def of otherReviews) {
    const booking = bookings[def.bookingKey];
    if (!booking) {
      console.warn(`Booking key not found: ${def.bookingKey}`);
      continue;
    }
    const existing = await prisma.review.findUnique({
      where: { bookingId: booking.id },
    });
    if (existing) continue;
    const review = await prisma.review.create({
      data: {
        bookingId: booking.id,
        hotelId: booking.hotelId,
        userId: def.userId,
        overallRating: def.overallRating,
        title: def.title,
        comment: def.comment,
        status: def.status as any,
      },
    });
    reviews.push(review);
  }

  console.log(
    `✅ ${reviews.length} reviews seeded (${metropoleReviews.length} for Sofitel Metropole Hanoi)`,
  );
  return reviews;
}
