(()=>{
    alert("Autoclicker loaded!(1)");
    if(window.__ac) return;
    alert("Autoclicker loaded!(2)");

    const a = window.__ac = {
        enabled: true,
        running: false,
        target: null,
        cpb: 30000,
        timer: null
    };

    const cpb = document.createElement("div");

    cpb.style = `
        position:fixed;
        top:10px;
        left:50%;
        transform:translateX(-50%);
        z-index:2147483647;
        background:#222;
        color:white;
        padding:10px;
        border-radius:8px;
        font:14px Arial;
        text-align:center;
        box-shadow:0 2px 10px #0008;
    `;

    cpb.innerHTML = `
        <b>Clicks Per Batch</b><br>
        <input id="ac-cpb-input"
               type="number"
               min="1"
               max="1000000"
               value="30000"
               style="width:110px;margin-top:5px">
        <div id="ac-cpb-current">CPB: 30000</div>
        <small>50000+ CPB can lag your device!</small>
    `;

    document.body.appendChild(cpb);

    const stop = document.createElement("div");

    stop.textContent = "Stop Clicking";

    stop.style = `
        position:fixed;
        bottom:20px;
        left:20px;
        z-index:2147483647;
        background:#222;
        color:white;
        padding:12px 18px;
        border-radius:8px;
        font:bold 16px Arial;
        box-shadow:0 2px 10px #0008;
        cursor:pointer;
        display:none;
        user-select:none;
    `;

    document.body.appendChild(stop);

    const toggle = document.createElement("div");

    toggle.style = `
        position:fixed;
        bottom:20px;
        right:20px;
        z-index:2147483647;
        background:#222;
        color:white;
        padding:10px 14px;
        border-radius:8px;
        font:14px Arial;
        box-shadow:0 2px 10px #0008;
        user-select:none;
    `;

    toggle.innerHTML = `
        Auto-Clicker Enabled
        <input id="ac-enabled"
               type="checkbox"
               checked
               style="margin-left:8px">
    `;

    document.body.appendChild(toggle);

    const input = cpb.querySelector("#ac-cpb-input");
    const current = cpb.querySelector("#ac-cpb-current");
    const checkbox = toggle.querySelector("#ac-enabled");

    input.addEventListener("input", () => {
        let value = parseInt(input.value) || 1;

        value = Math.max(1, Math.min(1000000, value));

        a.cpb = value;
        input.value = value;
        current.textContent = "CPB: " + value;
    });

    function stopClicking() {
        a.running = false;
        a.target = null;

        if(a.timer){
            clearTimeout(a.timer);
            a.timer = null;
        }

        stop.style.display = "none";
    }

    function startClicking(element) {
        if(!a.enabled || a.running) return;

        a.running = true;
        a.target = element;

        stop.style.display = "block";

        function clickLoop(){
            if(!a.running || !a.target) return;

            for(let i = 0; i < a.cpb; i++){
                if(!a.running || !a.target) return;

                a.target.click();
            }

            a.timer = setTimeout(clickLoop, 0);
        }

        clickLoop();
    }

    stop.addEventListener("click", e => {
        e.stopPropagation();
        stopClicking();
    });

    checkbox.addEventListener("change", () => {
        a.enabled = checkbox.checked;

        if(!a.enabled){
            stopClicking();
        }
    });

    document.addEventListener("click", e => {
        if(!a.enabled || a.running) return;

        if(
            e.target.closest("#ac-cpb") ||
            e.target.closest("#ac-stop") ||
            e.target.closest("#ac-toggle")
        ){
            return;
        }

        e.preventDefault();

        startClicking(e.target);
    }, true);

    cpb.id = "ac-cpb";
    stop.id = "ac-stop";
    toggle.id = "ac-toggle";
    alert("Autoclicker loaded!(3)");
})();
