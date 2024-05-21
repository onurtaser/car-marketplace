import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Explore from "./pages/Explore"
import ForgotPassword from "./pages/ForgotPassword"
import Offers from "./pages/Offers"
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Navbar from "./components/Navbar";
import Category from "./components/Category";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import ContactOwner from "./pages/ContactOwner";
import EditListing from "./pages/EditListing";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />}/>
          <Route path="/category/:categoryName" element={<Category />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route path="/offers" element={<Offers />}/>
          <Route path="/create-listing" element={<CreateListing />}/>
          <Route path="/category/:categoryName/:listingId" element={<Listing />} />
          <Route path="/contact/:ownerId" element={<ContactOwner />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />}/>
          <Route path="/sign-up" element={<SignUp />}/>
          <Route path="/edit-listing/:listingId" element={<EditListing />}/>
        </Routes>
        <Navbar />
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
