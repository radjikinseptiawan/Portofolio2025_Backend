const express = require("express");
const { getAData, registerData, loginData, updateBio, addProjects, getProjectsData } = require("../utils/utils");
const verifySupabaseToken = require("../middleware/middleware");
const router = express.Router()


router.get("/",getAData)

router.post("/register",registerData)

router.post("/login",loginData)

router.post("/bio",verifySupabaseToken,updateBio)

router.post("/add-projects",addProjects)

router.get("/projects",getProjectsData)

module.exports = router