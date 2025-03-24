import express, { Router } from "express"
import { register } from "../../controllers/auth/registerController"

const router: Router = express.Router()

router.post("/", register)

export default router