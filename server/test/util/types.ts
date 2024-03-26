import { Response } from 'supertest';

/**
 * Api 'error' response body
 */
export type MessageBody = { message: string };

// Overwrite the supertest response body to be generic
export type SuperTestResponse<T> = Omit<Response, 'body'> & { body: T };

export type ApiResponse<T> = SuperTestResponse<T | MessageBody>;
