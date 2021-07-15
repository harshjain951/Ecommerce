import React,{Fragment, useEffect} from 'react'
import {useState} from 'react'
import MetaData from '../layouts/MetaData'

import {updateProfile,laodUser,clearErrors} from '../../actions/authactions'
import {useAlert} from 'react-alert'
import {useDispatch,useSelector} from 'react-redux'
import {UPDATE_PROFILE_RESET} from '../../constants/authConstants'

const UpdateProfile = ({history}) => {

    const [name,setname]=useState("");
    const [email,setemail]=useState("");
    const [avatar, setAvatar] = useState("")
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')
    const [url1,setUrl1]=useState("");
    const [public_id1,setPublic_id1]=useState("");
    const [success,setSucces]=useState(false);
    const alert = useAlert();
    const dispatch = useDispatch();

    const { user} = useSelector(state => state.auth);
    const {error,loading,isUpdated}=useSelector(state=>state.user)

    useEffect(() => {

        if (user) {
            setname(user.name);
            setemail(user.email);
            setAvatarPreview(user.avatar.url);
            setUrl1(user.avatar.url);
            setPublic_id1(user.avatar.public_id);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if(isUpdated)
        {
            alert.success('user updated successfully');
            dispatch(laodUser());
            history.push('/me');
            dispatch({
                type:UPDATE_PROFILE_RESET
            })
        }

    }, [dispatch, alert, isUpdated, error, history,user])

    const submitHandler = async(e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        if(success)
        {
        const data =new FormData();
        data.append("file",avatar);
        data.append("upload_preset","ecommerce");
        data.append("cloud_name","harsh951");
        await fetch("https://api.cloudinary.com/v1_1/harsh951/image/upload",{
            method:"POST",
            body:data
        })
        .then(res=>res.json())
        .then(data1=>{
            console.log();
            setUrl1(data1.secure_url);
            setPublic_id1(data1.public_id);
            console.log(url1,public_id1);
            formData.set('url1', url1);
            formData.set('public_id1',public_id1);
            dispatch(updateProfile(name,email,data1.secure_url,data1.public_id));
        })
        .catch(err=>{
            console.log(err)
        })
    }
    else
    {
        dispatch(updateProfile(name,email,url1,public_id1));
    }
    }
    return (
        <Fragment>
            <MetaData title={'Update Profile'}/>
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}  encType='multipart/form-data'>
                        <h1 className="mt-2 mb-5">Update Profile</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input 
								type="name" 
								id="name_field" 
								className="form-control"
                                name='name'
                                value={name}
                                onChange={(e)=>setname(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e)=>setname(e.target.value)}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        onChange={(e)=>{
                                            setAvatar(e.target.files[0]);
                                            console.log(avatar);
                                            const reader = new FileReader();

                                             reader.onloadend = () => {
                                                setAvatarPreview(reader.result); 
                                            }
                                            reader.readAsDataURL(e.target.files[0])
                                            setSucces(true);
                                        }}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                </label>
                                </div>
                            </div>
                        </div>

                        <button type="submit" 
                        className="btn update-btn btn-block mt-4 mb-3" 
                        disabled={loading ? true : false}
                        >
                        Update
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateProfile
