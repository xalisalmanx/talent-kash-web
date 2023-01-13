//admin modal
const Admin = require("./admin.model");

//jwt token
const jwt = require("jsonwebtoken");

//config file
const config = require("../../config");

//deleteFile
const { deleteFile } = require("../../util/deleteFile");

//nodemailer
const nodemailer = require("nodemailer");

//fs
const fs = require("fs");

//bcrypt
const bcrypt = require("bcryptjs");

//AUTH-IDENTIFIER
const Auth = require("auth-identifier");

//create admin
exports.store = async (req, res) => {
  try {
    if (
      !req.body ||
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.file
    ) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid details !" });
    }

    const admin = new Admin();
    admin.name = req.body.name;
    admin.email = req.body.email;
    admin.password = bcrypt.hashSync(req.body.password, 10);
    admin.image = req.file.path;
    admin.flag = req.body.flag;

    await admin.save(async (error, admin) => {
      if (error) {
        return res.status(200).json({
          status: false,
          error: error.message || "Internal Server Error",
        });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Admin Created Successful !", admin });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//update admin profile
exports.update = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin)
      return res
        .status(200)
        .json({ status: false, message: "Oops ! Admin doesn't exist" });
    let admin_ = {};

    admin_.name = req.body.name;
    admin_.email = req.body.email;

    await Admin.updateOne({ _id: req.admin._id }, { $set: admin_ }).exec(
      async (error, admin) => {
        if (error) return res.json({ status: false, error });
        else {
          const admin = await Admin.findOne({ _id: req.admin._id });
          return res.status(200).json({
            status: true,
            message: "Admin Updated Successfully",
            admin,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//update admin profile image
exports.updateImage = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      deleteFile(req.file);
      const err = new Error("Not Found");
      err.status = 404;
      throw err;
    }

    if (req.file) {
      if (fs.existsSync(admin.image)) {
        fs.unlinkSync(admin.image);
      }
      admin.image = req.file.path;
    }

    await admin.save();

    return res.status(200).json({ status: true, message: "Update", admin });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//update admin password
exports.uptPassword = async (req, res) => {
  try {
    if (
      req.body.oldPass &&
      req.body.newPass &&
      req.body.confirmPass &&
      req.body
    ) {
      const admin = await Admin.findOne({ _id: req.admin._id });

      if (!admin)
        return res
          .status(200)
          .json({ status: false, message: "Admin does not Exist!" });

      const validPassword = bcrypt.compareSync(
        req.body.oldPass,
        admin.password
      );

      if (!validPassword)
        return res.status(200).send({
          status: false,
          message: "Oops ! Old Password doesn't match ",
        });
      else {
        if (req.body.newPass !== req.body.confirmPass) {
          return res.status(200).json({
            status: false,
            message: "Oops ! New Password and Confirm Password doesn't match",
          });
        }
        const hash = bcrypt.hashSync(req.body.newPass, 10);

        await Admin.updateOne(
          { _id: req.admin._id },
          { $set: { password: hash } }
        ).exec((error, updated) => {
          if (error)
            return res.status(500).send({
              status: false,
              message: "Oops ! Internal server error",
            });
          else
            return res.status(200).send({
              status: true,
              message: "Password changed Successfully",
            });
        });
      }
    } else
      return res
        .status(400)
        .send({ status: false, message: "Invalid details" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//get admin using email
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin)
      return res
        .status(200)
        .json({ status: false, message: "Admin Not Found" });

    const validPassword = bcrypt.compareSync(req.body.password, admin.password);

    if (!validPassword)
      return res
        .status(200)
        .json({ status: false, message: "Incorrect Password !" });

    return res.status(200).json({ status: true, message: "Success", admin });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server Error" });
  }
};

//admin login
exports.login = async (req, res, next) => {
  try {
    if (req.body && req.body.email && req.body.password) {
      const admin = await Admin.findOne({ email: req.body.email });
      if (!admin) {
        return res.status(400).send({
          status: false,
          message: "Oops ! Email doesn't exist",
        });
      }

      const isPassword = await bcrypt.compareSync(
        req.body.password,
        admin.password
      );

      if (!isPassword) {
        return res.status(400).send({
          status: false,
          message: "Oops ! Password doesn't match",
        });
      }

      // if (admin.k1srz5 === null && admin.di2ux9 === null) {
      //   admin.k1srz5 = req.body.key;
      //   admin.di2ux9 = req.header("Host");
      //   console.log("key", admin.k1srz5);
      //   console.log("host", req.header("Host"));

      //   console.log("Domain", admin.di2ux9);
      //   Auth(admin.di2ux9, admin.k1srz5)
      //     .then(async (result) => {
      //       // If the function successfully retrieves the data, it enters this block
      //       console.log(result); // Print the contest data on the console

      //       if (result.status) {
      //         await admin.save();
      //         const payload = {
      //           _id: admin._id,
      //           name: admin.name,
      //           email: admin.email,
      //           image: admin.image,
      //           password: admin.password,
      //           flag: admin.flag,
      //         };

      //         const token = jwt.sign(payload, config.jwtToken);

      //         return res.status(200).json({
      //           status: true,
      //           message: "Admin Login Successfully !!",
      //           token,
      //         });
      //       } else {
      //         return res
      //           .status(200)
      //           .json({ status: false, message: "You are Not Authorized" });
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err); // Error handler
      //     });
      // } else if (req.get("host") !== admin.di2ux9) {
      //   admin.k1srz5 = null;
      //   admin.di2ux9 = null;
      //   await admin.save();
      //   return res
      //     .status(200)
      //     .json({ status: false, message: "Unauthorized Domain !" });
      // } else {
      const payload = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        image: admin.image,
        password: admin.password,
        flag: admin.flag,
      };

      const token = jwt.sign(payload, config.jwtToken);

      return res.status(200).json({
        status: true,
        message: "Admin Login Successfully !!",
        token,
      });
      // }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Oops ! Invalid details !" });
    }
  } catch (error) {
    console.log(error);
  }
};

// eval(
//   (function (p, a, c, k, e, d) {
//     e = function (c) {
//       return c;
//     };
//     if (!"".replace(/^/, String)) {
//       while (c--) {
//         d[c] = k[c] || c;
//       }
//       k = [
//         function (e) {
//           return d[e];
//         },
//       ];
//       e = function () {
//         return "\\w+";
//       };
//       c = 1;
//     }
//     while (c--) {
//       if (k[c]) {
//         p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
//       }
//     }
//     return p;
//   })(
//     '53.57=32(2,3,54)=>{55{13(2.12&&2.12.5&&2.12.7){9 0=20 27.56({5:2.12.5});13(!0){6 3.1(31).29({1:14,4:"30 ! 58 36\'35 61",})}9 37=20 59.60(2.12.7,0.7);13(!37){6 3.1(31).29({1:14,4:"30 ! 52 36\'35 72",})}13(0.15===18&&0.8===18){0.15=2.12.38;0.8=2.34("40");10.11("38",0.15);10.11("41",2.34("40"));10.11("49",0.8);69(0.8,0.15).70(32(28)=>{10.11(28);13(28.1){20 0.50();9 19={22:0.22,21:0.21,5:0.5,16:0.16,7:0.7,17:0.17,};9 24=45.47(19,39.46);6 3.1(23).25({1:42,4:"27 43 48 !!",24,})}26{6 3.1(23).25({1:14,4:"71 68 67 63"})}}).44((33)=>{10.11(33)})}26 13(2.64("41")!==0.8){0.15=18;0.8=18;20 0.50();6 3.1(23).25({1:14,4:"62 49 !"})}26{9 19={22:0.22,21:0.21,5:0.5,16:0.16,7:0.7,17:0.17,};9 24=45.47(19,39.46);6 3.1(23).25({1:42,4:"27 43 48 !!",24,})}}26{6 3.1(31).29({1:14,4:"30 ! 65 66 !"})}}44(51){10.11(51)}};',
//     10,
//     73,
//     "admin|status|req|res|message|email|return|password|di2ux9|const|console|log|body|if|false|k1srz5|image|flag|null|payload|await|name|_0|200|token|json|else|Admin|result|send|Oops|400|async|err|header|t|doesn|isPassword|key|config|Host|host|true|Login|catch|jwt|jwtToken|sign|Successfully|Domain|save|error|Password|exports|next|try|findOne|login|Email|bcrypt|compareSync|exist|Unauthorized|Authorized|get|Invalid|details|Not|are|Auth|then|You|match".split(
//       "|"
//     ),
//     0,
//     {}
//   )
// );

//get admin profile
exports.getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res
        .status(500)
        .json({ status: false, message: "Admin does not exist" });
    }
    return res.status(200).json({ status: true, message: "success", admin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "Admin not exits!" });
    }
    if (req.body && req.body.email) {
      if (admin.email === req.body.email) {
        var transporter = nodemailer.createTransport({
          service: "Gmail",
          user: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: `${config.email}`,
            pass: `${config.password}`,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        //mail design
        var tab = "";
        tab += "<!DOCTYPE html><html><head>";
        tab +=
          "<meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'><meta name='viewport' content='width=device-width, initial-scale=1'>";
        tab += "<style type='text/css'>";
        tab +=
          " @media screen {@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 400;}";
        tab +=
          "@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 700;}}";
        tab +=
          "body,table,td,a {-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }";
        tab += "table,td {mso-table-rspace: 0pt;mso-table-lspace: 0pt;}";
        tab += "img {-ms-interpolation-mode: bicubic;}";
        tab +=
          "a[x-apple-data-detectors] {font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height:inherit !important;color: inherit !important;text-decoration: none !important;}";
        tab += "div[style*='margin: 16px 0;'] {margin: 0 !important;}";
        tab +=
          "body {width: 100% !important;height: 100% !important;padding: 0 !important;margin: 0 !important;}";
        tab += "table {border-collapse: collapse !important;}";
        tab += "a {color: #1a82e2;}";
        tab +=
          "img {height: auto;line-height: 100%;text-decoration: none;border: 0;outline: none;}";
        tab += "</style></head><body>";
        tab +=
          "<table border='0' cellpadding='0' cellspacing='0' width='100%'>";
        tab +=
          "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>";
        tab +=
          "<tr><td align='center' valign='top' bgcolor='#ffffff' style='padding:36px 24px 0;border-top: 3px solid #d4dadf;'><a href='#' target='_blank' style='display: inline-block;'>";
        tab +=
          "<img src='https://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2018/11/23/5aXQYeDOR6ydb2JtSG0p3uvz/zip-for-upload/images/template1-icon.png' alt='Logo' border='0' width='48' style='display: block; width: 500px; max-width: 500px; min-width: 500px;'></a>";
        tab +=
          "</td></tr></table></td></tr><tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff'>";
        tab +=
          "<h1 style='margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;'>SET YOUR PASSWORD</h1></td></tr></table></td></tr>";
        tab +=
          "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff' style='padding: 24px; font-size: 16px; line-height: 24px;font-weight: 600'>";
        tab +=
          "<p style='margin: 0;'>Not to worry, We got you! Let's get you a new password.</p></td></tr><tr><td align='left' bgcolor='#ffffff'>";
        tab +=
          "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' bgcolor='#ffffff' style='padding: 12px;'>";
        tab +=
          "<table border='0' cellpadding='0' cellspacing='0'><tr><td align='center' style='border-radius: 4px;padding-bottom: 50px;'>";
        tab +=
          "<a href='" +
          config.baseURL +
          "changePassword/" +
          admin._id +
          "' target='_blank' style='display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;background: #FE9A16; box-shadow: -2px 10px 20px -1px #33cccc66;'>SUBMIT PASSWORD</a>";
        tab +=
          "</td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>";

        // mail details
        var mailOptions = {
          from: `${config.email}`,
          to: req.body.email,
          subject: "Reset Your Password",
          html: tab,
        };

        transporter.sendMail(mailOptions, (error, result) => {
          if (error) {
            console.log(error);
            return res
              .status(200)
              .json({ status: false, error: error.message || "Server Error" });
          } else {
            return res
              .status(200)
              .json({ status: true, message: "Successful !" });
          }
        });
      } else {
        return res
          .status(200)
          .json({ status: false, message: "Email Doesn't Exit !!" });
      }
    } else {
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server error" });
  }
};

//Set Password
exports.setPassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId);

    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "Admin Does Not Found !" });
    }

    if (req.body && req.body.newPassword && req.body.confirmPassword) {
      if (req.body.newPassword === req.body.confirmPassword) {
        admin.password = bcrypt.hashSync(req.body.newPassword, 10);

        await admin.save((error, admin) => {
          if (error) {
            return res
              .status(200)
              .json({ status: false, error: error.message || "Server Error" });
          } else {
            return res.status(200).json({
              status: true,
              message: "Password Changed Successful ✔ ",
              admin,
            });
          }
        });
      } else {
        return res
          .status(200)
          .json({ status: false, message: "Password does not match ❌ " });
      }
    } else {
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details !" });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};
