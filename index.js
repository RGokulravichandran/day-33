import express from "express";
const app = express();
const PORT = 3000;

app.use(express.json());

const rooms = [];
const bookings = [];

// Room Details
app.get("/rooms", async (req, res) => {
  try {
    res.send(rooms);
  } catch (error) {
    res.send(error);
  }
});

// Booking Details
app.get("/bookings", async (req, res) => {
  try {
    res.send(bookings);
  } catch (error) {
    res.send(error);
  }
});

// Create New room
app.post("/create_room", async (req, res) => {
  // let addNewRoom;
  const { roomId } = req.body;
  const findingExsistance = rooms.find((room) => room.roomId == roomId);
  try {
    if (!findingExsistance) {
      rooms.push(req.body);
      res.status(200).send({ status: "Successfully Added", rooms });
    } else {
      res.status(400).send({ status: "RoomId Already exist" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Room Booking
app.post("/room_booking", async (req, res) => {
  const { roomId, date, startTime, endTime } = req.body;
  const findingExistance = rooms.find((data) => {
    return data.roomId == roomId;
  });
  const isRoomAvailable = findingExistance.bookings.every((booking) => {
    return (
      (startTime >= booking.endTime || endTime <= booking.startTime) &&
      date !== booking.date
    );
  });

  if (findingExistance && findingExistance.status == "available") {
    // res.send("Room found");
    if (isRoomAvailable) {
      bookings.push(req.body);
      findingExistance.bookings.push(req.body);
      const updatedRooms = rooms.map((room) => {
        return { ...room, findingExistance };
        return room;
      });
      res.send("success");
    } else {
      res.send("room not available at the time");
    }
  } else {
    res.send("Room not found");
  }
  // console.log(isRoomAvailable);
  // try {
  //   if (!findingExistance) {
  //     if (isRoomAvailable.length == 0) {
  //       rooms.bookings.push(req.body);
  //       bookings.push(req.body);
  //       res.status(200).send({ message: "Room Booked Successfully", rooms });
  //     } else {
  //       res
  //         .status(400)
  //         .send({ message: "Room not available for the specified time" });
  //     }
  //   } else {
  //     res.status(400).send({ message: "RoomId Not Found" });
  //   }
  // } catch (error) {
  //   res.status(500).send("Error:", error);
  // }
});

app.listen(PORT, () => {
  console.log(`Server is running  at http://localhost:${PORT}`);
});
