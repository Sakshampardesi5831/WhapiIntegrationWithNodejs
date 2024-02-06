const { Router } = require("express");
const sdk = require("api")("@whapi/v1.7.5#13fxolr0rpbag");
require("dotenv").config();
const routes = Router();

routes.get("/", (req, res) => {
  res.json("hello");
});
routes.post("/send-message", async (req, res, next) => {
  try {
    const { to, message } = req.body;
    console.log(to, message);
    sdk.auth(`${process.env.API_KEY}`);
    const data = await sdk.sendMessageText({
      typing_time: 0,
      to: `${to}`,
      body: `${message}`,
    });
    console.log(data);
    res.status(200).json({
      message: "success",
      data: data.data,
    });
  } catch (error) {
    res.json(error.message);
  }
});

routes.post("/createGroup", async (req, res, next) => {
  try {
    const { subject, participants } = req.body;
    sdk.auth(`${process.env.API_KEY}`);
    const data = await sdk.createGroup({
      subject: subject,
      participants: participants,
    });
    const sendMessage=await sendMessageToGroupAndNewsLetter(data.data.id,`WelCome to ${subject} only these message will`)
    res.json({
      message: "success",
      data: data.data,
    });
  } catch (error) {
    res.json({
      message: "error",
      error: error.message,
    });
  }
});

routes.get("/getGroups", async (req, res, next) => {
  try {
    sdk.auth(`${process.env.API_KEY}`);
    const data = await sdk.getGroups({ count: "10" });
    console.log(data?.data?.groups?.map((item) => item));
    res.json({
      message: "Success",
      data: data.data.groups,
    });
  } catch (error) {
    res.json({
      message: "Some Error Occurred !!!",
      error: error.message,
    });
  }
});

routes.get("/getGroup/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    sdk.auth(`${process.env.API_KEY}`);
    const data = await sdk.getGroup({ GroupID: id });
    res.json({
      message: "Success",
      data: data,
    });
  } catch (error) {
    res.json({
      message: "Some Error Occurred",
      error: error.message,
    });
  }
});

routes.post("/createNewsLetter", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    console.log(name, description);
    sdk.auth(`${process.env.API_KEY}`);
    const data = await sdk.createNewsletter({
      name: name,
      description: description,
    });
    const sendMessage=await sendMessageToGroupAndNewsLetter(data.data.id,`WelCome to ${name} only these message will`)
    res.json({
        message:"Success",
        data:data.data,
    })
  } catch (error) {
    res.json({
      message: "Some Error Occurred !!!",
      error: error.message,
    });
  }
});

routes.get("/getNewsLetters", async (req, res, next) => {
    try {
        sdk.auth(`${process.env.API_KEY}`);
        const data = await sdk.getNewsletters({ count: "10" });
        console.log(data?.data?.newsletters?.map((item) => item));
       
        res.json({
          message: "Success",
          data: data.data.newsletters,
        });
      } catch (error) {
        res.json({
          message: "Some Error Occurred !!!",
          error: error.message,
        });
      }
})
routes.get("/getLink",async (req, res, next)=>{
  try {
    sdk.auth(`${process.env.API_KEY}`);
    const LinkGenerate=await sdk.getGroupInvite({GroupID: '120363214954087637@g.us'})
    console.log(LinkGenerate);
    res.json({
      linkgenerated:`https://chat.whatsapp.com/${LinkGenerate.data.invite_code}`
    })
  } catch (error) {
    res.json({
      message:"Some Error Occurred !!!",
      error:error.message
    })
  }
})

async function sendMessageToGroupAndNewsLetter(to, message) {
    try {
        console.log(to, message);
        sdk.auth(`${process.env.API_KEY}`);
        const data = await sdk.sendMessageText({
          typing_time: 0,
          to: `${to}`,
          body: `${message}`,
        });
        console.log(data);
        return "WelCome Message Send SuccessFully !!!"
      } catch (error) {
         console.log(error)
      }
}

module.exports = routes;
