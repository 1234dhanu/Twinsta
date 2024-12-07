import React, { useState, useEffect } from "react";
import "../css/Createpost.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Createpost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);

  const navigate = useNavigate();

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    if (url) {
      fetch("http://localhost:5000/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body: selectedCaption || body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notifyA(data.error);
          } else {
            notifyB("Successfully Posted");
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [url, selectedCaption, body, navigate]);

  const fetchCaptions = (newPage) => {
    if (!keyword) {
      notifyA("Please enter a keyword");
      return;
    }
  
    fetch(`http://localhost:5000/fetch-captions?keyword=${encodeURIComponent(keyword)}&page=${newPage}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.captions) {
          setCaptions(data.captions.map(caption => caption.text)); // Extract text from caption objects
          setHasNext(data.hasNext);
          setHasPrevious(data.hasPrevious);
          setShowCaptions(true);
          setPage(newPage);
        } else {
          notifyA(data.error || "No captions found.");
        }
      })
      .catch((err) => console.log(err));
  };
  

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "cantacloud6");

    fetch("https://api.cloudinary.com/v1_1/cantacloud6/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  const loadfile = (event) => {
    const output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
    setImage(event.target.files[0]);
  };

  return (
    <div className="createPost">
      <div className="post-header">
        <h4>Create New Post</h4>
        <button id="post-btn" onClick={postDetails}>
          Share
        </button>
      </div>

      <div className="main-div">
        <img id="output" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKwAAACUCAMAAAA5xjIqAAAAY1BMVEX///8AAAD09PSxsbFkZGR1dXXx8fFeXl78/Py9vb3Z2dkPDw+2trbExMTl5eXNzc0VFRUoKCgwMDAbGxs4ODhVVVVPT0+RkZFqamqampqHh4ciIiKjo6NKSko/Pz+qqqp/f3+vg07PAAAEM0lEQVR4nO2c6XrqIBBAi0skmIiapS5xef+nvNW2SlgmQAhw7+X8denpfMMEBvDjI5FIJP4F8CwO8LAp7Rb1FoVnvVsc8xnoShfr0JYszVytmi1D2wlcNgrXzSq0moSayOPahBaTspPGNr4c+KbNRNc8tJSS7m9JgidCaGloI4AjL/sZ2gig5Vzx9f1a083Dc2PG+54rCJj5PySjLwSHl1FF+68wsrcwbgLkZbTO+68wskUYN4EkOxVJdiqS7FSMkc0IpZSoJu4TYC9bLJu62m737aHz9YCzlN0cEcvST3jtZPMa9ak+Y5XFRySy9JALNrInievXNHJ6WwvZTuqK0CFCWfUy8hSf7E4pu5V3HwLKqpLgQROZbHaVSL6YuNyaysKNj4mz1lQWXp83w+1ej7IzuK2oaPBBmFRnQ9lsD8puS1PX48XA1lB2A7qaz3xPQHN4clmgiS7jOcm4aie6qezABgP3HQP8TDKuurE1zVmwzKIz19XRctXPBNNqADfDtWP0gKmCmqPMtM5CT1uEVgauvYnmVavmmcqW4Pad0ONVwz1dap3YGk9kwKeC9rjGd/6jOs8TY9kScNWfGgiuWvluPp9Vb4vU2sNLujAa/ri57Eb5xNUuspK4PmM7lAkWazBVImiPLvmCE4k7BQ5kP3JpRdDtHIhji7GFY2vV5KCSdVihWwnAxwpcE+w6MtmC+yOt9kRWmQM/sYUywbYxR+7vcVYdtIcWHty7hjLBvotIylOzR+f2XhD9xYzGPjsQW6/N5OG4PtgpY+tV9iBRk1CrJpo+ZbXPWlSKTPAnizXj+mAnj60/WQNXVU3wJTszchW3vb3K8k+R4dhKWhCeZA3j+vQRM8GL7Mw4rg8qIbZeZC3P3Qk1wZksUba5Bpp5AGvO1pXs1/pBMZvBI84z7voRcCRLLghtpbbYKl9fUr3YupEl3/NFSVsuG3lOtGflRHbz2wET87Yd54rQmflOF7L0vZPLxdbJccZ3vXUgS9gVWc/Wvg6wvEM7Xpb0u6DMe7GbY6IOZYWV7ut4XTY6X13LErE/8/vuixtXd7JU1ku6uYyrO1l6ln595/RYsyNZyp8++WXuLAecyZbyuD6+y52qI1lSuVSaVrZUn5KITrb0FFcXsrKuZ6yy8n5ynLLU5x2xkbK5smbFJ5v7vXs3StZfHRgvW/hVHSULbYfGJlv4v9RqLTt0RibJJtkkm2STbJJNskk2yf5/ss3KNw21lcWZf7CtbFiS7FQk2alIslOhJevlBrAG71+24a9HMbJ7syszU8GcNhcOVzLbbufVIgKYXTfhDsYNxcuCj7qvfS4bxCMjwLH3wNTiWegQk1c9ZGfI5qGlFCylxQK+/RUKxa0zHGNFOCh/yJHClxb9c4YuoOIupt9GbI8Dd4UyUnzel+G53+ckkl85SyQSiUQikUjEyx+biGXAYGfSiwAAAABJRU5ErkJggg=="
        alt="" />
        <label className="upload-label" htmlFor="file-upload">
          Choose File
        </label>
        <input type="file" id="file-upload" accept="image/*" onChange={loadfile} />
      </div>

      <div className="keyword-input">
  <h5>Enter a Keyword:</h5>
  <select
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    className="keyword-dropdown"
  >
    <option value="">Select a Keyword</option>
    <option value="nature">Nature</option>
    <option value="plants">Plants</option>
    <option value="waterfall">Waterfalls</option>
    <option value="ocean">Ocean</option>
    <option value="sea">Sea</option>
    <option value="beach">Beach</option>
    <option value="rain">Rain</option>
    <option value="beauty">Beauty</option>
    <option value="photography">Photography</option>
    <option value="selfie">Selfie</option>
    <option value="reels">Reels</option>
    <option value="influencer">Influencer</option>
    <option value="fashion">Fashion</option>
    <option value="travel">Travel</option>
    <option value="hospitality">Hospitality</option>
    <option value="food">Food</option>
    <option value="beverage">Beverage</option>
    <option value="cooking">Cooking</option>
    <option value="veggie">Veggie</option>
    <option value="fitness">Fitness</option>
    <option value="sports">Sports</option>
    <option value="games">Games</option>
    <option value="mental health">Mental Health</option>
    <option value="motivation">Motivation</option>
    <option value="self love">Self Love</option>
    <option value="relax">Relax</option>
    <option value="pet">Pet</option>
    <option value="dog">Dog</option>
    <option value="cat">Cat</option>
    <option value="summer">Summer</option>
    <option value="spring">Spring</option>
    <option value="autumn">Autumn</option>
    <option value="winter">Winter</option>
    <option value="love">Love</option>
    <option value="halloween">Halloween</option>
    <option value="valentine">Valentine</option>
    <option value="new year">New Year</option>
    <option value="birthday">Birthday</option>
    <option value="easter">Easter</option>
    <option value="christmas">Christmas</option>
    <option value="thanking">Thanking</option>
    <option value="event">Event</option>
    <option value="coffee">Coffee</option>
    <option value="day">Day</option>
    <option value="monday">Monday</option>
    <option value="music">Music</option>
    <option value="dance">Dance</option>
    <option value="art">Art</option>
    <option value="book">Book</option>
    <option value="inspiration">Inspiration</option>
    <option value="movie">Movie</option>
    <option value="memes">Memes</option>
    <option value="creativity">Creativity</option>
    <option value="technology">Technology</option>
    <option value="education">Education</option>
    <option value="business">Business</option>
    <option value="content">Content</option>
    <option value="blogging">Blogging</option>
    <option value="friends">Friends</option>
    <option value="peace">Peace</option>
    <option value="flower">Flower</option>
    <option value="tree">Tree</option>
    <option value="river">River</option>
    <option value="sunrise">Sunrise</option>
    <option value="sunset">Sunset</option>
    <option value="family">Family</option>
    <option value="life">Life</option>
    <option value="lifestyle">Lifestyle</option>
    <option value="childhood">Childhood</option>
    <option value="fun">Fun</option>
    <option value="humour">Humour</option>
    <option value="culture">Culture</option>
    <option value="festival">Festival</option>
    <option value="celebration">Celebration</option>
    <option value="mountain">Mountain</option>
    <option value="sky">Sky</option>
    <option value="lake">Lake</option>
    <option value="park">Park</option>
    <option value="bird">Bird</option>
    <option value="rain">Rain</option>
    <option value="garden">Garden</option>
  </select>
  <button className="generate-captions-button" onClick={() => fetchCaptions(0)}>
    Select Caption
  </button>
</div>


      {showCaptions && (
        <div className="caption-selection">
          <div className="captions-list">
            {captions.map((caption, index) => (
              <div
                key={index}
                className={`caption-option ${selectedCaption === caption ? "selected" : ""}`}
                onClick={() => setSelectedCaption(caption)}
              >
                {caption}
              </div>
            ))}
          </div>
          <div className="pagination-buttons">
            {hasPrevious && <button onClick={() => fetchCaptions(page - 1)}>Previous</button>}
            {hasNext && <button onClick={() => fetchCaptions(page + 1)}>Next</button>}
          </div>
        </div>
      )}

      <div className="custom-caption">
        <h5>Write Your Own Caption:</h5>
        <textarea
          rows="4"
          placeholder="Type your caption here..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
    </div>
  );
}