function start () {
    chrome.storage.sync.get("running", data => {
        if (!data.running) {
            chrome.storage.sync.set({running: true}, () => {});

            document.getElementById('onoff').src = "./online.jpg";
            document.getElementById('domains').readOnly = true;
            chrome.storage.sync.get("domains", d1 => {
                let domains = d1.domains.split(";");
                chrome.storage.sync.get("tabs", d2 => {
                    let tabsdata = d2.tabs || {};
                    for (let i = 0; i < domains.length; i++) {
                        if (domains[i].trim() == "") {
                            continue;
                        }
                        chrome.tabs.query({url: ["https://" + domains[i] + "/*"], active: true, currentWindow: true}, tabs => {
                            if (tabs.length == 0) {
                                return;
                            }
                            tabsdata[tabs[0].id + "t"] = tabs[0].url;
                            chrome.tabs.update(tabs[0].id, {url: "./nono.html"});

                            chrome.storage.sync.set({tabs: tabsdata}, () => {});
                        });
                    }
                });
            });
        }
	});
}
function stop () {
    chrome.storage.sync.get("running", d1 => {
        if (d1.running) {
            chrome.storage.sync.get("tryStop", d2 => {
                if (!d2.tryStop) {
                    chrome.storage.sync.set({tryStop: true}, () => {});
                    setTimeout(doStop, 20000);
                }
            });
        }
	});
}
function doStop () {
    chrome.storage.sync.get("running", d1 => {
        if (d1.running) {
            chrome.storage.sync.get("tryStop", d2 => {
                if (d2.tryStop) {
                    chrome.storage.sync.set({running: false}, () => {});
                    chrome.storage.sync.set({tryStop: false}, () => {});
                    chrome.tabs.query({url: ["chrome-extension://" + "*/nono.html"]}, tabs => {
                        chrome.storage.sync.get("tabs", d3 => {
                            for (let i = 0; i < tabs.length; i++) {
                                try {
                                    chrome.tabs.update(tabs[i].id, {url: d3.tabs[tabs[i].id + "t"]});
                                }
                                catch (e) {
    
                                }
                            }
                        });
                        chrome.storage.sync.set({tabs: {}}, () => {});
                    });
                    document.getElementById('onoff').src = "./offline.jpg";
                    document.getElementById('domains').readOnly = false;              
                }
            });
        }
	});
}
function saveDomains () {
    chrome.storage.sync.set({domains: document.getElementById('domains').value}, () => {});
}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start').addEventListener('click', start);
    document.getElementById('stop').addEventListener('click', stop);
    document.getElementById('domains').addEventListener('change', saveDomains);
    chrome.storage.sync.get("domains", data => {
        document.getElementById('domains').value = data.domains;
	});
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        try {
            document.getElementById('currhost').innerHTML = new URL(tabs[0].url).hostname;
        } catch (e) {
    
        }
    });
    chrome.storage.sync.get("running", d1 => {
        if (d1.running) {
            document.getElementById('domains').readOnly = true;
            document.getElementById('onoff').src = "./online.jpg";
        } else {
            document.getElementById('domains').readOnly = false;
            document.getElementById('onoff').src = "./offline.jpg";
        }
	});
});
document.onmousemove = () => {
    chrome.storage.sync.get("tryStop", data => {
        if (data.tryStop) {
            chrome.storage.sync.set({tryStop: false}, () => {});
        }
    });
};