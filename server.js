const app = require('./app');
const { Op } = require('sequelize');
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
