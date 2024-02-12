import React, {useState} from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
} from 'reactstrap';

const items = [
    {
        src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        altText: 'Slide 1',
        caption: 'Slide 1',
        key: 1,
    },
    {
        src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        altText: 'Slide 2',
        caption: 'Slide 2',
        key: 2,
    },
    {
        src: 'https://picsum.photos/id/678/1200/400',
        altText: 'Slide 3',
        caption: 'Slide 3',
        key: 3,
    },
];

function ImageList({args, images}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };

    const slides = images.map((item) => {
        const imageStyle = {
            borderTopRightRadius: '20px', borderTopLeftRadius: '20px'
            // Add any other styles you may want for the images
        };
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.room_img_url}
            >
                <img src={item.room_img_url} alt={item.room_img_public_id} style={imageStyle} width="100%"/>
            </CarouselItem>
        );
    });

    const imageStyle = {
        borderTopRightRadius: '20px', borderTopLeftRadius: '20px'
        // Add any other styles you may want for the images
    };

    return (
        <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
            {...args}
            style={imageStyle}
        >
            <CarouselIndicators
                items={images}
                activeIndex={activeIndex}
                onClickHandler={goToIndex}
            />
            {slides}
            <CarouselControl
                direction="prev"
                directionText="Previous"
                onClickHandler={previous}
            />
            <CarouselControl
                direction="next"
                directionText="Next"
                onClickHandler={next}
            />
        </Carousel>
    );
}

export default ImageList;