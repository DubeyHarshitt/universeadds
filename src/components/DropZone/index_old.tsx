import React, { useState } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';

interface State {
  files: File[];
}

const DropzoneAreaExample: React.FC<{}> = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  return <DropzoneArea onChange={handleChange} />;
};

export default DropzoneAreaExample;
