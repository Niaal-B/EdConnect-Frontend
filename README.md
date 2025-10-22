# 🌉 EdConnect — Bridging Students and Mentors Worldwide

EdConnect is a full-stack mentorship platform designed to connect students with verified mentors studying or working abroad.  
It helps students gain career guidance, academic insights, and confidence through personalized mentor interactions.

---

## 🚀 Tech Stack

### **Backend**
- **Django** + **Django REST Framework**
- **PostgreSQL** (Database)
- **Redis** (for caching & Celery tasks)
- **Celery** (for async tasks)
- **Gunicorn** + **Nginx** (for production)
- **Docker** (containerized setup)

### **Frontend**
- **React** (with **Vite** + **TypeScript**)
- **Tailwind CSS** + **ShadCN UI**
- **Axios** for API calls
- **React Router DOM** for navigation

---

## 🧩 Features

### 👨‍🎓 Student Features
- Browse and discover mentors by country, course, or expertise.
- Send mentorship connection requests.
- Track pending, accepted, or rejected requests.
- Real-time chat (upcoming feature).

### 👨‍🏫 Mentor Features
- Create and manage mentor profiles.
- Upload verification documents for admin approval.
- Manage connection requests from students.
- Set available time slots for mentoring sessions.

### 🛡️ Admin Features
- Verify or reject mentor profiles.
- Manage user base and connection requests.
- Dashboard analytics (planned).

### 💬 Platform Features
- JWT Authentication with **HTTP-only cookies**.
- Email verification (with Redis temporary token storage).
- Secure media uploads for profile pictures & documents.
- Scalable Docker-based microservice architecture.

---

## ⚙️ Project Architecture

