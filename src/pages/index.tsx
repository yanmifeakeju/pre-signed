import axios from 'axios';
import { ChangeEvent } from 'react';
import styled from 'styled-components';

async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
  const formData = new FormData(e.target);

  const file = formData.get('filename') as File;
  const uploadOption = formData.get('uploadOption');

  if (!file || file.name === '') return null;

  //@ts-ignore
  const fileType = encodeURIComponent(file.type);

  const { data } = await axios.get(
    `/api/upload?fileType=${fileType}&uploadOption=${uploadOption}`
  );

  const { uploadUrl, Key } = data;

  await axios.put(uploadUrl, file);

  return Key;
}

export default function Upload() {
  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    const key = await uploadToS3(e);
    console.log(key);

    return key;
  }

  return (
    <Container>
      <div className='wrapper'>
        <form onSubmit={handleSubmit} className='input-wrap'>
          <p>Please select file to upload:</p>
          <SelectWrap>
            <select name='uploadOption'>
              <option defaultValue={0} disabled>
                Select option:
              </option>
              <option value='sanction'>Sanction</option>
              <option value='proliferation'>Proliferation Financing</option>
              <option value='watchlisted'>Watchlisted BVN</option>
              <option value='fraudsters'>Fraudsters</option>
              <option value='pep'>PEP</option>
            </select>
          </SelectWrap>
          <UploadBtnWrap>
            <input
              type='file'
              id='myFile'
              name='filename'
              className='file-upload'
            />
          </UploadBtnWrap>

          <button type='submit'>Submit</button>
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  font-family: 'Roboto', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  margin: 0 auto;

  .wrapper {
    width: 380px;
  }

  p {
    text-align: center;
    color: #2c3e50;
    font-size: 1.2rem;
    padding-bottom: 0.5rem;
  }

  form.input-wrap {
    background-color: #eeeeee;
    width: 100%;
    /* display: flex;
    flex-direction: column;
    justify-content: center; */
    height: 300px;
    border-radius: 8px;
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    button {
      color: #fff;
      background: #3d9b73;
      font-weight: 600;
      border: none;
      width: 80%;
      padding: 0.6rem;
      border-radius: 4px;
      font-size: 1rem;
      margin-top: 1rem;
      cursor: pointer;

      &:hover {
        background: #448f6e;
      }
    }
  }
`;

const SelectWrap = styled.div`
  padding-top: 1rem;
  select {
    /* Reset */
    appearance: none;
    border: 0;
    outline: 0;
    font: inherit;
    /* Personalize */
    width: 13em;
    height: 3em;
    padding: 0 4em 0 1em;
    background: url(https://upload.wikimedia.org/wikipedia/commons/9/9d/Caret_down_font_awesome_whitevariation.svg)
        no-repeat right 0.8em center / 1.4em,
      linear-gradient(to left, #34495e 3em, #2c3e50 3em);
    color: white;
    border-radius: 0.25em;
    box-shadow: 0 0 1em 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
    /* <option> colors */
    option {
      color: inherit;
      background-color: #320a28;
    }
    /* Remove focus outline */
    &:focus {
      outline: none;
    }
    /* Remove IE arrow */
    &::-ms-expand {
      display: none;
    }
  }
`;

const UploadBtnWrap = styled.div`
  margin-left: 2rem;
  padding: 1rem 0;
  color: #34495e;

  .file-upload {
    text-align: center;
    width: 240px;
    /* padding: 0.8rem; */
    font-size: 1rem;
    cursor: pointer;
  }
`;
