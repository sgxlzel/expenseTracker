// import mongoose from "mongoose";

// export const connectDB = async () => {
//     await mongoose.connect("mongodb+srv://guptavshradha95_db_user:<myprojectt9CTSAK_C7g4iP>@cluster0.om9j3m6.mongodb.net/?appName=Cluster0")
//     .then(() => {
//         console.log("MongoDB connected successfully");
//     })
//     .catch((err) => {
//         console.error("Error connecting to MongoDB:", err);
//     });
// }

import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

// import mongoose from "mongoose";

// export const connectDB = async () => {
//     try {
//         const uri = process.env.MONGO_URI;

//         const parsed = new URL(uri);

//         console.log("MongoDB URI check:");
//         console.log("Protocol:", parsed.protocol);
//         console.log("Username:", decodeURIComponent(parsed.username));
//         console.log("Host:", parsed.hostname);
//         console.log("Database:", parsed.pathname);
//         console.log("Password present:", parsed.password.length > 0);

//         await mongoose.connect(uri);

//         console.log("MongoDB connected successfully");
//     } catch (err) {
//         console.error("Error connecting to MongoDB:", err);
//     }
// };