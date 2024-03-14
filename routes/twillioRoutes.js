const { Router } = require("express");
const cloudinary = require("cloudinary").v2;
const upload = require("../upload/config");
const fs = require("fs");
const routes = Router();
const accountSid = `${process.env.API_TWILLIO_ACOOUNT_SID}`;
const authToken = `${process.env.API_TWILLIO_AUTH_TOKEN}`;
const client = require("twilio")(accountSid, authToken);
const quotes = require("../constants/constants");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
const recipients = [
  { to: "whatsapp:+918966991531", name: "Saksham" },
  { to: "whatsapp:+917974551047", name: "Hello Bhai" },
  { to: "whatsapp:+919171599869", name: "Hello Full Stack tera" },
  // Add more recipients as needed
];
routes.post("/sendMessageWithTwillio", async (req, res, next) => {
  try {
    const message = await client.messages.create({
      body: "Hello Im From Postman",
      from: "whatsapp:+14155238886",
      to: "whatsapp:+918966991531",
    });
    console.log(message.sid);
    return res.status(200).json({
      message: "Message Send SuccessFully",
      messageSid: message,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something Occured",
      error: error.message,
    });
  }
});

routes.post(
  "/sendMediaToTwillio",
  upload.single("picture"),
  async (req, res, next) => {
    try {
      const { myText } = req.body;
      const result = await uploadImageToCloudinary(req.file.path);
      console.log(result.url);
      if (result.url === "") {
        return res.status(500).json({
          message: result.message,
        });
      }
      const message = await client.messages.create({
        body: myText,
        from: "whatsapp:+14155238886",
        to: "whatsapp:+918966991531",
        mediaUrl: `${result.url}`, // Replace with the URL of your image
      });
      console.log(message.sid);
      return res.status(200).json({
        message: "Media is send SuccessFully !!",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something Occured",
        error: error.message,
      });
    }
  }
);

routes.post("/sendMessagesWithTwillio", async (req, res, next) => {
  try {
    const result = await sendMessages(recipients);
    console.log(result);
    return res.status(200).json({
      message: "Messages Send SuccessFully !!",
      messageSids: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something Occured",
    });
  }
});
routes.get("/getMessages/:id", async function (req, res, next) {
  try {
    const message = await client.messages(req.params.id).fetch();
    console.log(message);
    return res.status(200).json({
      message: "Message Send SuccessFully",
      messageData: message,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something Occured",
      error: error.message,
    });
  }
});

async function uploadImageToCloudinary(file) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, { folder: "samples" }, (error, result) => {
      if (error) {
        console.error("Error uploading image:", error);
        fs.unlink(file, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log("File deleted successfully");
          }
        });
        reject({ url: "", message: error.message });
      } else {
        console.log("Image uploaded successfully:", result.url);
        fs.unlink(file, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log("File deleted successfully");
          }
        });
        resolve({ url: result.url, message: "Image Uploaded To Cloudinary" });
      }
    });
  });
}
async function sendMessages(recipients) {
  try {
    const messageSids = await Promise.all(
      recipients.map(async (recipient) => {
        const message = await client.messages.create({
          body: `Hello ${recipient.name}, your appointment is coming up on July 21 at 3PM`,
          from: "whatsapp:+14155238886",
          to: recipient.to,
        });
        console.log(
          `Message sent to ${recipient.name} with SID: ${message.sid}`
        );
        return message.sid;
      })
    );

    console.log("All messages sent successfully");
    return messageSids;
  } catch (err) {
    console.error("Error sending messages:", err);
    throw err;
  }
}

module.exports = routes;
