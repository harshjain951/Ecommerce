import axios from 'axios';

import {ALL_PRODUCTS_FAIL,ALL_PRODUCTS_REQUEST,ALL_PRODUCTS_SUCCESS,CLEAR_ERRORS, PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS,NEW_REVIEW_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
ADMIN_PRODUCTS_FAIL,
ADMIN_PRODUCTS_SUCCESS,
ADMIN_PRODUCTS_REQUEST,
NEW_PRODUCT_FAIL,
NEW_PRODUCT_REQUEST,
NEW_PRODUCT_SUCCESS,
DELETE_PRODUCT_REQUEST,
DELETE_PRODUCT_SUCCESS,
DELETE_PRODUCT_FAIL,
UPDATE_PRODUCT_REQUEST,
UPDATE_PRODUCT_SUCCESS,
UPDATE_PRODUCT_FAIL,
GET_REVIEWS_REQUEST,
GET_REVIEWS_SUCCESS,
GET_REVIEWS_FAIL,
DELETE_REVIEW_REQUEST,
DELETE_REVIEW_SUCCESS,
DELETE_REVIEW_FAIL} from '../constants/productConstants';

export const getProducts = (keyword = '', currentPage = 1, price, category, rating = 0) => async (dispatch) => {
    try {

        dispatch({ type: ALL_PRODUCTS_REQUEST })

        let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`

        if (category) {
            link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&ratings[gte]=${rating}`
        }

        const { data } = await axios.get(link)
        

        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response.data.message
        })
    }
}
export const getProduct=(id)=>async(disptach)=>{
    try {
        disptach({
            type:PRODUCT_DETAILS_REQUEST
        });
        const {data}= await axios.get(`/api/v1/product/${id}`); 
        disptach({
            type:PRODUCT_DETAILS_SUCCESS,
            payload:data.product
        })

    } catch (error) {
        disptach({
            type:PRODUCT_DETAILS_FAIL,
            payload:error.response.data.message
        })
    }
}
export const newReview=(reviewData)=>async(disptach)=>{
    try {
        disptach({
            type:NEW_REVIEW_REQUEST
        });
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
        const {data}= await axios.put(`/api/v1/review`,reviewData,config); 
        disptach({
            type:NEW_REVIEW_SUCCESS,
            payload:data.success
        })

    } catch (error) {
        disptach({
            type:NEW_REVIEW_FAIL,
            payload:error.response.data.message
        })
    }
}

export const newProduct=(name,price,description,seller,category,stock,images)=>async(disptach)=>{
    try {
        disptach({
            type:NEW_PRODUCT_REQUEST
        });
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
        const {data}= await axios.post(`/api/v1/admin/product/new`,{name,price,description,seller,category,stock,images},config); 
        disptach({
            type:NEW_PRODUCT_SUCCESS,
            payload:data
        })

    } catch (error) {
        disptach({
            type:NEW_PRODUCT_FAIL,
            payload:error.response.data.message
        })
    }
}

export const getAdminProducts=()=>async(disptach)=>{
    try {
        disptach({
            type:ADMIN_PRODUCTS_REQUEST
        });

        const {data}= await axios.get(`/api/v1/admin/products`); 

        disptach({
            type:ADMIN_PRODUCTS_SUCCESS,
            payload:data.products
        })

    } catch (error) {
        disptach({
            type:ADMIN_PRODUCTS_FAIL,
            payload:error.response.data.message
        })
    }
}


export const deleteProduct = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_PRODUCT_REQUEST })
        const { data } = await axios.delete(`/api/v1/admin/product/${id}`)
        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateProduct = ( name,price,description,seller,category,stock,images,id) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PRODUCT_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/product/${id}`, {name,price,description,seller,category,stock,images}, config)

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getProductReviews = (id) => async (dispatch) => {
    try {

        dispatch({ type: GET_REVIEWS_REQUEST })

        const { data } = await axios.get(`/api/v1/reviews?id=${id}`)

        dispatch({
            type: GET_REVIEWS_SUCCESS,
            payload: data.reviews
        })

    } catch (error) {

        dispatch({
            type: GET_REVIEWS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Delete product review
export const deleteReview = (id, productId) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_REVIEW_REQUEST })

        const { data } = await axios.delete(`/api/v1/reviews?id=${id}&productId=${productId}`)

        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success
        })

    } catch (error) {

        console.log(error.response);

        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors=()=>async(disptach)=>{
    disptach({
        type:CLEAR_ERRORS,
    })
}