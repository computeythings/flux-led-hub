module.exports.post = async function(url, data) {
  var response = await fetch(`/api/${url}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  return response;
}
