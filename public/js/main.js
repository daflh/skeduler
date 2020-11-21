const config = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "example.firebaseapp.com",
    databaseURL: "https://example.firebaseio.com",
    projectId: "example",
    storageBucket: "example.appspot.com",
    messagingSenderId: "123456789012",
    appId: "YOUR_FIREBASE_APP_ID"
};

firebase.initializeApp(config);

const fs = firebase.firestore();
fs.settings({ cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED });
fs.enablePersistence({ synchronizeTabs: true });

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}

String.prototype.toUrl = () => {
    let str = this;
    if (!str.includes(".")) str += ".com";
    return !str.match(/^[a-zA-Z]+:\/\//) ? ('http://' + str) : ('' + str);
}

Date.prototype.getTimeS = () => {
    return Math.floor(this.getTime()/1000)*1000;
}

Date.prototype.getTimeM = () => {
    return this.getTimeS() - this.getSeconds()*1000;
}

Date.prototype.toISOMinuteString = () => {
    let twoDig = (num) => num.toString().padStart(2, "0");
    let dateString = this.getFullYear() + "-" + twoDig(this.getMonth()+1) + "-" + twoDig(this.getDate());
    let timeString = twoDig(this.getHours()) + ":" + twoDig(this.getMinutes());
    return dateString+'T'+timeString;
}

Date.prototype.toDateRelativeString = () => {
    const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let now = new Date();
    if (this.getTimeM() < now.getTimeM()) {
        let condition = {'day':24*60*60,'hour':60*60,'minute':60,'second':1};
        let diff = (now.getTimeM() - this.getTimeM())/1000;
        for(let key in condition){
            let d = diff / condition[key];
            if (d >= 1) {
                let t = Math.round(d);
                let xs = t > 1 ? 's' : '';
                return t + ' ' + key + xs + ' ago';
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

function fade(target, { type = '', duration = 600, initial = 'block' } = {}) {
    let dn = (type == 'show' || type == 'hide') ? (type == 'show' ? true : false) : getComputedStyle(target).display === 'none';
    if (dn) target.style.display = initial;
    target.style.opacity = dn ? 0 : 1;
    target.style.transitionProperty = 'opacity';
    target.style.transitionDuration = duration + 'ms';
    if (dn) window.setTimeout(() => target.style.opacity = 1);
    if (!dn) target.style.opacity = 0;
    window.setTimeout(() => {
        if (!dn) target.style.display = 'none';
        target.style.removeProperty('opacity');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
    }, duration);
}

function slide(target, { type = '', duration = 600, initial = 'block' } = {}) {
    let dn = (type == 'show' || type == 'hide') ? (type == 'show' ? true : false) : getComputedStyle(target).display === 'none';
    if (dn) {
        target.style.removeProperty('display');
        target.style.display = initial;
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

function modal(header, input = [], { titleVal = "", titlePlac = "", linkVal = "", linkPlac = "", dateVal = "", repeatVal = "" } = {}, whenSubmit = () => {}) {

    let element = `
        <div id="modal" class="modal-overlay">
            <div class="modal-box">
                <h2 class="mb-4">${header}</h2>
                <form id="modal-form" class="form-group mb-4">
                    <br/>
                    ${input.includes("title") ? `<input class="form-control" type="text" name="title" value="${titleVal}" placeholder="${titlePlac}" required><br/>`:``}
                    ${input.includes("link") ? `<input class="form-control" type="text" name="link" value="${linkVal}" placeholder="${linkPlac}">`:``}
                    ${input.includes("date") ? `<input class="form-control" type="datetime-local" name="date" value="${dateVal}" min="${new Date().toISOMinuteString()}" required><br/>`:``}
                    ${input.includes("repeat") ? `
                    <select class="form-control rounded-0" name="repeat">
                        <option ${repeatVal === 'no' ? 'selected' : ''} value="no">Does not repeat</option>
                        <option ${repeatVal === 'daily' ? 'selected' : ''} value="daily">Daily</option>
                        <option ${repeatVal === 'weekly' ? 'selected' : ''} value="weekly">Weekly</option>
                        <option ${repeatVal === 'monthly' ? 'selected' : ''} value="monthly">Monthly</option>
                        <option ${repeatVal === 'yearly' ? 'selected' : ''} value="yearly">Yearly</option>
                    </select>
                    <br/>
                    ` : ``}
                </form>
                <div class="text-right">
                    <button class="btn btn-danger cancel">Cancel</button>
                    <button type="submit" name="submit" form="modal-form" class="btn btn-primary ml-2" autofocus>OK</button>
                </div>
            </div>
        </div>
    `;

    let mdl;

    document.body.insertAdjacentHTML("beforeend", element);
    mdl = document.getElementById("modal");
    fade(mdl, { type: "show" });

    let modalForm = document.forms["modal-form"]; 
    let closeModal = () => {
        fade(mdl, { type: "hide", duration: 600 });
        setTimeout(() => mdl.parentNode.removeChild(mdl), 600);
    }

    modalForm.addEventListener("submit", (evt) => {
        evt.preventDefault();
        whenSubmit({
            title: input.includes("title") ? modalForm.elements.title.value : "",
            link: input.includes("link") ? modalForm.elements.link.value : "",
            date: input.includes("date") ? modalForm.elements.date.value : "",
            repeat: input.includes("repeat") ? modalForm.elements.repeat.value : ""
        });
        closeModal();
        modalForm.elements.submit.disabled = true;
    });

    mdl.querySelector(".cancel").addEventListener("click", closeModal);

}

function notif(text = "", { type = "", duration = 5000, description, whenUndo } = {}) {

    let identifierNum = Math.floor(100000 + Math.random() * 900000);
    let element = `
        <div id="notif" class="notif-overlay" data-identifier="${identifierNum}">
            <div class="notif-box">
                <div class="row">
                    <div class="text col align-items-center align-self-center small">
                        ${type !== "" ? `<i class="icon ${type} mr-2"></i>`:``}
                        <span class="align-middle">${text}</span>
                    </div>
                    <div class="actions col col-auto align-items-center">
                        ${whenUndo ? `
                        <i class="icon undo" title="Undo"></i>
                        `:``}
                        ${description ? `
                        <i class="icon expand arrow-up" title="See description"></i>
                        `:``}
                        <i class="icon shut" title="Close"></i>
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
    fade(ntf, { type: "show" })

    let closeNotif = (idNum) => {
        ntf = document.getElementById("notif");
        if (idNum !== undefined && (ntf == null || ntf.dataset.identifier != idNum)) return;
        fade(ntf, { type: "hide", duration: 600 })
        setTimeout(() => {
            if (typeof ntf != 'undefined' && ntf != null) ntf.parentNode.removeChild(ntf)
        }, 600);
    }

    if (duration !== 0) setTimeout(() => closeNotif(identifierNum), duration);

    if (whenUndo) {
        ntf.querySelector(".undo").addEventListener("click", () => {
            whenUndo();
            closeNotif();
        });
    }

    if (description) {
        let desc = ntf.querySelector(".desc");
        let expand = ntf.querySelector(".expand");
        expand.addEventListener("click", () => {
            if (getComputedStyle(desc).display == "none") {
                expand.classList.replace("arrow-up", "arrow-down");
                expand.title = "Hide description";
            } else {
                expand.classList.replace("arrow-down", "arrow-up");
                expand.title = "See description";
            }
            slide(desc);
        });
    }

    ntf.querySelector(".shut").addEventListener("click", () => closeNotif());

}

const _d = (...args) => new (Function.prototype.bind.apply(Date, [Date, ...args]));

if (location.pathname !== "/login") {
    
    document.querySelectorAll("#sidenav-main button[name^='navbarFade']").forEach((el) => {
        el.addEventListener("click", () => fade(document.getElementById("navcol")));
    });

    document.getElementById("logout").addEventListener("click", () => {
        firebase.auth().signOut();
    });

}
