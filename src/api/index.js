export function client(endpoint, {body, ...customConfig}) {
  // url 如果有 proxy 的時候， 需要過濾掉網只有 https or http
  let url = endpoint.match(/^(http|https)$/)
    ? new URL(endpoint)
    : new URL(endpoint);

  const config = {
    method: 'GET',
    ...customConfig,
    headers: {
      accessKey:
        '4x3VdowBx9pZEVW7E7JPwp6L4Ty0cy6C4UX67cT4RmZ9pvOK3GCoGWDmzWXhpiVC',
      ...customConfig.headers,
    },
  };

  // customConfig.params 傳入 { key:123, id:4 } 輸出成 kkbox/v1?key=123&id=4
  if (customConfig.params != null) {
    Object.keys(customConfig.params).forEach((key) =>
      url.searchParams.append(key, customConfig.params[key]),
    );
  }

  return fetch(url, config).then((res) => res.json());
}
