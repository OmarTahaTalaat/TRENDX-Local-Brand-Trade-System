const router = require("express").Router({ mergeParams: true });

const { websiteInfo, suggestedQuestions } = require("../controllers/chatbot/chatbot");

router.route("/").get(websiteInfo);
router.route("/questions").get(suggestedQuestions);

module.exports = router;
