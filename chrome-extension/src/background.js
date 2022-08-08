async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  let currentTab = await getCurrentTab();

  if (currentTab.url) {
    try {
      let response = await fetch('http://localhost:8100/session/chrome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: currentTab.url,
          navigationDate: new Date().toISOString()
        })
      });
    } catch (e) {
      console.error(e);
    }
  }


  // Sending and receiving data in JSON format using POST method
  //
  // var xhr = new XMLHttpRequest();
  // var url = "url";
  // xhr.open("POST", url, true);
  // xhr.setRequestHeader("Content-Type", "application/json");
  // xhr.onreadystatechange = function () {
  //   if (xhr.readyState === 4 && xhr.status === 200) {
  //     var json = JSON.parse(xhr.responseText);
  //     console.log(json);
  //   }
  // };
  // var data = JSON.stringify({ url: currentTab.url, navigationDate: new Date().toISOString() });
  // xhr.send(data);
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Chrome extension successfully installed!");

  
  
      // console.log(response.status);
      // console.log(response.statusText);
      // console.log(await response.text());
    


    // Sending and receiving data in JSON format using POST method
    //
    // var xhr = new XMLHttpRequest();
    // var url = "url";
    // xhr.open("POST", url, true);
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState === 4 && xhr.status === 200) {
    //     var json = JSON.parse(xhr.responseText);
    //     console.log(json);
    //   }
    // };
    // var data = JSON.stringify({ url: currentTab.url, navigationDate: new Date().toISOString() });
    // xhr.send(data);

});
