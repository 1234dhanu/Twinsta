import React,{ useState, useEffect } from 'react';
import "../css/Createpost.css";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function Createpost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const navigate = useNavigate()

  //Toast functions
  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

  useEffect(() => { 
    // saving post to mongodb
    if(url){

    fetch("/createPost", {
      method:"post",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        body,
        pic:url
      })
    }).then(res=>res.json())
    .then(data=>{if(data.error){
      notifyA(data.error)
    }else{
      notifyB("Successfully Posted")
      navigate("/")
    }})
    .catch(err => console.log(err))
  }  
  }, [url,body,navigate])
  

  // posting image to cloudinary
  const postDetails = () => {
    console.log(body,image)
    const data = new FormData()
    data.append("file",image)
    data.append("upload_preset", "insta-clone")
    data.append("cloud_name","cantacloud6")
    fetch("https://api.cloudinary.com/v1_1/cantacloud6/image/upload",
    {
      method:"post",
      body:data
    }).then(res => res.json())
    .then(data => setUrl(data.url))
    .catch(err => console.log(err))

    // saving post to mongodb
    fetch("/createPost",{
      method:"post",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        body,
        pic:url
      })
    }).then(res=>res.json())
    .then(data=>console.log(data))
    .catch(err => console.log(err))
  }

  const loadfile = (event) => {
      var output = document.getElementById("output");
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
          URL.revokeObjectURL(output.src); // free memory
        };
      };

    return (
        <div className="createPost">
      {/* //header */}
      <div className="post-header">
      <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
        <button id="post-btn" onClick={() => { postDetails() }}> Share </button>
      </div>

      {/* image preview */}
      <div className="main-div">
        <img id="output" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKwAAACUCAMAAAA5xjIqAAAAY1BMVEX///8AAAD09PSxsbFkZGR1dXXx8fFeXl78/Py9vb3Z2dkPDw+2trbExMTl5eXNzc0VFRUoKCgwMDAbGxs4ODhVVVVPT0+RkZFqamqampqHh4ciIiKjo6NKSko/Pz+qqqp/f3+vg07PAAAEM0lEQVR4nO2c6XrqIBBAi0skmIiapS5xef+nvNW2SlgmQAhw7+X8denpfMMEBvDjI5FIJP4F8CwO8LAp7Rb1FoVnvVsc8xnoShfr0JYszVytmi1D2wlcNgrXzSq0moSayOPahBaTspPGNr4c+KbNRNc8tJSS7m9JgidCaGloI4AjL/sZ2gig5Vzx9f1a083Dc2PG+54rCJj5PySjLwSHl1FF+68wsrcwbgLkZbTO+68wskUYN4EkOxVJdiqS7FSMkc0IpZSoJu4TYC9bLJu62m737aHz9YCzlN0cEcvST3jtZPMa9ak+Y5XFRySy9JALNrInievXNHJ6WwvZTuqK0CFCWfUy8hSf7E4pu5V3HwLKqpLgQROZbHaVSL6YuNyaysKNj4mz1lQWXp83w+1ej7IzuK2oaPBBmFRnQ9lsD8puS1PX48XA1lB2A7qaz3xPQHN4clmgiS7jOcm4aie6qezABgP3HQP8TDKuurE1zVmwzKIz19XRctXPBNNqADfDtWP0gKmCmqPMtM5CT1uEVgauvYnmVavmmcqW4Pad0ONVwz1dap3YGk9kwKeC9rjGd/6jOs8TY9kScNWfGgiuWvluPp9Vb4vU2sNLujAa/ri57Eb5xNUuspK4PmM7lAkWazBVImiPLvmCE4k7BQ5kP3JpRdDtHIhji7GFY2vV5KCSdVihWwnAxwpcE+w6MtmC+yOt9kRWmQM/sYUywbYxR+7vcVYdtIcWHty7hjLBvotIylOzR+f2XhD9xYzGPjsQW6/N5OG4PtgpY+tV9iBRk1CrJpo+ZbXPWlSKTPAnizXj+mAnj60/WQNXVU3wJTszchW3vb3K8k+R4dhKWhCeZA3j+vQRM8GL7Mw4rg8qIbZeZC3P3Qk1wZksUba5Bpp5AGvO1pXs1/pBMZvBI84z7voRcCRLLghtpbbYKl9fUr3YupEl3/NFSVsuG3lOtGflRHbz2wET87Yd54rQmflOF7L0vZPLxdbJccZ3vXUgS9gVWc/Wvg6wvEM7Xpb0u6DMe7GbY6IOZYWV7ut4XTY6X13LErE/8/vuixtXd7JU1ku6uYyrO1l6ln595/RYsyNZyp8++WXuLAecyZbyuD6+y52qI1lSuVSaVrZUn5KITrb0FFcXsrKuZ6yy8n5ynLLU5x2xkbK5smbFJ5v7vXs3StZfHRgvW/hVHSULbYfGJlv4v9RqLTt0RibJJtkkm2STbJJNskk2yf5/ss3KNw21lcWZf7CtbFiS7FQk2alIslOhJevlBrAG71+24a9HMbJ7syszU8GcNhcOVzLbbufVIgKYXTfhDsYNxcuCj7qvfS4bxCMjwLH3wNTiWegQk1c9ZGfI5qGlFCylxQK+/RUKxa0zHGNFOCh/yJHClxb9c4YuoOIupt9GbI8Dd4UyUnzel+G53+ckkl85SyQSiUQikUjEyx+biGXAYGfSiwAAAABJRU5ErkJggg=="
        alt="" />
        <input type="file" accept="image/*" 
        onChange={(event) => {
          loadfile(event);
          setImage(event.target.files[0])
        }}  />
        </div>

        {/* details */}
        <div className="details">
            <div className="card-header">
                <div className="card-pic">
                    <img src="https://media.istockphoto.com/id/1226793777/photo/black-and-white-beautiful-smiling-woman-portrait-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=93Fs3jBtzZFyRBrT3_JtxGLmtBw8gLg6-7zj1Yr_MII=" 
                    alt="" />  
                </div>
                <h5>Dakshya</h5>
            </div>
            <textarea value={body} onChange={(e) => {
              setBody(e.target.value)
            }} type="text" placeholder="Write a caption...."></textarea>
        </div>
      </div>
    );
}
