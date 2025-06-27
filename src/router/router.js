const express = require("express");
const { updateBio, getProjectsData,getProjectStack, addProjectsData, dropProjectData } = require("../utils/project");
const {loginData,registerData} = require("../utils/account")
const verifySupabaseToken = require("../middleware/middleware");
const {getAData} = require("../utils/account")
const router = express.Router()


router.get("/",getAData)

router.post("/register",verifySupabaseToken,registerData)

router.post("/login",loginData)

router.post("/bio",verifySupabaseToken,updateBio)

router.get("/projects",getProjectsData)

router.post("/projects",verifySupabaseToken,addProjectsData)

router.delete("/projects/:id",verifySupabaseToken,dropProjectData)

router.get("/projects/stack",getProjectStack)

module.exports = router