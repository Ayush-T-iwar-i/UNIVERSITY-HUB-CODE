const User = require("../models/User");
const bcrypt = require("bcryptjs"); 
const cloudinary = require("../config/cloudinary");

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update Name (if provided)
    if (name) {
      user.name = name;
    }

    // Change Password (if provided)
    if (oldPassword && newPassword) {

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload_stream(
      { folder: "college_app_profiles" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }

        const user = await User.findById(req.user.id);
        user.profileImage = result.secure_url;
        await user.save();

        res.json({
          success: true,
          imageUrl: result.secure_url,
        });
      }
    );

    result.end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};