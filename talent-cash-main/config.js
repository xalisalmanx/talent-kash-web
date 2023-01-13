module.exports = {
  //port
  PORT: process.env.PORT || 5000,

  //database
  dbUsername: "talent-cash-db-user",
  dbPassword: "zXnFTnNExdnRfK0i",
  dbName: "talent-cash-db",

  //json web token
  jwtToken: "Buzzy@12345",

  //email & pass
  email: "talentcash.official@gmail.com",
  password: "TalentCshOfc125&*(#",

  //Dev Key
  devKey: "soft@12345",

  //baseURL
  // baseURL: "http://localhost:5000/",
  baseURL: "https://www.talentcash.pk/",
  // baseURL: "http://talentcash-env.eba-q83yh4xv.ap-northeast-1.elasticbeanstalk.com/",

  api_base_url : 'https://www.talentcash.pk/',
  // api_base_url : 'http://localhost:5000/',

  cloudfront_url:'https://dploeyyos2utt.cloudfront.net/',

  //for send notification
  SERVER_KEY: "AAAABZc9HLA:APA91bFnkbQb1G5Y2jO1kmsyaBHscq4Qdp0s8YlTN-Z1HbrNqXffvZlMslanTnRiiAa-d6A0oHt4asBX4QPaocTnt1XdbDOSXrbwBmABddPcnWjF7w5EZifiv8awP6JGzoxQuWPqtxMZ",

  //Comapany share is 30%
  CompanyShare : 0.3,

  // S3 account Credentials
  s3AccessKeyId: "AKIAYE463SDECKQBHXMZ",
  s3SecretAccessKey: "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",

  // for pagination
  limit: 10,

  //PayPro Order Setting
  coinOrderIdFormat : 'TalentCashTest-',
  coinOrderLiveIdFormat : 'TalentCashLive-',
  payProDemoUrl : 'https://demoapi.paypro.com.pk/v2/ppro/co',
  payProLiveUrl : 'https://api.PayPro.com.pk/v2/ppro/co',
  payProDemoClientId : "wIDslNVla5P5aOv",
  payProDemoClientSecret : "j8r6QfRYbmFzfSO",
  payProLiveClientId : "D4gfXskcUh8eNhd",
  payProLiveClientSecret : "N1Ow0VKfj43dNXP",
  payProDemoAuth : "https://demoapi.paypro.com.pk/v2/ppro/auth",
  payProLiveAuth : "https://api.PayPro.com.pk/v2/ppro/auth",
  payProDemoUserName : "Talent_Cash",
  payProDemoPassword : "Demo@cash22",
  payProLiveUserName : "Talent_Cash",
  payProLivePassword : "Live@cash22",


};
