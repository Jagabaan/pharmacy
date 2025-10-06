import { Router } from "express";
import { uploader } from '../controllers/uploader.js'
import { upload } from "../middleware/multer.js";
import {validateRegister} from "../middleware/validateRegister.js"
import { cartUpload } from "../controllers/cartUpload.js";
import { getProducts } from "../controllers/getProducts.js";
import {getCartItems} from "../controllers/gerCartItems.js"
import { updateCart } from "../controllers/updateCart.js";
import {deleteCartItem } from "../controllers/deleteCartItem.js"
import {createOrder} from "../controllers/orderUpload.js"
import { deleteOrder } from "../controllers/deleteOrderItem.js"
import {getUserOrders} from "../controllers/getOrderItems.js"
import {deliveryOptions} from "../controllers/getDeliveryOptions.js"
import {singleOrder} from "../controllers/singleOrder.js"
import { getPaymentSummary } from "../controllers/paymentSummary.js";
import { resetCart } from "../controllers/resetCart.js";
//import { updateDeliveryStatus } from "../controllers/TrackingStatus.js"
import { registerUser } from '../controllers/registerAuthController.js';
import {loginUser} from '../controllers/loginAuthController.js'
import {requireAuth} from '../middleware/requireAuth.js'
import { getDeliveryStatus } from  '../controllers/deliveryStatus.js'

const router = Router();

//Home route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Product API',
    routes: {
      products: '/api/products',
      upload: '/api/upload'
    }
  });
});

// Route to get all products
router.get('/products', getProducts);

//Route to upload an image and create a product
router.post('/upload', upload.single('file'), uploader);

//Route to add to cart
router.post('/cartupload', requireAuth, cartUpload );

//Route to get cart Items
router.get('/cartitems',requireAuth, getCartItems);

//Route to update quantity in cart
router.put('/cartitems/:id',requireAuth, updateCart );

//Route to delete item in a cart
router.delete('/cartitems/:id',requireAuth, deleteCartItem);

//Route to reset cart
router.delete('/resetcart', resetCart);

//Route to create order
router.post('/createorder', requireAuth,  createOrder );

//Route to get all orders
router.get('/orderitems', requireAuth, getUserOrders);

//Route to delete an order
 router.delete('/deleteorder/:id', deleteOrder);

 //Route to get single order
router.get('/singleorder', singleOrder);

//Route to get all delivery options
router.get('/deliveryoptions', deliveryOptions);

//Route to get payment summary
router.get('/summary', requireAuth, getPaymentSummary);

//Route to updateDelivert Status
//router.put('/status/:orderId/:productId', updateDeliveryStatus);

// route: GET /api/orderitems/:orderId/:productId/status
router.get('/orderitems/:orderId/:productId/status', getDeliveryStatus);

//Route to register a user
router.post('/register', validateRegister, registerUser);

//Route to login
router.post('/login', loginUser); 





export default router;