

import express from "express"

import { userAuth} from "../Middleware/userAuth.js"

import {  createInterview , updateInterview , getRecruiterInterviews ,  getMyInterviews } from "../controllers/interviewController.js"


const router = express.Router()


router.post("/",   userAuth,  createInterview)

router.put("/:id",   userAuth,  updateInterview )

router.get("/",  userAuth, getRecruiterInterviews)

router.get("/my",  userAuth, getMyInterviews)





export default router;



