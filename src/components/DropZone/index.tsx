import * as React from "react";
import ReactDOM from "react-dom";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";

interface Props {
    allowedType?: string | null,
    files: any[]; // Define your file type here
    setFiles: (files: any[]) => void; // Define your setFiles function type here
}

const DropzoneAreaExample = ({ allowedType = "image/*,.pdf", files, setFiles }: Props) => {


    // const updateFiles = (incomingFiles) => {
    //     setFiles(incomingFiles);
    // };


    const updateFiles = (incomingFiles) => {
        const filesOnly = incomingFiles.filter(file => file.file instanceof File);
        Promise.all(filesOnly.map(readFileAsDataURL))
            .then(base64Strings => {
                const updatedFiles = base64Strings.map((base64String, index) => ({
                    ...filesOnly[index],
                    base64String
                }));
                setFiles(updatedFiles);
            })
            .catch(error => {
                console.error('Error reading files:', error);  // Log any errors
            });
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                console.log('File read as data URL:', reader.result);  // Log the data URL
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);  // Log any errors
                reject(error);
            };
            reader.readAsDataURL(file.file);
        });
    };


    // Filter out files without an id
    const validFiles = files.filter(file => file.id);

    return (
        <Dropzone accept={allowedType} onChange={updateFiles} value={files} maxFileSize={2000 * 1024} minHeight={300} maxFiles={1} behaviour={"replace"}>
            {validFiles.map((file) => (
                <div key={file.id}>
                    <FileMosaic {...file} preview />
                </div>
            ))}
        </Dropzone>
    );
};


export default DropzoneAreaExample;