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

 *  With the results from this request, inside "content", count
 *  the number of packages that have a MAJOR semver version 
 *  greater than 10.x.x
 */
module.exports = async function countMajorVersionsAbove10() {
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
    return 0;
  });
  if (!response.data.content) {
    return 0;
  }
  /**
   * Extracts the packages with major versions over 10.x.x
   * @param {Array} data the array to extract version infoormation from
   * @returns {Array} an array of packages with versions greater than 10
   */
  const getPackageVersionsOver10 = data => {
    if (!data) {
      return [];
    }
    return data.filter(item => {
      const majorVersion = parseInt(item.package.version.split('.')[0]);
      return majorVersion > 10;
    });
  };
  const count = getPackageVersionsOver10(response.data.content).length;
  return count;
};
