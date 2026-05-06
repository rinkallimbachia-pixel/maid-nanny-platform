const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.API_PORT || 4000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

const corsOptions = {
  origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

const sanitizeEmail = (email = "") => email.trim().toLowerCase();
const nowISO = () => new Date().toISOString();

const createSeedData = () => ({
  users: [
    {
      id: crypto.randomUUID(),
      fullName: "Riya Sharma",
      email: "household@example.com",
      password: "123456",
      role: "household",
      city: "Surat",
      createdAt: nowISO(),
    },
    {
      id: crypto.randomUUID(),
      fullName: "Seema Patel",
      email: "helper@example.com",
      password: "123456",
      role: "helper",
      city: "Surat",
      createdAt: nowISO(),
    },
    {
      id: crypto.randomUUID(),
      fullName: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
      city: "Surat",
      createdAt: nowISO(),
    },
  ],
  helpers: [
    {
      id: crypto.randomUUID(),
      userEmail: "helper@example.com",
      name: "Seema Patel",
      serviceType: "maid",
      experienceYears: 4,
      city: "Surat",
      availability: "full-time",
      verificationStatus: "approved",
      rating: 4.6,
      skills: ["Cleaning", "Cooking", "Laundry"],
      plans: {
        hourly: 180,
        monthly: 14500,
        yearly: 165000,
      },
      bio: "Experienced household helper with child-friendly and hygiene-first approach.",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    },
    {
      id: crypto.randomUUID(),
      userEmail: "pending.helper@example.com",
      name: "Neha Verma",
      serviceType: "nanny",
      experienceYears: 3,
      city: "Ahmedabad",
      availability: "part-time",
      verificationStatus: "pending",
      rating: 4.2,
      skills: ["Infant Care", "Meal Prep", "Play Activities"],
      plans: {
        hourly: 250,
        monthly: 18000,
        yearly: 210000,
      },
      bio: "Loving nanny focused on child safety and early learning routines.",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    },
  ],
  bookings: [],
  reviews: [],
});

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    const seed = createSeedData();
    await fs.writeFile(DATA_FILE, JSON.stringify(seed, null, 2), "utf-8");
  }
}

async function readStore() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeStore(store) {
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}

function issueToken(user) {
  return Buffer.from(
    JSON.stringify({
      id: user.id,
      role: user.role,
      email: user.email,
      issuedAt: Date.now(),
    }),
    "utf-8"
  ).toString("base64url");
}

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing or invalid auth token." });
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
  } catch {
    return res.status(401).json({ message: "Invalid auth token format." });
  }

  const store = await readStore();
  const user = store.users.find((item) => item.id === payload.id);
  if (!user) {
    return res.status(401).json({ message: "Auth token user not found." });
  }

  req.user = user;
  req.store = store;
  next();
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient access role." });
    }
    next();
  };
}

app.get("/api/health", async (_req, res) => {
  const store = await readStore();
  res.json({
    status: "ok",
    users: store.users.length,
    helpers: store.helpers.length,
    bookings: store.bookings.length,
  });
});

