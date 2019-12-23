const config = {
    apiKey: "AIzaSyDEwp69Rir4QRYYJzZtEHBwhC2fLD5IqVw",
    authDomain: "coragon.firebaseapp.com",
    databaseURL: "https://coragon.firebaseio.com",
    projectId: "coragon",
    storageBucket: "coragon.appspot.com",
    messagingSenderId: "975187721562",
    appId: "1:975187721562:web:7299b5199bb1b232620763"
};
firebase.initializeApp(config);

const fs = firebase.firestore();
fs.settings({cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED});
fs.enablePersistence({synchronizeTabs: true});

$("#logout").click(()=>firebase.auth().signOut());
$('.navbar-toggler[name=show]').click(()=>$('#navcol').fadeIn());
$('.navbar-toggler[name=hide]').click(()=>$('#navcol').fadeOut());

Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
});

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('sw.js').then(function(reg) {
        console.log('Service Worker is registered', reg);
        reg.pushManager.getSubscription().then(function(sub) {
            if (sub === null) {
                console.log('Not subscribed to push service!');
            } else {
                console.log('Subscription object: ', sub);
            }
        });
    }).catch(function(err) {
        console.log('Service Worker registration failed: ', err);
    });
} else {
    console.log('Push messaging is not supported');
}

function displayNotification() {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then(reg => {
            var options = {
                body: 'Here is a notification body!',
                icon: './img/icons/144x144.png',
                requireInteraction: true,
                data: {
                    repeat: null
                },
                actions: [
                    {action: 'snooze', title: 'Snooze'},
                    {action: 'done', title: 'Done'}
                ]
            };
            reg.showNotification('Coragon Notification', options);
        });
    }
}

function subscribeUser() {
    navigator.serviceWorker.getRegistration().then(reg => {
        reg.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function(sub) {
            console.log('Endpoint URL: ', sub.endpoint);
        }).catch(function(e) {
            console.log('Unable to subscribe to push', e);
        });
    })
}

