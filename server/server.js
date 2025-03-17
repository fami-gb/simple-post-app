import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { vValidator } from "@hono/valibot-validator";
import { HTTPException } from 'hono/http-exception';
import * as v from "valibot";

const PAGE_SIZE = 10;

const postApp = new Hono();

postApp.use(cors({ origin: "*" }));

let currentId = 1;

const postsData = [];

const schema = v.object({
  offset: v.pipe(
    v.string(),
    v.transform((value) => {
      const num = parseFloat(value);
      if (!isInt(value, num)) throw new HTTPException(400, { message: 'offset must be a valid number' });
      return num;
    })
  ),
  limits: v.pipe(
    v.string(),
    v.transform((value) => {
      const num = parseFloat(value);
      if (!isInt(value, num)) throw new HTTPException(400, { message: 'limits must be valid number' });
      return num;
    })
  )
})

const isInt = (value, num) => { return !isNaN(value) && (num | 0) === num };

postApp.get("/api/posts", vValidator("query", schema), (c) => {
  const offset = c.req.query("offset") || 0;
  const limits = c.req.query("limits") || PAGE_SIZE;

  // ページ毎にデータを分ける
  const splitedPosts = postsData.slice(offset, offset + limits);

  // 日付(新しい)順にする。
  splitedPosts.sort((a, b) => {
    return a.Date < b.Date ? 1 : -1;
  });
  return c.json(splitedPosts, 200)
});

postApp.post("/api/posts", async (c) => {
  const param = await c.req.json();

  if (!param.question) {
    throw new HTTPException(400, { message: "Question must be provided" });
  }

  const newPost = {
    id: String(currentId++),
    Date: new Date(),
    question: param.question,
  };

  postsData.push(newPost);

  return c.json({ message: "Successfully created" }, 200);
});

postApp.get("/api/posts/count", (c) => {
  const postsCount = postsData.length;
  return c.json({ count: postsCount }, 200);
});

postApp.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
});

serve({
  fetch: postApp.fetch,
  port: 8000,
});
