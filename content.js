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

        chrome.runtime.sendMessage(MyUtils.ExtId, "login_info", {}, function(response){
            var regex,
                is_auto;
            if (document.title == "login.cmu.edu") {
                var suc = fillForm(response);
                console.log(response);
                is_auto = (response.is_auto === "true");
                if (suc && is_auto && pageHTML.indexOf("Authentication failed.") == -1) {
                    document.forms["query"]["submit"].click();
                }
            }
        });

        chrome.runtime.onMessage.addListener(function (messages, sender, sendResponse) {
            if (messages == "login_info") return false;
            if (fillForm(messages))
                sendResponse({status: "success"});
            else
                sendResponse({error: "Invalid value."});
        });

    };

    function fillForm(messages){
        var key,
            item,
            message = {};
        //console.log(messages);
        try{
            message[messages.login_id] = messages["login_value"];
            message[messages.password_id] = messages["password_value"];
        }catch (ex){
            return false;
        }

        //console.log(message);
        for (key in message){
            if (message[key].length < 1){
                return false;
            }
            item = MyUtils.el(key);
            if (item){
                item.value = message[key];
            }
            else{
                return false;
            }
        }
        return true;
    }

    function getOCR(captcha_id) {
        var image = new Image();
        image.src = document.getElementById(captcha_id).src;
        var canvas = document.createElement('canvas');
        canvas.height = image.height;
        canvas.width = image.width;
        var imgDraw = canvas.getContext('2d');
        imgDraw.drawImage(image,0,0);
        return OCRAD(imgDraw);

    }

})();