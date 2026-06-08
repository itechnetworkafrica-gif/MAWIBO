import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import doctorsRouter from "./doctors";
import appointmentsRouter from "./appointments";
import healthRecordsRouter from "./health-records";
import medicationsRouter from "./medications";
import aiChatRouter from "./ai-chat";
import hospitalsRouter from "./hospitals";
import pharmaciesRouter from "./pharmacies";
import labsRouter from "./labs";
import mentalHealthRouter from "./mental-health";
import emergencyRouter from "./emergency";
import bloodBankRouter from "./blood-bank";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/users", usersRouter);
router.use("/doctors", doctorsRouter);
router.use("/appointments", appointmentsRouter);
router.use("/health-records", healthRecordsRouter);
router.use("/medications", medicationsRouter);
router.use("/ai-chat", aiChatRouter);
router.use("/hospitals", hospitalsRouter);
router.use("/pharmacies", pharmaciesRouter);
router.use("/labs", labsRouter);
router.use("/mental-health", mentalHealthRouter);
router.use("/emergency", emergencyRouter);
router.use("/blood-bank", bloodBankRouter);
router.use("/dashboard", dashboardRouter);

export default router;
