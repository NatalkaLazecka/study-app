import express from 'express'
import cors from 'cors'
import { PORT, FRONTEND_URL } from './config/env.js'
import emailRoutes from './routes/emails.routes.js'
import studentsRoute from "./routes/students.route.js";
import notesRoutes from "./routes/notes.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import groupsRoutes from "./routes/groups.routes.js";
import announcementsRoutes from "./routes/announcements.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";


const app = express()

// Middleware
app.use(cors({ origin: FRONTEND_URL, methods: ['GET', 'POST'], credentials: true }))
app.use(express.json())

//ROUTES
app.use("/api/emails", emailRoutes);
app.use("/api/students", studentsRoute);
app.use("/api/notes", notesRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/groups", groupsRoutes);
// app.use("/api/announcements", announcementsRoutes);
app.use("/api/events", eventsRoutes);
// app.use("/api/schedule", scheduleRoutes);


// Start serwera
app.listen(PORT, () => console.log(`Server działa na porcie ${PORT}`))
