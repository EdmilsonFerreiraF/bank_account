import express from "express";

import { init } from "./loaders";

export const app = express();

init({ expressApp: app });