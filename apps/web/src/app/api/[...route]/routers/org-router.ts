import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { spaceRouter } from "./space-router";

export const orgRouter = new Hono()
  .post(
    "/",
    zValidator(
      "form",
      z.object({
        name: z.string(),
        slug: z.string(),
        logo: z.string(),
      })
    ),
    async (c) => {
      const validate = c.req.valid("form");

      const user = c.get("user");

      if (!user) {
        throw new HTTPException(401, { message: "unauthorized" });
      }

      const org = await db.organization.create({
        data: {
          name: validate.name,
          slug: validate.slug,
          logo: validate.logo,
        },
      });

      const member = await db.member.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          role: "owner",
        },
      });

      return c.json(org);
    }
  )
  .route("/space", spaceRouter);
