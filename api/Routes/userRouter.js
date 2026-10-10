import express from "express";

const router = express.Router();


import {RegisterUser, LoginUser} from "../controllers/usercontroller.js";

import {userAuth }  from "../Middleware/userAuth.js";


//          for  User 

router.post("/register", RegisterUser);

router.post("/login",  LoginUser)




export default router;


