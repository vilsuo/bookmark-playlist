import { HttpResponse } from "msw";

export const createServerMockErrorResponse = (message: string, status = 400) => {
  return HttpResponse.json({ message } , { status });
};
