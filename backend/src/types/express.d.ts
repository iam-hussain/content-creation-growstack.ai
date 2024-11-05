// types/express.d.ts

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      name: string;
    };
    context: null | { id: string };
  }
}
