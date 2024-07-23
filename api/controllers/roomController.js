import Room from "../models/roomModule.js";
import Hotel from "../models/hotelModule.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);
  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (error) {
      next(error);
    }
    res.status(200).json(savedRoom);
  } catch (error) {
    next(error);
  }
};
export const UpdateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    const deleteRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deleteRoom) {
      return next(errorHandler(401, "no room found"));
    }
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (error) {
      next(error);
    }

    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    next(error);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return next(errorHandler(401, "no room found"));
    }

    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};
export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    if (!rooms) {
      return next(errorHandler(401, "no room found"));
    }

    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};
export const UpdateRoomAvailability = async (req, res, next) => {
  try {
    const updatedRoom = await Room.updateOne(
      {
        "roomNumbers._id": req.params.id,
      },
      { $push: { "roomNumbers.$.unavailableDates": req.body.dates } }
    );

    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};
