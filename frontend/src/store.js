import {createStore,combineReducers,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {productReducer,productDetailsReducer, newReviewReducer, newProductReducer, productsReducer, reviewReducer, productReviewsReducer} from './reducers/productReducer';
import {authReducer,userReducer,forgotPasswordReducer, allUsersReducer, userDetailsReducer} from './reducers/authReducer';
import { cartReducer } from './reducers/cartReducer';
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer } from './reducers/orderReducer';

const reducer=combineReducers({
    products:productReducer,
    product:productsReducer,
    productDetails:productDetailsReducer,
    auth:authReducer,
    user:userReducer,
    forgotPassword:forgotPasswordReducer,
    cart:cartReducer,
    newOrder:newOrderReducer,
    myOrders:myOrdersReducer,
    allOrders:allOrdersReducer,
    order:orderReducer,
    orderDetails:orderDetailsReducer,
    newReview:newReviewReducer,
    newProduct:newProductReducer,
    allUsers:allUsersReducer,
    userDetails:userDetailsReducer,
    review:reviewReducer,
    productReviews:productReviewsReducer
})

let initialState={
    cart:{
        cartItems:localStorage.getItem('cartItems')?JSON.parse(localStorage.getItem('cartItems')):[],
        shippingInfo:localStorage.getItem('shippingInfo')?JSON.parse(localStorage.getItem('shippingInfo')):{}
    }
}

const middleware=[thunk]
const store =createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)));
export default store;