const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG and PNG images are allowed."));
    }
  },
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

function validateForm(data) {
  const errors = {};

  const {
    fullName,
    email,
    phone,
    jobTitle,
    gender,
    dateOfBirth,
  } = data;

  if (!fullName || fullName.trim() === "") {
    errors.fullName = "Full name is required.";
  } else if (fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }

  if (!email || email.trim() === "") {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!phone || phone.trim() === "") {
    errors.phone = "Phone number is required.";
  } else if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!jobTitle || jobTitle.trim() === "") {
    errors.jobTitle = "Job title is required.";
  }

  if (!gender) {
    errors.gender = "Please select a gender.";
  } else if (!["male", "female", "other"].includes(gender)) {
    errors.gender = "Please select a valid gender.";
  }

  if (!dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required.";
  } else if (new Date(dateOfBirth) > new Date()) {
    errors.dateOfBirth = "Date of birth cannot be in the future.";
  }

  return errors;
}

app.post("/api/applications", upload.single("profileImage"), (req, res) => {
  try {
    const errors = validateForm(req.body);

    if (!req.file) {
      errors.profileImage = "Profile image is required.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Please fix the validation errors.",
        errors,
      });
    }

    const application = {
      id: Date.now(),
      fullName: req.body.fullName.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone.trim(),
      jobTitle: req.body.jobTitle.trim(),
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      profileImage: req.file.filename,
    };

    console.log("Application submitted:", application);

    res.status(201).json({
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Image must be smaller than 5 MB.",
      });
    }
  }

  if (error.message === "Only JPG and PNG images are allowed.") {
    return res.status(400).json({
      message: error.message,
    });
  }

  res.status(500).json({
    message: "Something went wrong.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});