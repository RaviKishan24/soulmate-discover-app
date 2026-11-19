import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../Config/db.js"; 
import User from "../Models/User.js";
import Swipe from "../Models/Swipe.js";
import Match from "../Models/Match.js";
import bcrypt from "bcrypt";

const NAMES = [
  "Aarav", "Priya", "Rohan", "Ananya", "Kabir", "Meera", "Arjun", "Isha", "Vikram", "Sneha",
  "Aditya", "Neha", "Karan", "Riya", "Dev", "Tara", "Nikhil", "Pooja", "Siddharth", "Kavya",
  "Manav", "Zoya", "Yash", "Diya", "Rahul", "Aisha", "Aman", "Nidhi", "Varun", "Sara", "Rishabh"
];
const CITIES = ["Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Jaipur", "Chennai", "Kolkata"];
const INTERESTS = [
  "Travel", "Music", "Photography", "Startups", "Fitness", "Reading", "Gaming", "Art",
  "Coffee", "Dancing", "Hiking", "Movies", "Cooking", "Yoga", "Tech"
];
const BIOS = [
  "Coffee enthusiast and weekend hiker.",
  "Designing things by day, breaking things by night.",
  "Looking for someone to argue about pineapple on pizza.",
  "Startup nerd. Music lover. Amateur chef.",
  "I'll beat you at Mario Kart, then buy you chai.",
  "Wandering, wondering, and occasionally working.",
  "Art, books, and long drives.",
  "Coding, cricket, and cold coffee."
];

function pick(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

async function seed() {
  await connectDB();

  console.log("Clearing old data...");
  await Promise.all([
    User.deleteMany({}),
    Swipe.deleteMany({}),
    Match.deleteMany({}),
  ]);

  const demoPassword = await bcrypt.hash("demo1234", 10);
  const profilePassword = await bcrypt.hash("seed1234", 10);
  const testPassword = await bcrypt.hash("test1234", 10);

  // ── 1. CREATE THE DEMO USER ──
  const demo = await User.create({
    name: "Demo User",
    email: "demo@coy.local",
    password: demoPassword,
    age: 24,
    photo: "https://i.pravatar.cc/600?img=1",
    bio: "This is the demo account for SoulMate Discover.",
    city: "Delhi",
    interests: ["Travel", "Coffee", "Tech"],
    emailVerified: true,
    isDemo: true,
  });
  console.log(`👤 Demo user: ${demo._id}`);

  // ── 2. CREATE 30 FAKE PROFILES ──
  const profiles = [];
  for (let i = 0; i < 30; i++) {
    profiles.push({
      name: NAMES[i % NAMES.length],
      email: `seed${i + 1}@coy.local`,
      password: profilePassword,
      age: 21 + (i % 10),
      photo: `https://i.pravatar.cc/600?img=${(i % 70) + 2}`,
      bio: BIOS[i % BIOS.length],
      city: CITIES[i % CITIES.length],
      interests: pick(INTERESTS, 3),
      emailVerified: true,
    });
  }
  const created = await User.insertMany(profiles);
  console.log(`✨ Created ${created.length} profiles`);

  // ── 3. SEED INCOMING LIKES (First 10 profiles liked the Demo User) ──
  const incoming = created.slice(0, 10).map((p) => ({
    fromUser: p._id,
    toUser: demo._id,
    action: "like",
  }));
  await Swipe.insertMany(incoming);
  console.log(`💌 Seeded ${incoming.length} incoming likes to demo user`);

  // ── 4. SEED PRE-LOADED MATCHES FOR DEMO USER (First 3 profiles) ──
  const firstThree = created.slice(0, 3);
  
  const outgoing = firstThree.map((p) => ({
    fromUser: demo._id,
    toUser: p._id,
    action: "like",
  }));
  await Swipe.insertMany(outgoing);

  const preloadedMatches = firstThree.map((p) => ({
    users: [demo._id, p._id],
    seenBy: [], // Empty so the notification pops up instantly
  }));
  await Match.insertMany(preloadedMatches);
  console.log(`❤️ Seeded 3 pre-loaded Matches for the Demo user`);

  // ── 5. CREATE 2 TEST ACCOUNTS FOR EVALUATOR ──
  await User.insertMany([
    {
      name: "Test User A",
      email: "usera@test.com",
      password: testPassword,
      age: 25,
      photo: "https://i.pravatar.cc/600?img=12",
      bio: "I am User A. I will like User B.",
      city: "Mumbai",
      interests: ["Startups", "Gaming"],
      emailVerified: true,
    },
    {
      name: "Test User B",
      email: "userb@test.com",
      password: testPassword,
      age: 24,
      photo: "https://i.pravatar.cc/600?img=47",
      bio: "I am User B. I will like User A.",
      city: "Mumbai",
      interests: ["Travel", "Music"],
      emailVerified: true,
    }
  ]);
  console.log(`🧑‍🤝‍🧑 Created test accounts: usera@test.com & userb@test.com (Pass: test1234)`);

  await mongoose.disconnect();
  console.log("✅ Seed complete");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});