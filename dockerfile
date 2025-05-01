# Gunakan image Node.js resmi yang ringan
FROM node:18-alpine

# Tentukan working directory dalam container
WORKDIR /app

# Salin file dependency terlebih dahulu (agar caching efisien)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Salin semua file ke dalam container
COPY . .

# Tentukan port yang digunakan oleh aplikasi (harus sesuai dengan app-mu)
EXPOSE 3000

# Command untuk menjalankan aplikasi
CMD ["npm", "start"]
