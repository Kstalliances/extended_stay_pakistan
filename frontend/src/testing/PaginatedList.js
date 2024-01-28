// PaginatedList.js
import React, {useState, useEffect} from 'react';
import {Pagination} from 'react-bootstrap';
import axios from 'axios';
import {getRooms} from "../service/roomsservice";

const itemsPerPage = 5;

const PaginatedList = () => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Fetch data from your backend using Axios
        getRooms()
            .then(response => {
                setItems(response);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [currentPage]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            {/* Render your items */}
            <ul>
                {currentItems.map((item, index) => (
                    <li key={index}>{item?._id}</li>
                    ))}
            </ul>

            {/* Pagination component */}
            <Pagination>
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
};

export default PaginatedList;
