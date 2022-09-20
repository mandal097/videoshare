import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import axios from "../config/axios";
import { useSelector } from "react-redux";
import SendSharpIcon from '@mui/icons-material/SendSharp';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  /* align-items: center; */
  gap: 10px;
  /* border:1px solid red; */
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Button = styled.button`
display:flex;
align-items:center;
width:35px;
height:35px;
background-color:${({ theme }) => theme.bgLighter};
border:1px solid ${({ theme }) => theme.textSoft};
color: ${({ theme }) => theme.textSoft};
border-radius:50%;
margin-top:5px;
transform:rotate(-24deg);
cursor:pointer;
&:hover{
  transform:scale(1.1) rotate(-29deg);
}
`;

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user)
  const [comments, setComments] = useState([]);
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/find/${videoId}`);
        setComments(res.data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchComments()
  }, [videoId]);

  const addComments = async (e) => {
    e.preventDefault()
    if (!desc) {
      toast.error("Write something in comments")
    } else {
      try {
        await axios.post(`/comments`, {
          desc: desc,
          videoId: videoId
        },
          {
            headers: {
              token: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        toast.success("Comment successfully")
        setDesc('');
      } catch (error) {
        toast.error("Something went wrong or need to login")
        console.log(error);
      }
    }
  }

  return (
    <Container>
      <ToastContainer />
      <NewComment>
        <Avatar src={currentUser?.img} />
        <Input placeholder="Add a comment..." onChange={(e) => setDesc(e.target.value)} />
        <Button onClick={addComments}>
          <SendSharpIcon />
        </Button>
      </NewComment>
      {
        comments.map(comment => (
          <Comment key={comment._id} comment={comment} />
        ))
      }
    </Container>
  );
};

export default Comments;
