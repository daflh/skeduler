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

String.prototype.capitalize = function(onlyFirstWord = false) {
    let cptlzer = word => word.charAt(0).toUpperCase() + word.slice(1);
    return !onlyFirstWord ? this.split(" ").map(cptlzer).join(" ") : cptlzer(this);
}

String.prototype.extractNumber = function(){
    return Number(this.match(/\d+/g).join(""));
}

String.prototype.toUrl = function(){
    let str = this;
    if(!str.includes(".")) str += ".com";
    return !str.match(/^[a-zA-Z]+:\/\//) ? ('http://' + str) : ('' + str);
}

let twoDigit = num => ("0" + num).substr(-2);

let time = data => Math.floor((data === undefined || !data ? new Date() : new Date(data)).getTime()/1000);

let utcDate = data => {
    let dt = (data === undefined || !data) ? new Date() : new Date(/^\d+$/.test(data) || typeof data==="number" ? Number(data) : data);
    let theDate = dt.getFullYear()+'-'+twoDigit((dt.getMonth()+1),2)+'-'+twoDigit(dt.getDate(),2);
    let theTime = twoDigit(dt.getHours(),2) + ":" + twoDigit(dt.getMinutes(),2);
    return theDate+'T'+theTime;
}

let readableDate = data => {
    const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let dt = new Date(data);
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
        let minsec = twoDigit(dt.getHours(),2)+":"+twoDigit(dt.getMinutes(),2);
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

let repeatTime = (dateTimestamp, repeatEvery) => {
    dateTimestamp = Number(dateTimestamp);
    let dt = dateTimestamp;
    let objectdt = new Date(dateTimestamp);
    if(repeatEvery==="daily") {
        dt += 60*60*24*1000;
    } else if(repeatEvery==="weekly") {
        dt += 60*60*24*7*1000;
    } else if(repeatEvery==="monthly") {
        let date = objectdt.getDate();
        objectdt.setMonth(objectdt.getMonth()+1);
        objectdt.setDate(date);
        dt = objectdt.getTime();
    } else if(repeatEvery==="yearly") {
        objectdt.setFullYear(objectdt.getFullYear() + (
            objectdt.getDate() === 29 && objectdt.getMonth() === 1 ? 4 : 1
        ));
        dt = objectdt.getTime();
    }
    return dt;
}

let modal = (header, input, options, doneCallback = () => {}) => {

    let element = `
        <div id="modal" class="modal-overlay fade hide opacity-0">
            <div class="modal-box">
                <h2 class="mb-4">${header}</h2>
                <form id="modal-form" class="form-group mb-4">
                    <br/>
                    ${input.includes("title") ? `<input class="form-control" type="text" name="title" value="${options.titleVal||''}" placeholder="${options.titlePl||''}" required><br/>`:``}
                    ${input.includes("link") ? `<input class="form-control" type="text" name="link" value="${options.linkVal||''}" placeholder="${options.linkPl||''}">`:``}
                    ${input.includes("date") ? `<input class="form-control" type="datetime-local" name="date" value="${options.dateVal||''}" min="${utcDate((time()+60)*1000)}" required><br/>`:``}
                    ${input.includes("repeat") ? `
                    <select class="form-control rounded-0" name="repeat">
                        <option ${options.repeatVal === 'unrepeat' ? 'selected' : ''} value="unrepeat">Does not repeat</option>
                        <option ${options.repeatVal === 'daily' ? 'selected' : ''} value="daily">Daily</option>
                        <option ${options.repeatVal === 'weekly' ? 'selected' : ''} value="weekly">Weekly</option>
                        <option ${options.repeatVal === 'monthly' ? 'selected' : ''} value="monthly">Monthly</option>
                        <option ${options.repeatVal === 'yearly' ? 'selected' : ''} value="yearly">Yearly</option>
                    </select>
                    ` : ``}
                </form>
                <div class="text-right">
                    <button class="btn btn-danger cancel">Cancel</button>
                    <button type="submit" form="modal-form" class="btn btn-primary ml-2" autofocus>OK</button>
                </div>
            </div>
        </div>
    `;

    let mdl;

    document.body.insertAdjacentHTML("beforeend", element);
    mdl = document.getElementById("modal");
    mdl.style.display = "block";
    setTimeout(() => mdl.style.opacity = 1, 10);

    let modalForm = document.forms["modal-form"]; 
    let closeModal = () => {
        mdl.style.opacity = 0;
        setTimeout(() => mdl.parentNode.removeChild(mdl), 600);
    }

    modalForm.addEventListener("submit", evt => {
        evt.preventDefault();
        doneCallback({
            title: input.includes("title") ? modalForm.elements.title.value : "",
            link: input.includes("link") ? modalForm.elements.link.value : "",
            date: input.includes("date") ? modalForm.elements.date.value : "",
            repeat: input.includes("repeat") ? modalForm.elements.repeat.value : ""
        });
        closeModal();
    });

    mdl.getElementsByClassName("cancel")[0].addEventListener("click", closeModal);

}

let notif = (text = "", desc, type = "", time = 5000, undoCallback) => {

    let identifierNum = Math.floor(100000 + Math.random() * 900000);
    let element = `
        <div id="notif" class="notif-overlay fade hide opacity-0" data-identifier="${identifierNum}">
            <div class="notif-box">
                <div class="row">
                    <div class="text col align-self-center small">
                        ${type !== "" ? `<img class="mr-2" title="Information" src='img/svg/${type}.svg'>`:``}
                        <span class="align-middle">${text}</span>
                    </div>
                    <div class="col col-auto align-self-center">
                        ${undoCallback ? `<span class="undo pointer"><img title="Undo" src='img/svg/undo.svg'></span>`:``}
                        ${desc ? `<span class="expand pointer"><img title="See description" src='img/svg/arrow-down.svg'></span>`:``}
                        <span class="shut pointer"><img title="Close" src='img/svg/close.svg'></span>
                    </div>
                </div>
                ${desc ? `<div class="row desc slide hide height-0">
                    <div class="col mt-2">
                        <p class="small m-0">${desc}</p>
                    </div>
                </div>` : ``}
            </div>
        </div>
    `;

    let ntf = document.getElementById("notif");

    typeof ntf != 'undefined' && ntf != null ? ntf.outerHTML = element : document.body.insertAdjacentHTML("beforeend", element);
    ntf = document.getElementById("notif");
    ntf.style.display = "block";
    setTimeout(() => ntf.style.opacity = 1, 10);

    let closeNotif = idNum => {
        ntf = document.getElementById("notif");
        if(idNum !== undefined && ntf.dataset.identifier != idNum) return;
        ntf.style.opacity = 0;
        setTimeout(() => {
            if(typeof ntf != 'undefined' && ntf != null) ntf.parentNode.removeChild(ntf)
        }, 600);
    }

    if(time !== 0) setTimeout(() => closeNotif(identifierNum), time);

    if(undoCallback) ntf.getElementsByClassName("undo")[0].addEventListener("click", () => {
        undoCallback();
        closeNotif();
    });

    if(desc) ntf.getElementsByClassName("expand")[0].addEventListener("click", () => {
        let desc = ntf.getElementsByClassName("desc")[0];
        let img = ntf.getElementsByClassName("expand")[0].firstElementChild;
        if(getComputedStyle(desc).display == "none"){
            desc.style.display = "block";
            setTimeout(() => desc.style.height = "100%", 10);
            img.setAttribute("src", "img/svg/arrow-up.svg");
        } else {
            desc.style.height = "0";
            setTimeout(() => desc.style.display = "none", 600);
            img.setAttribute("src", "img/svg/arrow-down.svg");
        }
    });

    ntf.getElementsByClassName("shut")[0].addEventListener("click", () => closeNotif());

}

let navbar = document.getElementById("navcol");

document.getElementsByName("navbarFadeIn")[0].addEventListener("click", () => {
    navbar.style.display = "block";
    setTimeout(() => navbar.style.opacity = 1, 10);
});

document.getElementsByName("navbarFadeOut")[0].addEventListener("click", () => {
    navbar.style.opacity = 0;
    setTimeout(() => navbar.style.display = "none", 600);
});

document.getElementById("logout").addEventListener("click", () => {
    let userId = sessionStorage.getItem("onesignal-user-id");
    let uid = sessionStorage.getItem("firebase-uid");
    fs.collection("users").doc(uid).update({
        onesignal_devices: firebase.firestore.FieldValue.arrayRemove(userId)
    }).then(() => firebase.auth().signOut());
});