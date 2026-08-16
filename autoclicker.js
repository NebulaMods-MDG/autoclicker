(()=>{
    if(window.__ac)return;

    const a=window.__ac={
        enabled:true,
        running:false,
        target:null,
        mode:"delay",
        delay:0,
        cpb:10000,
        timer:null,
        last:performance.now(),
        remainder:0
    };

    const ui=document.createElement("div");
    ui.id="ac-ui";
    ui.style=`
        position:fixed;
        top:10px;
        left:50%;
        transform:translateX(-50%);
        z-index:2147483647;
        background:#222;
        color:#fff;
        padding:10px;
        border-radius:8px;
        font:14px Arial;
        text-align:center;
        box-shadow:0 2px 10px #0008;
    `;

    ui.innerHTML=`
        <button id="ac-mode" style="margin-bottom:6px;padding:5px 10px">
            Click Delay
        </button><br>
        <b id="ac-title">Click Delay</b><br>
        <input id="ac-input" type="number" min="0" value="0"
        style="width:110px;margin-top:5px">
        <div id="ac-current">Delay: 0 ms</div>
    `;

    document.body.appendChild(ui);

    const stop=document.createElement("button");
    stop.id="ac-stop";
    stop.textContent="Stop Clicking";

    stop.style=`
        position:fixed;
        bottom:20px;
        left:20px;
        z-index:2147483647;
        background:#222;
        color:#fff;
        padding:12px 18px;
        border:0;
        border-radius:8px;
        font:bold 16px Arial;
        box-shadow:0 2px 10px #0008;
        display:none;
    `;

    document.body.appendChild(stop);

    const toggle=document.createElement("label");
    toggle.id="ac-toggle";

    toggle.style=`
        position:fixed;
        bottom:20px;
        right:20px;
        z-index:2147483647;
        background:#222;
        color:#fff;
        padding:10px 14px;
        border-radius:8px;
        font:14px Arial;
        box-shadow:0 2px 10px #0008;
    `;

    toggle.innerHTML='Auto-Clicker Enabled <input type="checkbox" checked>';
    document.body.appendChild(toggle);

    const mode=ui.querySelector("#ac-mode");
    const title=ui.querySelector("#ac-title");
    const input=ui.querySelector("#ac-input");
    const current=ui.querySelector("#ac-current");
    const checkbox=toggle.querySelector("input");

    function updateUI(){
        if(a.mode==="delay"){
            mode.textContent="Switch to CPB";
            title.textContent="Click Delay";
            input.min="0";
            input.max="";
            input.value=a.delay;
            current.textContent="Delay: "+a.delay+" ms";
        }else{
            mode.textContent="Switch to Click Delay";
            title.textContent="Clicks Per Batch";
            input.min="1";
            input.max="1000000";
            input.value=a.cpb;
            current.textContent="CPB: "+a.cpb;
        }
    }

    mode.addEventListener("click",e=>{
        e.stopPropagation();

        if(a.mode==="delay"){
            a.mode="cpb";
        }else{
            a.mode="delay";
        }

        updateUI();
    });

    input.addEventListener("input",()=>{
        let n=parseFloat(input.value);

        if(a.mode==="delay"){
            if(isNaN(n)||n<0)n=0;

            a.delay=n;
            current.textContent="Delay: "+n+" ms";
        }else{
            if(isNaN(n)||n<1)n=1;
            if(n>1000000)n=1000000;

            a.cpb=Math.floor(n);
            input.value=a.cpb;
            current.textContent="CPB: "+a.cpb;
        }
    });

    function stopClicking(){
        a.running=false;
        a.target=null;

        if(a.timer){
            clearTimeout(a.timer);
            a.timer=null;
        }

        a.last=performance.now();
        a.remainder=0;

        stop.style.display="none";
    }

    function clickLoop(){
        if(!a.running||!a.target)return;

        const now=performance.now();
        const elapsed=now-a.last;
        a.last=now;

        if(a.mode==="delay"){
            if(a.delay<=0){
                a.target.click();
            }else{
                const exact=elapsed/a.delay+a.remainder;
                const clicks=Math.floor(exact);

                a.remainder=exact-clicks;

                for(let i=0;i<clicks;i++){
                    if(!a.running||!a.target)return;
                    a.target.click();
                }
            }
        }else{
            const target=a.target;

            for(let i=0;i<a.cpb;i++){
                if(!a.running||a.target!==target)return;
                target.click();
            }
        }

        a.timer=setTimeout(clickLoop,0);
    }

    stop.addEventListener("click",e=>{
        e.stopPropagation();
        stopClicking();
    });

    checkbox.addEventListener("change",()=>{
        a.enabled=checkbox.checked;

        if(!a.enabled){
            stopClicking();
        }
    });

    document.addEventListener("click",e=>{
        if(!a.enabled||a.running)return;

        if(
            e.target.closest("#ac-ui")||
            e.target.closest("#ac-stop")||
            e.target.closest("#ac-toggle")
        )return;

        e.preventDefault();

        a.target=e.target;
        a.running=true;
        a.last=performance.now();
        a.remainder=0;

        stop.style.display="block";

        clickLoop();
    },true);

    updateUI();
})();
