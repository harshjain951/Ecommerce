import React, { Fragment, useEffect, useState } from 'react'

import MetaData from '../layouts/MetaData'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { updateProduct,getProduct, clearErrors } from '../../actions/productactions'
import SideBar from './SideBar'
import {  UPDATE_PRODUCT_RESET } from '../../constants/productConstants'

const UpdateProduct = ({match,history}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState('');
    const [imagesPreview, setImagesPreview] = useState([]);
    const[oldImages,setOldImages]=useState([]);
    const [images,setImages]=useState([]);
    const alert = useAlert();
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
    const dispatch = useDispatch();

    const {error,product}=useSelector(state=>state.productDetails)
    const { loading, error:updateError, isUpdated } = useSelector(state => state.product);
    const productId=match.params.id;
    useEffect(() => {

        if(product&& product._id!==productId)
        {
            dispatch(getProduct(productId));
        }
        else
        {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setStock(product.stock)
            setSeller(product.seller)
            setOldImages(product.images);
            setImages(product.images);

        }


        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            history.push('/admin/products');
            alert.success('Product updated successfully');
            dispatch({ type: UPDATE_PRODUCT_RESET })
        }
    }, [dispatch, alert, error,isUpdated, history,updateError,productId,product]);

    const onChange =(e) => {
        const files = Array.from(e.target.files)
        var image=[];
        setImagesPreview([]);
        setOldImages([]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                }
            }
            reader.readAsDataURL(file)
        })
        if(files.length!==0)
        {
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
    }}
    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch(updateProduct(name,price,description,seller,category,stock,images,product._id));
    }

    return ( <Fragment>
        <MetaData title={'Update Product'} />
        <div className="row">
            <div className="col-12 col-md-2">
                <SideBar />
            </div>

            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper my-5">
                        <form className="shadow-lg" onSubmit={submitHandler}  encType='multipart/form-data'>
                            <h1 className="mb-4">Update Product</h1>

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

                                {oldImages&&oldImages.map(img1=>(
                                    <img key={img1} src={img1.url} alt={img1.url} className="mt-3 mr-2" width="55" height="52"/>
                                ))}

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
                                UPDATE
                            </button>

                        </form>
                    </div>

                </Fragment>
            </div>
        </div>

    </Fragment>
    )
}

export default UpdateProduct
