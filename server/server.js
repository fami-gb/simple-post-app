import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';

const post = new Hono();

post.use(cors({ origin: "*" }));

let PostData = [
  { id: "1", title: "投稿タイトル1", description: "内容が入る" },
  { id: "2", title: "投稿タイトル2", description: "内容が入る" },
  { id: "3", title: "投稿タイトル3", description: "内容が入る" },
  { id: "4", title: "投稿タイトル4", description: "内容が入る" },
  { id: "5", title: "投稿タイトル5", description: "内容が入る" },
  { id: "6", title: "投稿タイトル6", description: "内容が入る" },
  { id: "7", title: "投稿タイトル7", description: "内容が入る" },
  { id: "8", title: "投稿タイトル8", description: "内容が入る" },
  { id: "9", title: "投稿タイトル9", description: "内容が入る" },
  { id: "10", title: "投稿タイトル10", description: "内容が入る" },
  { id: "11", title: "投稿タイトル11", description: "内容が入る" },
];

let currentId = 1;

post.get("/api/posts", (c) => {
  const page = c.req.query("page") || 1;
  // 1ページあたりの最大投稿件数
  const pageSize = 10;
  
  // 表示するデータの範囲
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // ページ毎にデータを分ける
  const splitedPosts = PostData.slice(startIndex, endIndex);

   return c.json(splitedPosts, 200)
});

post.post("/api/posts", async (c) => {
  const param = await c.req.json();

  if (!param.title) {
    throw new Error("Title must be provided");
  }

  const newPost = {
    id: String(currentId++),
    title: param.title,
    description: param.description,
  };

  todoList.push(newPost);

  return c.json({ message: "Successfully created" }, 200);
});

serve({
  fetch: post.fetch,
  port: 8000,
});