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
            }
        };
    })();


    var url = window.location.href,
        pageHTML = (document.getElementsByTagName("html")[0].innerHTML);



    if (url.indexOf("https://autolab.cs.cmu.edu/auth/users/sign_in") != -1){
        window.location.href = "https://autolab.cs.cmu.edu/auth/users/auth/shibboleth";
    }
    else if (url.match(/^https?:\/\/oli\.cmu\.edu\/?(jcours\/webui\/login\/required.do)??$/i)) {
        window.location.href = "https://oli.cmu.edu/jcourse/webui/login/webiso.do";
    }
    else if (url.indexOf("https://oli.cmu.edu/jcourse/webui/login/required.do?") != -1) {
        window.location.href = "https://oli.cmu.edu/jcourse/webui/login/webiso.do";
    }
    else if (url.indexOf("https://login.cmu.edu/idp") != -1) {
        chrome.runtime.sendMessage(MyUtils.ExtId, "login_info", {}, function (response) {
            var is_auto;
            console.log(response);
            MyUtils.el("j_username").value = response["login_value"];
            MyUtils.el("j_password").value = response["password_value"];
            is_auto = (response.is_auto === "true");
            if (is_auto && pageHTML.indexOf("Authentication failed.") == -1) {
                document.forms["query"]['_eventId_proceed'].click()
            }
        });
    }
    else if (url.indexOf("http://www.cmu.edu/career/") != -1) {
        chrome.runtime.sendMessage(MyUtils.ExtId, "login_info", {}, function (response) {
            var is_auto;

            document.querySelector("input[alt='Username']").value = response["login_value"] + "@andrew.cmu.edu";
            document.querySelector("input[alt='Password']").value = response["password_value"];
            is_auto = (response.is_auto === "true");
            if (is_auto && pageHTML.indexOf("Authentication failed.") == -1) {
                document.forms[1].submit();
            }
        });
    }
})();
