import React from 'react';

const IMGPATH = "https://image.tmdb.org/t/p/w500";

export default function Result({ movies }) {
    return (
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4'>
            {movies.map((item) => (
                <Box
                    key={item.id}
                    image={item.poster_path}
                    title={item.original_title}
                    rating={item.vote_average}
                />
            ))}
        </div>
    );
}

const Box = ({ image, title, rating }) => {
    return (
        <div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl'>
            <img
                src={`${IMGPATH}${image}`}
                alt={title}
                className='w-full h-60 object-cover'
            />
            <div className='p-4'>
                <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 truncate'>{title}</h3>
                <div className='flex justify-between items-center mt-2'>
                    <span className='text-lg text-gray-600 dark:text-gray-400'>Rating:</span>
                    <span className='text-lg text-yellow-500 font-bold'>{rating}</span>
                </div>
            </div>
        </div>
    );
};
