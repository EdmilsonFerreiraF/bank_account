import express from 'express';
import helmet from "helmet";
import morgan from "morgan";
import Handlebars from "handlebars";

import { logger, accessLogStream } from "../logger";
import { accountRouter } from "../controller/routes/accountRouter";

export default async ({ app }: { app: express.Application }) => {
    app.use(morgan('combined', { stream: accessLogStream }));
    app.use(helmet())
    app.use(express.json());
    app.use(accountRouter);
    app.use((req, res, done) => {
        logger.info(req.originalUrl);
        done();
    })
    
    const template = Handlebars.compile("Name: {{name}}");
    console.log(template({ name: "Nils" }));

    return app
}