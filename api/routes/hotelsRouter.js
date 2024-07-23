import express from "express";
const router = express.Router();

import { errorHandler } from "../utils/errorHandler.js";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getAllHotels,
  getHotel,
  getHotelRooms,
  updateHotel,
} from "../controllers/hotelController.js";
import { verifyAdmin } from "../utils/verifyToken.js";
//////creating

/////////////
///////////////

router.post("/", verifyAdmin, createHotel);
router.put("/:id", verifyAdmin, updateHotel);

router.delete("/:id", verifyAdmin, deleteHotel);

router.get("/", getAllHotels);

router.get("/find/:id", getHotel);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);
export default router;
