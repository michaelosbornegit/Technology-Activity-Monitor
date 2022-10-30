import { CreateBasicToken } from "@serverTypes/basic-token";

const basicTokenResource = `${process.env.REACT_APP_API_HOST}/basicToken/mint` || '';

const enrichedFetch = async (
    url: string,
    options: {},
    throwOnError = true
) => {
    const response = await fetch(url, options);
    if (response.status === 204) return response;
    if (response.status === 401) throw new Error('Unauthorized');
    if (response.status < 200 || response.status >= 300) {
      if (throwOnError) throw new Error('Failed API Call');
      return response;
    }
    return response.json();
}

export const mintNft = async (nft: CreateBasicToken) => {
    const response = await enrichedFetch(basicTokenResource,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nft),
          });

    console.log(response);
}