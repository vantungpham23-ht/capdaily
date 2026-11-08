# CapDaily — Každodenné Captiony

Trình tạo caption hàng ngày cho 5 ngành: **nails**, **hair-men**, **hair-women**, **restaurant**, **eyelash**.
Mỗi ngày mỗi category sinh **3 caption Slovak + 2 caption English**, kèm bản dịch tiếng Việt để đọc (không bị copy) và 5 hashtag.

## Caption ngắn, bắt trend

Caption được ghép từ 2 slot độc lập — `hook` + `tail`:

```
hook  +  tail  +  (season)  +  emoji
```

Mỗi caption chỉ **1 dòng, ~3-9 từ** — đúng format đang chạy trên Instagram / TikTok hiện nay.
Ví dụ:

```
short & sweet pozrite sa 😍
the cut that changes everything tag someone who needs this 🤍
mihalnice, ktoré neukážu look at this ✨
```

Trend word (`chrome nails`, `wolf cut`, `soft glam`…) được hiển thị thành **chip vàng** và có thể bật/tắt khi copy.

| Category | hooks × tails | Biến thể / ngôn ngữ |
|---|---|---|
| nails | 43 × 12 | 516 |
| hair-men | 43 × 12 | 516 |
| hair-women | 42 × 12 | 504 |
| restaurant | 39 × 12 | 468 |
| eyelash | 41 × 12 | 492 |

## Điểm nổi bật: không lặp lại trong 30 ngày

Cơ chế chọn caption có **3 lớp bảo đảm**, từ mạnh nhất đến dự phòng:

1. **Deterministic partition (không cần storage)** — danh sách ứng viên được xáo trộn 1 lần bằng seed cố định, rồi đi theo chu kỳ `slotStart = (daysSinceEpoch % cycleDays) * take`.
   Các lát cắt của một chu kỳ không chồng nhau ⇒ **0 lặp lại trong ≥30 ngày**, kể cả khi xóa cache hay đổi thiết bị.
2. **localStorage history** — lưu fingerprint của caption đã dùng (giữ 45 ngày), loại trừ mọi caption dùng trong 30 ngày gần nhất.
3. **Least-recently-used fallback** — nếu pool cạn, lấy caption lâu chưa dùng nhất.

Ngoài ra mỗi ngày còn xoay:
- **Trending topic** (14 chủ đề/category, xoay theo ngày)
- **Theme theo thứ trong tuần** (Thứ 2 → Chủ nhật)
- **Accent theo mùa** (12 tháng)
- **Emoji trang trí** (18 emoji) + **icon category** (12–16 emoji)
- **Hashtag** — 60% tiếng Anh + 40% tiếng bản địa, xoay ngẫu nhiên mỗi ngày

## Kiểm chứng

```bash
npm run verify:captions
```

Script mô phỏng 60 ngày (có và không có history) + 365 ngày (worst case) và assert **0 lặp lại** trong cửa sổ 30 ngày.

Kết quả hiện tại:

```
60 days, history enabled   → 1500 captions / 1500 unique  PASS
60 days, history disabled  → 1500 captions / 1500 unique  PASS
365 days, history disabled → 9125 captions / 9125 unique  PASS
```

## Lệnh

```bash
npm run dev              # dev server
npm run build            # static export -> out/
npm run typecheck        # tsc --noEmit
npm run lint             # eslint
npm run verify:captions  # test không trùng 30 ngày
```

## Cấu trúc

```
src/
├── app/page.tsx                 # trang chính + điều hướng ngày
├── components/
│   ├── CategorySection.tsx       # card category, filter SK/EN, copy all
│   └── CaptionCard.tsx           # hiển thị caption + dịch + trending chip
├── data/captions.ts             # slot templates, hashtag, trending, theme
├── lib/
│   ├── captionGenerator.ts       # engine ghép caption + chọn không trùng
│   ├── history.ts                # localStorage history (45 ngày)
│   └── date.ts                   # helper date (local time, không UTC)
└── types/index.ts
```

## Deploy

GitHub Actions (`.github/workflows/nextjs.yml`) build static export và publish lên GitHub Pages.
Cần bật **Settings → Pages → Source: GitHub Actions**.

> Lưu ý: dùng `output: "export"` trong `next.config.ts` — không có API route server-side.

## Copy format

```
<caption> <emoji>

#tag1 #tag2 #tag3 #tag4 #tag5
```

Bản dịch tiếng Việt chỉ hiển thị để đọc, **không bao giờ** được copy.

Bấm vào chip trending vàng để bật/tắt trend khi copy:

```
<caption>  · chrome nails <emoji>

#tag1 #tag2 #tag3 #tag4 #tag5
```
