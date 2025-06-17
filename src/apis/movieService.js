import axios from "@apis/axiosClient"

export const findProducts = async ({page, size, status}) => {
    const url = "/movie/all";
    return await axios.get(url, {
        params: {
            page,
            size,
            status
        }
    });
}



