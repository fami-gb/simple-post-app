let currentPage = 1;

const submitBtn = document.getElementById("submit");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const fetchAndDisplayPosts = async (page) => {
    const response = await fetch("http://localhost:8000/api/posts?page=" + String(page));
    const postList = await response.json();
    const postListElement = document.getElementById("post-list");
    postListElement.innerHTML = "";

    // ボタンの無効処理
    prevBtn.disabled = (page == 1);
    nextBtn.disabled = (Object.keys(postList).length === 0);

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
prevBtn.addEventListener("click", () => {
    currentPage--;
    fetchAndDisplayPosts(currentPage);
});
nextBtn.addEventListener("click", () => {
    currentPage++;
    fetchAndDisplayPosts(currentPage);
});

submitBtn.addEventListener("click", async () => {
    const qText = (document.getElementById("qbox")).value;
    await fetch("http://localhost:8000/api/posts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"question": qText}),
    });
    fetchAndDisplayPosts(currentPage);
});

document.addEventListener("DOMContentLoaded", fetchAndDisplayPosts(1));
