/* JSHint settings */
/* jshint esversion: 6 */
function bottomPopupInitOld(parent, JSONData, currentApp) {
    var depictionPath = parent.find(".app-name").attr("data-depictionJSON");
    if (typeof JSONData == "undefined") {
        $.ajax({
            url: depictionPath,
            async: false,
            dataType: 'json',
            success: function (data) {
            JSONData = data;
            console.log("Parsed a JSON");
            }
        });
    }
    var refAppPrice = JSONData.price;
    if (refAppPrice == "Free") {
        priceText = "Get";
    } else {
        priceText = refAppPrice;
    }
    appendAppName($(".app-name-popupbar"), false);
    appendSubtitleContent($(".subtitle-popupbar"), false);
    $(".subtitle-popupbar").css("color", "rgba(30, 30, 30, 0.8)");
    $(".app-name-popupbar").css("color", "rgba(30, 30, 30, 0.8)");
    $(".app-name-popupbar").attr("data-depictionJSON", depictionPath);
    appendIcon($(".app-icon-popupbar"), "app-icon", JSONData);
    appendBtnDownloadContent($(".btn-download-popup"));
    $(".btn-download-popup").attr("data-depictionJSON", depictionPath);
    parent.scroll(function() {
        if(parent.scrollTop() > 400){
            $(".bottom-popup").css({bottom: 0});
            $(".app-page").css({paddingBottom: "6em"});
        }
        else{
            $(".bottom-popup").css({bottom: "-100%"});
            $(".app-page").css({paddingBottom: 0});
        }
    });
    parent.parent().scroll(function() {
        if(parent.parent().scrollTop() > 400){
            $(".bottom-popup").css({bottom: 0});
            $(".app-page").css({paddingBottom: "6em"});
        }
        else{
            $(".bottom-popup").css({bottom: "-100%"});
            $(".app-page").css({paddingBottom: 0});
        }
    });
}
class UIBottomPopup {
    constructor(currentApp, cache) {
        this.cache = window.appCache || cache || {};
        this.currentApp = currentApp || defaultApp();
        this.directory = appDirectory();
        this.tintEnabled = tintState();
        // Defaults for elements, you can change these if your elements are different
        this.bottomPopup = $(".bottom-popup");
        this.iconWrapper = this.bottomPopup.find(".app-icon-popupbar");
        this.appNameElement = this.bottomPopup.find(".app-name-popupbar");
        this.appSubtitleElement = this.bottomPopup.find(".subtitle-popupbar");
        this.btnDownload = this.bottomPopup.find(".btn-download-popup");
        this.tintedElements = this.bottomPopup.find(".tinted");
        // Values
        this.closeDuration = 500;
        // Overrides
        this.settingsOverrideDefaults = {
            "appName": false,
            "appSubtitle": false
        };
        this.overrideDefaults = {};
        this.override = this.overrideDefaults;
        this.settingsOverride = this.settingsOverrideDefaults;
    }
    init(app) {
        this.checkIfNeededToReload(app);
    }
    checkIfNeededToReload(app) {
        if (this.currentApp != app) {
            this.reset();
            this.currentApp = app;
            this.initAll();
        } else if (this.currentApp == app) {
            this.initAll();
        }
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
                  cache[currentApp] = data;
                  window.appCache[currentApp] = data;
                }
            });
            this.JSONData = JSONData;
            this.cache[this.currentApp] = cache[this.currentApp];
        } else {
            this.JSONData = this.cache[this.currentApp];
        }
        return this.JSONData;
    }
    initAppIcon() {
        if (!this.JSONData && !window.appCache[this.currentApp]) {
            this.parseJSON();
        }
        appendIcon(this.iconWrapper, "app-icon");
    }
    initAppName() {
        if (!this.JSONData && !window.appCache[this.currentApp]) {
            this.parseJSON();
        }
        appendAppName(this.appNameElement, this.settingsOverride.appName, this.override.appName);
    }
    initBtnDownload() {
        if (!this.JSONData && !window.appCache[this.currentApp]) {
            this.parseJSON();
        }
        appendBtnDownloadContent(this.btnDownload);
    }
    initSubtitle() {
        if (!this.JSONData && !window.appCache[this.currentApp]) {
            this.parseJSON();
        }
        appendSubtitleContent(this.appSubtitleElement, this.settingsOverride.appSubtitle, this.override.appSubtitle);
    }
    tintElements() {
        if (!this.JSONData && !window.appCache[this.currentApp]) {
            this.parseJSON();
        }
        tintElements(this.tintedElements, this.JSONData.textTint2);
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
        // Tint elements
        this.tintElements();
        // Append things to btn-download
        this.initBtnDownload();
    }
    // Open bottomPopup
    open() {
        this.bottomPopup.css({visibility: "visible", bottom: "0"});
    }
    close(animate) {
        if (typeof animate == "undefined") {
            animate = true;
        }
        toggleCards();
        // Hide the app page
        if (animate === false) {
            this.bottomPopup.addClass("no-animation");
        }
        this.bottomPopup.css({bottom: "-100%"});
        // Reset all the things back once it is closed
        setTimeout(() => {
            if (animate === false) {
                this.bottomPopup.removeClass("no-animation");
            }
            window.bottomPopup.reset();
        }, this.closeDuration);
        
    }
    reset() {
        // Reset overrides back to default
        this.settingsOverride = this.settingsOverrideDefaults;
        this.override = this.overrideDefaults;
        window.alreadyAddedHistoryAppPage = false;
        return;
    }
}
function defineBottomPopup() {
    window.bottomPopup = new UIBottomPopup();
}
function bottomPopupOpen() {
    if (window.bottomPopup) {
        window.bottomPopup.open();
    } else {
        defineBottomPopup();
        window.bottomPopup.init(window.currentApp);
        window.bottomPopup.open();
    }
}
function bottomPopupClose() {
    if (window.bottomPopup) {
        window.bottomPopup.close();
    } else {
        defineBottomPopup();
        window.bottomPopup.close();
    }
}
function bottomPopupInit(parent) {
    window.bottomPopup.init(window.currentApp);
    parent.parent().scroll(() => {
        if (parent.parent().scrollTop() > 400) {
            parent.find(".container").css({paddingBottom: "5rem"});
            bottomPopupOpen();
        }
        else {
            parent.find(".container").css({paddingBottom: ''});
            bottomPopupClose();
        }
    });
}