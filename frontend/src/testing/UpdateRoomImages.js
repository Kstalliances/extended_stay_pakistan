import React, {useState} from 'react';
import axios from 'axios'; // if you're using axios for making HTTP requests

function UpdateRoomImages({roomId}) {
    const [selectedImages, setSelectedImages] = useState([]);

    // Function to handle file input change
    const handleImageChange = (event) => {
        setSelectedImages(event.target.files);
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        for (let i = 0; i < selectedImages.length; i++) {
            formData.append('images', selectedImages[i]);
        }

        console.log("Selected Images:");
        for (let i = 0; i < selectedImages.length; i++) {
            console.log(selectedImages[i]);
        }

        try {
            await axios.put(`/api/rooms/${roomId}/images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Images updated successfully');
        } catch (error) {
            console.error('Error updating images:', error);
            alert('An error occurred while updating images');
        }
    };

    return (
        <div>
            {JSON.stringify(selectedImages.length)}
            <h2>Update Room Images</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" multiple onChange={handleImageChange}/>
                <button type="submit">Update Images</button>
            </form>
        </div>
    );
}

export default UpdateRoomImages;
