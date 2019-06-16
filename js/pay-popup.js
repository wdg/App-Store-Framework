/* JSHint settings */
/* jshint esversion: 6 */
class UIPayPopup {
    constructor(directory, currentApp, cache, payPopup) {
        this.cache = cache || {};
        this.currentApp = currentApp || "default";
        this.directory = directory || "depictions/";
        // Defaults for elements, you can change these if your elements are different
        this.payPopup = payPopup || $(".pay-now");
        this.appNameElement = $(".pay-popup-name");
        this.appSubtitleElement = $(".pay-popup-subtitle");
        this.iconWrapper = $(".pay-popup-app-icon");
        this.payButton = $(".pay-now-button");
        // Overrides
        this.settingsOverrideDefaults = {
            "appName": false,
            "appSubtitle": false
        };
        this.overrideDefaults = {};
        this.override = this.overrideDefaults;
        this.settingsOverride = this.settingsOverrideDefaults;
    }
    initAll() {
        // Parse the JSON
        this.parseJSON();
        // Append app name
        this.initAppName();
        // Append subtitle
        this.initSubtitle();
        // Add app icon
        this.initAppIcon();
        // Add price
        this.initPrice();
        // Tint elements
        this.tintElements();
        // Show app-page
        this.open();
        // Check cookie
        this.checkCookie();
        // Append things to download button
        this.initBtnDownload();
    }
    parseJSON(pathToJSON) {
        var path = pathToJSON || this.directory + this.currentApp + ".json";
        var JSONData = [];
        var cache = this.cache;
        if (typeof this.cache[this.currentApp] == "undefined") {
            $.ajax({
                url: path,
                async: false,
                dataType: 'json',
                success: function (data) {
                  JSONData = data;
                  console.log(cache);
                  cache[currentApp] = data;
                }
            });
            if (typeof JSONItems != "object"){
                console.log("Error while parsing JSON");
            }
            this.JSONData = JSONData;
        } else {
            this.JSONData = this.cache[this.currentApp];
        }
        return JSONData;
    }
    open() {
        this.payPopup.css("opacity", "1");
        if (window.innerWidth < 700) {
            this.payPopup.css({bottom: 0});
        } else {
            this.payPopup.css({bottom: "1em"});
        }
        $(".bottom-popup").css("bottom", "-100%");
    }
    initAppName() {
        appendAppName(this.depictionPath, this.appNameElement, this.currentApp, this.JSONData, this.settingsOverride.appName, this.override.appName);
        this.appNameElement.attr("data-depictionJSON");
    }
    initSubtitle() {
        appendSubtitleContent(this.depictionPath, this.appSubtitleElement, this.JSONData, this.settingsOverride.appSubtitle, this.override.appSubtitle);
    }
    initAppIcon() {
        appendIcon(this.depictionPath, this.iconWrapper, "app-icon", this.JSONData);
    }
    initPrice() {
        $(".pay-popup-price").text("" + this.JSONData.price);
    }
    initBtnDownload() {
        this.payButton.css({"background-color": this.JSONData.tint, "color": this.JSONData.textTint});
    }
    tintElements() {
        this.payPopup.find(".tinted").css({color: this.JSONData.textTint2});
    }
    checkCookie() {
        this.user = getCookie("email");
        if (this.user != "") {
            $(".email").text(this.user);
            this.payButton.attr({"onclick": "", "href": this.JSONData.location});
        } else {
            $(".email").text("Not logged in");
            this.payButton
                .text("Log in")
                .attr("onclick", "logInPopupOpen(); payPopupClose();");
        }
    }
    close() {
        this.payPopup.css({bottom: "-100%", opacity: 0});
        this.settingsOverride = this.settingsOverrideDefaults;
        this.override = this.overrideDefaults;
    }
}
var payPopup = new UIPayPopup();


function payPopupInit(parent) {
    var currentApp = parent.attr("app");
    payPopup.currentApp = currentApp;
    payPopup.cache = appCache;
    payPopup.initAll();
}
function payPopupClose() {
    payPopup.close();
}
/* This should be replaced with your code if it is different */
$(".cancel").click(function() {
    payPopupClose();
});
$(".pay-now-button").click(function(){
    payPopupClose();
});
$(".btn-download").click(function() {
    payPopupInit($(this));
});