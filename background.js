chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        chrome.storage.sync.get("running", data => {
            let paths = tab.url.split("/");
            if (paths[paths.length - 1] == "nono.html" && !data.running) {
                chrome.storage.sync.get("tabs", d3 => {
                    chrome.tabs.update(tab.id, {url: d3.tabs[tab.id + "t"]});
                });
                chrome.storage.sync.set({tabs: {}}, () => {});
            }
            else if (data.running) {
                chrome.storage.sync.get("domains", d1 => {
                    let domains = d1.domains.split(";");
                    chrome.storage.sync.get("tabs", d2 => {
                        let tabsdata = d2.tabs || {};
                        for (let i = 0; i < domains.length; i++) {
                            if (domains[i].trim() == "") {
                                continue;
                            }
                            try {
                                if (new URL(tab.url).hostname == domains[i]) {
                                    tabsdata[tab.id + "t"] = tab.url;
                                    chrome.tabs.update(tab.id, {url: "./nono.html"});
                                }
                            } catch (e) {
                    
                            }
                        }
                        chrome.storage.sync.set({tabs: tabsdata}, () => {});
                    });
                });
            }
        });
    });
});

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (tab.active) {
        chrome.storage.sync.get("running", data => {
            let paths = tab.url.split("/");
            if (paths[paths.length - 1] == "nono.html" && !data.running) {
                chrome.storage.sync.get("tabs", d3 => {
                    chrome.tabs.update(tabId, {url: d3.tabs[tabId + "t"]});
                });
                chrome.storage.sync.set({tabs: {}}, () => {});
            } 
            else if (data.running) {
                chrome.storage.sync.get("domains", d1 => {
                    let domains = d1.domains.split(";");
                    chrome.storage.sync.get("tabs", d2 => {
                        let tabsdata = d2.tabs || {};
                        for (let i = 0; i < domains.length; i++) {
                            if (domains[i].trim() == "") {
                                continue;
                            }
                            try {
                                if (new URL(tab.url).hostname == domains[i]) {
                                    tabsdata[tabId + "t"] = tab.url;
                                    chrome.tabs.update(tabId, {url: "./nono.html"});
                                }
                            } catch (e) {
                    
                            }
                        }
                        chrome.storage.sync.set({tabs: tabsdata}, () => {});
                    });
                });
            }
        });
    }
});