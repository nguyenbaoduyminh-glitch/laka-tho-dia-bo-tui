# LaKa Demo App

Demo mobile web app HTML/CSS/JS có tích hợp AI Gemini qua Vercel API.

## Chạy thử nhanh
Mở `index.html` trong trình duyệt để xem giao diện. Khi chưa deploy Vercel hoặc chưa có key, app sẽ tự dùng dữ liệu demo.

## Deploy Vercel
1. Upload toàn bộ thư mục này lên GitHub.
2. Vào Vercel → Add New Project → Import repo.
3. Vào Settings → Environment Variables.
4. Thêm biến:

```txt
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

5. Deploy lại project.

## Cấu trúc
```txt
index.html
style.css
script.js
api/gemini.js
package.json
```
