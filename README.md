
# 🌐 Website Monitoring Tool  

A lightweight, containerized website monitoring tool built with **Node.js, Express, and Docker**.  
It periodically checks multiple websites’ availability and provides a secure admin panel to manage monitored URLs.  

---

## 🚀 Features  

- ✅ Add / remove websites to monitor via **Admin Dashboard**  
- ✅ Email alerts when a website goes **DOWN**  
- ✅ **Cron-based checks** every 15 minutes (configurable)  
- ✅ Secure **Admin Login** with bcrypt-hashed password  
- ✅ Automatic **session timeout** for security  
- ✅ Dockerized for easy deployment  
- ✅ Works with **Office365 / Gmail SMTP** or any SMTP server  

---

## 🛠️ Tech Stack  

- [Node.js](https://nodejs.org/)  
- [Express.js](https://expressjs.com/)  
- [EJS](https://ejs.co/) templating  
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) for password hashing  
- [node-cron](https://github.com/node-cron/node-cron) for scheduled checks  
- [Docker](https://www.docker.com/) for containerization  

---

## ⚙️ Setup & Installation  

### 1️⃣ Clone the Repository  

```bash
git clone https://github.com/yourusername/website-monitoring-tool.git
cd website-monitoring-tool
```

### 2️⃣ Install Dependencies  

```bash
npm install
```

### 3️⃣ Configure Environment Variables  

Copy the provided `.env.example` to `.env` and update with your own values:  

```bash
cp .env.example .env
```

🔑 **Generate a bcrypt password hash**:  

```bash
node -e 'require("bcrypt").hash("YourPasswordHere", 10).then(console.log)'
```

Replace `ADMIN_PASSWORD_HASH` in `.env` with the generated hash.

---

### 4️⃣ Run Locally  

```bash
npm start
```

App runs on: [http://localhost:1234](http://localhost:1234)

---

### 5️⃣ Docker Deployment  

Build and run using Docker Compose:  

```bash
docker compose up -d --build
```

Check logs:  

```bash
docker logs website-monitor
```

---

## 🔐 Default Admin Login  

- **Email:** as set in `.env` (`ADMIN_EMAIL`)  
- **Password:** plaintext password used for hashing  

---

## 🖥️ Screenshots  

*(Add screenshots of login page, dashboard, and monitoring results here)*  

---

## 🛡️ Security  

- Do **NOT** commit your `.env` file  
- Use strong SMTP credentials and bcrypt-hashed admin passwords  
- Use HTTPS when deploying publicly  

---

## 📜 License  

MIT License – free to use and modify.  
