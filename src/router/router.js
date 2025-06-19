const express = require("express");
const { getAData, registerData, loginData, updateBio, getProjectsData } = require("../utils/utils");
const verifySupabaseToken = require("../middleware/middleware");
const router = express.Router()


router.get("/",getAData)

router.post("/register",verifySupabaseToken,registerData)

router.post("/login",loginData)

router.post("/bio",verifySupabaseToken,updateBio)

router.get("/projects",getProjectsData)


module.exports = router