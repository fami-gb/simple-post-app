import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';

const post = new Hono();

post.use(cors({ origin: "*" }));

let currentId = 1;
const PAGE_SIZE = 10;

const postsData = [];

post.get("/api/posts", (c) => {
  const page = c.req.query("page") || 1;
  
  // 表示するデータの範囲
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  // ページ毎にデータを分ける
  const splitedPosts = postsData.slice(startIndex, endIndex);

   return c.json(splitedPosts, 200)
});

post.post("/api/posts", async (c) => {
  const param = await c.req.json();

  if (!param.question) {
    throw new HttpException(400, { message: "Question must be provided" });
  }

  const newPost = {
    id: String(currentId++),
    question: param.question,
  };

  postsData.push(newPost);

  return c.json({ message: "Successfully created" }, 200);
});

post.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
});

serve({
  fetch: post.fetch,
  port: 8000,
});