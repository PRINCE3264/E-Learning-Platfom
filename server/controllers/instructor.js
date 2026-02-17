import TryCatch from "../middlewares/TryCatch.js";
import { Instructor } from "../models/Instructor.js";
import { User } from "../models/User.js";

// Register as an Instructor
export const registerInstructor = TryCatch(async (req, res) => {
    const { userId, bio, department, experience, specialization, linkedin, twitter, website, fee } = req.body;

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let instructor = await Instructor.findOne({ user: userId });
    if (instructor) return res.status(400).json({ message: "Already an instructor" });

    instructor = await Instructor.create({
        user: userId,
        bio,
        department,
        experience,
        specialization,
        fee,
        socialLinks: { linkedin, twitter, website },
        status: "active",
    });

    // Update user role and profile picture
    user.role = "admin";
    if (req.file) {
        user.profilePicture = req.file.path;
    }
    await user.save();

    res.status(201).json({
        message: "Instructor Registered Successfully",
        instructor,
    });
});

// Get all instructors (Admin View)
export const getAllInstructors = TryCatch(async (req, res) => {
    const instructors = await Instructor.find().populate("user", "name email username profilePicture role");
    res.status(200).json({ instructors });
});

// Get active instructors (Public View)
export const getPublicInstructors = TryCatch(async (req, res) => {
    const instructors = await Instructor.find({ status: "active" }).populate("user", "name profilePicture");
    res.status(200).json({ instructors });
});

// Update Instructor Profile
export const updateInstructor = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { bio, department, experience, specialization, linkedin, twitter, website, rating, totalStudents, fee } = req.body;

    const instructor = await Instructor.findById(id);
    if (!instructor) return res.status(404).json({ message: "Instructor not found" });

    if (bio) instructor.bio = bio;
    if (department) instructor.department = department;
    if (experience) instructor.experience = experience;
    if (specialization) instructor.specialization = specialization;
    if (rating) instructor.rating = rating;
    if (totalStudents) instructor.totalStudents = totalStudents;
    if (fee !== undefined) instructor.fee = fee;

    if (linkedin || twitter || website) {
        instructor.socialLinks = {
            linkedin: linkedin || instructor.socialLinks.linkedin,
            twitter: twitter || instructor.socialLinks.twitter,
            website: website || instructor.socialLinks.website,
        };
    }

    await instructor.save();

    if (req.file) {
        const user = await User.findById(instructor.user);
        if (user) {
            user.profilePicture = req.file.path;
            await user.save();
        }
    }

    res.status(200).json({
        message: "Instructor Updated Successfully",
        instructor,
    });
});

// Get Professional Stats for Admin
export const getInstructorStats = TryCatch(async (req, res) => {
    const totalInstructors = await Instructor.countDocuments();
    const activeInstructors = await User.countDocuments({ role: "admin", status: "active" }); // Approximation

    // You can add more complex aggregation here
    const stats = {
        totalInstructors,
        activeInstructors,
        avgRating: 4.5, // Placeholder or aggregate
    };

    res.status(200).json({ stats });
});

// Delete Instructor Node
export const deleteInstructor = TryCatch(async (req, res) => {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: "Instructor not found" });

    // Optional: Downgrade user role
    const user = await User.findById(instructor.user);
    if (user) {
        user.role = "user";
        await user.save();
    }

    await instructor.deleteOne();

    res.status(200).json({ message: "Instructor Node Deleted" });
});

// User Application to be Instructor
export const applyInstructor = TryCatch(async (req, res) => {
    const { bio, department, experience, specialization, linkedin, twitter, website } = req.body;

    const existingInstructor = await Instructor.findOne({ user: req.user._id });
    if (existingInstructor) return res.status(400).json({ message: "You have already applied or are an instructor" });

    const instructor = await Instructor.create({
        user: req.user._id,
        bio,
        department,
        experience,
        specialization,
        socialLinks: { linkedin, twitter, website },
        status: "pending",
    });

    res.status(201).json({
        message: "Application Submitted Successfully. Awaiting Admin Approval.",
        instructor,
    });
});

// Admin Approval/Rejection
export const updateInstructorStatus = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    const instructor = await Instructor.findById(id);
    if (!instructor) return res.status(404).json({ message: "Instructor record not found" });

    instructor.status = status;

    if (status === "active") {
        const user = await User.findById(instructor.user);
        if (user) {
            user.role = "admin";
            await user.save();
        }
    } else {
        const user = await User.findById(instructor.user);
        if (user) {
            user.role = "user";
            await user.save();
        }
    }

    await instructor.save();

    res.status(200).json({
        message: `Instructor marked as ${status}`,
        instructor,
    });
});
