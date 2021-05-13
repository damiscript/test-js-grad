const { default: axios } = require('axios');
/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 *  With the results from this request, inside "content", return
 *  the "name" of the package that has the oldest "date" value
 */

module.exports = async function oldestPackageName() {
  const response = await axios({
    method: 'post',
    url: 'http://ambush-api.inyourarea.co.uk/ambush/intercept',
    data: {
      url: 'https://api.npms.io/v2/search/suggestions?q=react',
      method: 'GET',
      return_payload: true,
    },
  }).catch(error => {
    console.log(error);
    return '';
  });
  if (!response.data.content) {
    return '';
  }
  /**
   * Cycle through and compare the previous package to the current package to find
   * the oldest package name by date
   * @param {Array} data the array to extract version infoormation from
   * @returns {Object} the object witht he oldest data
   */
  const findOldestPackage = data => {
    if (!data) {
      return '';
    }
    return data.reduce((prev, current) => {
      return new Date(prev.package.date).getTime() <=
        new Date(current.package.date).getTime()
        ? prev
        : current;
    }).package;
  };
  const name = findOldestPackage(response.data.content).name;
  return name;
};