app.post("/api/auth/register", async (req, res) => {
  const { fullName, email, password, role, city } = req.body || {};
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({
      message: "fullName, email, password and role are required.",
    });
  }

  if (!["household", "helper", "admin"].includes(role)) {
    return res.status(400).json({ message: "Role must be household/helper/admin." });
  }

  const store = await readStore();
  const normalizedEmail = sanitizeEmail(email);
  if (store.users.some((user) => sanitizeEmail(user.email) === normalizedEmail)) {
    return res.status(409).json({ message: "Email already exists." });
  }

  const user = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
    role,
    city: city || "Unknown",
    createdAt: nowISO(),
  };

  store.users.push(user);

  if (role === "helper") {
    store.helpers.push({
      id: crypto.randomUUID(),
      userEmail: user.email,
      name: user.fullName,
      serviceType: "maid",
      experienceYears: 0,
      city: user.city,
      availability: "part-time",
      verificationStatus: "pending",
      rating: 0,
      skills: [],
      plans: { hourly: 0, monthly: 0, yearly: 0 },
      bio: "",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    });
  }

  await writeStore(store);

  return res.status(201).json({
    message: "Registration successful.",
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    token: issueToken(user),
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = sanitizeEmail(email);

  const store = await readStore();
  const user = store.users.find(
    (item) => sanitizeEmail(item.email) === normalizedEmail && item.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({
    message: "Login successful.",
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    token: issueToken(user),
  });
});

app.get("/api/helpers", async (req, res) => {
  const { serviceType, city, availability, planType, verificationStatus, minExperience } =
    req.query;
  const store = await readStore();

  let result = [...store.helpers];

  if (serviceType) result = result.filter((h) => h.serviceType === serviceType);
  if (city) result = result.filter((h) => h.city.toLowerCase() === String(city).toLowerCase());
  if (availability) result = result.filter((h) => h.availability === availability);
  if (verificationStatus) {
    result = result.filter((h) => h.verificationStatus === verificationStatus);
  }
  if (minExperience) {
    const minExp = Number(minExperience);
    if (!Number.isNaN(minExp)) {
      result = result.filter((h) => h.experienceYears >= minExp);
    }
  }
  if (planType && ["hourly", "monthly", "yearly"].includes(String(planType))) {
    result = result.filter((h) => Number(h.plans[String(planType)]) > 0);
  }

  res.json({ total: result.length, data: result });
});

app.get("/api/helpers/:id", async (req, res) => {
  const store = await readStore();
  const helper = store.helpers.find((item) => item.id === req.params.id);
  if (!helper) {
    return res.status(404).json({ message: "Helper not found." });
  }
  return res.json(helper);
});

app.post("/api/bookings", authMiddleware, requireRole(["household"]), async (req, res) => {
  const { helperId, planType, startDate, endDate, address, notes } = req.body || {};
  if (!helperId || !planType || !startDate) {
    return res.status(400).json({ message: "helperId, planType and startDate are required." });
  }
  if (!["hourly", "monthly", "yearly"].includes(planType)) {
    return res.status(400).json({ message: "planType must be hourly/monthly/yearly." });
  }

  const store = req.store;
  const helper = store.helpers.find((item) => item.id === helperId);
  if (!helper) {
    return res.status(404).json({ message: "Helper not found." });
  }

  const booking = {
    id: crypto.randomUUID(),
    householdUserId: req.user.id,
    householdName: req.user.fullName,
    helperId: helper.id,
    helperName: helper.name,
    planType,
    amount: helper.plans[planType] || 0,
    startDate,
    endDate: endDate || null,
    address: address || "",
    notes: notes || "",
    status: "requested",
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };

  store.bookings.push(booking);
  await writeStore(store);
  res.status(201).json(booking);
});

app.get("/api/bookings/me", authMiddleware, async (req, res) => {
  const store = req.store;
  let bookings = [];

  if (req.user.role === "household") {
    bookings = store.bookings.filter((item) => item.householdUserId === req.user.id);
  } else if (req.user.role === "helper") {
    const helper = store.helpers.find((item) => item.userEmail === req.user.email);
    bookings = helper
      ? store.bookings.filter((item) => item.helperId === helper.id)
      : [];
  } else {
    bookings = [...store.bookings];
  }

  res.json({ total: bookings.length, data: bookings });
});

app.patch(
  "/api/bookings/:id/decision",
  authMiddleware,
  requireRole(["helper"]),
  async (req, res) => {
    const { decision } = req.body || {};
    if (!["accepted", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "decision must be accepted or rejected." });
    }

    const store = req.store;
    const helper = store.helpers.find((item) => item.userEmail === req.user.email);
    if (!helper) {
      return res.status(404).json({ message: "Helper profile not found for this user." });
    }

    const booking = store.bookings.find(
      (item) => item.id === req.params.id && item.helperId === helper.id
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.status !== "requested") {
      return res.status(409).json({ message: "Only requested bookings can be updated." });
    }

    booking.status = decision;
    booking.updatedAt = nowISO();
    await writeStore(store);
    return res.json(booking);
  }
);

app.get("/api/admin/helpers/pending", authMiddleware, requireRole(["admin"]), async (req, res) => {
  const pending = req.store.helpers.filter((item) => item.verificationStatus === "pending");
  res.json({ total: pending.length, data: pending });
});

app.patch(
  "/api/admin/helpers/:id/verify",
  authMiddleware,
  requireRole(["admin"]),
  async (req, res) => {
    const { decision } = req.body || {};
    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "decision must be approved or rejected." });
    }

    const helper = req.store.helpers.find((item) => item.id === req.params.id);
    if (!helper) {
      return res.status(404).json({ message: "Helper not found." });
    }

    helper.verificationStatus = decision;
    helper.updatedAt = nowISO();
    await writeStore(req.store);
    res.json(helper);
  }
);

app.get("/api/admin/analytics/overview", authMiddleware, requireRole(["admin"]), async (req, res) => {
  const store = req.store;
  const verifiedHelpers = store.helpers.filter((h) => h.verificationStatus === "approved").length;
  const requested = store.bookings.filter((b) => b.status === "requested").length;
  const accepted = store.bookings.filter((b) => b.status === "accepted").length;
  const rejected = store.bookings.filter((b) => b.status === "rejected").length;
  const completionRate = store.bookings.length
    ? ((accepted / store.bookings.length) * 100).toFixed(2)
    : "0.00";

  res.json({
    users: store.users.length,
    helpers: store.helpers.length,
    verifiedHelpers,
    bookings: store.bookings.length,
    bookingByStatus: { requested, accepted, rejected },
    completionRatePercent: Number(completionRate),
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Unexpected server error." });
});

app.listen(PORT, async () => {
  await ensureDataFile();
  console.log(`API server running on http://localhost:${PORT}`);
});
