const express = require('express');
const router = express.Router();

//Models
const User = require("../models/User")

/* GET users listing. */
router.get('/new', function(req, res, next) {
  const user = new User(
      {
        id : 3,
        fullName : "Adem Arslan",
        age : 65
      }
  );
  user.save((err,data) => {
    if(err)
      console.log("User Eklenemedi");
    else
      res.json(data);
  });
});

module.exports = router;
