import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';

const post = new Hono();

post.use(
    "*",
    cors({
      origin: "null",
    })
  );

let PostData = [
  { id: "1", title: "投稿タイトル", description: "内容が入る" },
];

post.get("/", async (c) => {
  new Response(JSON.stringify(PostData), {
    headers: { 'Content-Type': 'application/json' },
})
});

post.post("/", async (c) => {
  const param = await c.req.json();
  const newPost = {
      id: String(Number(PostData.length === 0 ? "1" : PostData[PostData.length - 1].id) + 1),
      title: param.title,
      description: param.description,
  }
  PostData = [...PostData, newPost];

  return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
  });
});

const app = new Hono();
app.route("/api/posts", post);
  
serve({
  fetch: app.fetch,
  port: 8000,
});