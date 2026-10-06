import { UploadedDocument } from '@/types';

/**
 * Calculates SHA-256 hash of a file using Web Crypto API.
 */
export async function calculateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Marks duplicate documents in an array of UploadedDocuments based on SHA-256 content hashes.
 */
export function detectDuplicates(documents: UploadedDocument[]): UploadedDocument[] {
  const hashMap = new Map<string, number>();

  // Count occurrences of each hash
  for (const doc of documents) {
    if (doc.hash) {
      hashMap.set(doc.hash, (hashMap.get(doc.hash) || 0) + 1);
    }
  }

  // Update duplicate flag
  return documents.map((doc) => ({
    ...doc,
    isDuplicate: doc.hash ? (hashMap.get(doc.hash) || 0) > 1 : false,
  }));
}
