const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
var bodyParser = require("body-parser");
require("dotenv").config();

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.SERVER_PREFIX,
});

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.post("/lists/add", async (req, res, next) => {
  try {
    const listsResp = await mailchimp.lists.getAllLists();
    // console.log(listsResp.lists[0].id);
    const listId = listsResp.lists[0].id;
    const { email, name, address, apt, city, state, zip, country } = req.body;
    const resp = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: name,
        EMAIL: email,
        APT: apt,
        ADDRESS: address,
        CITY: city,
        STATE: state,
        ZIP: zip,
        COUNTRY: country,
      },
    });
    res.json(resp);
  } catch (e) {
    // console.log(JSON.stringify(e));
    console.log(JSON.parse(e.response.text).detail);
    return next(e);
  }
});
app.use((err, req, res, next) => {
  //   console.error(err.stack);
  res.status(500).json({ message: JSON.parse(err.response.text).detail });
});
app.listen(process.env.PORT || 3000, () => {
  console.log("Running");
});
