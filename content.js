/**
 * Created by lenovo on 2015/4/6.
 */
(function init(){

    var MyUtils = (function (){

        var ExtentionID = chrome.runtime.id;

        return {
            ExtId : ExtentionID,
            el : function(id, rg){
                var range = rg || document;
                return range.getElementById(id);
            },
            getMsg: function (what) {
                return messages[what];
            },
            qs : function(selector, rg){
                var range = rg || document;
                return range.querySelector(selector);
            },
            qsa : function(selector, rg){
                var range = rg || document;
                return range.querySelectorAll(selector);
            }
        };
    })();


    window.onload = function(){

        var pageHTML = (document.getElementsByTagName("html")[0].innerHTML);

        if (window.location.href == "https://login.cmu.edu/idp/Authn/Stateless") {
            chrome.runtime.sendMessage(MyUtils.ExtId, "login_info", {}, function (response) {
                var is_auto;

                MyUtils.el("j_username").value = response["login_value"];
                MyUtils.el("j_password").value = response["password_value"];
                is_auto = (new Boolean(response.is_auto) == true);
                if (is_auto && pageHTML.indexOf("Authentication failed.") == -1) {
                    document.forms["query"]["submit"].click();
                }
            });
        }

    };


})();