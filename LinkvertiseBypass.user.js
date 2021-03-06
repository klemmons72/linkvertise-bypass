// ==UserScript==
// @name LinkvertiseBypass
// @namespace http://tampermonkey.net/
// @version 3
// @updateURL https://github.com/klemmons72/linkvertise-bypass/raw/main/LinkvertiseBypass.user.js
// @description Bypass linkvertise
// @author Bandz
// @match *://*.linkvertise.com/*
// @match *://*.linkvertise.net/*
// @match *://*.link-to.net/*
// @run-at document-start
// @grant GM.xmlHttpRequest
// ==/UserScript==

let search_params = new URLSearchParams(window.location.search);

if (search_params.get("r") !== null) {
    window.location = atob(decodeURIComponent(search_params.get("r")));
} else {

    // iframe check
    if (window.parent.location != window.location) { return }

    var paths = ["/captcha", "/countdown_impression?trafficOrigin=network", "/todo_impression?mobile=true&trafficOrigin=network"]

    paths.map(path => {
        GM.xmlHttpRequest({
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
            },
            url: "https://publisher.linkvertise.com/api/v1/redirect/link" + window.location.pathname + path
        });
    })


    let o = {
        timestamp: new Date().getTime(),
        random: "6548307"
    };
    var bypass_url = "https://publisher.linkvertise.com/api/v1/redirect/link/static" + window.location.pathname;
    GM.xmlHttpRequest({
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
        },
        url: bypass_url,
        onload: function (response) {
            var json = JSON.parse(response.responseText);
            o.link_id = json.data.link.id
            o = { serial: btoa(JSON.stringify(o)) }
            bypass_url = "https://publisher.linkvertise.com/api/v1/redirect/link" + window.location.pathname + "/target?X-Linkvertise-UT=" + localStorage.getItem("X-LINKVERTISE-UT");

            GM.xmlHttpRequest({
                method: "POST",
                headers: {
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(o),
                url: bypass_url,
                onload: function (response) {
                    var json = JSON.parse(response.responseText);
                    window.location = json.data.target;
                }
            });
        }
    });
}
