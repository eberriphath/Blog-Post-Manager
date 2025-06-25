// Backend URL 
const apiURL = 'http://localhost:3000/posts';

// When page is ready 
document.addEventListener("DOMContentLoaded", () => {
  showAllPosts();
  setupNewPostForm();
});

// Get all posts and display on left side 
function showAllPosts() {
  fetch(apiURL)
    .then(res => res.json())
    .then(posts => {
      const list = document.getElementById("post-list");
      list.innerHTML = "<h2>Posts</h2>";

      posts.forEach(post => {
        const item = document.createElement("div");
        item.textContent = post.title;
        item.dataset.id = post.id;
        item.style.cursor = "pointer";

        item.addEventListener("click", () => {
          getPostDetails(post.id);
        });

        list.appendChild(item);
      });

      if (posts.length > 0) {
        getPostDetails(posts[0].id); 
        // show first post by default
      }
    });
}

// Get and show one post details 
function getPostDetails(postId) {
  fetch(`${apiURL}/${postId}`)
    .then(res => res.json())
    .then(data => {
      displayPost(data);
    });
}

// Show post content on the right 
function displayPost(post) {
  const detail = document.getElementById("post-detail");

  detail.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.content}</p>
    <p><strong>Author:</strong> ${post.author}</p>
    <button id="delete-btn">Delete</button>
  `;

  setupDelete(post.id);
}

// new post form 
function setupNewPostForm() {
  const form = document.getElementById("new-post-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newPost = {
      title: form.title.value.trim(),
      content: form.content.value.trim(),
      author: form.author.value.trim(),
    };

    // Debug
    console.log("New post data:", newPost);

    // Simple validation
    if (!newPost.title || !newPost.content || !newPost.author) {
      alert("Please fill out everything.");
      return;
    }

    // Save to API
    fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then(res => res.json())
      .then(data => {
        form.reset(); // clear form
        showAllPosts(); // refresh list
        getPostDetails(data.id); // show new post
      });
  });
}

// Delete a post
function setupDelete(id) {
  const deleteBtn = document.getElementById("delete-btn");
  deleteBtn.addEventListener("click", () => {
    fetch(`${apiURL}/${id}`, {
      method: "DELETE",
    }).then(() => {
      document.getElementById("post-detail").innerHTML = "<p>Select a post to view its details.</p>";
      showAllPosts();
    });
  });
}
