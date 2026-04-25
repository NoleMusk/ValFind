const app = require("../app");

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Seattle search app berjalan di http://localhost:${port}`);
});
