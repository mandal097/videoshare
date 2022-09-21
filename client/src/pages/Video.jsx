import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from '../components/Loading'
import { useNavigate } from 'react-router-dom';
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Comments from "../components/Comments";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../config/axios";
import { fetchSuccess, updateDisLikes, updateLikes } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import Recommendations from "../components/Recommendations";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Container = styled.div`
  display: flex;
  gap: 24px;
  /* border:1px solid red; */
  `;

const Content = styled.div`
  flex: 6;
  /* border:1px solid blue; */
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor:pointer;
  &:hover{
    transform:scale(1.06);
  }
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
  cursor:pointer;
  text-transform:capitalize;
  &:hover{
    color:skyblue;
  }
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;



const VideoFrame = styled.video`
  max-height:500px;
  width:100%;
  object-fit:cover;  
`

const Video = () => {
  const { currentVideo } = useSelector((state) => state.video);
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentVideo);
  const path = useLocation();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState({});
  const id = path.pathname.split('/')[2];

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${id}`);
        dispatch(fetchSuccess(videoRes.data));
        if (videoRes) {
          const channelRes = await axios.get(`/user/find/${videoRes.data.userId}`);
          setChannel(channelRes.data.user);
          await axios.put(`/videos/vid-f/views/${id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchVideo();
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }, [id, dispatch]);

  const handleLikes = async () => {
    const token = localStorage.getItem('token')
    if (currentUser !== null) {
      await axios.put(`/videos/vid-l/likes/${currentVideo._id}`, {}, {
        headers: {
          token: `Bearer ${token}`
        }
      })
      dispatch(updateLikes(currentUser._id))
    } else {
      toast.error("you have to log in first")
    }

  };
  const handleDisLikes = async () => {
    const token = localStorage.getItem('token')
    if (currentUser !== null) {
      await axios.put(`/videos/vid-l/dislikes/${currentVideo._id}`, {}, {
        headers: {
          token: `Bearer ${token}`
        }
      })
      dispatch(updateDisLikes(currentUser._id))
    } else {
      toast.error("you have to log in first");
    }
  };

  const handleSubscribed = async () => {
    const token = localStorage.getItem('token')
    if (currentUser !== null) {
      if (currentUser.subscribedUsers.includes(channel._id)) {
        await axios.put(`/user/subscribe/unsub/${channel._id}`, {}, {
          headers: {
            token: `Bearer ${token}`
          }
        })
        dispatch(subscription(channel._id))
      } else {
        await axios.put(`/user/subscribe/sub/${channel._id}`, {}, {
          headers: {
            token: `Bearer ${token}`
          }
        });
        dispatch(subscription(channel._id))
      }
    } else {
      toast.error("You have to log in to subscribe")
    }
  }


  return (
    <Container>
      <ToastContainer />
      {
        loading ?
            <Loading/>
          :
          <>

            <Content>
              <VideoWrapper>
                <VideoFrame controls src={currentVideo?.videoUrl} autoPlay />
              </VideoWrapper>
              <Title>{currentVideo?.title}</Title>
              <Details>
                <Info>{currentVideo?.views} views • {format(currentVideo?.createdAt)}</Info>
                <Buttons>
                  {
                    currentUser ?
                      (
                        <>
                          <Button onClick={handleLikes}>
                            {currentUser.likes?.includes(currentUser._id) ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                            {currentVideo.likes.length}
                          </Button>
                          <Button onClick={handleDisLikes}>
                            {currentUser.dislikes?.includes(currentUser._id) ? <ThumbDownIcon /> : <ThumbDownOffAltOutlinedIcon />}{currentVideo.dislikes.length}
                          </Button>

                        </>
                      ) : (
                        <>

                          <Button onClick={handleLikes}>
                            {currentUser?.likes.includes(currentUser._id) ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                            {currentVideo.likes.length}
                          </Button>
                          <Button onClick={handleDisLikes}>
                            {currentUser?.dislikes.includes(currentUser._id) ? <ThumbDownIcon /> : <ThumbDownOffAltOutlinedIcon />}{currentVideo.dislikes.length}
                          </Button>
                        </>
                      )
                  }
                  <Button>
                    <ReplyOutlinedIcon /> Share
                  </Button>
                  <Button>
                    <AddTaskOutlinedIcon /> Save
                  </Button>
                </Buttons>
              </Details>
              <Hr />
              <Channel>
                <ChannelInfo>
                  <Image src={channel.img} onClick={() => navigate(`/channel/${channel._id}`)} />
                  <ChannelDetail>
                    <ChannelName onClick={() => navigate(`/channel/${channel._id}`)}>{channel.name}</ChannelName>
                    <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
                    <Description>
                      {currentVideo.desc}
                    </Description>
                  </ChannelDetail>
                </ChannelInfo>
                <Subscribe onClick={handleSubscribed}>
                  {currentUser?.subscribedUsers.includes(channel._id) ? "SUBSCRIBED" : "SUBSCRIBE"}
                </Subscribe>
              </Channel>
              <Hr />
              <Comments videoId={currentVideo?._id} />
            </Content>
            <Recommendations tags={currentVideo?.tags} />
          </>
      }
    </Container>
  );
};

export default Video;
