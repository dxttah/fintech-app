const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/database");

const port = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("MongoDB connection failed!!", error);
  }
};

startServer();
