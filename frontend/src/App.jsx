import { useState } from "react";
import "./App.css";

const API_URL = "";

function App() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    gender: "",
    dateOfBirth: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value, files } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: files ? files[0] : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setMessage("");
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName =
        "Full name must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select a gender.";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    } else if (
      new Date(formData.dateOfBirth) > new Date()
    ) {
      newErrors.dateOfBirth =
        "Date of birth cannot be in the future.";
    }

    if (!formData.profileImage) {
      newErrors.profileImage = "Profile image is required.";
    } else {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];

      if (!allowedTypes.includes(formData.profileImage.type)) {
        newErrors.profileImage =
          "Only JPG and PNG images are allowed.";
      }

      if (formData.profileImage.size > 5 * 1024 * 1024) {
        newErrors.profileImage =
          "Image must be smaller than 5 MB.";
      }
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const data = new FormData();

    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("jobTitle", formData.jobTitle);
    data.append("gender", formData.gender);
    data.append("dateOfBirth", formData.dateOfBirth);
    data.append("profileImage", formData.profileImage);

    try {
      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
        }

        throw new Error(
          result.message || "Submission failed."
        );
      }

      setMessage(result.message);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        jobTitle: "",
        gender: "",
        dateOfBirth: "",
        profileImage: null,
      });

      document.getElementById("application-form").reset();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">

      <div className="form-card">

        <h1>Job Application Form</h1>

        <p className="subtitle">
          Please complete all fields before submitting your
          application.
        </p>

        {message && (
          <div
            className={
              message.includes("successfully")
                ? "message success"
                : "message error-message"
            }
          >
            {message}
          </div>
        )}

        <form
          id="application-form"
          onSubmit={handleSubmit}
          noValidate
        >

          <div className="field">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              onChange={handleChange}
            />

            {errors.fullName && (
              <span className="field-error">
                {errors.fullName}
              </span>
            )}
          </div>

          <div className="field">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              onChange={handleChange}
            />

            {errors.email && (
              <span className="field-error">
                {errors.email}
              </span>
            )}
          </div>

          <div className="field">
            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              placeholder="+20 1234567890"
              onChange={handleChange}
            />

            {errors.phone && (
              <span className="field-error">
                {errors.phone}
              </span>
            )}
          </div>

          <div className="field">
            <label>Job Title</label>

            <input
              type="text"
              name="jobTitle"
              placeholder="e.g. Frontend Developer"
              onChange={handleChange}
            />

            {errors.jobTitle && (
              <span className="field-error">
                {errors.jobTitle}
              </span>
            )}
          </div>

          <div className="field">
            <label>Gender</label>

            <select
              name="gender"
              defaultValue=""
              onChange={handleChange}
            >
              <option value="" disabled>
                Select your gender
              </option>

              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {errors.gender && (
              <span className="field-error">
                {errors.gender}
              </span>
            )}
          </div>

          <div className="field">
            <label>Date of Birth</label>

            <input
              type="date"
              name="dateOfBirth"
              onChange={handleChange}
            />

            {errors.dateOfBirth && (
              <span className="field-error">
                {errors.dateOfBirth}
              </span>
            )}
          </div>

          <div className="field">
            <label>Profile Image</label>

            <input
              type="file"
              name="profileImage"
              accept="image/png,image/jpeg"
              onChange={handleChange}
            />

            <small>
              JPG or PNG only. Maximum size: 5 MB.
            </small>

            {errors.profileImage && (
              <span className="field-error">
                {errors.profileImage}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="submit-button"
          >
            {submitting ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>

        </form>

      </div>

    </div>
  );
}

export default App;