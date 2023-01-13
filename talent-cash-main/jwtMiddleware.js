const jwt = require("jsonwebtoken");

const config = require("./config");

const User = require("./server/user/user.model");



module.exports = async (req, res, next) => {
    try {
      //const Authorization = req.get("Authorization");
      //const token = req.body.token || req.query.token || req.headers["x-access-token"];

      const token = req.headers["authorization"];
      if (!token)
      {
        // return res
        //   .status(403)
        //   .json({ status: false, message: "Oops ! You are not Authorized" });
        next();
      }
      else
      {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        const decodeToken = await jwt.verify(bearerToken, config.jwtToken);
        const user = await User.findById(decodeToken._id);
        req.user = user;
        next();
      }

      // console.log(decodeToken);
  
      
  
      
  
      
    } catch (error) {
      return res.status(500).json({
        status: false,
        error: error.message || "Internal Server Error !",
      });
    }
  };