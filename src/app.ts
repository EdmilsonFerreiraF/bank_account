import express, { NextFunction, Request, Response } from "express";

import { accountRouter } from "./controller/routes/accountRouter";
import "dotenv/config"

const app = express();

app.use(express.json());
app.use(accountRouter);
app.use(
    (err: Error, _: Request, res: Response, __: NextFunction) => {
        if (err instanceof Error) {
            return res.status(400).json({
                message: err.message
            })
        }

        return res.status(500).json({
            status: "error",
            message: `Internal server error - ${err}`
        })
    }
)

export { app }