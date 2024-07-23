import Hotel from "../models/hotelModule.js";
import { errorHandler } from "../utils/errorHandler.js";
import Room from "../models/roomModule.js";
export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (error) {
    next(error);
  }
};
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};
export const getAllHotels = async (req, res, next) => {
  const { min, max, city, limit, ...others } = req.query;

  try {
    // Convert min, max, and limit to numbers, provide defaults where necessary
    const minPrice = Number(min) || 1;
    const maxPrice = Number(max) || 999;
    const limitNumber = Number(limit) || 0;

    // Create a query object and add the city filter only if it's not an empty string
    const query = {
      ...others,
      cheapestPrice: { $gt: minPrice, $lt: maxPrice },
    };

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }
    console.log("this is  city in getall hotels", city);

    const hotels = await Hotel.find(query).limit(limitNumber);
    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};
export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return next(errorHandler(401, "no hotel found"));
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    console.log("this is error in delete hotle", error);
    next(error);
  }
};
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};
export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "Hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });
    res.status(200).json([
      { type: "Hotel", count: hotelCount },
      { type: "apartment", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
      { type: "cabin", count: cabinCount },
    ]);
  } catch (error) {
    next(error);
  }
};
export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};
