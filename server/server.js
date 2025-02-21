import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';

const PAGE_SIZE = 10;

const postApp = new Hono();

postApp.use(cors({ origin: "*" }));

let currentId = 1;

const postsData = [];

postApp.get("/api/posts", (c) => {
  const offset = parseInt(c.req.query("offset") || 0, 10);
  const limits = parseInt(c.req.query("limits") || 10, 10);

  // 型バリデーション
  if (isNaN(offset) || !Number.isInteger(offset)) {
    throw new HttpException(400, { message: "offset has invalid data type" });
  }
  if (isNaN(limits) || !Number.isInteger(limits)) {
    throw new HttpException(400, { message: "'limits' has invalid data type" })
  }

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
    throw new HttpException(400, { message: "Question must be provided" });
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
