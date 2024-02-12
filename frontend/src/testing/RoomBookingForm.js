import React, { useState } from 'react';

function RoomBookingForm() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [error, setError] = useState('');

    const handleCheckInChange = (e) => {
        const selectedDate = e.target.value;
        if (selectedDate < today) {
            setError('Please select a future date for check-in');
        } else {
            setCheckInDate(selectedDate);
            setError('');
        }
    };

    const handleCheckOutChange = (e) => {
        const selectedDate = e.target.value;
        if (selectedDate < today) {
            setError('Please select a future date for check-out');
        } else {
            setCheckOutDate(selectedDate);
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!checkInDate || !checkOutDate) {
            setError('Please select both check-in and check-out dates');
            return;
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkOut <= checkIn) {
            setError('Check-out date must be after check-in date');
            return;
        }

        // Proceed with booking
        // ...
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Check-in Date:</label>
                <input type="date" value={checkInDate} onChange={handleCheckInChange} min={today} />
            </div>
            <div>
                <label>Check-out Date:</label>
                <input type="date" value={checkOutDate} onChange={handleCheckOutChange} min={checkInDate || today} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Book Room</button>
        </form>
    );
}

export default RoomBookingForm;
