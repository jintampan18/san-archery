import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiFillPicture } from "react-icons/ai";
import { Button } from '../ui/button';

const FileUploader = ({ fieldChange, mediaUrl }) => {
    const [file, setFile] = useState([]);
    const [fileUrl, setFileUrl] = useState(mediaUrl);

    const onDrop = useCallback(
        (acceptedFiles) => {
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(URL.createObjectURL(acceptedFiles[0]));
        }, [file]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg']
        }
    });

    return (
        <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
            <input {...getInputProps()} />
            {
                fileUrl ? (
                    <>
                        <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                            <img
                                src={fileUrl}
                                alt='image'
                                className='file_uploader-img max-h-full max-w-full object-contain'
                            />
                        </div>
                        <p className='file_uploader-label'>Click or drag photo to replace</p>
                    </>
                ) : (
                    <div className='file_uploader-box'>
                        <AiFillPicture className="text-gray-400 w-24 h-24" />
                        <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag your photo/video here</h3>
                        <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPG</p>
                        <Button className='shad-button_dark_4'>
                            Select from your device
                        </Button>
                    </div>
                )
            }
        </div>
    );
};

export default FileUploader;