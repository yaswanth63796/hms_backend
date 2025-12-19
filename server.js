import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import route from "./Routes/routes.js";
import complaint from "./model/HostelManagement.js";
import User from "./model/User.js";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT || 4000;




// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });


app.use("/api/auth", route);

//  Get student complaints by roll number


app.get("/api/students/complaints/:rollNumber", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const complaints = await complaint.find({ Roll_Number: rollNumber });

    if (complaints.length === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Post complaint
app.post("/api/students/complaints", async (req, res) => {
  try {
    const {
      Roll_Number,
      Block,
      Room_Number,
      Name,
      Complaint_Type,
      Description,
      Phone_Number,
    } = req.body;

    const complaints = new complaint({
      Roll_Number,
      Block,
      Room_Number,
      Name,
      Complaint_Type,
      Description,
      Phone_Number,
    });

    await complaints.save();
    res.status(201).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all complaints
app.get("/api/students/complaints", async (req, res) => {
  try {
    const complaints = await complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Delete complaint
app.delete("/api/students/complaints/:id", async (req, res) => {
  try {
    const complaints = await complaint.findByIdAndDelete(req.params.id);

    if (!complaints) {
      return res.status(404).json({ message: "Complaints not found!" });
    }

    res.json({ message: "Complaint deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Warden: get complaints by block
app.get("/api/warden/complaints/:block", async (req, res) => {
  try {
    const { block } = req.params;
    const complaints = await complaint.find({ Block: block });

    if (complaints.length === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Warden: update status
app.put("/api/warden/complaints/:id", async (req, res) => {
  try {
    const { Status } = req.body;

    const updated = await complaint.findByIdAndUpdate(
      req.params.id,
      { Status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
