import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

export default function Home() {
  const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  let limit = 10;
  let skip = 0;

  // Toast notification functions
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
    }

    fetchPosts();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navigate]);

  const fetchPosts = () => {
    fetch(`http://localhost:5000/allposts?limit=${limit}&skip=${skip}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData((prevData) => [...prevData, ...result]);
      })
      .catch((err) => console.error(err));
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.scrollHeight
    ) {
      skip += 10;
      fetchPosts();
    }
  };

  const toggleComments = (post) => {
    setShowComments(!showComments);
    setSelectedPost(post);
  };

  const likePost = (id) => {
    fetch("http://localhost:5000/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedData = data.map((post) =>
          post._id === result._id ? result : post
        );
        setData(updatedData);
      })
      .catch((err) => console.error(err));
  };

  const unlikePost = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedData = data.map((post) =>
          post._id === result._id ? result : post
        );
        setData(updatedData);
      })
      .catch((err) => console.error(err));
  };

  const makeComment = (text, id) => {
    fetch("http://localhost:5000/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ text, postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedData = data.map((post) =>
          post._id === result._id ? result : post
        );
        setData(updatedData);
        setComment("");
        notifySuccess("Comment posted");
      })
      .catch((err) => console.error(err));
  };

  const onEmojiClick = (emojiData) => {
    setComment(comment + emojiData.emoji);
    setEmojiPickerVisible(false);
  };

  return (
    <div className="home">
      {data.map((post) => (
        <div className="card" key={post._id}> {/* Using post._id as key */}
          <div className="card-header">
            <div className="card-pic">
              <img
                src={post.postedBy.Photo || picLink}
                alt={post.postedBy.name}
              />
            </div>
            <h5>
              <Link to={`/profile/${post.postedBy._id}`}>
                {post.postedBy.name}
              </Link>
            </h5>
          </div>
          <div className="card-image">
            <img src={post.photo} alt={post.body} />
          </div>
          <div className="card-content">
            {post.likes.includes(
              JSON.parse(localStorage.getItem("user"))._id
            ) ? (
              <span
                className="material-symbols-outlined material-symbols-outlined-red"
                onClick={() => unlikePost(post._id)}
              >
                favorite
              </span>
            ) : (
              <span
                className="material-symbols-outlined"
                onClick={() => likePost(post._id)}
              >
                favorite
              </span>
            )}
            <p>{post.likes.length} Likes</p>
            <p>{post.body}</p>
            <p
              style={{ fontWeight: "bold", cursor: "pointer" }}
              onClick={() => toggleComments(post)}
            >
              View all comments
            </p>
          </div>
          <div className="add-comment">
            <span
              className="material-symbols-outlined"
              onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
            >
              mood
            </span>
            {emojiPickerVisible && (
              <div className="emoji-picker-container">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
            <input
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="comment"
              onClick={() => makeComment(comment, post._id)}
            >
              Post
            </button>
          </div>
        </div>
      ))}

      {/* Show selected post comments */}
      {showComments && selectedPost && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={selectedPost.photo} alt={selectedPost.body} />
            </div>
            <div className="details">
              <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                <div className="card-pic">
                  <img
                    src={selectedPost.postedBy.Photo || picLink}
                    alt={selectedPost.postedBy.name}
                  />
                </div>
                <h5>{selectedPost.postedBy.name}</h5>
              </div>

              {/* Comment section */}
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {selectedPost.comments.map((comment, index) => (
                  <p className="comm" key={index}> {/* Using index as key is fine for comments */}
                    <span
                      className="commenter"
                      style={{ fontWeight: "bolder" }}
                    >
                      {comment.postedBy.name}
                    </span>
                    <span className="commentText">{comment.comment}</span>
                  </p>
                ))}
              </div>

              {/* Card content for selected post */}
              <div className="card-content">
                <p>{selectedPost.likes.length} Likes</p>
                <p>{selectedPost.body}</p>
              </div>

              {/* Add comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, selectedPost._id);
                    toggleComments(selectedPost); // Close the comments after posting
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div
            className="close-comment"
            onClick={() => setShowComments(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </div>
        </div>
      )}
    </div>
  );
}
