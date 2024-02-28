import {myAxios, privateAxios} from "../config/cloud";
import END_POINT from '../config/globalContants';

export const getRooms = () => {
    return myAxios.get(END_POINT.GET_ROOMS)
        .then((response) =>
            response.data.data
        );
}

export const getRoomById = (roomId) => {
    return myAxios.get("/room/" + roomId)
        .then(response => response.data.data);
}


export const getRoomBookingStatus = (roomId) => {
    return myAxios.get('/booking-status/' + roomId)
        .then(resposne => resposne.data.data[0]);
}

export const postRoomData = (formData, userId) => {
    return privateAxios.post(`/add-room/user/${userId}`, formData)
        .then(response => response.data);
}

export const deleteRoomFromBookedList = (roomId, startDate, endDate) => {
    // console.log(roomId, startDate, endDate);
    return privateAxios.delete(`/delete/booked-room/${roomId}/${startDate}/${endDate}`)
        .then(response => response.data);
}

export const getRoomReservedDates = (roomId) => {
    return myAxios.get(`/rooms/dates/${roomId}`)
        .then(response => response.data.data);
}

export const getRoomDates = (roomId) => {
    return myAxios.get(`/list/room/date/${roomId}`)
        .then(response => response.data.data);
}

export const UpdateUserRoomById = (formData, userId, roomId) => {
    // console.log(`userId: ${userId} roomId: ${roomId}`)
    return privateAxios.put(`/room/${roomId}/user/${userId}`, formData)
        .then(response => response.data);
}

export const deleteUserRoom = (roomId, publicId, userId) => {
    // console.log(`roomId: ${roomId} userId: ${userId} publicId: ${publicId}`);
    return privateAxios.delete(`/delete-room/${userId}/${roomId}/${publicId}`)
        .then(response => response.data);
}

export const GetRoomRates = () => {
    return myAxios.get(END_POINT.GET_ROOM_RATE)
        .then((response) => response.data);
}

export const GetOneRoomRates = (id) => {
    return myAxios.get(`/room-rates/${id}`)
        .then((response) => response.data);
}
export const UpdateRoomRate = (id, rate) => {
    return myAxios.put(`/room-rates/${id}`, rate)
        .then((response) => response.data);
}

export const DeleteRoomRates = (id) => {
    return myAxios.delete(`/room-rates/${id}`)
        .then((response) => response.data);
}

