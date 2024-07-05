let currentPage = 1;

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const fetchAndDisplayPosts = async (page) => {
    // ページ数が1のとき前へボタンを無効にする。
    let disabledFlag = (page == 1);
    prevBtn.disabled = disabledFlag;

    const response = await fetch("http://localhost:8000/api/posts?page=" + String(page));
    const postList = await response.json();
    const postListElement = document.getElementById("post-list");
    postListElement.innerHTML = "";

    if (Object.keys(postList).length  === 0) {
        // 「次へ」ボタンの処理
        // 納期がやばいので後々考えることにする。
    }

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

    currentPage = page;
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

document.addEventListener("DOMContentLoaded", fetchAndDisplayPosts(1));