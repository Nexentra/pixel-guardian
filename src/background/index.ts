import { storage } from "../storage";
import { NsfwSpy } from "@nsfwspy/browser";
let nsfwSpy;
// let images;

// window.onload = async () => { // https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
//   console.log("window loaded");
// };

// chrome.windows.onCreated.addListener(async () => {
//   console.log("window created");
//   // const result = await ImageVerifier("https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80");
//   // console.log(result);
// });

// chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
//   // await chrome.declarativeNetRequest.updateDynamicRules({
//   //   removeRuleIds: [

//   //   ],
//   //   addRules: [
//   //     {
//   //       id: 1,
//   //       priority: 1,
//   //       action: {
//   //         type: "redirect",
//   //         redirect: {
//   //           url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR34hPo9zGkYxB2NKePgvPeImdm-CDTsHPrt4DFUyU_4A&s",
//   //         },
//   //       },
//   //       condition: {
//   //         resourceTypes: ["image"],
//   //       },
//   //     },
//   //   ],
//   // },
//   // (rules) => {
//   //   console.log("rules",rules);
//   //   });
//   if (changeInfo.status == 'loading') {
//     chrome.scripting
//     .executeScript({
//       target : {tabId : tab.id},
//       func : updateRules,
//     })
//     .then(async () => {
//       console.log("injected");
//     });
//   }
// })

// async function updateRules(){
//   console.log("injected");
// }

// chrome.runtime.onInstalled.addListener(() => {
//   // storage.get().then(
//   //     (storage) => {
//   //         nsfwSpy = storage.nsfwSpy
//   //     }
//   // );
// });

// chrome.runtime.onInstalled.addListener(async () => {
//   // Load the declarative net request rules
//   await chrome.declarativeNetRequest.updateDynamicRules({
//     removeRuleIds: [],
//     addRules: [],
//   },
//   (rules) => {
//     console.log("rules",rules);
//     });

//   // Optional: Log the updated rules
//   const rules = await chrome.declarativeNetRequest.getDynamicRules();
//   console.log(rules);

//   // ImageVerifier("https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80")
// });

async function ImageVerifier(imageUrl) {
  nsfwSpy = new NsfwSpy("./model/model.json");
  await nsfwSpy.load();
  const result = await nsfwSpy.classifyImage(imageUrl);
  console.log(result);
  return result;
}

function addCommandHandler() {
  chrome.commands.onCommand.addListener(async (command, tab) => {
    if (!tab.url) return;
    switch (command) {
      case "censor-images": {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: blurAllImages,
        });
        return;
      }
      case "uncensor-images": {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: removeBlurFromImages,
        });
        return;
      }
    }
  });
}

function init() {
  addCommandHandler();
  liveScrollListener();

  console.log("Init complete.");
}

init();

function blurAllImages() {
  const images = Array.from(document.images);
  images.forEach((image) => {
    image.removeAttribute("referrerpolicy");
    image.setAttribute("crossorigin", "anonymous");
    console.log("Censor image: ", image);

    image.style.filter = "blur(10px)";
    image.style.backdropFilter = "blur(10px)";
    image.style.webkitFilter = "blur(10px)";
  });
}

function removeBlurFromImages() {
  const images = Array.from(document.images);
  images.forEach((image) => {
    image.style.removeProperty("filter");
  });
}

function liveScrollListener() {
  chrome.tabs.onUpdated.addListener(async function (tabId, info, tab) {
    // if (!tab.url) return;
    //   if (info.status == "complete") {

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        var previousScrollPosition = 0;

        function blurAllImages() {
          const images = Array.from(document.images);
          images.forEach((image) => {
            image.removeAttribute("referrerpolicy");
            image.setAttribute("crossorigin", "anonymous");
            console.log("Censor image: ", image);
        
            image.style.filter = "blur(10px)";
            image.style.backdropFilter = "blur(10px)";
            image.style.webkitFilter = "blur(10px)";
          });
        }

        blurAllImages()

        window.addEventListener("scroll", function () {
          console.log("scrolling");
          // Calculate the height of the viewport
          var viewportHeight = 100; //window.innerHeight
          console.log(viewportHeight);

          // Calculate the scroll position relative to the document
          var scrollPosition = window.scrollY || window.pageYOffset;

          // Check if the user has scrolled past each viewport height
          if (scrollPosition > previousScrollPosition + viewportHeight) {
            blurAllImages()
            // Update the previous scroll position
            previousScrollPosition = scrollPosition;
          }
        });
      },
    });
    // }
  });
}
