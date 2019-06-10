//--- Requires ---//
const express = require("express");
const HomeController = require("../controllers/home");

const router = express.Router();

//--- Methods ---/
router.get("/administration/accounts/disabled", HomeController.getDisabledAccounts);
router.get("/administration/accounts/active", HomeController.getActivatedAccounts);
router.put("/administration/accounts/activate", HomeController.activateAccount);
router.put("/administration/accounts/disable", HomeController.disableAccount);
router.put("/administration/accounts/privileges", HomeController.givePrivileges);

router.post("/administration/servers/create", HomeController.createServerRoom);
router.get("/administration/servers/serverrooms", HomeController.getServerRooms);
router.delete("/administration/servers/serverrooms/delete/:id", HomeController.deleteServerRoom);

router.post("/administration/relations", HomeController.createRelation);
router.delete("/administration/relations/delete/:aId/:sName", HomeController.deleteRelation);

router.get("/accounts/privileges", HomeController.getAccountsPrivileges); // do usunięcia
//--- Exports ---//
module.exports = router;
