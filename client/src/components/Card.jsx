import axios from "../config/axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from "react-redux";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "310px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
  `;

const Image = styled.img`
width: 100%;
height: ${(props) => (props.type === "sm" ? "100px" : "190px")};
cursor: pointer;
  background-color: #999;
  flex: 1;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  position:relative;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;
const Edit = styled.button`
  font-size: 40px;
  color: ${({ theme }) => theme.textSoft};
  background-color: ${({ theme }) => theme.bg};
  border:none;
  margin-left:auto;
  width:25px;
  align-self:flex-start;
  cursor:pointer;
  transform:scale(1.3);
  &:hover{
    transform:scale(1.4);
  }
  `;
const UpdateFields = styled.div`
width:140px;
height:auto;
border:1px solid ${({ theme }) => theme.textSoft};
background-color: ${({ theme }) => theme.bgLighter};
color: ${({ theme }) => theme.textSoft};
border-radius:5px;
position:absolute;
top:50px;
right:-70px;
z-index:101;
display:flex;
flex-direction:column;
align-items:center;
`;
const UpdateField = styled.div`
font-size:14px;
width:90%;
height:auto;
/* border-bottom:1px solid ${({ theme }) => theme.textSoft}; */
background-color: ${({ theme }) => theme.bgLighter};
margin:10px 5px;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
&:hover{
  transform:scale(1.1);
}
`;

const Card = ({ type, video, channel }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {

    const fetchUser = async () => {
      const res = await axios.get(`/user/find/${video.userId}`)
      setUser(res.data.user)
    }
    fetchUser()
  }, [video.userId]);


  const edit = (e) => {
    e.persist();
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    setShow(true)
  }

  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref?.current?.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const deleteVideo = async () => {
    const res = axios.delete(`/videos/delete/${video._id}`, {
      headers: {
        token: `Bearer ${localStorage.getItem('token')}`
      }
    })
    setTimeout(() => {
      window.location.reload()
    }, 1000);
    console.log(res.data);
  }
  return (
    <Container type={type}>
      <Link to={`/video/${video._id}`} refresh='true' style={{ textDecoration: "none" }}>
        <Image
          type={type}
          src={video.imgUrl}
        />
      </Link>
      <Details type={type}>
        <ChannelImage
          type={type}
          src={user.img}
        />
        <Texts>
          <Title>{video.title}</Title>
          <ChannelName>{user.name}</ChannelName>
          <Info>{video.views} views • {format(video.createdAt)}</Info>
        </Texts>
        {
          currentUser &&
          <>
            {
              type === "channel" &&
              Object.values(currentUser)?.includes(user?._id) &&
              <>
                <Edit onClick={edit}><MoreVertIcon /></Edit>
              </>
            }
            {
              Object.values(currentUser)?.includes(user?._id) && show &&
              <UpdateFields ref={ref} >
                <UpdateField onClick={deleteVideo}>Delete</UpdateField>
              </UpdateFields>
            }
          </>
        }
      </Details>
    </Container>
  );
};

export default Card;
