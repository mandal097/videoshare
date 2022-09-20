import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import app from '../firebase';
import axios from '../config/axios'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/userSlice';


const Container = styled.div`
width:100%;
height:100vh;
background-color:#00000081;
position:fixed;
top:0;
bottom:0;
right:0;
left:0;
display:grid;
place-items:center;
`;
const Body = styled.div`
width:500px;
height:500px;
display:flex;
position:relative;
/* align-items:center; */
flex-direction:column;
gap:20px;
padding: 20px;
color:${({ theme }) => theme.text};
/* border:1px solid ${({ theme }) => theme.text}; */
background-color:${({ theme }) => theme.bgLighter};
z-index:100;
`;

const Title = styled.h2`
text-align:center;
font-size:20px;
margin-bottom:20px;
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

const Input = styled.input`
border:1px solid ${({ theme }) => theme.soft};
color:${({ theme }) => theme.text};
border-radius:3px;
padding:10px;
background-color:transparent;
margin-bottom:10px;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  /* cursor: pointer; */
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
font-size:16px;
`;

const Image = styled.img`
width:250px;
height:250px;
border-radius:50%;
margin:0 auto;
object-fit:cover;
`;

const UpdateProfile = ({ setProfile }) => {
    const dispatch = useDispatch()

    const { currentUser } = useSelector((state) => state.user)

    const [img, setImg] = useState('');
    const [imgPerc, setImgPerc] = useState(0);
    const [imgUrl, setImgUrl] = useState({});
    const [disable, setDisable] = useState(true);

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
                setImgPerc(Math.round(progress))
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
                    setImgUrl((prev) => {
                        return { ...prev, [urlType]: downloadURL };
                    })
                    console.log('File available at', downloadURL);
                    setTimeout(() => {
                        setDisable(false);
                    }, 1500);
                });
            }
        );
    }

    useEffect(() => {
        img && uploadFile(img, 'img')
    }, [img]);

    const submit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        if (!img) {
            toast.error("Please choose image")
        } else {
            console.log(imgUrl.img);
            console.log("imgUrl");
            await axios.put(`/user/update/${currentUser._id}`, { img: imgUrl.img }, {
                headers: {
                    token: `Bearer ${token}`
                }
            })
            toast.success("Profile successfully updated");
            dispatch(updateProfile(imgUrl.img));

            setTimeout(() => {
                setProfile(false);
            }, 2000);
        }
    }

    return (
        <Container>
            <ToastContainer />
            {
                !currentUser.fromGoogle ?
                    (
                        <Body>
                            <Title>Update your profile Pic</Title>
                            <Close onClick={() => setProfile(false)}>X</Close>
                            {imgPerc > 0 ? "Uploading" + imgPerc + "%" :
                                <Label>Select Image :</Label>}
                            <Input type={"file"} onChange={(e) => setImg(e.target.files[0])} accept="image/*" />
                            {
                                img ? <Image src={URL.createObjectURL(img)} />
                                    : <Image src={currentUser.img} />
                            }
                            {/* {
                                imgPerc === 100 &&
                            } */}
                            <Button onClick={submit} disabled={disable}  >{!img ? "Choose image" : imgPerc < 100 ? "Uploading" : "Update"}</Button>
                        </Body>

                    ) : (
                        <Body>
                            <Close onClick={() => setProfile(false)}>X</Close>
                            <Image src={currentUser.img} />
                        </Body>
                    )
            }
        </Container>
    )
}

export default UpdateProfile