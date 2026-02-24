# 🃏 Ghi Điểm Đánh Bài - Không Quảng Cáo

Ứng dụng ghi điểm đánh bài miễn phí, không quảng cáo. Theo dõi điểm số, quản lý sòng bài và xem lịch sử chi tiết.

## ✨ Tính năng

- **Tạo sòng** — Đặt tên sòng, thêm người chơi và bắt đầu ngay
- **Bảng điểm** — Nhập điểm từng ván, chỉnh sửa hoặc xóa ván bất kỳ
- **Kết thúc sòng** — Popup thống kê xếp hạng và người chiến thắng
- **Lịch sử sòng** — Xem lại chi tiết từng sòng đã chơi (điểm, thời gian, số ván)
- **Thống kê** — Tổng số ván, Vua sòng (người thắng nhiều nhất)
- **Tùy chỉnh** — Chế độ tối, chọn màu chủ đạo
- **Xóa dữ liệu** — Xóa toàn bộ lịch sử, giữ lại cài đặt
- **Offline** — Dữ liệu lưu trên máy (localStorage), không cần đăng nhập

## 🛠️ Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |

## 🚀 Chạy local

```bash
# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

## 📁 Cấu trúc

```
src/
├── App.tsx              # Component chính, quản lý state & routing
├── types.ts             # TypeScript types (Player, Match, MatchRound)
├── index.css            # Tailwind config & custom styles
├── main.tsx             # Entry point
└── components/
    ├── Home.tsx         # Trang chủ, thống kê
    ├── Scoreboard.tsx   # Bảng điểm & nhập điểm từng ván
    ├── ScoreEntry.tsx   # Modal nhập/sửa điểm
    ├── CreateMatch.tsx  # Modal tạo sòng mới
    ├── MatchHistory.tsx # Lịch sử & chi tiết sòng
    ├── Players.tsx      # Danh sách người chơi
    ├── Settings.tsx     # Cài đặt (giao diện, xóa dữ liệu)
    └── Onboarding.tsx   # Màn hình chào lần đầu
```

## 📄 License

MIT
