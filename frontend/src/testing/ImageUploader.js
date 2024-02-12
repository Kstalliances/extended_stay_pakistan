import React, {useState} from 'react';

function ImageUploader() {
    const [resizedImage, setResizedImage] = useState(null);

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxWidth = 800; // Adjust as needed
                const maxHeight = 600; // Adjust as needed
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    setResizedImage(URL.createObjectURL(blob));
                }, selectedFile.type);
            };
        };

        reader.readAsDataURL(selectedFile);
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange}/>
            {resizedImage && <img src={resizedImage} alt="Selected"/>}
        </div>
    );
}

export default ImageUploader;
