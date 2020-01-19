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

String.prototype.toUrl = function(){
    let str = this;
    if(!str.includes(".")) str += ".com";
    return !str.match(/^[a-zA-Z]+:\/\//) ? ('http://' + str) : ('' + str);
}

Date.prototype.getTimeS = function(){
    return Math.floor(this.getTime()/1000)*1000;
}

Date.prototype.getTimeM = function(){
    return this.getTimeS() - this.getSeconds()*1000;
}

Date.prototype.toISOMinuteString = function(){
    let twoDig = num => num.toString().padStart(2, "0");
    let dateString = this.getFullYear() + "-" + twoDig(this.getMonth()+1) + "-" + twoDig(this.getDate());
    let timeString = twoDig(this.getHours()) + ":" + twoDig(this.getMinutes());
    return dateString+'T'+timeString;
}

Date.prototype.toDateRelativeString = function(){
    const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let now = new Date();
    if (this.getTimeM() < now.getTimeM()) {
        let condition = {'day':24*60*60,'hour':60*60,'minute':60,'second':1};
        let diff = (now.getTimeM() - this.getTimeM())/1000;
        for(let key in condition){
            let d = diff / condition[key];
            if(d >= 1){
                let t = Math.round(d);
                let xs = t > 1 ? 's' : '';
                return t + ' ' + key + xs + ' ago';
                break;
            }
        }
    } else if (this.getTimeM() === now.getTimeM()) {
        return "Now!";
    } else {
        let daynm = dayNames[this.getDay()];
        let datmon = this.getDate()+" "+monthNames[this.getMonth()];
        let minsec = this.getHours().toString().padStart(2, "0")+":"+this.getMinutes().toString().padStart(2, "0");
        if (now.getFullYear() === this.getFullYear()) {
            let sameMonth = now.getMonth() === this.getMonth();
            let tomorrow = new Date(now.getTime());
            tomorrow.setDate(tomorrow.getDate()+1);
            if (sameMonth && now.getDate() === this.getDate()) {
                return "Today at "+minsec;
            } else if (sameMonth && tomorrow.getDate() === this.getDate()) {
                return "Tomorrow at "+minsec;
            } else {
                return daynm+", "+datmon+" at "+minsec;
            }
        } else {
            return daynm+", "+datmon+" "+this.getFullYear()+" at "+minsec;
        }
    }
}

Element.prototype.autoExpand = function(){
    let elem = this;

    if(elem.tagName !== "TEXTAREA") throw new Error("The 'autoExpand' method can only be used with textarea element.")

    function resize() {
        let belowMaxHeight = elem.scrollHeight < parseFloat(getComputedStyle(elem).maxHeight);
        let offset = elem.offsetHeight - elem.clientHeight;
        elem.style.height = 'auto';
        elem.style.height = (elem.scrollHeight + offset) + 'px';
        elem.style.overflow = belowMaxHeight ? "hidden" : "visible";
    }
    
    elem.addEventListener('input', resize);
    elem.addEventListener('change', resize);
    elem.addEventListener('cut', () => setTimeout(resize));
    elem.addEventListener('paste', () => setTimeout(resize));
    elem.addEventListener('drop', () => setTimeout(resize));
    elem.addEventListener('keydown', () => setTimeout(resize));
    window.addEventListener('resize', () => setTimeout(resize));
    resize();

    elem.style.overflowWrap = "break-word";
    elem.style.resize = "none";
}

function slide(target, duration = 600) {
    let display = getComputedStyle(target).display;
    if (display === 'none') {
        target.style.removeProperty('display');
        if (display === 'none') display = 'block';
        target.style.display = display;
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.boxSizing = 'border-box';
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
        }, duration);
    } else {
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.boxSizing = 'border-box';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.style.display = 'none';
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
        }, duration);
    }
}

function fade(target, type = '', duration = 600, initial = 'block') {
    let dn = (type == 'show' || type == 'hide') ? (type == 'show' ? true : false) : getComputedStyle(target).display === 'none';
    if(dn) target.style.display = initial;
    target.style.opacity = dn ? 0 : 1;
    target.style.transitionProperty = 'opacity';
    target.style.transitionDuration = duration + 'ms';
    if(dn) window.setTimeout(() => target.style.opacity = 1);
    if(!dn) target.style.opacity = 0;
    window.setTimeout(() => {
        if(!dn) target.style.display = 'none';
        target.style.removeProperty('opacity');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
    }, duration);
}

