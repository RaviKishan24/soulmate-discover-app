# SoulMate Discover 💖 | Coy SDE Intern Assignment

A mobile-first, fully functional swipe-based discovery application inspired by Tinder and Bumble. Built as a standalone app with a placeholder Home tab and a fully functional Discover tab.

## 🚀 Key Features Implemented
- **Swipe Experience:** Smooth drag gestures on mobile and Like/Pass buttons on desktop using `framer-motion`.
- **Mutual Match Logic:** A match is only created when two users like each other. 
- **Privacy First:** Unmatched incoming likes are strictly hidden. You only see who liked you if it's a mutual match (Core Coy Promise).
- **Real-Time Notifications:** Global toast notifications and Navbar red badges alert users to new matches while they are using the app.
- **Persistent State:** All swipes, passes, and matches are saved to MongoDB. Refreshing the page keeps your feed and matches intact.
- **Authentication:** JWT-based login with secure 6-digit Email OTP verification (via Brevo HTTP API).
- **Empty State:** A polished "You've seen everyone!" screen when the feed runs out.
- **Privacy Controls:** Users can unmatch and remove connections completely.

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite), JavaScript, Tailwind CSS, Framer Motion, React Router DOM, Axios.
- **Backend:** Node.js, Express.js, JavaScript (ES Modules).
- **Database:** MongoDB, Mongoose.
- **Email:** Brevo (HTTP API).

---

## 🔑 Test Accounts (For Evaluators)
To make testing fast and easy, I have provided 3 pre-verified accounts. **You do not need to check your email for OTPs.**

| Account Role | Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Demo User** | `demo@coy.local` | `demo1234` | Already has 3 pre-loaded matches. Use this to test the Matches page and instant notification popups. |
| **Test User A** | `usera@test.com` | `test1234` | Use in Window A to test the mutual match flow. |
| **Test User B** | `userb@test.com` | `test1234` | Use in Window B (Incognito) to trigger the real-time notification for User A. |

### How to test the Real-Time Mutual Match:
1. Log in as **User A** in a normal browser window.
2. Log in as **User B** in an Incognito window.
3. In **User A's** window, find User B in the Discover feed and Swipe Right (Like).
4. In **User B's** window, find User A in the Discover feed and Swipe Right (Like).
5. **Watch User A's screen:** Within 10 seconds, a Toast Notification will slide in from the right, and a red notification dot will appear on the Navbar. 

---
