// lib/upload.ts – drop-in helpers for XLSX / PNG multipart; returns FormData.

/* lib/upload.ts */
import axios from 'axios';
import api from './api';

/**
 * Upload an Excel sheet of collaborator cards.
 * Returns the created batch object.
 */
export async function uploadCollabXlsx(
  file: File,
  companyId: string,
  token: string,
) {
  const form = new FormData();
  form.append('file', file, file.name);

  const { data } = await axios.post(
    `/api/collabcards/upload-xlsx?company_id=${companyId}`,
    form,
    {
      baseURL: api.defaults.baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
        // Let Axios set multipart boundaries automatically
      },
      onUploadProgress: (e) =>
        console.log('xlsx progress', Math.round((e.loaded / e.total!) * 100)),
    },
  );
  return data; // BatchRead
}

/**
 * Upload one or many generated PNG cards for a batch.
 */
export async function uploadCardPngs(
  files: File[],
  batchId: string,
  companyId: string,
  token: string,
) {
  const form = new FormData();
  for (const f of files) form.append('files', f, f.name);

  await axios.post(
    `/api/cards/upload?batch_id=${batchId}&company_id=${companyId}`,
    form,
    {
      baseURL: api.defaults.baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      maxBodyLength: Infinity, // allow large zips
      onUploadProgress: (e) =>
        console.log(
          'png upload',
          Math.round((e.loaded / (e.total ?? 1)) * 100),
          '%',
        ),
    },
  );
}