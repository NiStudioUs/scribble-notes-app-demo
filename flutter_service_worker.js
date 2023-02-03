'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "cdd852b768b791d5900b5c6173fe02ee",
"assets/assets/icon/btn_google_dark_normal.png": "e24c25257d4d0d97a6a05ac295e6e963",
"assets/assets/icon/btn_google_signin_dark_focus_hdpi.9.png": "55e5ddd22924677162f757bb2e47275d",
"assets/assets/icon/btn_google_signin_dark_normal_hdpi.9.png": "f8512fbc92574a6ed11b1d2b0beb5844",
"assets/assets/icon/btn_google_signin_dark_normal_web.png": "696c081ae56a5d4674d5da24e7810ab7",
"assets/assets/icon/google_drive_logo.png": "00fd5289d1a2e9ef666d6216b0070e0f",
"assets/assets/icon/IC_oldNotesApp.png": "29599795412ceb377b5a5d167143760c",
"assets/assets/images/ic_launcher_bw_pen_paper_01.png": "ab24333b3d1d9cded345f86fbf0c3adf",
"assets/assets/images/long_tree.png": "a4f288b95f8e81e6268551dfd697c8fa",
"assets/assets/images/nightsight.png": "173190d1fafdd17b4d407ee85b026f01",
"assets/FontManifest.json": "2383699896873fbd2cab02831d9303a0",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/google_fonts/Amiri-BoldItalic.ttf": "414aa5e9bb090b3994c7155edd257ce7",
"assets/google_fonts/AmitiOFL.txt": "7829f3e4363bb3502faa39d1d30d9bd1",
"assets/google_fonts/DancingScript-VariableFont_wght.ttf": "796bdaef35c72bb17246391811a5d7c1",
"assets/google_fonts/Dancing_ScriptOFL.txt": "dab7b7fd17e174eb970b11d4bbd2f6c9",
"assets/google_fonts/IndieFlower-Regular.ttf": "8a33aae7305b37411d775d6617e80aca",
"assets/google_fonts/Indie_FlowerOFL.txt": "b117924592ddee79b545b76597291fbe",
"assets/google_fonts/JosefinSans-VariableFont_wght.ttf": "36699ca6fe30d1ff7a718f0655653374",
"assets/google_fonts/Josefin_SansOFL.txt": "d97dc83ed2528fbee393b28fb7fa2453",
"assets/google_fonts/OFL.txt": "7829f3e4363bb3502faa39d1d30d9bd1",
"assets/google_fonts/OleoScriptSwashCaps-Regular.ttf": "cedd93aff0900036032396ae5ba6fee2",
"assets/google_fonts/Oleo_Script_Swash_CapsOFL.txt": "3183e4a4a239069f7551240b1c4d0fd0",
"assets/google_fonts/Roboto_Medium.ttf": "68ea4734cf86bd544650aee05137d7bb",
"assets/google_fonts/Roboto_MediumOFL.txt": "d273d63619c9aeaf15cdaf76422c4f87",
"assets/NOTICES": "5e5cb25845a5de5ed1570a906fb70fdb",
"assets/packages/flutter_neumorphic/fonts/NeumorphicIcons.ttf": "32be0c4c86773ba5c9f7791e69964585",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.png": "8e2eb305c8e830ce0ab68e741bd4e8c3",
"flutter.js": "1cfe996e845b3a8a33f57607e8b09ee4",
"icons/Icon-192.png": "78ddaca82c0094578449bb8df31749f9",
"icons/Icon-512.png": "c0ad3e33fb730fa9b08301093d654cc5",
"icons/Icon-maskable-192.png": "78ddaca82c0094578449bb8df31749f9",
"icons/Icon-maskable-512.png": "c0ad3e33fb730fa9b08301093d654cc5",
"index.html": "b0d0e6d2fadd7c91adf6bda1e7d0ceff",
"/": "b0d0e6d2fadd7c91adf6bda1e7d0ceff",
"main.dart.js": "0bbdd757d9e4398ce3fa63859e7836ee",
"manifest.json": "d16074d54de93827ce150b4b47bd72b1",
"version.json": "0fbe624f6c9955b434310408ad13b23e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
