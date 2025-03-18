let offset = 0;
const PAGE_SIZE = 10;

const submitBtnElement = document.getElementById("submit");
const nextBtnElement = document.getElementById("next");
const prevBtnElement = document.getElementById("prev");

const fetchAndDisplayPosts = async () => {
    const response = await fetch(`http://localhost:8000/api/posts?offset=${offset}&limits=${PAGE_SIZE}`);
    const postList = await response.json();
    const postListElement = document.getElementById("post-list");
    postListElement.innerHTML = "";

    // 前へボタンの無効化
    prevBtnElement.disabled = offset === 0;
    // 次へボタンの無効化
    nextBtnElement.disabled = !(await hasNextPage());

    postList.forEach((post) => {
        const paraElement1 = document.createElement("div");
        paraElement1.innerHTML = post.question;

        const paraElement2 = document.createElement("div");
        const date = new Date(post.Date);
        paraElement2.innerHTML = date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo"});

        const postElement = document.createElement("div");
        postElement.appendChild(paraElement1);
        postElement.appendChild(paraElement2);

        postListElement.appendChild(postElement);
    });
};

const hasNextPage = async () => {
    const response = await fetch('http://localhost:8000/api/posts/count');
    const data = await response.json();
    return (offset + PAGE_SIZE < data.count);
};

prevBtnElement.addEventListener("click", () => {
    offset -= PAGE_SIZE;
    fetchAndDisplayPosts();
});
nextBtnElement.addEventListener("click", () => {
    offset += PAGE_SIZE;
    fetchAndDisplayPosts();
});

submitBtnElement.addEventListener("click", async () => {
    const qTextElement = document.getElementById("qbox");
    if (!qTextElement) return;
    await fetch("http://localhost:8000/api/posts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"question":qTextElement.value}),
    });
    qTextElement.value = "";
    fetchAndDisplayPosts();
});

document.addEventListener("DOMContentLoaded", () => fetchAndDisplayPosts());
