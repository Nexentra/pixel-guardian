import { storage } from "../storage";
import { NsfwSpy } from "@nsfwspy/browser";
let nsfwSpy;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("tab", tab);
  if (changeInfo.status == 'loading') {
    console.log("tab", tab);
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id, allFrames: true },
    //   files: ['code-to-inject.js'],
    // })
  }
})

// window.onload = async () => { // https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
//   console.log("window loaded");
// };


chrome.windows.onCreated.addListener(async () => {
  console.log("window created");
  // const result = await ImageVerifier("https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80");
  // console.log(result);
});

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'loading') {
    chrome.scripting
    .executeScript({
      target : {tabId : tab.id},
      func : updateRules,
    })
    .then(async () => {
      console.log("injected");
    });

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [
        
      ],
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: "redirect",
            redirect: {
              url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR34hPo9zGkYxB2NKePgvPeImdm-CDTsHPrt4DFUyU_4A&s",
            },
          },
          condition: {
            resourceTypes: ["image"],
          },
        },
      ],
    },
    (rules) => {
      console.log("rules",rules);
      });
  }
})


async function updateRules(){
  console.log("injected");
}


chrome.runtime.onInstalled.addListener(() => {
  // storage.get().then(
  //     (storage) => {
  //         nsfwSpy = storage.nsfwSpy
  //     }
  // );
});

chrome.runtime.onInstalled.addListener(async () => {
  // Load the declarative net request rules
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [],
    addRules: [],
  },
  (rules) => {
    console.log("rules",rules);
    });     

  // Optional: Log the updated rules
  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  console.log(rules);
  
  // ImageVerifier("https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80")
});

async function ImageVerifier(imageUrl) {
  nsfwSpy = new NsfwSpy("./model/model.json");
  await nsfwSpy.load();
  const result = await nsfwSpy.classifyImage(imageUrl);
  console.log(result);
  return result;
}
