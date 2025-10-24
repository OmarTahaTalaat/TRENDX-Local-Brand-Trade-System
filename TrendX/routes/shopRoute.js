const router = require("express").Router({ mergeParams: true });

const { getShop_S } = require("../controllers/shopController");

router.route("/").get(getShop_S);

module.exports = router;