function modal(header, input, options, doneCallback = () => {}){

    let element = `
        <div id="modal" class="modal-overlay">
            <div class="modal-box">
                <h2 class="mb-4">${header}</h2>
                <form id="modal-form" class="form-group mb-4">
                    <br/>
                    ${input.includes("title") ? `<input class="form-control" type="text" name="title" value="${options.titleVal||''}" placeholder="${options.titlePl||''}" required><br/>`:``}
                    ${input.includes("link") ? `<input class="form-control" type="text" name="link" value="${options.linkVal||''}" placeholder="${options.linkPl||''}">`:``}
                    ${input.includes("date") ? `<input class="form-control" type="datetime-local" name="date" value="${options.dateVal||''}" min="${new Date().toISOMinuteString()}" required><br/>`:``}
                    ${input.includes("repeat") ? `
                    <select class="form-control rounded-0" name="repeat">
                        <option ${options.repeatVal === 'unrepeat' ? 'selected' : ''} value="unrepeat">Does not repeat</option>
                        <option ${options.repeatVal === 'daily' ? 'selected' : ''} value="daily">Daily</option>
                        <option ${options.repeatVal === 'weekly' ? 'selected' : ''} value="weekly">Weekly</option>
                        <option ${options.repeatVal === 'monthly' ? 'selected' : ''} value="monthly">Monthly</option>
                        <option ${options.repeatVal === 'yearly' ? 'selected' : ''} value="yearly">Yearly</option>
                    </select>
                    <br/>
                    ` : ``}
                    ${input.includes("date") ? `
                    <div class="pretty-checkbox" title="Notification can only be used for event that happen in less than 29 days from now">
                        <input type="checkbox" name="notif" id="notifInput" ${(new Date().getTimeS()+60*60*24*29*1000 < new Date(options.dateVal).getTimeS() ? ' disabled' : '') + (options.notif !== false ? ' checked' : '')}>
                        <label for="notifInput">Create notification for this event</label>
                    </div>
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
    fade(mdl, "show");

    let modalForm = document.forms["modal-form"]; 
    let closeModal = () => {
        fade(mdl, "hide", 600);
        setTimeout(() => mdl.parentNode.removeChild(mdl), 600);
    }

    if(input.includes("date")) modalForm.elements.date.addEventListener("input", evt => {
        let val = evt.target.value;
        let notifInput = modalForm.elements.notif;
        let dbled;
        if (new Date().getTimeS()+60*60*24*29*1000 < new Date(val).getTimeS()) {
            notifInput.checked = false;
            dbled = true;
        } else {
            dbled = false;
        }
        notifInput.disabled = dbled;
    })

    modalForm.addEventListener("submit", evt => {
        evt.preventDefault();
        doneCallback({
            title: input.includes("title") ? modalForm.elements.title.value : "",
            link: input.includes("link") ? modalForm.elements.link.value : "",
            date: input.includes("date") ? modalForm.elements.date.value : "",
            repeat: input.includes("repeat") ? modalForm.elements.repeat.value : "",
            notif: input.includes("date") ? modalForm.elements.notif.checked : ""
        });
        closeModal();
    });

    mdl.querySelector(".cancel").addEventListener("click", closeModal);

}

function notif(text = "", description, type = "", time = 5000, undoCallback){

    let identifierNum = Math.floor(100000 + Math.random() * 900000);
    let element = `
        <div id="notif" class="notif-overlay" data-identifier="${identifierNum}">
            <div class="notif-box">
                <div class="row">
                    <div class="text col align-self-center small">
                        ${type !== "" ? `<img class="mr-2" title="Information" src='img/svg/levels/${type}.svg'>`:``}
                        <span class="align-middle">${text}</span>
                    </div>
                    <div class="actions col col-auto align-self-center">
                        ${undoCallback ? `
                        <span class="undo pointer"><img title="Undo" src='img/svg/undo.svg'></span>
                        `:``}
                        ${description ? `
                        <span class="expand pointer"><img title="See description" src='img/svg/arrow-up.svg'></span>
                        `:``}
                        <span class="shut pointer"><img title="Close" src='img/svg/close.svg'></span>
                    </div>
                </div>
                ${description ? `
                <div class="row desc">
                    <div class="col">
                        <p class="small m-0">${description}</p>
                    </div>
                </div>
                ` : ``}
            </div>
        </div>
    `;

    let ntf = document.getElementById("notif");

    typeof ntf != 'undefined' && ntf != null ? ntf.outerHTML = element : document.body.insertAdjacentHTML("beforeend", element);
    ntf = document.getElementById("notif");
    fade(ntf, "show")

    let closeNotif = idNum => {
        ntf = document.getElementById("notif");
        if(idNum !== undefined && ntf.dataset.identifier != idNum) return;
        fade(ntf, "hide", 600)
        setTimeout(() => {
            if(typeof ntf != 'undefined' && ntf != null) ntf.parentNode.removeChild(ntf)
        }, 600);
    }

    if(time !== 0) setTimeout(() => closeNotif(identifierNum), time);

    if(undoCallback) ntf.querySelector(".undo").addEventListener("click", () => {
        undoCallback();
        closeNotif();
    });

    if(description) {
        let desc = ntf.querySelector(".desc");
        let expand = ntf.querySelector(".expand");
        expand.addEventListener("click", () => {
            slide(desc);
            let img = expand.firstElementChild;
            let display = getComputedStyle(desc).display;
            display == "none" ? img.setAttribute("src", "img/svg/arrow-down.svg") : img.setAttribute("src", "img/svg/arrow-up.svg");
        });
    }

    ntf.querySelector(".shut").addEventListener("click", () => closeNotif());

}

const _d = (...args) => new (Function.prototype.bind.apply(Date, [Date, ...args]));

document.querySelectorAll("#sidenav-main button[name^='navbarFade']").forEach(el => {
    el.addEventListener("click", () => fade(document.getElementById("navcol")));
});

document.getElementById("logout").addEventListener("click", () => {
    let userId = sessionStorage.getItem("onesignal-user-id");
    let uid = sessionStorage.getItem("firebase-uid");
    fs.collection("users").doc(uid).update({
        onesignal_devices: firebase.firestore.FieldValue.arrayRemove(userId)
    }).then(() => firebase.auth().signOut());
});