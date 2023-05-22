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
    if (!tab.url) return
    switch (command) {
      case 'censor-images': {
        chrome.scripting.executeScript({target: {tabId: tab.id}, func: () => {
          const images = Array.from(document.images);
          images.forEach(image => {
            image.removeAttribute('referrerpolicy');
            image.setAttribute('crossorigin', 'anonymous');
            console.log('Censor image: ', image);

            image.style.filter = 'blur(3px)';

            // Create a canvas element
            // const canvas = document.createElement('canvas');
            // const context = canvas.getContext('2d');

            // Check if the image is already loaded
            // if (image.complete) {
            //   canvas.width = image.width;
            //   canvas.height = image.height;
  
            //   // Draw the image on the canvas
            //   context.drawImage(image, 0, 0, canvas.width, canvas.height)
  
            //   // Apply the blur effect
            //   const blurAmount = 20; // Adjust the blur amount as desired
            //   context.filter = `blur(${blurAmount}px)`;
  
            //   // Draw the blurred image on the canvas
            //   context.drawImage(canvas, 0, 0, canvas.width, canvas.height);
  
            //   // // Replace the image with the blurred canvas
            //   if (image.srcset) {
            //     image.srcset = canvas.toDataURL();
            //   }
            //   if (image.src) {
            //     image.src = canvas.toDataURL();
            //   }
  
            //   console.log('Censored image: ', image.src);
            // }
          });
        }})
        return
      }
      case 'uncensor-images': {
        chrome.scripting.executeScript({target: {tabId: tab.id},func: () => {
          console.log('Censor images')
        }})
        return
      }
    }
  })
}

const passDataToTab = (id, name, data) => {
  console.log('Pass data: ', id, name, data)
  return chrome.scripting.executeScript({
    args: [data, name],
    target: {tabId: id, allFrames: true},
    func: (data, name) => {
      window[name] = data
    }
  })
}


function init() {
  addCommandHandler()
  console.log('Init complete.')
}

init()