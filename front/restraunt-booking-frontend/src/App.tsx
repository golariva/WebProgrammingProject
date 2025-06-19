import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Restaurants from "./pages/Restaurants";
import User from "./pages/User";
import Floors from  "./pages/Floors"
import About from "./pages/About";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel.tsx";
import UserBookings from "./pages/UserBookings";
import AddRestaurant from "./pages/AddRestaurant";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/restaurant/:restaurant_id/floor/:floor_id/booking" element={<Booking />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/profile" element={<User />} />
                <Route path="/restaurant/:restaurant_id/floors" element={<Floors />} />
                <Route path="/about" element={<About />} />
                <Route path="/adminpanel" element={<AdminPanel />} />
                <Route path="/user_bookings" element={<UserBookings />} />
                <Route path="/add-restaurant" element={<AddRestaurant />} />
            </Routes>
        </Router>
    );
}

export default App;
