// apiClient.ts

interface ListFilesResponse {
    // Assuming the response is a list of file information. Adjust according to your actual response structure.
    files: { name: string; size: number; path: string }[];
}

interface ExampleResponse {
    // Adjust according to your actual response structure.
    message: string;
}

async function fetchApi(url: string, options: RequestInit = {}): Promise<Response> {

    // host and port should be same as this site, so we can use relative path
    // const url = `http://localhost:3000${path}`; <- not needed (in theorie)

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }
    return response;
}

export const listFiles = async (path: string): Promise<ListFilesResponse> => {
    const url = `/api/list/${encodeURIComponent(path)}`;
    const response = await fetchApi(url);
    return response.json() as Promise<ListFilesResponse>;
};

export const getFile = async (path: string): Promise<Blob> => {
    const url = `/api/files/${encodeURIComponent(path)}`;
    const response = await fetchApi(url);
    return response.blob();
};

export const getExample = async (): Promise<ExampleResponse> => {
    const url = '/api/example/';
    const response = await fetchApi(url);
    return response.json() as Promise<ExampleResponse>;
};