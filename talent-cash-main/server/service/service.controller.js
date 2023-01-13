//model
const Service = require("./service.model");


//config
const config = require("../../config");

//for Android
exports.index = async (req, res) => {
    try {
        //const service = [{"service_id":1,"service_name":'Gardener'}, {"service_id":2, "service_name": "Plumber"},{"service_id":3, "service_name": "Electrician"}];
        // const Last_Record = await Service.find().sort({ $natural: -1 }).limit(1);
        // if(!Last_Record[0] || !Last_Record[0].service_id)
        // {
        //   var service_id = '1';//first order id in case of no order id available
        // }
        // else
        // {
        //   var last_service_id = Last_Record[0].service_id;
        //   var service_id = parseInt(last_service_id) + 1;
        // }
        const service = await Service.aggregate([
          { $match: { isDelete: false } },
          
        ])
        .project("_id service_name service_id");
        var jsonData = {};
        for(var i = 0 ; i < service.length ; i ++ )
        {
          var columnName = i;
          jsonData[columnName] = service[i].service_name;
        }
        
        //console.log(jsonData);

        // const service_2 = {0:"ABC",1:'Gardener',2:"Plumber",};
      return res
        .status(200)
        .json({ status: true, message: "Successful !", service: jsonData});
    } catch (error) {
      return res.status(500).json({
        status: false,
        error: error.message || "Internal Server Error !",
      });
    }
  };

//for IOS
exports.getServices = async (req, res) => {
  try {
      //const service = [{"service_id":1,"service_name":'Gardener'}, {"service_id":2, "service_name": "Plumber"},{"service_id":3, "service_name": "Electrician"}];
      //const service = {0:"ABC",1:'Gardener',2:"Plumber",};
      const service = await Service.aggregate([
        { $match: { isDelete: false } },
        
      ])
      .project("_id service_name service_id");
    return res
      .status(200)
      .json({ status: true, message: "Successful !", service: service });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//get appDownload
exports.getBackendServices = async (req, res) => {
  try {
    const redeemPlan = await Service.find({ isDelete: false }).sort({
      createdAt: -1,
    });
    if (!redeemPlan)
      return res.status(200).json({ status: false, message: "No data found!" });

    return res
      .status(200)
      .json({ status: true, message: "Success!!", redeemPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// create diamond plan
exports.store = async (req, res) => {
  try {
    if (!req.body.service_name)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    
    const checkRes = await Service.find({ service_name: req.body.service_name }).sort({
      createdAt: -1,
    });

    if (checkRes.length > 0)
      return res
      .status(200)
      .json({ status: false, message: "Service Already Exist !!!" });

      const Last_Record = await Service.find().sort({ $natural: -1 }).limit(1);
          if(!Last_Record[0] || !Last_Record[0].service_id)
          {
            var service_id = '1';//first order id in case of no order id available
          }
          else
          {
            var last_service_id = Last_Record[0].service_id;
            var service_id = parseInt(last_service_id) + 1;
          }

    const service = new Service();

    service.service_name = req.body.service_name;
    service.service_id = service_id;

    await service.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!", redeemPlan : service });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update diamond plan
exports.update = async (req, res) => {
  try {
    const redeemPlan =  await Service.findById(req.params.planId);

    if (!redeemPlan) {
      return res
        .status(200)
        .json({ status: false, message: "Record does not Exist!" });
    }

    // redeemPlan.diamond = req.body.diamond;
    // redeemPlan.dollar = req.body.dollar;
    // redeemPlan.rupee = req.body.rupee;
    // redeemPlan.tag = req.body.tag;

    redeemPlan.service_name = req.body.service_name;

    await redeemPlan.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!", redeemPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// delete redeemPlan
exports.destroy = async (req, res) => {
  try {
    const redeemPlan = await Service.findById(req.params.planId);

    if (!redeemPlan)
      return res
        .status(200)
        .json({ status: false, message: "Record does not Exist!" });

    redeemPlan.isDelete = true;

    await redeemPlan.save();

    return res.status(200).json({ status: true, message: "Success!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
