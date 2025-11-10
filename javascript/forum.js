// Initialize Locomotive Scroll
const scroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true,
  multiplier: 1,
  class: "is-inview",
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero title animation
gsap.from(".hero-title", {
  opacity: 0,
  y: 50,
  duration: 1.5,
  ease: "power3.out",
});

gsap.from(".hero p", {
  opacity: 0,
  y: 30,
  duration: 1.5,
  delay: 0.3,
  ease: "power3.out",
});

gsap.from(".cta-button", {
  opacity: 0,
  scale: 0.8,
  duration: 1,
  delay: 0.6,
  ease: "back.out(1.7)",
});

// Generate random guest ID on page load
let guestId = localStorage.getItem("guestId");
if (!guestId) {
  guestId = "guest_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("guestId", guestId);
}

// Sample posts data (In production, this would come from Firebase)
let posts = [
  {
    id: 1,
    author: "Anonymous",
    title: "Dealing with exam anxiety",
    description:
      "I get really anxious before exams. My hands shake and I can't think straight. Anyone else experience this?",
    tag: "anxiety",
    upvotes: 24,
    comments: 12,
    reading: Math.floor(Math.random() * 5) + 1,
  },
  {
    id: 2,
    author: "Someone",
    title: "Feeling overwhelmed with assignments",
    description:
      "Three papers due this week and I haven't started any of them. Feeling paralyzed.",
    tag: "stress",
    upvotes: 31,
    comments: 18,
    reading: Math.floor(Math.random() * 5) + 1,
  },
  {
    id: 3,
    author: "Anonymous",
    title: "Small wins today",
    description:
      "I actually got out of bed and attended my morning class. It's something!",
    tag: "motivation",
    upvotes: 89,
    comments: 34,
    reading: Math.floor(Math.random() * 5) + 1,
  },
  {
    id: 4,
    author: "Anonymous",
    title: "Can't sleep, mind won't stop racing",
    description:
      "It's 3 AM and my brain just keeps replaying every embarrassing moment from the past 5 years.",
    tag: "sleep",
    upvotes: 42,
    comments: 23,
    reading: Math.floor(Math.random() * 5) + 1,
  },
  {
    id: 5,
    author: "Someone",
    title: "Loneliness on campus",
    description:
      "Surrounded by thousands of students but feel completely alone. Is this normal?",
    tag: "relationships",
    upvotes: 56,
    comments: 29,
    reading: Math.floor(Math.random() * 5) + 1,
  },
  {
    id: 6,
    author: "Anonymous",
    title: "How do you all cope with failure?",
    description:
      "Failed my midterm and feeling like I'm not cut out for this major.",
    tag: "depression",
    upvotes: 38,
    comments: 27,
    reading: Math.floor(Math.random() * 5) + 1,
  },
];

// Store posts in localStorage for persistence
if (!localStorage.getItem("forumPosts")) {
  localStorage.setItem("forumPosts", JSON.stringify(posts));
} else {
  posts = JSON.parse(localStorage.getItem("forumPosts"));
}

// Render posts
function renderPosts(filter = "all", searchTerm = "") {
  const postsGrid = document.getElementById("postsGrid");
  postsGrid.innerHTML = "";

  let filteredPosts = posts;

  // Filter by category
  if (filter !== "all") {
    filteredPosts = posts.filter((post) => post.tag === filter);
  }

  // Filter by search term
  if (searchTerm) {
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  filteredPosts.forEach((post, index) => {
    const postCard = document.createElement("div");
    postCard.className = "post-card";
    postCard.style.opacity = "0";
    postCard.style.transform = "translateY(30px)";

    postCard.innerHTML = `
                    <div class="post-header">
                        <span class="post-author">${post.author}</span>
                        <span class="post-tag">#${post.tag}</span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-description">${post.description.substring(
                      0,
                      100
                    )}...</p>
                    <div class="post-footer">
                        <div class="post-stats">
                            <span class="stat">💬 ${post.comments}</span>
                            <span class="stat">👍 ${post.upvotes}</span>
                        </div>
                        <button class="upvote-btn" onclick="upvotePost(${
                          post.id
                        })">Upvote</button>
                    </div>
                    <p class="reading-indicator">${
                      post.reading
                    } people reading this...</p>
                `;

    postCard.onclick = () => openThread(post.id);
    postsGrid.appendChild(postCard);

    // Animate card appearance with GSAP
    gsap.to(postCard, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.1,
      ease: "power2.out",
    });
  });

  // Update scroll
  scroll.update();
}

// Initial render
renderPosts();

// Category filter
document.querySelectorAll(".category-pill").forEach((pill) => {
  pill.onclick = function () {
    document
      .querySelectorAll(".category-pill")
      .forEach((p) => p.classList.remove("active"));
    this.classList.add("active");
    const category = this.getAttribute("data-category");
    renderPosts(category, document.getElementById("searchInput").value);
  };
});

// Search functionality
document.getElementById("searchInput").addEventListener("input", (e) => {
  const activeCategory = document
    .querySelector(".category-pill.active")
    .getAttribute("data-category");
  renderPosts(activeCategory, e.target.value);
});

