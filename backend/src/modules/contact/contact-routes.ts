import { Hono } from "hono";
import { createContactMessage } from "./contact-controllers";

const contactRoutes = new Hono();

contactRoutes.post("/", createContactMessage);

export default contactRoutes;
