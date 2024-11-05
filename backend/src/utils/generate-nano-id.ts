import { nanoid } from 'nanoid';

export const generateNanoID = (length: number = 10) => {
  return nanoid(length);
};

export default generateNanoID;
