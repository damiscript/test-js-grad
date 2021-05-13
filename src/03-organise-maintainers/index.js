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

 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should 
 * be in alphabetical order.
 */

module.exports = async function organiseMaintainers() {
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
    return [];
  });
  if (!response.data.content) {
    return [];
  }
  /**
   * Populates the maintainers array based on the response data and sorts them alphabetically
   * @param {Array} data the array to extract maintainer data from
   * @returns {Array} an array containing information on maintainers and their respective projects
   */
  const getSortedMaintainerData = data => {
    var maintainersData = [];
    if (!data) {
      return [];
    }
    data.forEach(item => {
      item.package.maintainers.forEach(maintainer => {
        const packageName = item.package.name; //The name of the current package
        /**
         * Checks if the current maintainer exists within the maintaers array
         * @returns {Number} the id of the maintainer found returning -1 where not available
         */
        const existingMaintainerId = maintainersData.findIndex(
          activeMaintainer => activeMaintainer.username == maintainer.username,
        );
        //Updates a maintainer if they exist
        if (existingMaintainerId !== -1) {
          const currentPackages =
            maintainersData[existingMaintainerId].packageNames;
          const updatedPackages = [...currentPackages, packageName];
          maintainersData[
            existingMaintainerId
          ].packageNames = updatedPackages.sort();
        } else {
          //Adds a new maintainer and package
          maintainersData.push({
            username: maintainer.username,
            packageNames: [packageName],
          });
        }
      });
    });
    //Sort the data by usernames alphabetically before submission
    return maintainersData.sort((a, b) => {
      return a.username !== b.username ? (a.username < b.username ? -1 : 1) : 0;
    });
  };
  const maintainers = getSortedMaintainerData(response.data.content);
  return maintainers;
};
