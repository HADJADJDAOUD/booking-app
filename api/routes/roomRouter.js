import express from "express";
const router = express.Router();

import { verifyAdmin } from "../utils/verifyToken.js";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  UpdateRoomAvailability,
  getRoom,
  UpdateRoom,
} from "../controllers/roomController.js";
//////creating
router.post("/:hotelid", verifyAdmin, createRoom);
router.put("/:id", verifyAdmin, UpdateRoom);
router.put("/availability/:id", UpdateRoomAvailability);

router.delete("/:id", verifyAdmin, deleteRoom);

router.get("/", getAllRooms);
router.get("/:id", getRoom);
export default router;
