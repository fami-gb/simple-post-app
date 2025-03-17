let offset = 0;
const PAGE_SIZE = 10;

const submitBtnElement = document.getElementById("submit");
const nextBtnElement = document.getElementById("next");
const prevBtnElement = document.getElementById("prev");

const fetchAndDisplayPosts = async (offset=0) => {
    const response = await fetch(`http://localhost:8000/api/posts?offset=${offset}&limits=${PAGE_SIZE}`);
    const postList = await response.json();
    const postListElement = document.getElementById("post-list");
    postListElement.innerHTML = "";

    prevBtnElement.disabled = offset == 0;
    nextBtnElement.disabled = Object.keys(postList).length < 10;
    if (Object.keys(postList).length === 0) {
        nextBtnElement.disabled = false;
        offset -= 10;
        fetchAndDisplayPosts(offset);
        return;
    }

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
// 次へ、前へのボタンで(1,2,3) => (2,3,4)のようにしてページネーションを実現する
// 今は取り敢えず「前へ」「次へ」のみでページネーションを実現させる。
prevBtnElement.addEventListener("click", () => {
    offset -= PAGE_SIZE;
    fetchAndDisplayPosts(offset);
});
nextBtnElement.addEventListener("click", () => {
    offset += PAGE_SIZE;
    fetchAndDisplayPosts(offset);
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
    fetchAndDisplayPosts(offset);
});

document.addEventListener("DOMContentLoaded", fetchAndDisplayPosts());