function pad(num, size) {
    var s = "00000" + num;
    return s.substr(s.length-size);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function autoHttp(url){
    if(!url.match(/^[a-zA-Z]+:\/\//)){
        return 'http://' + url;
    } else {
        return url;
    }
}

function time(data){
    var dt;
    if(data===undefined || !data) dt = new Date();
    else dt = new Date(data);
    return Math.floor(dt.getTime()/1000);
}

function utcDate(data){
    var dt;
    if(data===undefined || !data) dt = new Date();
    else dt = new Date(/^\d+$/.test(data) || typeof data==="number"?Number(data):data);
    var theDate = dt.getFullYear()+'-'+pad((dt.getMonth()+1),2)+'-'+pad(dt.getDate(),2);
    var theTime = pad(dt.getHours(),2) + ":" + pad(dt.getMinutes(),2);
    return theDate+'T'+theTime;
}

function readableDate(data){
    const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var dt = new Date(data);
    if (time(dt) < time(utcDate())) {
        let condition = {'day':24*60*60,'hour':60*60,'minute':60,'second':1};
        let diff = time() - time(dt);
        if(diff < 1) return 'less than 1 second ago';
        for(let key in condition){
            let d = diff / condition[key];
            if(d >= 1){
                let t = Math.round(d);
                let xs = t > 1 ? 's' : '';
                return t + ' ' + key + xs + ' ago';
                break;
            }
        }
    } else if (time(dt) === time(utcDate())) {
        return "Now!";
    } else {
        let daynm = dayNames[dt.getDay()];
        let datmon = parseInt(dt.getDate(),10)+" "+monthNames[Number(parseInt(dt.getMonth(),10))];
        let minsec = pad(dt.getHours(),2)+":"+pad(dt.getMinutes(),2);
        if (new Date().getFullYear() === dt.getFullYear()) {
            let sameMonth = new Date().getMonth() === dt.getMonth();
            let tomo = new Date();
            tomo.setDate(tomo.getDate()+1)
            if (sameMonth && new Date().getDate() === dt.getDate()) {
                return "Today at "+minsec;
            } else if (sameMonth && tomo.getDate() === dt.getDate()) {
                return "Tomorrow at "+minsec;
            } else {
                return daynm+", "+datmon+" at "+minsec;
            }
        } else {
            return daynm+", "+datmon+" "+dt.getFullYear()+" at "+minsec;
        }
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function repeatTime(dateTimestamp,repeatEvery) {
    dateTimestamp = Number(dateTimestamp);
    let dt = dateTimestamp;
    let objectdt = new Date(dateTimestamp);
    if(repeatEvery==="daily") dt += 60*60*24*1000;
    else if(repeatEvery==="weekly") dt += 60*60*24*7*1000;
    else if(repeatEvery==="monthly") {
        let date = objectdt.getDate();
        objectdt.setMonth(objectdt.getMonth()+1);
        objectdt.setDate(date);
        dt = objectdt.getTime();
    }
    else if(repeatEvery==="yearly") {
        objectdt.setFullYear(objectdt.getFullYear() + (
            objectdt.getDate() === 29 && objectdt.getMonth() === 1 ? 4 : 1
        ));
        dt = objectdt.getTime();
    }
    return dt;
}

function modal(header, input, options, done = ()=>{}){

    var element = `
        <div id="modal" class="modal-overlay">
            <div class="modal-box">
                <h2 class="mb-4">${header}</h2>
                <form id="modal-form" class="form-group mb-4">
                    <br/>
                    ${input.includes("title")?`<input class="form-control" type="text" name="title" value="${options.titleVal||''}" placeholder="${options.titlePl||''}" required><br/>`:``}
                    ${input.includes("link")?`<input class="form-control" type="text" name="link" value="${options.linkVal||''}" placeholder="${options.linkPl||''}">`:``}
                    ${input.includes("date")?`<input class="form-control" type="datetime-local" name="date" value="${options.dateVal||''}" min="${utcDate((time()+60)*1000)}" required><br/>`:``}
                    ${input.includes("repeat")?`
                    <select class="form-control rounded-0" name="repeat">
                        <option ${options.repeatVal==='unrepeat'?'selected':''} value="unrepeat">Does not repeat</option>
                        <option ${options.repeatVal==='daily'?'selected':''} value="daily">Daily</option>
                        <option ${options.repeatVal==='weekly'?'selected':''} value="weekly">Weekly</option>
                        <option ${options.repeatVal==='monthly'?'selected':''} value="monthly">Monthly</option>
                        <option ${options.repeatVal==='yearly'?'selected':''} value="yearly">Yearly</option>
                    </select>
                    `:``}
                </form>
                <div class="text-right">
                    <button class="btn btn-danger cancel">Cancel</button>
                    <button type="submit" form="modal-form" class="btn btn-primary ml-2" autofocus>OK</button>
                </div>
            </div>
        </div>
    `;

    $(element).hide().appendTo("body").fadeIn();

    function closeModal(){
        $("#modal").fadeOut(400, function(){
            $(this).remove();
        });
    }

    $("#modal-form").submit(function(){
        done({
            title: $("#modal input[name=title]").val() || "",
            link: $("#modal input[name=link]").val() || "",
            date: $("#modal input[name=date]").val() || "",
            repeat: $("#modal select[name=repeat]").val() || ""
        });
        closeModal();
        return false;
    });

    $("#modal .cancel").click(closeModal);

}

function notif(text = "", desc, type = "", time = 5000, undo){

    var rand = Math.floor(Math.random() * 10000);
    var element = `
        <div id="notif" class="notif-overlay" data-box-id="${rand}">
            <div class="notif-box">
                <div class="row">
                    <div class="text col align-self-center small">
                        ${type!==""?`<img class="mr-2" title="Information" src='img/svg/${type}.svg'>`:``}
                        <span class="align-middle">${text}</span>
                    </div>
                    <div class="col col-auto align-self-center">
                        ${undo?`<span class="undo pointer"><img title="Undo" src='img/svg/undo.svg'></span>`:``}
                        ${desc?`<span class="expand pointer"><img title="See description" src='img/svg/arrow-down.svg'></span>`:``}
                        <span class="shut pointer"><img title="Close" src='img/svg/close.svg'></span>
                    </div>
                </div>
                <div class="row desc" style="display:none">
                    <div class="col mt-2">
                        <p class="small m-0">${desc}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    if($("#notif").length !== 0) $("#notif").replaceWith(element);
    else $(element).hide().appendTo("body").fadeIn("fast");

    function closeNotif(boxID){
        $("#notif[data-box-id="+boxID+"]").fadeOut("fast",function(){
            $(this).remove();
        });
    }

    if(time !== 0) setTimeout(()=>closeNotif(rand), time);

    $("#notif .undo").click(()=>{
        undo();
        closeNotif(rand);
    });

    $("#notif .expand").click(function(){
        let el = $(".desc");
        if(el.is(":hidden")){
            el.slideDown("fast");
            $(this).children("img").attr("src","img/svg/arrow-up.svg");
        } else {
            el.slideUp("fast");
            $(this).children("img").attr("src","img/svg/arrow-down.svg");
        }
    });

    $("#notif .shut").click(()=>closeNotif(rand));

}