const subscribersRouter = require("express").Router();
const { getSubscriberEmail } = require("../controllers/suscribe");
const { validateEmail } = require("../validation/subscriber");

subscribersRouter.post("/", validateEmail, getSubscriberEmail);

module.exports = subscribersRouter;
