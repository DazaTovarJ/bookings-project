// import and load the express app
import app from "./app.js";

// Start the server
app.listen(app.get("port"), () => {
  console.log(`Booking Service is up and running on port ${app.get("port")}`);
});