// Modal functions
function openModal() {
  const modal = document.getElementById("createPostModal");
  modal.classList.add("active");
  gsap.from(".modal-content", {
    scale: 0.8,
    opacity: 0,
    duration: 0.4,
    ease: "back.out(1.7)",
  });
}

function closeModal() {
  const modal = document.getElementById("createPostModal");
  modal.classList.remove("active");
}

// Submit post
function submitPost(e) {
  e.preventDefault();

  const title = document.getElementById("postTitle").value;
  const description = document.getElementById("postDescription").value;
  const tag = document.getElementById("postTag").value;

  const newPost = {
    id: posts.length + 1,
    author: "Anonymous",
    title: title,
    description: description,
    tag: tag,
    upvotes: 0,
    comments: 0,
    reading: 0,
  };

  posts.unshift(newPost);
  localStorage.setItem("forumPosts", JSON.stringify(posts));

  renderPosts();
  closeModal();

  // Reset form
  document.getElementById("postForm").reset();

  // Success animation
  gsap.from(".posts-grid .post-card:first-child", {
    scale: 1.1,
    duration: 0.5,
    ease: "elastic.out(1, 0.5)",
  });
}

// Upvote post
function upvotePost(postId) {
  event.stopPropagation();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.upvotes++;
    localStorage.setItem("forumPosts", JSON.stringify(posts));
    renderPosts(
      document
        .querySelector(".category-pill.active")
        .getAttribute("data-category"),
      document.getElementById("searchInput").value
    );
  }
}

// Open thread view
function openThread(postId) {
  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  const threadModal = document.getElementById("threadModal");
  const threadContent = document.getElementById("threadContent");

  threadContent.innerHTML = `
                <div class="thread-post">
                    <div class="post-header">
                        <span class="post-author">${post.author}</span>
                        <span class="post-tag">#${post.tag}</span>
                    </div>
                    <h2 class="post-title">${post.title}</h2>
                    <p class="post-description">${post.description}</p>
                    <div class="post-footer">
                        <div class="post-stats">
                            <span class="stat">💬 ${post.comments}</span>
                            <span class="stat">👍 ${post.upvotes}</span>
                        </div>
                        <button class="upvote-btn" onclick="upvotePost(${post.id})">Upvote</button>
                    </div>
                </div>

                <div class="comments-section">
                    <h3>Comments</h3>
                    <div class="comment">
                        <p><strong>Anonymous:</strong> You're not alone in this. I've been there too.</p>
                    </div>
                    <div class="comment">
                        <p><strong>Someone:</strong> Have you tried talking to a counselor? It really helped me.</p>
                    </div>

                    <div class="comment-form">
                        <textarea class="comment-input" placeholder="Add your supportive comment..."></textarea>
                        <button class="submit-btn" style="margin-top: 1rem;">Post Comment</button>
                    </div>
                </div>
            `;

  threadModal.classList.add("active");
  gsap.from(".thread-post", {
    y: 30,
    opacity: 0,
    duration: 0.5,
  });
}

function closeThreadModal() {
  document.getElementById("threadModal").classList.remove("active");
}

// Random quotes
const quotes = [
  '"You are not alone"',
  '"Healing is progress"',
  '"Your feelings are valid"',
  '"Tomorrow is a new day"',
  '"You are stronger than you think"',
  '"Small steps are still steps"',
  '"Be kind to yourself"',
];

function updateQuote() {
  const quoteElement = document.getElementById("random-quote");
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  gsap.to(quoteElement, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      quoteElement.textContent = randomQuote;
      gsap.to(quoteElement, { opacity: 1, duration: 0.5 });
    },
  });
}

// Update quote every 10 seconds
setInterval(updateQuote, 10000);

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);

  const button = document.querySelector(".dark-mode-toggle");
  button.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  toggleDarkMode();
}

// Mood tracker
function logMood(mood) {
  const moodButtons = document.querySelectorAll(".mood-btn");
  moodButtons.forEach((btn) => btn.classList.remove("selected"));
  event.target.classList.add("selected");

  const message = document.getElementById("mood-message");
  message.style.opacity = "1";

  // Store mood anonymously
  const moodData = {
    mood: mood,
    timestamp: new Date().toISOString(),
    guestId: guestId,
  };

  let moods = JSON.parse(localStorage.getItem("moodLog") || "[]");
  moods.push(moodData);
  localStorage.setItem("moodLog", JSON.stringify(moods));

  gsap.from(message, {
    scale: 0.5,
    duration: 0.5,
    ease: "back.out(2)",
  });

  setTimeout(() => {
    message.style.opacity = "0";
  }, 3000);
}

// Scroll to forum
function scrollToForum() {
  scroll.scrollTo("#forum");
}

// Close modals on outside click
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("active");
  }
};

// Update reading indicators randomly
setInterval(() => {
  posts.forEach((post) => {
    post.reading = Math.floor(Math.random() * 8) + 1;
  });

  const activeCategory = document
    .querySelector(".category-pill.active")
    .getAttribute("data-category");
  const searchTerm = document.getElementById("searchInput").value;
  // Only update if we're still on the main view
  if (!document.getElementById("threadModal").classList.contains("active")) {
    renderPosts(activeCategory, searchTerm);
  }
}, 15000);
