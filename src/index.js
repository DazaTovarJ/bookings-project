// import and load the express app
const app = require("./app");

// Set the port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Booking Service is up and running on port ${port}`);
});
