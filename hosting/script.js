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

function pad(num, size) {
    var s = "00000" + num;
    return s.substr(s.length-size);
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

function dialogBox(opt,doneCallback=()=>{}){
    function closeDialog(){
        $("#dialog").fadeOut("fast", ()=>$(this).remove());
    }
    var element = `
        <div id="dialog" class="dialog-overlay">
            <div class="dialog-box">
                <h2 class="mb-4">${opt.header}</h2>
                <form id="dialogForm" class="form-group mb-4">
                    <br/>
                    `+(opt.input.includes("title")?`
                    <input class="form-control" type="text" name="title" value="${opt.titleValue||''}" placeholder="${opt.titlePlaceholder||''}" required><br/>
                    `:``)
                    +(opt.input.includes("link")?`
                    <input class="form-control" type="text" name="link" value="${opt.linkValue||''}" placeholder="${opt.linkPlaceholder||''}">
                    `:``)
                    +(opt.input.includes("date")?`
                    <input class="form-control" type="datetime-local" name="date" value="${opt.dateValue||''}" min="${utcDate((time()+60)*1000)}" required><br/>
                    `:``)
                    +(opt.input.includes("repeat")?`
                    <select class="form-control rounded-0" name="repeat">
                        <option `+(opt.repeatValue===null?'selected ':'')+` value="null">Does not repeat</option>
                        <option `+(opt.repeatValue==='daily'?'selected ':'')+`value="daily">Daily</option>
                        <option `+(opt.repeatValue==='weekly'?'selected ':'')+`value="weekly">Weekly</option>
                        <option `+(opt.repeatValue==='monthly'?'selected ':'')+`value="monthly">Monthly</option>
                        <option `+(opt.repeatValue==='yearly'?'selected ':'')+`value="yearly">Yearly</option>
                    </select>
                    `:``)+`
                </form>
                <div class="text-right">
                    <button class="btn btn-danger cancel">Cancel</button>
                    <button type="submit" form="dialogForm" class="btn btn-primary ml-2" autofocus>OK</button>
                </div>
            </div>
        </div>
    `;
    $(element).hide().appendTo("body").fadeIn();
    $("#dialogForm").submit(()=>{
        doneCallback({
            title: $("#dialog input[name=title]").val()||"",
            link: $("#dialog input[name=link]").val()||"",
            date: $("#dialog input[name=date]").val()||"",
            repeat: $("#dialog select[name=repeat]").val()!="null"?$("#dialog select[name=repeat]").val():null
        });
        closeDialog();
        return false;
    });
    $("#dialog button.cancel").click(()=>closeDialog());
}

function infoBox(text,undoActionCallback){
    function closeInfo(sesn){
        $("#info[data-session="+sesn+"]").fadeOut("fast",()=>$(this).remove());
        clearTimeout(timeout);
    }
    var timeout;
    var rand = Math.floor(Math.random() * 10000);
    var undo = undoActionCallback !== undefined;
    var element = `
        <div id="info" class="info-overlay" data-session="${rand}">
            <div class="info-box">
                <div class="text small">${text}</div>
                <div class="mt-3">
                    `+(undo?`<span class="undo pointer text-primary small float-left">Undo</span>`:``)+`
                    <span class="shut pointer small `+(undo?`float-right`:`float-left`)+`">Close</span>
            </div>
        </div>
    `;
    if($("#info").length !== 0){
        $("#info").remove();
        $("body").append(element);
    } else {
        $(element).hide().appendTo("body").fadeIn("fast");
    }
    timeout = setTimeout(()=>closeInfo(rand), 10000);
    $("#info .undo").click(()=>{undoActionCallback();closeInfo(rand)});
    $("#info .shut").click(()=>closeInfo(rand));
}