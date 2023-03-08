import axios from 'axios';
import { ChangeEvent } from 'react';

async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
  const formData = new FormData(e.target);
  const file = formData.get('file');

  if (!file) return null;

  //@ts-ignore
  const fileType = encodeURIComponent(file.type);
  const { data } = await axios.get(`/api/upload?fileType=${fileType}`);

  const { uploadUrl, Key } = data;

  await axios.put(uploadUrl, file);

  return Key;
}

export default function Upload() {
  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    const key = await uploadToS3(e);
    console.log(key);
  }

  return (
    <>
      <p>Please select file to upload:</p>

      <form onSubmit={handleSubmit}>
        <input type='file' name='file' accept='text/csv' />
        <button type='submit'>Upload</button>
      </form>
    </>
  );
}
