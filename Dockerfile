# Optional Docker image for self-hosted deployments.
# Vercel does not use this Dockerfile; production deploys run via GitHub Actions.
# ===== E-Commerce (Node.js + Express + EJS + Sequelize) =====
FROM node:24-alpine

ENV NODE_ENV=production
WORKDIR /app

# 1) Cài dependency trước -> tận dụng cache layer (chỉ cài lại khi package*.json đổi)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 2) Copy source code (node_modules, .env... đã bị .dockerignore loại)
COPY --chown=node:node . .

# 3) Thư mục ảnh sản phẩm phải ghi được bởi user "node" (multer lưu ảnh vào đây)
RUN mkdir -p public/uploads/products && chown -R node:node public/uploads

# 4) Không chạy app bằng root
USER node

EXPOSE 3000

# App khởi động chậm lần đầu (sync DB + seed dữ liệu) nên start-period để dài
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1:3000/ || exit 1

# Chạy node trực tiếp (không qua npm) để nhận tín hiệu SIGTERM đúng cách
CMD ["node", "app.js"]
