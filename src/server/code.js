window.onload = function() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    
    let value = `Code: ${params.code || "ERROR TRY AGAIN"}`;
    document.getElementById("code").innerHTML = value;

    let button = document.getElementById('button');
    button.addEventListener('click', function(e) {
        if (!params.code) return;
        button.focus();

        if (!navigator.clipboard) {
            var textArea = document.createElement("textarea");
            textArea.value = params.code;

            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.height = "0";
            textArea.style.width = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Fallback: Copying text command was ' + msg);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }

            document.body.removeChild(textArea);
            return;
        }

        navigator.clipboard.writeText(params.code).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    })
}