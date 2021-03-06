/**
 * Created by lenovo on 2015/4/25.
 */
(function init(){
    var MyUtils = (function (){

        var keys = ["login_value", "password_value"];
        var messages = {
            saveSuccessMsg : "<div class='alert alert-success alert-dismissible' role='alert'><strong>Well done!</strong> You have saved all input.</div>",
            saveFillSuccessMsg : "<div class='alert alert-success alert-dismissible' role='alert'><strong>Well done!</strong> You have saved and filled all input.</div>",
            warningMsg : "<div class='alert alert-warning alert-dismissible' role='alert'><strong>Warning!</strong> Better check yourself, you're not looking too good.</div>"
        };
        var ExtentionID = chrome.runtime.id;
        var saveItem = function(name, value){
            localStorage.setItem(name, value);
        };

        var getItem = function(name){
            return localStorage.getItem(name) || "";
        };

        return {
            ExtId : ExtentionID,
            getKeys: function() {
                return keys.slice(0);
            },
            getAll: function(){
                var params = {},
                    item;

                for (var i = 0; i < keys.length; i++){
                    item = getItem(keys[i]);
                    if (item)
                        params[keys[i]] = item;
                }
                params["is_auto"] = getItem("is_auto");
                return params;
            },
            saveAll: function(params){
                for (var key in params){
                    if (params.hasOwnProperty(key))
                        saveItem(key, params[key]);
                }
            },
            el : function(id, rg){
                var range = rg || document;
                return range.getElementById(id);
            },
            getMsg: function (what) {
                return messages[what];
            },
        };
    })();
    window.addEventListener("load", function(){

        var form = document.forms[0],
            key,
            savedParams = MyUtils.getAll(),
            params;
        //console.log(savedParams);
        for (key in savedParams){
            if (savedParams.hasOwnProperty(key)) {
                if (key == "is_auto")
                    form.elements[key].checked = (savedParams[key] === "true");
                else
                    form.elements[key].value = savedParams[key];
            }
        }

        var saveEvent = function(callback){

            return function(event) {
                event.preventDefault();

                var keys = MyUtils.getKeys(),
                    i;
                params = {};
                for (i = 0; i < keys.length; i++){
                    params[keys[i]] = form.elements[keys[i]].value;
                }
                params["is_auto"] = form.elements["is_auto"].checked;
                //console.log(params);
                MyUtils.saveAll(params);
                callback && callback.apply(null);
            }
        };
        MyUtils.el("save").onclick = saveEvent(function(){
            MyUtils.el("messages").innerHTML = MyUtils.getMsg("saveSuccessMsg");
        });
        MyUtils.el("fill-save").onclick = saveEvent(function(){
            console.log(params);
            chrome.tabs.query({active:	true, currentWindow: true},
                function(tabs)	{
                    chrome.tabs.sendMessage(tabs[0].id, params, function(response){
                        MyUtils.el("messages").innerHTML = ((response && response.error) ? MyUtils.getMsg("warningMsg") : MyUtils.getMsg("saveFillSuccessMsg"));
                    });
                });
        });

    }, false);

})();