import './App.css';
import Header from './components/layouts/Header'
import Footer from './components/layouts/Footer'
import Home from './components/Home'
import Login from './components/user/Login'
import Register from './components/user/Register'
import Profile from './components/user/Profile'
import UpdateProfile from './components/user/UpdateProfile'
import ProductDetails from './components/product/ProductDetails'
import ProtectedRoute from './components/route/ProtectedRoute'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword'
import NewPassword from './components/user/NewPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';
import ListOrders from './components/order/ListOrders';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import {useEffect,useState} from 'react'
import {laodUser} from './actions/authactions'
import store from './store'
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderDetails from './components/order/OrderDetails';
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import {useSelector} from 'react-redux'
import OrderList from './components/admin/OrderList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import UpdateUser from './components/admin/UpdateUser';
import ProductReviews from './components/admin/ProductReviews';
function App() {
  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {
    store.dispatch(laodUser())

    async function getStripApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi');

      setStripeApiKey(data.stripeApiKey)
    }

    getStripApiKey();

  }, [])
  const { user, isAuthenticated, loading } = useSelector(state => state.auth)
  return (
    <Router>
    <div className="App">
      <Header/>
      <div className="container container-fluid">
      <Route path='/' component={Home} exact></Route>
      <Route path='/search/:keyword' component={Home} exact></Route>
      <Route path='/product/:id' component={ProductDetails} exact></Route>
      <Route path='/login' component={Login} exact></Route>
      <ProtectedRoute path='/me' component={Profile} exact/>
      <ProtectedRoute path='/me/update' component={UpdateProfile} exact/>
      <ProtectedRoute path='/password/update' component={UpdatePassword} exact/>
      <Route path='/register' component={Register} exact></Route>
      <Route path='/password/reset/:token' component={NewPassword} exact></Route>
      <Route path='/password/forgot' component={ForgotPassword} exact></Route>
      <Route path='/cart' component={Cart} exact></Route>
      <ProtectedRoute path='/success' component={OrderSuccess} exact/>
      {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements>
          }
      <ProtectedRoute path='/shipping' component={Shipping} exact/>
      <ProtectedRoute path='/order/confirm' component={ConfirmOrder} exact/>
      
      <ProtectedRoute path='/order/:id' component={OrderDetails} exact/>
      <ProtectedRoute path='/orders/me' component={ListOrders} exact/>
      </div>
      
      <ProtectedRoute path='/dashboard' isAdmin={true} component={Dashboard} exact/>
      <ProtectedRoute path='/admin/products' isAdmin={true} component={ProductsList} exact/>
      <ProtectedRoute path='/admin/product' isAdmin={true} component={NewProduct} exact/>
      <ProtectedRoute path='/admin/product/:id' isAdmin={true} component={UpdateProduct} exact/>
      <ProtectedRoute path='/admin/user/:id' isAdmin={true} component={UpdateUser} exact/>
      <ProtectedRoute path='/admin/orders' isAdmin={true} component={OrderList} exact/>
      <ProtectedRoute path='/admin/users' isAdmin={true} component={UsersList} exact/>
      <ProtectedRoute path='/admin/reviews' isAdmin={true} component={ProductReviews} exact/>
      <ProtectedRoute path='/admin/order/:id' isAdmin={true} component={ProcessOrder} exact/>
      {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <Footer />
        )}
    </div>
    </Router>
  );
}
export default App;
