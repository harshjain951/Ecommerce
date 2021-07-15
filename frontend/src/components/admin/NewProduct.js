import React, { Fragment, useEffect, useState } from 'react'

import MetaData from '../layouts/MetaData'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { newProduct, clearErrors } from '../../actions/productactions'
import SideBar from './SideBar'
import { NEW_PRODUCT_RESET } from '../../constants/productConstants'

const NewProduct = ({ history }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState('');
    const [imagesPreview, setImagesPreview] = useState([]);
    const [images,setImages]=useState([]);
    const categories = [
        'Electronics',
        'Camera',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector(state => state.newProduct);
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (success) {
            history.push('/admin/products');
            alert.success('Product created successfully');
            dispatch({ type: NEW_PRODUCT_RESET })
        }
    }, [dispatch, alert, error, success, history]);

    const onChange =(e) => {
        const files = Array.from(e.target.files)
        var image=[];
        setImagesPreview([]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                }
            }
            reader.readAsDataURL(file)
        })
        files.forEach(avatar => {
            const data = new FormData();
            console.log(avatar)
            data.append("file", avatar);
            data.append("upload_preset", "ecommerce");
            data.append("cloud_name", "harsh951");
            fetch("https://api.cloudinary.com/v1_1/harsh951/image/upload", {
                method: "POST",
                body: data
            })
            .then(res => res.json())
            .then(data => {
                image.push({
                    public_id:data.public_id,
                    url:data.secure_url
                })
                setImages(image)
            })
            .catch(err => {
                console.log(err)
            })
        })
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch(newProduct(name,price,description,seller,category,stock,images));
    }
    return (

        <Fragment>
            <MetaData title={'New Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <SideBar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler}  encType='multipart/form-data'>
                                <h1 className="mb-4">New Product</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e)=>setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price_field">Price</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        value={price}
                                        onChange={(e)=>setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description_field">Description</label>
                                    <textarea className="form-control" id="description_field" rows="8" 
                                        value={description}
                                        onChange={(e)=>setDescription(e.target.value)}></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_field">Category</label>
                                    <select className="form-control" id="category_field" value={category} onChange={(e)=>setCategory(e.target.value)}>
                                        {categories.map(category=>(
                                        <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="stock_field">Stock</label>
                                    <input
                                        type="number"
                                        id="stock_field"
                                        className="form-control"
                                        value={stock}
                                        onChange={(e)=>setStock(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="seller_field">Seller Name</label>
                                    <input
                                        type="text"
                                        id="seller_field"
                                        className="form-control"
                                        value={seller}
                                        onChange={(e)=>setSeller(e.target.value)}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Images</label>

                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='product_images'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChange}
                                            multiple
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Choose Images
                                        </label>
                                    </div>
                                    {imagesPreview.map(img=>(
                                        <img className="mt-3 mr-2" src={img} key={img} alt="Images Preview" width="55" height="52"></img>
                                    ))}
                                </div>


                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading?true:false}
                                >
                                    CREATE
                                </button>

                            </form>
                        </div>

                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default NewProduct
