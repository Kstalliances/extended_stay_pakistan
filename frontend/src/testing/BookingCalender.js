import {useEffect, useState} from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './Calender.css';


export function BookingCalender() {
    const [selectedRanges, setSelectedRanges] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Assuming you have some mechanism to fetch or update the selected ranges,
    // you can update the state whenever it changes.
    useEffect(() => {
        // Fetch or update selectedRanges here
        // Example:
        setSelectedRanges([
            {startDate: new Date('2024-02-25'), endDate: new Date('2024-02-29')},
            {startDate: new Date('2024-03-05'), endDate: new Date('2024-03-10')},
            {startDate: new Date('2024-03-15'), endDate: new Date('2024-03-25')},
            // Add more date ranges as needed
        ]);
    }, []); // Empty dependency array ensures this effect runs only once after the initial render

    const [fromDate, setFromDate] = useState('');

    const allHighlightedDates = selectedRanges.flatMap(range =>
        getDatesInRange(range.startDate, range.endDate)
    );

    const tileContent = ({date, view}) => {
        const isHighlighted = allHighlightedDates.some(d => d.toDateString() === date.toDateString());

        const tileStyle = {
            backgroundColor: isHighlighted ? '#ffcccb' : 'rgba(0, 0, 0, 0.1)', // Set dim color for non-highlighted dates
            borderRadius: '8px',
            width: '80%',
            height: '80%',
            margin: '10%',
        };

        return (
            <div className="date-tile" style={tileStyle}>
                {isHighlighted && <div className="highlighted-date"></div>}
            </div>
        );
    };

    function getDatesInRange(start, end) {
        const dates = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    const handleFromDate = (date) => {
        console.log(date);
        const today = new Date();
        if (date >= today) {
            const formattedDate = date.toISOString().split('T')[0];
            setFromDate(date);
            setSelectedDate(date); // Update selected date
        } else {
            alert('Please select a future date.');
        }
    }

    return (
        <div>
            {JSON.stringify(fromDate)}
            <Calendar
                value={selectedDate}
                onChange={handleFromDate}
                tileContent={tileContent}
                tileDisabled={({ date }) => date < new Date().setHours(0, 0, 0, 0)}
            />
        </div>
    );
}