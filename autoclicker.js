(()=>{
    if(window.__ac)return;

    const a=window.__ac={
        enabled:true,
        running:false,
        target:null,
        delay:0,
        timer:null
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
        <b>Click Delay</b><br>
        <input id="ac-input" type="number" min="0" value="0"
        style="width:100px;margin-top:5px">
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

    const input=ui.querySelector("#ac-input");
    const current=ui.querySelector("#ac-current");
    const checkbox=toggle.querySelector("input");

    input.addEventListener("input",()=>{
        let n=parseFloat(input.value);

        if(isNaN(n)||n<0)n=0;

        a.delay=n;
        input.value=n;
        current.textContent="Delay: "+n+" ms";
    });

    function stopClicking(){
        a.running=false;
        a.target=null;

        if(a.timer){
            clearTimeout(a.timer);
            a.timer=null;
        }

        stop.style.display="none";
    }

    function clickLoop(){
        if(!a.running||!a.target)return;

        a.target.click();

        if(!a.running||!a.target)return;

        if(a.delay<=0){
            a.timer=setTimeout(clickLoop,0);
        }else{
            a.timer=setTimeout(clickLoop,a.delay);
        }
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

        stop.style.display="block";

        clickLoop();
    },true);
})();
