import request from '../util/request';

export function queryList() {
  return request('/api/trees');
}

export function addOne(data) {
  console.log(JSON.stringify(data))
  return request('/hello/test', {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  });
}
