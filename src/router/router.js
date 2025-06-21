const express = require("express");
const { getAData, registerData, loginData, updateBio, getProjectsData, addProjectsData, dropProjectData } = require("../utils/utils");
const verifySupabaseToken = require("../middleware/middleware");
const router = express.Router()


router.get("/",getAData)

router.post("/register",verifySupabaseToken,registerData)

router.post("/login",loginData)

router.post("/bio",verifySupabaseToken,updateBio)

router.get("/projects",getProjectsData)

router.post("/projects",verifySupabaseToken,addProjectsData)

router.delete("/projects/:id",verifySupabaseToken,dropProjectData)
module.exports = router