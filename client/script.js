const fetchAndDisplayPosts = async (page=1) => {
    const response = await fetch("http://localhost:8000/api/posts?page=" + String(page));
    const postList = await response.json();
    const postListElement = document.getElementById("post-list");
    postListElement.innerHTML = "";

    postList.forEach((post) => {
        const paraElement1 = document.createElement("div");
        paraElement1.innerHTML = post.question;

        const paraElement2 = document.createElement("div");
        paraElement2.innerHTML = post.Date;

        const postElement = document.createElement("div");
        postElement.appendChild(paraElement1);
        postElement.appendChild(paraElement2);

        postListElement.appendChild(postElement);
    });
};
// 次へ、前へのボタンで(1,2,3) => (2,3,4)のようにしてページネーションを実現する
// 今は取り敢えず3ページ分だけ実装しておく
var btn = new Array();
for (let i = 1; i < 4; i++){
    btn[i] = document.getElementById("btn" + String(i));
    btn[i].addEventListener("click", () => {
        fetchAndDisplayPosts(i);
    });
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayPosts());