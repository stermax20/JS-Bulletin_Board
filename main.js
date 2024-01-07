let posts = JSON.parse(localStorage.getItem('posts')) || [];

let selectedPost = null;

document.getElementById('postForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    posts.push({
        title: title,
        author: author,
        content: content,
        comments: [],
        likes: 0,
        dislikes: 0,
        reports: 0,
    });

    localStorage.setItem('posts', JSON.stringify(posts));

    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('content').value = '';

    document.getElementById('write_form').style.display = 'none';
    document.getElementById('board_area').style.display = 'block';
    document.getElementById('post_view').style.display = 'none';

    refreshBoard();

    document.getElementById('writeButton').textContent = '펼치기';
});

function refreshBoard() {
    const board = document.getElementById('board_area');
    board.innerHTML = '';

    for (const post of posts) {
        const div = document.createElement('div');
        div.textContent = post.title + ' by ' + post.author;
        div.addEventListener('click', function () {
            selectedPost = post;
            showPost(post);
        });
        board.appendChild(div);
    }
}

function showPost(post) {
    document.getElementById('post_title').innerText = '게시물 제목: ' + post.title;
    document.getElementById('post_author').innerText = '작성자: ' + post.author;
    document.getElementById('post_content').innerText = '내용: ' + post.content;
    document.getElementById('post_likes').innerText = '👍: ' + post.likes;
    document.getElementById('post_dislikes').innerText = '👎: ' + post.dislikes;
    if (post.reports > 0) {
        document.getElementById('post_reports').innerText = '신고된 사용자';
    } else {
        document.getElementById('post_reports').innerText = '';
    }

    showComments(post);
    document.getElementById('board_area').style.display = 'none';
    document.getElementById('post_view').style.display = 'block';
}

function showComments(post) {
    const commentsArea = document.getElementById('comments_area');
    commentsArea.innerHTML = '';

    for (const comment of post.comments) {
        const div = document.createElement('div');
        div.textContent = comment.author + ': ' + comment.content;
        commentsArea.appendChild(div);
    }
}

document.getElementById('commentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const author = document.getElementById('comment_author').value;
    const content = document.getElementById('comment_content').value;

    selectedPost.comments.push({
        author: author,
        content: content,
    });

    localStorage.setItem('posts', JSON.stringify(posts));

    document.getElementById('comment_author').value = '';
    document.getElementById('comment_content').value = '';

    showComments(selectedPost);
});

document.getElementById('writeButton').addEventListener('click', function () {
    const writeForm = document.getElementById('write_form');
    if (writeForm.style.display === 'none') {
        writeForm.style.display = 'block';
        this.textContent = '접기';
    } else {
        writeForm.style.display = 'none';
        this.textContent = '펼치기';
    }
});

document.getElementById('backButton').addEventListener('click', function () {
    document.getElementById('board_area').style.display = 'block';
    document.getElementById('post_view').style.display = 'none';
});

document.getElementById('likeButton').addEventListener('click', function () {
    selectedPost.likes++;
    localStorage.setItem('posts', JSON.stringify(posts));
    showPost(selectedPost);
    alert('좋아요를 눌렀습니다.');
});

document.getElementById('dislikeButton').addEventListener('click', function () {
    selectedPost.dislikes++;
    localStorage.setItem('posts', JSON.stringify(posts));
    showPost(selectedPost);
    alert('싫어요를 눌렀습니다.');
});

document.getElementById('reportButton').addEventListener('click', function () {
    selectedPost.reports++;
    localStorage.setItem('posts', JSON.stringify(posts));

    if (selectedPost.reports >= 10) {
        alert('신고 10번 누적으로 해당 게시물이 삭제됩니다.');

        setTimeout(function () {
            const index = posts.indexOf(selectedPost);
            if (index > -1) {
                posts.splice(index, 1);
            }
            localStorage.setItem('posts', JSON.stringify(posts));
            refreshBoard();
            document.getElementById('board_area').style.display = 'block';
            document.getElementById('post_view').style.display = 'none';
        }, 10000);
    } else {
        alert('신고하였습니다.');
    }
});

document.getElementById('deleteButton').addEventListener('click', function () {
    const index = posts.indexOf(selectedPost);
    if (index > -1) {
        posts.splice(index, 1);
    }
    localStorage.setItem('posts', JSON.stringify(posts));
    refreshBoard();
    document.getElementById('board_area').style.display = 'block';
    document.getElementById('post_view').style.display = 'none';
});

refreshBoard();
