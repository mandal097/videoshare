import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "../config/axios";
import { format } from "timeago.js";
import DeleteOutLineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit:cover;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;
const Delete = styled.div`
  /* font-size: 20px; */
  color:red;
  /* color:${({ theme }) => theme.text}; */
  margin-left:auto;
  cursor:pointer;
  &:hover{
  transform:scale(1.1) rotate(9deg);
}
`;

const Comment = ({ comment }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`/user/find/${comment.userId}`);
      setUser(res.data.user);
    }
    fetchUsers()
  }, [comment.userId]);
  // console.log(user);

  const deleteComment = async () => {
    try {
      await axios.delete(`/comments/delete/${comment._id}`, {
        headers: {
          token: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("deleted successfully")
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Container>
      <ToastContainer />
      <Avatar src={user.img} />
      <Details>
        <Name>
          {user.name} <Date>{format(comment.createdAt)}</Date>
        </Name>
        <Text>
          {comment.desc}
        </Text>
      </Details>
      {
        Object.values(user).includes(currentUser?._id) &&
        <Delete onClick={deleteComment}>
          <DeleteOutLineOutlined />
        </Delete>
      }
    </Container>
  );
};

export default Comment;
