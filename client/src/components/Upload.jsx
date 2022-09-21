import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../firebase';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
width: 100%;
height:100%;
position:fixed;
top:0;
left:0;
bottom:0;
right:0;
background-color:#0000007b;
display:flex;
align-items:center;
justify-content:center;
z-index:100;
`;
const Wrapper = styled.div`
width: 600px;
height:600px;
background-color:${({ theme }) => theme.bgLighter};
color:${({ theme }) => theme.text};
padding:20px;
display:flex;
flex-direction:column;
gap:20px;
position:relative;
`;
const Close = styled.div`
position:absolute;
top:10px;
right:10px;
font-size:20px;
cursor:pointer;
&:hover{
font-size:22px;
}
transition:all 300ms linear;
`;
const Title = styled.h3`
text-align:center;
`;
const Input = styled.input`
border:1px solid ${({ theme }) => theme.soft};
color:${({ theme }) => theme.text};
border-radius:3px;
padding:10px;
background-color:transparent;
margin-bottom:10px;
`;
const Desc = styled.textarea`
border:1px solid ${({ theme }) => theme.soft};
color:${({ theme }) => theme.text};
border-radius:3px;
padding:10px;
background-color:transparent;
margin-top:10px;
max-width:100%;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: ${(props) => props.disabled ? "not-allowed" : "pointer"};
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
font-size:16px;
`;

const Upload = ({ setOpen }) => {
    const navigate = useNavigate()

    const [img, setImg] = useState(undefined);
    const [video, setVideo] = useState(undefined);
    const [imgPerc, setImgPerc] = useState(0);
    const [videoPerc, setVideoPerc] = useState(0);

    const [inputs, setInputs] = useState({});
    const [tags, setTags] = useState([]);

    const handleChange = (e) => {
        setInputs(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const handleTags = (e) => {
        setTags(e.target.value.split(","));
    };

    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                urlType === 'imgUrl' ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress))
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => { },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => {
                        return { ...prev, [urlType]: downloadURL };
                    })
                    console.log('File available at', downloadURL);
                });
            }
        );
    }

    useEffect(() => {
        video && uploadFile(video, 'videoUrl')
    }, [video]);
    useEffect(() => {
        img && uploadFile(img, "imgUrl")
    }, [img]);

    const uploadToDb = async (e) => {
        e.preventDefault();
        // console.log("db clicked");
        if (!inputs || !tags || !video || !img) {
            toast.error("Please add all the fields")
        } else {
            const res = await axios.post('/videos', { ...inputs, tags }, {
                headers: {
                    token: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setOpen(false);
            res.status === 200 && navigate(`/video/${res.data._id}`)
        }
    }


    return (
        <Container>
            <ToastContainer />
            <Wrapper>
                <Close onClick={() => setOpen(false)}>X</Close>
                <Title>Upload a video</Title>
                <Label>Video :</Label>
                {videoPerc > 0 ? "Uploading" + videoPerc + "%" :
                    (
                        <Input
                            type="file"
                            accept='video/*'
                            onChange={e => setVideo(e.target.files[0])}
                        />
                    )
                }
                <Input
                    type="text"
                    placeholder='Title of the video'
                    name='title'
                    onChange={handleChange}
                />
                <Desc
                    type="text"
                    placeholder='Description'
                    rows={8}
                    name='desc'
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    placeholder='Separate tags with commas.'
                    onChange={handleTags}

                />
                <Label>Image :</Label>
                {imgPerc > 0 ? "Uploading" + imgPerc + "%" :
                    (
                        <Input
                            type="file"
                            accept='image/*'
                            onChange={e => setImg(e.target.files[0])}
                        />
                    )}
                {/* { */}
                {/* // (videoPerc === 100 && imgPerc === 100) && */}
                <Button onClick={uploadToDb}
                    disabled={(videoPerc === 100 && imgPerc === 100) ? false : true}>Upload</Button>
                {/* } */}
            </Wrapper>
        </Container>
    )
}

export default Upload