import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {LoginPage} from "./components/user/LoginPage";
import Home from "./components/post/Home";
import {Registration} from "./components/user/Register";
import MoreDetailComponent from "./components/post/MoreDetail";
import {BookingPage} from "./components/post/BookingPage";
import PrivateRoutes from "./components/PrivateRoutes";
import {AddRoom} from "./components/post/AddRoom";
import {UpdateRoom} from "./components/post/UpdateRoom";
import {ToastContainer} from "react-toastify";
import {AboutUs} from "./components/post/AboutUs";
import {UpdateAbout} from "./components/UpdateAbout";
import ListOfBookedRooms from "./components/user/ListOfBookedRooms";
import {Users} from "./components/user/Users";
import {ForgotPassword} from "./components/user/ForgotPassword";
import {NormalUserRooms} from "./components/user/NormalUserRooms";
import UpdateRoomImages from "./testing/UpdateRoomImages";
import {BookingCalender} from "./testing/BookingCalender";
import DateCalendarServerRequest from "./testing/MeterialUICalender";
import {UpdateRoomRates} from "./components/post/UpdateRoomRates";
import MyComponent from "./testing/ids";

function App() {
    // const {t} = useTranslation();
    return (
        <div className="App">
            <BrowserRouter>
                {/*<LanguageSwitcher/>*/}
                <ToastContainer/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/test" element={<BookingCalender/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/signup" element={<Registration/>}/>
                    <Route path="/room-detail/:roomId" element={<MoreDetailComponent/>}/>
                    <Route path="/booking/:roomId" element={<BookingPage/>}/>
                    <Route path="/about" element={<AboutUs/>}/>
                    <Route path="/about/:aboutUsId" element={<UpdateAbout/>}/>
                    <Route path="/user/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/booked-rooms/:userId" element={<NormalUserRooms/>}/>
                    <Route path="/test-id" element={<MyComponent/>}/>
                    <Route path="/user" element={<PrivateRoutes/>}>
                        <Route path="settings" element={<ListOfBookedRooms/>}/>
                        <Route path="add-room" element={<AddRoom/>}/>
                        <Route path="users" element={<Users/>}/>
                        <Route path="update-room/:roomId" element={<UpdateRoom/>}/>
                        <Route path="update-room-rate/:id" element={<UpdateRoomRates/>}/>
                    </Route>

                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
